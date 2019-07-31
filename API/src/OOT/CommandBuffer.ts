import IMemory from '../IMemory';

const instance: number = 0x600000 + 0x0090;
const slotSize = 0x8;
const slotCount = 16;

export const enum Command {
  NULL,
  SPAWN_ACTOR,
  UPDATE_C_BUTTON_ICON,
  PLAY_SOUND,
}

export class CommandBufferSlot {
  private readonly addr_cmd: number;
  private readonly addr_result: number;
  private readonly emulator: IMemory;

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

export class CommandBuffer {
  private readonly slots: CommandBufferSlot[] = new Array<CommandBufferSlot>(
    slotCount
  );

  constructor(emulator: IMemory) {
    for (let i = 0; i < slotCount; i++) {
      this.slots[i] = new CommandBufferSlot(instance + i * slotSize, emulator);
    }
  }

  runCommand(command: Command, param: number): boolean {
    let success = false;
    for (let i = 0; i < slotCount; i++) {
      if (this.slots[i].cmd === 0) {
        // Free slot.
        this.slots[i].param = param;
        this.slots[i].cmd = command;
        success = true;
        break;
      }
    }
    return success;
  }
}
