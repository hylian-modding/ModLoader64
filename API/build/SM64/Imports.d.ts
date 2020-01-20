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
