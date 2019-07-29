import IMemory from 'modloader64_api/IMemory';

export class FakeN64Memory implements IMemory {
  private buf: Buffer = Buffer.alloc(0x8000000);

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
