"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const FlagManager_1 = require("../FlagManager");
__export(require("./Bitmaps"));
__export(require("./Enums"));
class BaseObj {
    constructor(emu) {
        this.emulator = emu;
    }
    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj = Object.assign({}, this);
        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
            if (descriptor && key[0] !== '_') {
                try {
                    const val = this[key];
                    jsonObj[key] = val;
                }
                catch (error) {
                    console.error(`Error calling getter ${key}`, error);
                }
            }
        });
        return jsonObj;
    }
}
exports.BaseObj = BaseObj;
class InstanceObj extends BaseObj {
    constructor(emu, instance) {
        super(emu);
        this.instance = instance;
    }
    dereferencePointer(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.dereferencePointer(addr + offset);
    }
    rdramReadBuffer(offset, size) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadBuffer(addr + offset, size);
    }
    rdramReadF32(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadF32(addr + offset);
    }
    rdramRead32(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramRead32(addr + offset);
    }
    rdramRead16(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramRead16(addr + offset);
    }
    rdramRead8(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramRead8(addr + offset);
    }
    rdramReadS32(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadS32(addr + offset);
    }
    rdramReadS16(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadS16(addr + offset);
    }
    rdramReadS8(offset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadS8(addr + offset);
    }
    rdramReadPtrBuffer(offset, suboffset, size) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtrBuffer(addr + offset, suboffset, size);
    }
    rdramReadPtrF32(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtrF32(addr + offset, suboffset);
    }
    rdramReadPtr32(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtr32(addr + offset, suboffset);
    }
    rdramReadPtr16(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtr16(addr + offset, suboffset);
    }
    rdramReadPtr8(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtr8(addr + offset, suboffset);
    }
    rdramReadPtrS32(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtrS32(addr + offset, suboffset);
    }
    rdramReadPtrS16(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtrS16(addr + offset, suboffset);
    }
    rdramReadPtrS8(offset, suboffset) {
        let addr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadPtrS8(addr + offset, suboffset);
    }
    rdramWriteBuffer(offset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWriteBuffer(addr + offset, value);
    }
    rdramWriteF32(offset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWriteF32(addr + offset, value);
    }
    rdramWrite32(offset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWrite32(addr + offset, value);
    }
    rdramWrite16(offset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWrite16(addr + offset, value);
    }
    rdramWrite8(offset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWrite8(addr + offset, value);
    }
    rdramWritePtrBuffer(offset, suboffset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWritePtrBuffer(addr + offset, suboffset, value);
    }
    rdramWritePtrF32(offset, suboffset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWritePtrF32(addr + offset, suboffset, value);
    }
    rdramWritePtr32(offset, suboffset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWritePtr32(addr + offset, suboffset, value);
    }
    rdramWritePtr16(offset, suboffset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWritePtr16(addr + offset, suboffset, value);
    }
    rdramWritePtr8(offset, suboffset, value) {
        let addr = this.emulator.dereferencePointer(this.instance);
        this.rdramWritePtr8(addr + offset, suboffset, value);
    }
}
exports.InstanceObj = InstanceObj;
class BufferObj extends BaseObj {
    constructor(emu, instance, length) {
        super(emu);
        this.manager = new FlagManager_1.FlagManager(emu, instance);
        this.instance = instance;
        this.length = length;
    }
    get_all() {
        return this.emulator.rdramReadBuffer(this.instance, this.length);
    }
    set_all(value) {
        this.emulator.rdramWriteBuffer(this.instance, value);
    }
    get_bit(flag) {
        return this.manager.isBitSet(flag);
    }
    set_bit(flag, value) {
        this.manager.setBit(flag, value);
    }
    get(offset) {
        return this.emulator.rdramRead8(this.instance + offset);
    }
    set(offset, value) {
        this.emulator.rdramWrite8(this.instance + offset, value);
    }
}
exports.BufferObj = BufferObj;
//# sourceMappingURL=Imports.js.map