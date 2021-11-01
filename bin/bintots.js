#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
commander_1.default.option('-i, --input <file>', 'input file');
commander_1.default.option('-d, --dir <dir>', 'directory');
commander_1.default.option('-r, --remove <str>', 'remove string from output');
commander_1.default.option('-e, --encode <str>', 'encoding mode');
commander_1.default.parse(process.argv);
let e = "base64";
if (commander_1.default.encode !== undefined) {
    e = commander_1.default.encode;
}
if (commander_1.default.input) {
    let str = "export const " + path_1.default.parse(commander_1.default.input).name.split(" ").join("_").split("-").join("_") + ": Buffer = Buffer.from(\"";
    let buf = fs_1.default.readFileSync(commander_1.default.input);
    str += buf.toString(e);
    str += `\", '${e}');\n`;
    fs_1.default.writeFileSync(path_1.default.resolve(path_1.default.parse(commander_1.default.input).dir, path_1.default.parse(commander_1.default.input).name.split(" ").join("_").split("-").join("_") + ".ts"), str);
}
else if (commander_1.default.dir) {
    var recursive = require("recursive-readdir");
    let dir = path_1.default.resolve(commander_1.default.dir);
    let str = "";
    recursive(dir, (err, files) => {
        for (let i = 0; i < files.length; i++) {
            let f = path_1.default.resolve(files[i]);
            if (commander_1.default.remove) {
                str += "export const " + path_1.default.parse(f).name.split(" ").join("_").split("-").join("_").replace(commander_1.default.remove, "") + ": Buffer = Buffer.from(\"";
            }
            else {
                str += "export const " + path_1.default.parse(f).name.split(" ").join("_").split("-").join("_") + ": Buffer = Buffer.from(\"";
            }
            let buf = fs_1.default.readFileSync(f);
            str += buf.toString(e);
            str += `\", '${e}');\n`;
        }
        fs_1.default.writeFileSync(path_1.default.resolve(dir, path_1.default.parse(dir).name.split(" ").join("_").split("-").join("_") + ".ts"), str);
    });
}
