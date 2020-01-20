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
class BufferPtrObj extends BaseObj {
    constructor(emu, instance, length) {
        super(emu);
        this.instance = instance;
        this.length = length;
    }
    get_all() {
        let ptr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramReadBuffer(ptr, this.length);
    }
    set_all(value) {
        let ptr = this.emulator.dereferencePointer(this.instance);
        this.emulator.rdramWriteBuffer(ptr, value);
    }
    get_bit(flag) {
        let ptr = this.emulator.dereferencePointer(this.instance);
        ptr = ptr + Math.floor(flag / 8);
        let byte = this.emulator.rdramRead8(ptr);
        let offset = flag % 8;
        let isSet = (byte & (1 << offset)) !== 0;
        return isSet;
    }
    set_bit(flag, value) {
        let ptr = this.emulator.dereferencePointer(this.instance);
        ptr = ptr + Math.floor(flag / 8);
        let byte = this.emulator.rdramRead8(ptr);
        let offset = flag % 8;
        let isSet = (byte & (1 << offset)) !== 0;
        if ((value && !isSet) || (!value && isSet)) {
            byte ^= 1 << offset;
            this.emulator.rdramWrite8(ptr, byte);
        }
    }
    get(offset) {
        let ptr = this.emulator.dereferencePointer(this.instance);
        return this.emulator.rdramRead8(ptr + offset);
    }
    set(offset, value) {
        let ptr = this.emulator.dereferencePointer(this.instance);
        this.emulator.rdramWrite8(ptr + offset, value);
    }
}
exports.BufferPtrObj = BufferPtrObj;
//# sourceMappingURL=Imports.js.map