import IMemory from 'modloader64_api/IMemory';
import { Command, ICommandBuffer } from 'modloader64_api/MM/ICommandBuffer';

const instance: number = 0x00800000 + 0x100;
const slotSize = 0x8;
const slotCount = 16;

export class CommandBufferSlot {
  private readonly addr_cmd: number;
  private readonly addr_result: number;
  private readonly emulator: IMemory;
  callback: Function = () => {};

  constructor(addr: number, emulator: IMemory) {
      this.addr_cmd = addr;
      this.addr_result = addr + 0x4;
      this.emulator = emulator;
  }

  get cmd(): Command {
      return this.emulator.rdramRead32(this.addr_cmd);
  }

  set cmd(command: Command) {
      this.emulator.rdramWrite32(this.addr_cmd, command);
  }

  set param(data: number) {
      this.emulator.rdramWrite32(this.addr_result, data);
  }

  get result(): number {
      return this.emulator.rdramRead32(this.addr_result);
  }
}

export class CommandBuffer implements ICommandBuffer {
  private readonly slots: CommandBufferSlot[] = new Array<CommandBufferSlot>(
      slotCount
  );
  private tickingSlots: number[] = new Array<number>();

  constructor(emulator: IMemory) {
      for (let i = 0; i < slotCount; i++) {
          this.slots[i] = new CommandBufferSlot(instance + i * slotSize, emulator);
      }
  }

  runCommand(
      command: Command,
      param: number,
      callback: Function = () => {}
  ): boolean {
      let success = false;
      for (let i = 0; i < slotCount; i++) {
          if (this.slots[i].cmd === 0) {
              // Free slot.
              this.slots[i].param = param;
              this.slots[i].cmd = command;
              this.slots[i].callback = callback;
              this.tickingSlots.push(i);
              success = true;
              break;
          }
      }
      return success;
  }

  nukeBuffer() {
      if (this.tickingSlots.length > 0) {
          this.tickingSlots.splice(0, this.tickingSlots.length);
      }
      for (let i = 0; i < this.slots.length; i++) {
          this.slots[i].cmd = 0;
          this.slots[i].param = 0;
      }
  }

  onTick() {
      if (this.tickingSlots.length > 0) {
          this.tickingSlots.forEach(
              (value: number, index: number, arr: number[]) => {
                  if (this.slots[value].cmd === 0) {
                      // command is finished.
                      this.slots[value].callback(
                          this.slots[value].cmd === 0,
                          this.slots[value].result
                      );
                      this.slots[value].param = 0x00000000;
                      this.tickingSlots.splice(index, 1);
                  }
              }
          );
      }
  }
}
