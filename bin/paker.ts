#!/usr/bin/env node

import program from 'commander';
import { IPakFileCompressionOptions, Pak } from 'modloader64_api/PakFormat';
import path from 'path';
import zip from 'adm-zip';
import fse from 'fs-extra';

let recursive = require('recursive-readdir');
require('mkdir-recursive');

program.option('-d --dir <dir>', 'base directory');
program.option('-i --input <pak>', 'pak to unpak');
program.option('-o, --output <dir>', 'output dir');
program.option("-j, --json <file>", "input json");
program.option("-a, --algo <algo>", "compression algo");
program.option("-c, --convert <zip>", "convert zip to pak");
program.parse(process.argv);

if (program.convert !== undefined) {
    let zipFile: zip = new zip(fse.readFileSync(program.convert));
    zipFile.extractAllTo("./");
    let pak: Pak = new Pak("./" + path.parse(program.convert).name + '.pak');
    recursive(path.join("./", path.parse(program.convert).name), function (err: any, files: string[]) {
        console.log("Total files: " + files.length);
        for (let i = 0; i < files.length; i++) {
            pak.save_file(files[i], { enabled: true, algo: "DEFL" });
        }
        pak.update();
    });
}

if (program.dir !== undefined) {
    recursive(program.dir, function (err: any, files: string[]) {
        if (program.algo === "zip") {
            let zipFile: zip = new zip();
            zipFile.addLocalFolder(path.resolve(program.dir), path.parse(program.dir).name);
            zipFile.writeZip(path.resolve(program.output + "/" + path.parse(program.dir).name + '.zip'));
        } else {
            let pak: Pak = new Pak(program.output + "/" + path.parse(program.dir).name + '.pak');
            console.log("Total files: " + files.length);
            for (let i = 0; i < files.length; i++) {
                if (program.algo !== undefined) {
                    console.log(i + " / " + files.length);
                    pak.save_file(files[i], { enabled: true, algo: program.algo });
                } else {
                    pak.save_file(files[i]);
                }
            }
            pak.update();
        }
    });
}

if (program.json) {
    let pak: Pak = new Pak(program.output);
    pak.overwriteFileAtIndex(0, fse.readJSONSync(program.json), { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions);
    pak.update();
}

if (program.input !== undefined) {
    let pak: Pak = new Pak(program.input);
    pak.extractAll(program.output);
}
