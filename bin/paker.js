#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const PakFormat_1 = require("modloader64_api/PakFormat");
const path_1 = __importDefault(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_extra_1 = __importDefault(require("fs-extra"));
let recursive = require('recursive-readdir');
require('mkdir-recursive');
commander_1.default.option('-d --dir <dir>', 'base directory');
commander_1.default.option('-i --input <pak>', 'pak to unpak');
commander_1.default.option('-o, --output <dir>', 'output dir');
commander_1.default.option("-j, --json <file>", "input json");
commander_1.default.option("-a, --algo <algo>", "compression algo");
commander_1.default.option("-c, --convert <zip>", "convert zip to pak");
commander_1.default.parse(process.argv);
if (commander_1.default.convert !== undefined) {
    let zipFile = new adm_zip_1.default(fs_extra_1.default.readFileSync(commander_1.default.convert));
    zipFile.extractAllTo("./");
    let pak = new PakFormat_1.Pak("./" + path_1.default.parse(commander_1.default.convert).name + '.pak');
    recursive(path_1.default.join("./", path_1.default.parse(commander_1.default.convert).name), function (err, files) {
        console.log("Total files: " + files.length);
        for (let i = 0; i < files.length; i++) {
            pak.save_file(files[i], { enabled: true, algo: "DEFL" });
        }
        pak.update();
    });
}
if (commander_1.default.dir !== undefined) {
    recursive(commander_1.default.dir, function (err, files) {
        if (commander_1.default.algo === "zip") {
            let zipFile = new adm_zip_1.default();
            zipFile.addLocalFolder(path_1.default.resolve(commander_1.default.dir), path_1.default.parse(commander_1.default.dir).name);
            zipFile.writeZip(path_1.default.resolve(commander_1.default.output + "/" + path_1.default.parse(commander_1.default.dir).name + '.zip'));
        }
        else {
            let pak = new PakFormat_1.Pak(commander_1.default.output + "/" + path_1.default.parse(commander_1.default.dir).name + '.pak');
            console.log("Total files: " + files.length);
            for (let i = 0; i < files.length; i++) {
                if (commander_1.default.algo !== undefined) {
                    console.log(i + " / " + files.length);
                    pak.save_file(files[i], { enabled: true, algo: commander_1.default.algo });
                }
                else {
                    pak.save_file(files[i]);
                }
            }
            pak.update();
        }
    });
}
if (commander_1.default.json) {
    let pak = new PakFormat_1.Pak(commander_1.default.output);
    pak.overwriteFileAtIndex(0, fs_extra_1.default.readJSONSync(commander_1.default.json), { enabled: true, algo: "DEFL" });
    pak.update();
}
if (commander_1.default.input !== undefined) {
    let pak = new PakFormat_1.Pak(commander_1.default.input);
    pak.extractAll(commander_1.default.output);
}
