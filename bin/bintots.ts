#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import path from 'path';

program.option('-i, --input <file>', 'input file');
program.option('-d, --dir <dir>', 'directory');
program.option('-r, --remove <str>', 'remove string from output')
program.parse(process.argv);

if (program.input) {
    let str: string = "export const " + path.parse(program.input).name.split(" ").join("_").split("-").join("_") + ": Buffer = Buffer.from(\"";
    let buf: Buffer = fs.readFileSync(program.input);
    str += buf.toString('base64');
    str += "\", 'base64');\n";
    fs.writeFileSync(path.resolve(path.parse(program.input).dir, path.parse(program.input).name.split(" ").join("_").split("-").join("_") + ".ts"), str);
} else if (program.dir) {
    var recursive = require("recursive-readdir");
    let dir = path.resolve(program.dir);
    let str: string = "";
    recursive(dir, (err: any, files: Array<string>) => {
        for (let i = 0; i < files.length; i++) {
            let f = path.resolve(files[i]);
            if (program.remove){
                str += "export const " + path.parse(f).name.split(" ").join("_").split("-").join("_").replace(program.remove, "") + ": Buffer = Buffer.from(\"";
            }else{
                str += "export const " + path.parse(f).name.split(" ").join("_").split("-").join("_") + ": Buffer = Buffer.from(\"";
            }
            let buf: Buffer = fs.readFileSync(f);
            str += buf.toString('base64');
            str += "\", 'base64');\n";
        }
        fs.writeFileSync(path.resolve(dir, path.parse(dir).name.split(" ").join("_").split("-").join("_") + ".ts"), str);
    });
}