#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import path from 'path';

program.option('-i, --input <file>', 'input file');
program.option('-d, --dir <dir>', 'directory');
program.option('-r, --remove <str>', 'remove string from output');
program.option('-e, --encode <str>', 'encoding mode');
program.parse(process.argv);

let e = "base64";
if (program.encode !== undefined){
    e = program.encode;
}

if (program.input) {
    let str: string = "export const " + path.parse(program.input).name.split(" ").join("_").split("-").join("_") + ": Buffer = Buffer.from(\"";
    let buf: Buffer = fs.readFileSync(program.input);
    str += buf.toString(e);
    str += `\", '${e}');\n`;
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
            str += buf.toString(e);
            str += `\", '${e}');\n`;
        }
        fs.writeFileSync(path.resolve(dir, path.parse(dir).name.split(" ").join("_").split("-").join("_") + ".ts"), str);
    });
}