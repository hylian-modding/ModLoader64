"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlagManager {
    constructor(emulator, offset) {
        this.emulator = emulator;
        this.addr = offset;
    }
    isFlagSet(flag) {
        return this.emulator.rdramReadBit8(this.addr + flag.byte, flag.bit);
    }
    setFlag(flag, bool) {
        this.emulator.rdramWriteBit8(this.addr + flag.byte, flag.bit, bool);
    }
    isBitSet(bit) {
        return this.isFlagSet(new Flag(bit / 8, bit % 8));
    }
    setBit(bit, bool) {
        this.setFlag(new Flag(bit / 8, bit % 8), bool);
    }
}
exports.FlagManager = FlagManager;
class Flag {
    constructor(byte, bit) {
        this.byte = byte;
        this.bit = bit;
    }
}
exports.Flag = Flag;
//# sourceMappingURL=FlagManager.js.map