import IMemory from "./API/IMemory";

export class FlagManager {
    private emulator: IMemory
    private offset: number

    constructor(emulator: IMemory, offset: number){
        this.emulator = emulator;
        this.offset = offset;
    }

    isFlagSet(flag: Flag): boolean{
        return bitwise.byte.read(this.emulator.rdramRead8(global.ModLoader.save_context + this.offset + flag.byte) as UInt8)[flag.bit] === 1;
    }

    setFlag(flag: Flag, bool: boolean){
        var i: Bit = bool ? 1 : 0
        var bits = bitwise.byte.read(this.emulator.rdramRead8(global.ModLoader.save_context + this.offset + flag.byte) as UInt8)
        bits[flag.bit] = i;
        var byte = bitwise.byte.write(bits);
        this.emulator.rdramWrite8(global.ModLoader.save_context + this.offset + flag.byte, byte);
    }
}

export class Flag {

    readonly byte: number;
    readonly bit: number;

    constructor(byte: number, bit: number){
        this.byte = byte;
        this.bit = bit;
    }

}