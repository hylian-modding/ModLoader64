#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import fse from 'fs-extra';

program.option('-init, --init', 'init new project');
program.option('-b, --build', 'build mod');
program.option('-r, --run', 'run mod');
program.option('-d, --dist', 'pack mod');
program.option("-p2, --runp2", "run p2");
program.option("-u, --update", "update");
program.option("-bv, --bumpversion", "bump version number");
program.option("-i, --install <url>", "install dependency");
program.parse(process.argv);

if (program.init) {
    let original_dir: string = process.cwd();
    console.log("Generating mod scaffolding...");
    child_process.execSync("npm init --yes");
    if (!fs.existsSync("./src")) {
        fs.mkdirSync("./src");
        let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
        fs.mkdirSync("./src/" + meta.name);
        process.chdir("./src/" + meta.name);
        child_process.execSync("npm init --yes");
    }
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
    let original_dir: string = process.cwd();
    console.log("Building mod. Please wait...");
    if (!fs.existsSync("./cores")) {
        fs.mkdirSync("./cores");
    }
    child_process.execSync("npx tsc");
    fse.copySync("./src", "./build/src");
    if (!fs.existsSync("./build/cores")) {
        fs.mkdirSync("./build/cores");
    }
    if (!fs.existsSync("./libs")) {
        fs.mkdirSync("./libs");
    }
    fse.copySync("./cores", "./build/cores");
    fse.copySync("./build/cores", "./libs");
    fs.readdirSync("./libs").forEach((file: string) => {
        let p: string = path.join("./libs", file);
        if (fs.lstatSync(p).isDirectory()) {
            child_process.execSync("npm link --local " + p);
        }
    });
    process.chdir(original_dir);
}

if (program.run) {
    console.log("Running mod. Please wait while we load the emulator...");
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    let ml = child_process.exec("npm run start -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.join(original_dir, "roms") + " --cores=" + path.join(original_dir, "build/cores") + " --options=" + path.join(original_dir, "modloader64-config.json"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    process.chdir(original_dir);
}

if (program.dist) {
    let original_dir: string = process.cwd();
    const fsExtra = require('fs-extra');
    fsExtra.emptyDirSync("./dist");
    if (!fs.existsSync("./dist")) {
        fs.mkdirSync("./dist");
    }
    let f1: string = path.join(__dirname, "../");
    fse.copySync("./build/src", "./dist");
    fse.copySync("./build/cores", "./dist");
    process.chdir(path.join(".", "dist"));
    fs.readdirSync(".").forEach((file: string) => {
        let p: string = path.join(".", file);
        if (fs.lstatSync(p).isDirectory()) {
            child_process.execSync("node " + path.join(f1, "/build/src/tools/paker.js") + " --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\"");
            console.log("Generated pak for " + file + ".");
        }
    });
    process.chdir(original_dir);
}

if (program.runp2) {
    console.log("Running mod. Please wait while we load the emulator...");
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    let ml = child_process.exec("npm run start_2 -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.join(original_dir, "roms") + " --cores=" + path.join(original_dir, "build/cores"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    ml.on('error', (err: Error) => {
        console.log(err);
    });
    process.chdir(original_dir);
}

if (program.update) {
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    console.log("Updating ModLoader64...");
    child_process.execSync("git reset --hard origin/master");
    child_process.execSync("git pull");
    let ml = child_process.exec("npm install");
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    process.chdir(original_dir);
}

if (program.bumpversion) {
    let original_dir: string = process.cwd();
    child_process.execSync("npm version --no-git-tag-version patch");
    let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
    let p: string = "./src/" + meta.name;
    process.chdir(p);
    child_process.execSync("npm version --no-git-tag-version patch");
    meta = JSON.parse(fs.readFileSync("./package.json").toString());
    console.log("New version number: " + meta.version);
    process.chdir(original_dir);
}

if (program.install !== undefined) {
    console.log("Installing " + program.install + "...");
    let original_dir: string = process.cwd();
    if (!fs.existsSync("./dependencies")) {
        fs.mkdirSync("./dependencies");
    }
    process.chdir("./dependencies");
    child_process.execSync("git clone " + program.install);
    let cores: Array<string> = [];
    fs.readdirSync(".").forEach((file: string) => {
        let p: string = path.join(".", file);
        let b: string = process.cwd();
        if (fs.lstatSync(p).isDirectory()) {
            process.chdir(p);
            child_process.execSync("modloader64 --init --build");
            fs.readdirSync("./build/cores").forEach((file: string) => {
                let b2: string = process.cwd();
                let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
                child_process.execSync("npm link " + meta.name);
                process.chdir(original_dir);
                child_process.execSync("npm link " + meta.name);
                process.chdir(b2);
            });
        }
        process.chdir(b);
    });

    process.chdir(original_dir);
}