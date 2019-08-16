import IMemory from 'modloader64_api/IMemory';
import OOTAPI from 'modloader64_api/OOT/OOTAPI';

export class KeyManager implements OOTAPI.IKeyManager {
  private readonly KEY_ARRAY_ADDR: number =
    global.ModLoader['save_context'] + 0xbc;
  private readonly KEY_ARRAY_SIZE: number = 0x14;
  private readonly emulator: IMemory;

  constructor(emulator: IMemory) {
    this.emulator = emulator;
  }

  getKeyCountForIndex(index: number): number {
    if (index > this.KEY_ARRAY_ADDR) {
      return OOTAPI.NO_KEYS;
    }
    return this.emulator.rdramRead8(this.KEY_ARRAY_ADDR + index);
  }

  setKeyCountByIndex(index: number, count: number): void {
    if (index > this.KEY_ARRAY_ADDR) {
      return;
    }
    this.emulator.rdramWrite8(this.KEY_ARRAY_ADDR + index, count);
  }

  getRawKeyBuffer(): Buffer {
    return this.emulator.rdramReadBuffer(
      this.KEY_ARRAY_ADDR,
      this.KEY_ARRAY_SIZE
    );
  }
}
