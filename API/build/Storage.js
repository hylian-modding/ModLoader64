"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const PakFormat_1 = require("./PakFormat");
class StorageContainer {
    constructor(key) {
        let file = path_1.default.resolve(path_1.default.join(process.cwd(), 'storage', key + '.pak'));
        this.pak = new PakFormat_1.Pak(file);
    }
    storeObject(obj, compressed = true) {
        if (!fs_1.default.existsSync(path_1.default.parse(this.pak.fileName).dir)) {
            fs_1.default.mkdirSync(path_1.default.parse(this.pak.fileName).dir);
        }
        this.pak.overwriteFileAtIndex(0, obj, compressed);
        this.pak.update();
    }
    loadObject() {
        return JSON.parse(this.pak.load(0));
    }
}
exports.StorageContainer = StorageContainer;
class StorageKeyManager {
    constructor() {
        this.MAX = 0xffffffff;
    }
    getStorageKey() {
        let b = true;
        let v = '';
        while (b) {
            let possible = Math.floor(Math.random() * (this.MAX - 0 + 1) + 0).toString(16);
            let file = path_1.default.resolve(path_1.default.join(process.cwd(), 'storage', possible + '.pak'));
            if (!fs_1.default.existsSync(file)) {
                v = possible;
                b = false;
            }
        }
        return v;
    }
}
exports.KeyManager = new StorageKeyManager();
//# sourceMappingURL=Storage.js.map