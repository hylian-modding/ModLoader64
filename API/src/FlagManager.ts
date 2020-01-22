import IMemory from './IMemory';

export class FlagManager {
  private emulator: IMemory;
  private addr: number;

  constructor(emulator: IMemory, offset: number) {
      this.emulator = emulator;
      this.addr = offset;
  }

  isFlagSet(flag: Flag): boolean {
      return this.emulator.rdramReadBit8(this.addr + flag.byte, flag.bit);
  }

  setFlag(flag: Flag, bool: boolean) {
      this.emulator.rdramWriteBit8(this.addr + flag.byte, flag.bit, bool);
  }

  isBitSet(bit: number) {
      return this.isFlagSet(new Flag(bit / 8, bit % 8));
  }

  setBit(bit: number, bool: boolean) {
      this.setFlag(new Flag(bit / 8, bit % 8), bool);
  }
}

export class Flag {
  readonly byte: number;
  readonly bit: number;

  constructor(byte: number, bit: number) {
      this.byte = byte;
      this.bit = bit;
  }
}
