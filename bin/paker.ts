#!/usr/bin/env node

import program from 'commander';
import {Pak} from 'modloader64_api/PakFormat';
import path from 'path';

program.option('-d --dir <dir>', 'base directory');
program.option('-i --input <pak>', 'pak to unpak');
program.option('-o, --output <dir>', 'output dir');
program.option("-a, --algo <algo>", "compression algo");

program.parse(process.argv);

if (program.dir !== undefined) {
    let recursive = require('recursive-readdir');
    require('mkdir-recursive');

    recursive(program.dir, function (err: any, files: string[]) {
        
        let pak: Pak = new Pak(program.output + "/" + path.parse(program.dir).name + '.pak');
        console.log("Total files: " + files.length);
        for (let i = 0; i < files.length; i++) {
            if (program.algo !== undefined){
                console.log(i + " / " + files.length);
                pak.save_file(files[i], {enabled: true, algo: program.algo});
            }else{
                pak.save_file(files[i]);
            }
        }
        pak.update();
    });
}

if (program.input !== undefined) {
    let pak: Pak = new Pak(program.input);
    pak.extractAll(program.output);
}
