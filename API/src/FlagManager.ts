import IMemory from './IMemory';
import bitwise from 'bitwise';
import { Bit, UInt8 } from 'bitwise/types';

export class FlagManager {
  private emulator: IMemory;
  private offset: number;

  constructor(emulator: IMemory, offset: number) {
    this.emulator = emulator;
    this.offset = offset;
  }

  isFlagSet(flag: Flag): boolean {
    return (
      bitwise.byte.read(this.emulator.rdramRead8(
        this.offset + flag.byte
      ) as UInt8)[flag.bit] === 1
    );
  }

  setFlag(flag: Flag, bool: boolean) {
    let i: Bit = bool ? 1 : 0;
    let org = this.emulator.rdramRead8(this.offset + flag.byte) as UInt8;
    let bits = bitwise.byte.read(org);
    bits[flag.bit] = i;
    let byte = bitwise.byte.write(bits);
    this.emulator.rdramWrite8(this.offset + flag.byte, byte);
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
