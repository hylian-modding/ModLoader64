#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import fse from 'fs-extra';
const isElevated = require('is-elevated');
const stripJsonComments = require('strip-json-comments');

let platformkey = '';
if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
    platformkey = process.platform.trim() + 'x64';
} else {
    platformkey = process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
}

program.option('-n, --init', 'init new project');
program.option('-b, --build', 'build mod');
program.option('-r, --run', 'run mod');
program.option('-d, --dist', 'pack mod');
program.option("-2, --runp2", "run p2");
program.option("-u, --update", "update");
program.option("-q, --bumpversion", "bump version number");
program.option("-i, --install <url>", "install dependency");
program.option("-s, --setroms <path>", "set rom directory");
program.option("-c, --clean", "cleans build dirs");
program.option("-a, --modulealias <alias>", "alias a module path");
program.option("-p, --modulealiaspath <path>", "alias a module path");

program.parse(process.argv);

interface SDK_Cat {
    roms_dir: string;
}

interface ModLoader64_Cat {
    SDK: SDK_Cat;
}

interface SDKCFG {
    ModLoader64: ModLoader64_Cat;
}

let original_dir: string = process.cwd();
process.chdir(path.join(__dirname, "../"));
let sdk_cfg: SDKCFG = JSON.parse(fs.readFileSync("./SDK-config.json").toString());
process.chdir(original_dir);

let tsconfig_path: string = path.resolve(path.join("./", "tsconfig.json"));
let tsconfig!: any;
if (fs.existsSync(tsconfig_path)) {
    tsconfig = JSON.parse(stripJsonComments(fs.readFileSync(tsconfig_path).toString()));
}

function saveTSConfig() {
    fs.writeFileSync(tsconfig_path, JSON.stringify(tsconfig, null, 2));
}

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
    if (!fs.existsSync("./node_modules")) {
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
    child_process.execSync("npm install");
}

