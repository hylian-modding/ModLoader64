import program from 'commander';
import fs from 'fs';
import {Pak} from 'modloader64_api/PakFormat';
import path from 'path';

program.option('-d --dir <dir>', 'base directory');
program.option('-i --input <pak>', 'pak to unpak');
program.option('-o, --output <dir>', 'output dir');

program.parse(process.argv);

if (program.dir !== undefined) {
    let recursive = require('recursive-readdir');
    require('mkdir-recursive');

    recursive(program.dir, function (err: any, files: string[]) {
        
        let pak: Pak = new Pak(program.output + "/" + path.parse(program.dir).name + '.pak');
        for (let i = 0; i < files.length; i++) {
            pak.save_file(files[i]);
        }
        pak.update();
    });
}

if (program.input !== undefined) {
    let pak: Pak = new Pak(program.input);
    pak.extractAll(program.output);
}
