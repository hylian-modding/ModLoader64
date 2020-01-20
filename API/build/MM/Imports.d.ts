/// <reference types="node" />
import IMemory from '../IMemory';
export * from './Bitmaps';
export * from './Enums';
export * from './Interfaces';
export declare class BaseObj {
    protected emulator: IMemory;
    constructor(emu: IMemory);
    toJSON(): any;
}
export declare class InstanceObj extends BaseObj {
    private instance;
    constructor(emu: IMemory, instance: number);
    dereferencePointer(offset: number): number;
    rdramReadBuffer(offset: number, size: number): Buffer;
    rdramReadF32(offset: number): number;
    rdramRead32(offset: number): number;
    rdramRead16(offset: number): number;
    rdramRead8(offset: number): number;
    rdramReadS32(offset: number): number;
    rdramReadS16(offset: number): number;
    rdramReadS8(offset: number): number;
    rdramReadPtrBuffer(offset: number, suboffset: number, size: number): Buffer;
    rdramReadPtrF32(offset: number, suboffset: number): number;
    rdramReadPtr32(offset: number, suboffset: number): number;
    rdramReadPtr16(offset: number, suboffset: number): number;
    rdramReadPtr8(offset: number, suboffset: number): number;
    rdramReadPtrS32(offset: number, suboffset: number): number;
    rdramReadPtrS16(offset: number, suboffset: number): number;
    rdramReadPtrS8(offset: number, suboffset: number): number;
    rdramWriteBuffer(offset: number, value: Buffer): void;
    rdramWriteF32(offset: number, value: number): void;
    rdramWrite32(offset: number, value: number): void;
    rdramWrite16(offset: number, value: number): void;
    rdramWrite8(offset: number, value: number): void;
    rdramWritePtrBuffer(offset: number, suboffset: number, value: Buffer): void;
    rdramWritePtrF32(offset: number, suboffset: number, value: number): void;
    rdramWritePtr32(offset: number, suboffset: number, value: number): void;
    rdramWritePtr16(offset: number, suboffset: number, value: number): void;
    rdramWritePtr8(offset: number, suboffset: number, value: number): void;
}
export declare class BufferObj extends BaseObj {
    private manager;
    private instance;
    private length;
    constructor(emu: IMemory, instance: number, length: number);
    get_all(): Buffer;
    set_all(value: Buffer): void;
    get_bit(flag: number): boolean;
    set_bit(flag: number, value: boolean): void;
    get(offset: number): number;
    set(offset: number, value: number): void;
}
