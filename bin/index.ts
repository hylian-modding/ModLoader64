#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import { ncp } from 'ncp';

program.option('-init, --init', 'init new project');
program.option('-b, --build', 'build mod');
program.option('-r, --run', 'run mod');
program.option('-d, --dist', 'pack mod');
program.option("-p2, --runp2", "run p2");
program.parse(process.argv);

if (program.init) {
    let original_dir: string = process.cwd();
    console.log("Generating mod scaffolding...");
    child_process.execSync("npm init --yes");
    fs.mkdirSync("./src");
    let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
    fs.mkdirSync("./src/" + meta.name);
    process.chdir("./src/" + meta.name);
    child_process.execSync("npm init --yes");
    process.chdir(original_dir);
    console.log("Linking ModLoader64 API to project...");
    console.log("This might take a moment. Please be patient.");
    let our_pkg: any = JSON.parse(fs.readFileSync(path.join(__dirname, "../", "package.json")).toString());
    Object.keys(our_pkg.dependencies).forEach((key: string) => {
        if (key.indexOf("modloader64") === -1) {
            child_process.execSync("npm link " + key);
        }
    });
    Object.keys(our_pkg.devDependencies).forEach((key: string) => {
        if (key.indexOf("modloader64") === -1) {
            child_process.execSync("npm link " + key);
        }
    });
    child_process.execSync("npm link " + "modloader64_api");
    console.log("Setting up TypeScript compiler...");
    child_process.execSync("tsc --init");
    fs.copyFileSync(path.join(__dirname, "../", "tsconfig.json"), "./tsconfig.json");
}

if (program.build) {
    console.log("Building mod. Please wait...");
    if (!fs.existsSync("./cores")){
        fs.mkdirSync("./cores");
    }
    child_process.execSync("npx tsc");
    ncp("./src", "./build/src", function (err) {
        if (err) {
            return console.error(err);
        }
    });
    if (!fs.existsSync("./build/cores")){
        fs.mkdirSync("./build/cores");
    }
}

if (program.run) {
    console.log("Running mod. Please wait while we load the emulator...");
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    let ml = child_process.exec("npm run start -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.join(original_dir, "roms") + " --cores=" + path.join(original_dir, "build/cores") + " --options=" + path.join(original_dir, "modloader64-config.json"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
}

if (program.dist){
    let original_dir: string = process.cwd();
    const fsExtra = require('fs-extra');
    fsExtra.emptyDirSync("./dist");
    if (!fs.existsSync("./dist")){
        fs.mkdirSync("./dist");
    }
    let f1: string = path.join(__dirname, "../");
    ncp("./build/src", "./dist", function (err) {
        if (err) {
            return console.error(err);
        }
        process.chdir(path.join(".", "dist"));
        fs.readdirSync(".").forEach((file: string)=>{
            let p: string = path.join(".", file);
            if (fs.lstatSync(p).isDirectory()){
                child_process.execSync("node " + path.join(f1, "/build/src/tools/paker.js") + " --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\"");
                console.log("Generated pak for " + file + ".");
            }
        });
    });
}

if (program.runp2){
    console.log("Running mod. Please wait while we load the emulator...");
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    let ml = child_process.exec("npm run start_2 -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.join(original_dir, "roms") + " --cores=" + path.join(original_dir, "build/cores"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
}