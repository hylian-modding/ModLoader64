import IMemory from 'modloader64_api/IMemory';
import Vector3 from 'modloader64_api/math/Vector3';
import { IRomMemory } from 'modloader64_api/IRomMemory';

export class FakeN64Memory implements IMemory, IRomMemory {

    bitCount8(value: number): number {
        return -1;
    }
    bitCount16(value: number): number {
        return -1;
    }
    bitCount32(value: number): number {
        return -1;
    }
    bitCountBuffer(buf: Buffer, off: number, len: number): number {
        return -1;
    }
    
    invalidateCachedCode(): void {
    }

    romRead8(addr: number): number {
        return -1;
    }
    romWrite8(addr: number, value: number): void {
    }
    romRead16(addr: number): number {
        return -1;
    }
    romWrite16(addr: number, value: number): void {
    }
    romRead32(addr: number): number {
        return -1;
    }
    romWrite32(addr: number, value: number): void {
    }
    romReadBuffer(addr: number, size: number): Buffer {
        return Buffer.alloc(size);
    }
    romWriteBuffer(addr: number, buf: Buffer): void {
    }

    rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
        return Buffer.alloc(1);
    }

    rdramReadBits8(addr: number): Buffer {
        return Buffer.alloc(8);
    }

    rdramReadBit8(addr: number, bitoffset: number): boolean {
        return false;
    }

    rdramWriteBitsBuffer(addr: number, buf: Buffer): void {}

    rdramWriteBits8(addr: number, buf: Buffer): void {}

    rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {}

    rdramReadPtr8(addr: number, offset: number): number {
        return -1;
    }

    rdramWritePtr8(addr: number, offset: number, value: number): void {}

    rdramReadPtr16(addr: number, offset: number): number {
        return -1;
    }

    rdramWritePtr16(addr: number, offset: number, value: number): void {}

    rdramWritePtr32(addr: number, offset: number, value: number): void {}

    rdramReadPtr32(addr: number, offset: number): number {
        return -1;
    }

    rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
        return Buffer.alloc(size);
    }

    rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {}

    rdramReadPtrS8(addr: number, offset: number): number {
        return -1;
    }

    rdramReadPtrS16(addr: number, offset: number): number {
        return -1;
    }

    rdramReadPtrS32(addr: number, offset: number): number {
        return -1;
    }

    rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
        return Buffer.alloc(bytes);
    }

    rdramReadPtrBits8(addr: number, offset: number): Buffer {
        return Buffer.alloc(8);
    }

    rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
        return false;
    }

    rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {}

    rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {}

    rdramWritePtrBit8(
        addr: number,
        offset: number,
        bitoffset: number,
        bit: boolean
    ): void {}

    rdramRead8(addr: number): number {
        return -1;
    }

    rdramWrite8(addr: number, value: number): void {}

    rdramRead16(addr: number): number {
        return -1;
    }

    rdramWrite16(addr: number, value: number): void {}

    rdramWrite32(addr: number, value: number): void {}

    rdramRead32(addr: number): number {
        return -1;
    }

    rdramReadBuffer(addr: number, size: number): Buffer {
        return Buffer.alloc(size);
    }

    rdramWriteBuffer(addr: number, buf: Buffer): void {}

    rdramReadUBuffer(addr: number, size: number): Buffer {
        return Buffer.alloc(size);
    }

    dereferencePointer(addr: number): number {
        return -1;
    }

    rdramReadS8(addr: number): number {
        return -1;
    }

    rdramReadS16(addr: number): number {
        return -1;
    }

    rdramReadS32(addr: number): number {
        return -1;
    }

    rdramReadF32(addr: number): number {
        return -1;
    }

    rdramReadPtrF32(addr: number, offset: number): number {
        return -1;
    }

    rdramWriteF32(addr: number, value: number): void {}

    rdramWritePtrF32(addr: number, offset: number, value: number): void {}

    memoryDebugLogger(bool: boolean): void {}
}
