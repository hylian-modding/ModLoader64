import IMemory from '../IMemory';
import { FlagManager } from '../FlagManager';

export * from './Bitmaps';
export * from './Enums';
export * from './Interfaces';

export class BaseObj {
  protected emulator: IMemory;

  constructor(emu: IMemory) {
    this.emulator = emu;
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class InstanceObj extends BaseObj {
  private instance: number;

  constructor(emu: IMemory, instance: number) {
    super(emu);
    this.instance = instance;
  }

  dereferencePointer(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.dereferencePointer(addr + offset);
  }

  rdramReadBuffer(offset: number, size: number): Buffer {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadBuffer(addr + offset, size);
  }

  rdramReadF32(offset: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadF32(addr + offset);
  }

  rdramRead32(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramRead32(addr + offset);
  }

  rdramRead16(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramRead16(addr + offset);
  }

  rdramRead8(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramRead8(addr + offset);
  }

  rdramReadS32(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadS32(addr + offset);
  }

  rdramReadS16(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadS16(addr + offset);
  }

  rdramReadS8(offset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadS8(addr + offset);
  }

  rdramReadPtrBuffer(offset: number, suboffset: number, size: number): Buffer {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtrBuffer(addr + offset, suboffset, size);
  }

  rdramReadPtrF32(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtrF32(addr + offset, suboffset);
  }

  rdramReadPtr32(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtr32(addr + offset, suboffset);
  }

  rdramReadPtr16(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtr16(addr + offset, suboffset);
  }

  rdramReadPtr8(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtr8(addr + offset, suboffset);
  }

  rdramReadPtrS32(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtrS32(addr + offset, suboffset);
  }

  rdramReadPtrS16(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtrS16(addr + offset, suboffset);
  }

  rdramReadPtrS8(offset: number, suboffset: number): number {
    let addr = this.emulator.dereferencePointer(this.instance);
    return this.emulator.rdramReadPtrS8(addr + offset, suboffset);
  }

  rdramWriteBuffer(offset: number, value: Buffer) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWriteBuffer(addr + offset, value);
  }

  rdramWriteF32(offset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWriteF32(addr + offset, value);
  }

  rdramWrite32(offset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWrite32(addr + offset, value);
  }

  rdramWrite16(offset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWrite16(addr + offset, value);
  }

  rdramWrite8(offset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWrite8(addr + offset, value);
  }

  rdramWritePtrBuffer(offset: number, suboffset: number, value: Buffer) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWritePtrBuffer(addr + offset, suboffset, value);
  }

  rdramWritePtrF32(offset: number, suboffset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWritePtrF32(addr + offset, suboffset, value);
  }

  rdramWritePtr32(offset: number, suboffset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWritePtr32(addr + offset, suboffset, value);
  }

  rdramWritePtr16(offset: number, suboffset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWritePtr16(addr + offset, suboffset, value);
  }

  rdramWritePtr8(offset: number, suboffset: number, value: number) {
    let addr = this.emulator.dereferencePointer(this.instance);
    this.rdramWritePtr8(addr + offset, suboffset, value);
  }
}

export class BufferObj extends BaseObj {
  private manager: FlagManager;
  private instance: number;
  private length: number;

  constructor(emu: IMemory, instance: number, length: number) {
    super(emu);
    this.manager = new FlagManager(emu, instance);
    this.instance = instance;
    this.length = length;
  }

  get_all(): Buffer {
    return this.emulator.rdramReadBuffer(this.instance, this.length);
  }
  set_all(value: Buffer) {
    this.emulator.rdramWriteBuffer(this.instance, value);
  }
  get_bit(flag: number): boolean {
    return this.manager.isBitSet(flag);
  }
  set_bit(flag: number, value: boolean) {
    this.manager.setBit(flag, value);
  }
  get(offset: number): number {
    return this.emulator.rdramRead8(this.instance + offset);
  }
  set(offset: number, value: number) {
    this.emulator.rdramWrite8(this.instance + offset, value);
  }
}
