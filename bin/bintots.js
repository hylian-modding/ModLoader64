#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = __importDefault(require("commander"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
commander_1["default"].option('-i, --input <file>', 'input file');
commander_1["default"].option('-d, --dir <dir>', 'directory');
commander_1["default"].parse(process.argv);
if (commander_1["default"].input) {
    var str = "export const " + path_1["default"].parse(commander_1["default"].input).name.split(" ").join("_").split("-").join("_").replace(/[0-9]/, '') + ": Buffer = Buffer.from(\"";
    var buf = fs_1["default"].readFileSync(commander_1["default"].input);
    str += buf.toString('base64');
    str += "\", 'base64');\n";
    fs_1["default"].writeFileSync(path_1["default"].resolve(path_1["default"].parse(commander_1["default"].input).dir, path_1["default"].parse(commander_1["default"].input).name.split(" ").join("_").split("-").join("_").replace(/[0-9]/, '') + ".ts"), str);
}
else if (commander_1["default"].dir) {
    var dir = path_1["default"].resolve(commander_1["default"].dir);
    var str_1 = "";
    fs_1["default"].readdirSync(dir).forEach(function (file) {
        var f = path_1["default"].resolve(commander_1["default"].dir, file);
        str_1 += "export const " + path_1["default"].parse(f).name.split(" ").join("_").split("-").join("_").replace(/[0-9]/, '') + ": Buffer = Buffer.from(\"";
        var buf = fs_1["default"].readFileSync(f);
        str_1 += buf.toString('base64');
        str_1 += "\", 'base64');\n";
    });
    fs_1["default"].writeFileSync(path_1["default"].resolve(dir, path_1["default"].parse(dir).name.split(" ").join("_").split("-").join("_").replace(/[0-9]/, '') + ".ts"), str_1);
}
