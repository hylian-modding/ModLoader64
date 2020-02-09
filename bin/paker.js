#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = __importDefault(require("commander"));
var PakFormat_1 = require("modloader64_api/PakFormat");
var path_1 = __importDefault(require("path"));
commander_1["default"].option('-d --dir <dir>', 'base directory');
commander_1["default"].option('-i --input <pak>', 'pak to unpak');
commander_1["default"].option('-o, --output <dir>', 'output dir');
commander_1["default"].parse(process.argv);
if (commander_1["default"].dir !== undefined) {
    var recursive = require('recursive-readdir');
    require('mkdir-recursive');
    recursive(commander_1["default"].dir, function (err, files) {
        var pak = new PakFormat_1.Pak(commander_1["default"].output + "/" + path_1["default"].parse(commander_1["default"].dir).name + '.pak');
        for (var i = 0; i < files.length; i++) {
            pak.save_file(files[i]);
        }
        pak.update();
    });
}
if (commander_1["default"].input !== undefined) {
    var pak = new PakFormat_1.Pak(commander_1["default"].input);
    pak.extractAll(commander_1["default"].output);
}
