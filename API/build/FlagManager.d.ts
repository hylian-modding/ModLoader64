import IMemory from './IMemory';
export declare class FlagManager {
    private emulator;
    private addr;
    constructor(emulator: IMemory, offset: number);
    isFlagSet(flag: Flag): boolean;
    setFlag(flag: Flag, bool: boolean): void;
    isBitSet(bit: number): boolean;
    setBit(bit: number, bool: boolean): void;
}
export declare class Flag {
    readonly byte: number;
    readonly bit: number;
    constructor(byte: number, bit: number);
}
