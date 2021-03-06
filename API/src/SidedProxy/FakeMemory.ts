import IMemory from "../IMemory";
import { IRomMemory } from "../IRomMemory";

export class FakeMemory implements IMemory{
    rdramRead8(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramWrite8(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramRead16(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramWrite16(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramWrite32(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramRead32(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadBuffer(addr: number, size: number): Buffer {
        throw new Error("Method not implemented.");
    }
    rdramWriteBuffer(addr: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    dereferencePointer(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadS8(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadS16(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadS32(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
        throw new Error("Method not implemented.");
    }
    rdramReadBits8(addr: number): Buffer {
        throw new Error("Method not implemented.");
    }
    rdramReadBit8(addr: number, bitoffset: number): boolean {
        throw new Error("Method not implemented.");
    }
    rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    rdramWriteBits8(addr: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
        throw new Error("Method not implemented.");
    }
    rdramReadPtr8(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramWritePtr8(addr: number, offset: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramReadPtr16(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramWritePtr16(addr: number, offset: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramWritePtr32(addr: number, offset: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramReadPtr32(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrS8(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrS16(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrS32(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrBits8(addr: number, offset: number): Buffer {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrBit8(addr: number, offset: number, bitoffset: number, bit: boolean): void {
        throw new Error("Method not implemented.");
    }
    rdramReadF32(addr: number): number {
        throw new Error("Method not implemented.");
    }
    rdramReadPtrF32(addr: number, offset: number): number {
        throw new Error("Method not implemented.");
    }
    rdramWriteF32(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrF32(addr: number, offset: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    bitCount8(value: number): number {
        throw new Error("Method not implemented.");
    }
    bitCount16(value: number): number {
        throw new Error("Method not implemented.");
    }
    bitCount32(value: number): number {
        throw new Error("Method not implemented.");
    }
    bitCountBuffer(buf: Buffer, off: number, len: number): number {
        throw new Error("Method not implemented.");
    }
    getRdramBuffer(): ArrayBuffer {
        throw new Error("Method not implemented.");
    }
    invalidateCachedCode(): void {
        throw new Error("Method not implemented.");
    }
}

export class FakeRom implements IRomMemory{
    romRead8(addr: number): number {
        throw new Error("Method not implemented.");
    }
    romWrite8(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    romRead16(addr: number): number {
        throw new Error("Method not implemented.");
    }
    romWrite16(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    romRead32(addr: number): number {
        throw new Error("Method not implemented.");
    }
    romWrite32(addr: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    romReadBuffer(addr: number, size: number): Buffer {
        throw new Error("Method not implemented.");
    }
    romWriteBuffer(addr: number, buf: Buffer): void {
        throw new Error("Method not implemented.");
    }
    getRomBuffer(): ArrayBuffer {
        throw new Error("Method not implemented.");
    }
}