if (program.setroms !== undefined) {
    sdk_cfg.ModLoader64.SDK.roms_dir = path.resolve(program.setroms);
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    fs.writeFileSync("./SDK-config.json", JSON.stringify(sdk_cfg, null, 2));
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

if (program.clean) {
    fse.removeSync("./build");
    fse.removeSync("./build2");
    fse.removeSync("./dist");
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
    let ml = child_process.exec("npm run start -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path.join(original_dir, "libs") + " --config=" + path.join(original_dir, "modloader64-config.json") + " --startdir " + original_dir);
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    ml.on('error', (err: Error) => {
        console.log(err);
    });
    ml.stderr.on('data', (data) => {
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
            child_process.execSync("node " + path.join(f1, "/bin/paker.js") + " --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\"");
            console.log("Generated pak for " + file + ".");
        }
    });
    process.chdir(original_dir);
}

if (program.runp2) {
    console.log("Running mod. Please wait while we load the emulator...");
    let original_dir: string = process.cwd();
    let cfg: any = JSON.parse(fs.readFileSync(path.join(original_dir, "modloader64-config.json")).toString());
    cfg["ModLoader64"]["isServer"] = false;
    fs.writeFileSync(path.join(original_dir, "modloader64-p2-config.json"), JSON.stringify(cfg, null, 2));
    process.chdir(path.join(__dirname, "../"));
    let ml = child_process.exec("npm run start_2 -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path.join(original_dir, "libs") + " --config=" + path.join(original_dir, "modloader64-p2-config.json") + " --startdir " + original_dir);
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    ml.on('error', (err: Error) => {
        console.log(err);
    });
    process.chdir(original_dir);
}

function updateCores() {
    let original_dir: string = process.cwd();
    let deps_dir: string = path.join("./", "external_cores");
    process.chdir(deps_dir);
    let cores: Array<string> = [];
    fs.readdirSync("./").forEach((file: string) => {
        let f: string = path.join("./", file);
        if (fs.lstatSync(f).isDirectory()) {
            let b2: string = process.cwd();
            process.chdir(path.join("./", f));
            cores.push(path.resolve("./build/cores"));
            child_process.execSync("git reset --hard origin/master");
            child_process.execSync("git pull");
            console.log(process.cwd());
            let meta2: any = JSON.parse(fs.readFileSync("./package.json").toString());
            console.log("Updating " + meta2.name);
            child_process.execSync("npm install");
            child_process.execSync("modloader64 -nbd");
            process.chdir(b2);
        }
    });
    process.chdir(original_dir);
}

function installCores() {
    let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
    if (!meta.hasOwnProperty("modloader64_deps")) {
        meta["modloader64_deps"] = {};
    }
    let mod_meta: any = JSON.parse(fs.readFileSync(path.join(".", "src", meta.name, "package.json")).toString());
    if (!mod_meta.hasOwnProperty("modloader64_deps")) {
        mod_meta["modloader64_deps"] = {};
    }
    Object.keys(mod_meta["modloader64_deps"]).forEach((key: string) => {
        child_process.execSync("modloader64 -i " + mod_meta["modloader64_deps"][key]);
    });
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
    ml.on('exit', () => {
        process.chdir(original_dir);
        updateCores();
    });
    process.chdir(original_dir);
    updateCores();
}

function install() {
    (async () => {
        let elv: boolean = await isElevated();
        if (!elv && platformkey.indexOf("win32") > -1) {
            console.log("Install must be run as administrator on Windows!");
            return;
        }
        console.log("Installing " + program.install + "...");
        let original_dir: string = process.cwd();
        let deps_dir: string = path.join("./", "external_cores");
        if (!fs.existsSync(deps_dir)) {
            fs.mkdirSync(deps_dir);
        }
        let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
        if (!meta.hasOwnProperty("modloader64_deps")) {
            meta["modloader64_deps"] = {};
        }
        let mod_meta: any = JSON.parse(fs.readFileSync(path.join(".", "src", meta.name, "package.json")).toString());
        if (!mod_meta.hasOwnProperty("modloader64_deps")) {
            mod_meta["modloader64_deps"] = {};
        }
        process.chdir(deps_dir);
        try {
            child_process.execSync("git clone " + program.install);
        } catch (err) {
            if (err) {
                console.log("This core is already installed!");
            }
        }
        let cores: Array<string> = [];
        fs.readdirSync(".").forEach((file: string) => {
            let p: string = path.join(".", file);
            let b: string = process.cwd();
            if (fs.lstatSync(p).isDirectory()) {
                process.chdir(p);
                child_process.execSync("modloader64 --init --build");
                cores.push(path.resolve("./build/cores"));
                fs.readdirSync("./build/cores").forEach((file: string) => {
                    let meta2: any = JSON.parse(fs.readFileSync("./package.json").toString());
                    if (!meta["modloader64_deps"].hasOwnProperty("meta2.name")) {
                        meta["modloader64_deps"][meta2.name] = program.install;
                    }
                    if (!mod_meta["modloader64_deps"].hasOwnProperty("meta2.name")) {
                        mod_meta["modloader64_deps"][meta2.name] = program.install;
                    }
                    if (tsconfig !== undefined) {
                        tsconfig["compilerOptions"]["paths"] = {};
                        tsconfig["compilerOptions"]["paths"][meta2.name + "/*"] = [path.join("./libs", meta2.name) + "/*"];
                        saveTSConfig();
                    }
                });
            }
            process.chdir(b);
        });
        process.chdir(original_dir);
        fs.writeFileSync("./package.json", JSON.stringify(meta, null, 2));
        fs.writeFileSync(path.join(".", "src", meta.name, "package.json"), JSON.stringify(mod_meta, null, 2));
        if (!fs.existsSync("./libs")) {
            fs.mkdirSync("./libs");
        }
        for (let i = 0; i < cores.length; i++) {
            let c: string = cores[i];
            fs.readdirSync(c).forEach((dir: string) => {
                let f: string = path.join(c, dir);
                if (fs.lstatSync(f).isDirectory()) {
                    try {
                        fse.symlinkSync(f, path.resolve(path.join("./libs", path.parse(f).name)));
                    } catch (err) {
                        if (err) {
                            console.log(err);
                        }
                    }
                }
            });
        }
    })();
}

if (program.install !== undefined) {
    install();
}

if (program.modulealiaspath !== undefined) {
    (async () => {
        let elv: boolean = await isElevated();
        if (!elv && platformkey.indexOf("win32") > -1) {
            console.log("Alias must be run as administrator on Windows!");
            return;
        }
        if (!fs.existsSync("./libs")) {
            fs.mkdirSync("./libs");
        }
        let p: string = path.resolve(program.modulealiaspath);
        let p2: string = path.resolve(path.join("./libs", path.parse(p).name));
        if (fs.lstatSync(p).isDirectory()) {
            fse.symlinkSync(p, p2);
        }
        console.log("Created alias for " + program.modulealiaspath + " -> " + program.modulealias);
        if (program.modulealias !== undefined) {
            let p: string = path.resolve(program.modulealiaspath);
            let p2: string = path.resolve(path.join("./libs", path.parse(p).name));
            let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
            let mod_meta: any = JSON.parse(fs.readFileSync(path.join(".", "src", meta.name, "package.json")).toString());
            if (!mod_meta.hasOwnProperty("modloader64_aliases")) {
                mod_meta["modloader64_aliases"] = {};
            }
            mod_meta["modloader64_aliases"]["@" + program.modulealias + "/*"] = [path.relative("./", p2) + "/*"];
            fs.writeFileSync(path.join(".", "src", meta.name, "package.json"), JSON.stringify(mod_meta, null, 2));
            // TSConfig.
            tsconfig["compilerOptions"]["paths"]["@" + program.modulealias + "/*"] = [path.relative("./", p2) + "/*"];
            saveTSConfig();
        }
    })();
}