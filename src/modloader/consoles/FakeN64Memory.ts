import IMemory from "../../API/IMemory";

export class FakeN64Memory implements IMemory {

    private buf: Buffer = Buffer.alloc(0x800000)

    rdramRead8(addr: number): number {
        return this.buf.readUInt8(addr)
    }

    rdramWrite8(addr: number, value: number): void {
        this.buf.writeUInt8(value, addr)
    }

    rdramRead16(addr: number): number {
        return this.buf.readUInt16BE(addr)
    }

    rdramWrite16(addr: number, value: number): void {
        this.buf.writeUInt16BE(value, addr)
    }

    rdramWriteU32(addr: number, value: number): void {
        this.buf.writeUInt32BE(value, addr)
    }

    rdramWrite32(addr: number, value: number): void {
        this.buf.writeUInt32BE(value, addr)
    }

    rdramReadU32(addr: number): number {
        return this.buf.readUInt32BE(addr)
    }

    rdramRead32(addr: number): number {
        return this.buf.readUInt32BE(addr)
    }

    rdramWriteU64(addr: number, value: number): void {
        var hex = value.toString(16);
        var parts = hex.match(/.{1,2}/g);
        if (parts !== null) {
            for (let i = 0; i < parts.length; i++) {
                this.buf.writeUInt8(parseInt("0x" + parts[i]), addr + i)
            }
        }
    }

    rdramWrite64(addr: number, value: number): void {
        var hex = value.toString(16);
        var parts = hex.match(/.{1,2}/g);
        if (parts !== null) {
            for (let i = 0; i < parts.length; i++) {
                this.buf.writeUInt8(parseInt("0x" + parts[i]), addr + i)
            }
        }
    }

    rdramReadU64(addr: number): number {
        var b: Buffer = Buffer.alloc(8)
        this.buf.copy(b, 0, addr, addr + 8)
        return parseInt("0x" + b.toString('hex'))
    }

    rdramRead64(addr: number): number {
        var b: Buffer = Buffer.alloc(8)
        this.buf.copy(b, 0, addr, addr + 8)
        return parseInt("0x" + b.toString('hex'))
    }

    rdramReadBuffer(addr: number, size: number): Buffer {
        let nb = Buffer.alloc(size)
        this.buf.copy(nb, 0, addr, addr + size)
        return nb
    }

    rdramWriteBuffer(addr: number, buf: Buffer): void {
        buf.copy(this.buf, addr, 0, buf.byteLength)
    }

    rdramReadUBuffer(addr: number, size: number): Buffer {
        let nb = Buffer.alloc(size)
        this.buf.copy(nb, 0, addr, addr + size)
        return nb
    }

    rdramWriteUBuffer(addr: number, buf: Buffer): void {
        buf.copy(this.buf, addr, 0, buf.byteLength)
    }
}