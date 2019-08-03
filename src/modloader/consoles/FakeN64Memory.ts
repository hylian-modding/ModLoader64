import IMemory from 'modloader64_api/IMemory';
import bitwise from 'bitwise';
import { UInt8, Bit } from 'bitwise/types';

export class FakeN64Memory implements IMemory {
  private buf: Buffer = Buffer.alloc(0x800000);

  rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
    let buf: Buffer = Buffer.alloc(bytes * 8);
    let buf_index = 0;
    let byte_index = 0;
    for (let i = 0; i < bytes; i++) {
      let data: UInt8 = this.buf.readUInt8(addr + byte_index) as UInt8;
      let bits = bitwise.byte.read(data);
      for (let j = 0; j < bits.length; j++) {
        buf.writeUInt8(bits[j], buf_index);
        buf_index++;
      }
      byte_index++;
    }
    return buf;
  }

  rdramReadBits8(addr: number): Buffer {
    let buf: Buffer = Buffer.alloc(8);
    let data: UInt8 = this.buf.readUInt8(addr) as UInt8;
    let bits = bitwise.byte.read(data);
    for (let i = 0; i < bits.length; i++) {
      buf.writeUInt8(bits[i], i);
    }
    return buf;
  }

  rdramReadBit8(addr: number, bitoffset: number): boolean {
    let data: UInt8 = this.buf.readUInt8(addr) as UInt8;
    let bits = bitwise.byte.read(data);
    return bits[bitoffset] === 1;
  }

  rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
    let bytes = buf.byteLength / 8;
    for (let i = 0; i < bytes; i++) {
      let copy: Buffer = Buffer.alloc(8);
      buf.copy(copy, 0, bytes * 8, bytes * 8 + 8);
      let data: UInt8 = this.buf.readUInt8(addr + i) as UInt8;
      let bits = bitwise.byte.read(data);
      for (let j = 0; j < copy.byteLength; j++) {
        bits[j] = copy.readUInt8(j) as Bit;
      }
      data = bitwise.byte.write(bits);
      this.buf.writeUInt8(data, addr + i);
    }
  }

  rdramWriteBits8(addr: number, buf: Buffer): void {
    let data: UInt8 = this.buf.readUInt8(addr) as UInt8;
    let bits = bitwise.byte.read(data);
    for (let i = 0; i < buf.byteLength; i++) {
      bits[i] = buf.readUInt8(i) as Bit;
    }
    data = bitwise.byte.write(bits);
    this.buf.writeUInt8(data, addr);
  }

  rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
    let data: UInt8 = this.buf.readUInt8(addr) as UInt8;
    let bits = bitwise.byte.read(data);
    bits[bitoffset] = (bit ? 1 : 0) as Bit;
    data = bitwise.byte.write(bits);
    this.buf.writeUInt8(data, addr);
  }

  rdramReadPtr8(addr: number, offset: number): number {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramRead8(pointer + offset);
  }

  rdramWritePtr8(addr: number, offset: number, value: number): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWrite8(pointer + offset, value);
  }

  rdramReadPtr16(addr: number, offset: number): number {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramRead16(pointer + offset);
  }

  rdramWritePtr16(addr: number, offset: number, value: number): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWrite16(pointer + offset, value);
  }

  rdramWritePtr32(addr: number, offset: number, value: number): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWrite32(pointer + offset, value);
  }

  rdramReadPtr32(addr: number, offset: number): number {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramRead32(pointer + offset);
  }

  rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadBuffer(pointer + offset, size);
  }

  rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWriteBuffer(pointer + offset, buf);
  }

  rdramReadPtrS8(addr: number, offset: number): number {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadS8(pointer + offset);
  }

  rdramReadPtrS16(addr: number, offset: number): number {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadS16(pointer + offset);
  }

  rdramReadPtrS32(addr: number, offset: number): number {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadS32(pointer + offset);
  }

  rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadBitsBuffer(pointer + offset, bytes);
  }

  rdramReadPtrBits8(addr: number, offset: number): Buffer {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadBits8(pointer + offset);
  }

  rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
    let pointer: number = this.dereferencePointer(addr);
    return this.rdramReadBit8(pointer + offset, bitoffset);
  }

  rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWriteBitsBuffer(pointer + offset, buf);
  }

  rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWriteBits8(pointer + offset, buf);
  }

  rdramWritePtrBit8(
    addr: number,
    offset: number,
    bitoffset: number,
    bit: boolean
  ): void {
    let pointer: number = this.dereferencePointer(addr);
    this.rdramWriteBit8(pointer + offset, bitoffset, bit);
  }

  rdramRead8(addr: number): number {
    return this.buf.readUInt8(addr);
  }

  rdramWrite8(addr: number, value: number): void {
    this.buf.writeUInt8(value, addr);
  }

  rdramRead16(addr: number): number {
    return this.buf.readUInt16BE(addr);
  }

  rdramWrite16(addr: number, value: number): void {
    this.buf.writeUInt16BE(value, addr);
  }

  rdramWrite32(addr: number, value: number): void {
    this.buf.writeUInt32BE(value, addr);
  }

  rdramRead32(addr: number): number {
    return this.buf.readUInt32BE(addr);
  }

  rdramReadBuffer(addr: number, size: number): Buffer {
    let nb = Buffer.alloc(size);
    this.buf.copy(nb, 0, addr, addr + size);
    return nb;
  }

  rdramWriteBuffer(addr: number, buf: Buffer): void {
    buf.copy(this.buf, addr, 0, buf.byteLength);
  }

  rdramReadUBuffer(addr: number, size: number): Buffer {
    let nb = Buffer.alloc(size);
    this.buf.copy(nb, 0, addr, addr + size);
    return nb;
  }

  dereferencePointer(addr: number): number {
    return this.rdramRead32(addr) - 0x80000000;
  }

  rdramReadS8(addr: number): number {
    return this.buf.readUInt8(addr);
  }

  rdramReadS16(addr: number): number {
    return this.buf.readUInt16BE(addr);
  }

  rdramReadS32(addr: number): number {
    return this.buf.readUInt32BE(addr);
  }
}
