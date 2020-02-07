"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var original_dir = process.cwd();
var rom_dir = path_1["default"].join(original_dir, "roms");
var cfg = {
    ModLoader64: {
        SDK: {
            roms_dir: rom_dir
        }
    }
};
if (!fs_1["default"].existsSync(path_1["default"].join(original_dir, "SDK-config.json"))) {
    fs_1["default"].writeFileSync(path_1["default"].join(original_dir, "SDK-config.json"), JSON.stringify(cfg, null, 2));
}
