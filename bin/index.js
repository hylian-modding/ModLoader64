#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = __importDefault(require("commander"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var child_process_1 = __importDefault(require("child_process"));
var fs_extra_1 = __importDefault(require("fs-extra"));
commander_1["default"].option('-n, --init', 'init new project');
commander_1["default"].option('-b, --build', 'build mod');
commander_1["default"].option('-r, --run', 'run mod');
commander_1["default"].option('-d, --dist', 'pack mod');
commander_1["default"].option("-2, --runp2", "run p2");
commander_1["default"].option("-u, --update", "update");
commander_1["default"].option("-q, --bumpversion", "bump version number");
commander_1["default"].option("-i, --install <url>", "install dependency");
commander_1["default"].option("-s, --setroms <path>", "set rom directory");
commander_1["default"].parse(process.argv);
var original_dir = process.cwd();
process.chdir(path_1["default"].join(__dirname, "../"));
var sdk_cfg = JSON.parse(fs_1["default"].readFileSync("./SDK-config.json").toString());
process.chdir(original_dir);
if (commander_1["default"].init) {
    var original_dir_1 = process.cwd();
    console.log("Generating mod scaffolding...");
    child_process_1["default"].execSync("npm init --yes");
    if (!fs_1["default"].existsSync("./src")) {
        fs_1["default"].mkdirSync("./src");
        var meta = JSON.parse(fs_1["default"].readFileSync("./package.json").toString());
        fs_1["default"].mkdirSync("./src/" + meta.name);
        process.chdir("./src/" + meta.name);
        child_process_1["default"].execSync("npm init --yes");
    }
    process.chdir(original_dir_1);
    if (!fs_1["default"].existsSync("./node_modules")) {
        console.log("Linking ModLoader64 API to project...");
        console.log("This might take a moment. Please be patient.");
        var our_pkg = JSON.parse(fs_1["default"].readFileSync(path_1["default"].join(__dirname, "../", "package.json")).toString());
        Object.keys(our_pkg.dependencies).forEach(function (key) {
            if (key.indexOf("modloader64") === -1) {
                child_process_1["default"].execSync("npm link " + key);
            }
        });
        Object.keys(our_pkg.devDependencies).forEach(function (key) {
            if (key.indexOf("modloader64") === -1) {
                child_process_1["default"].execSync("npm link " + key);
            }
        });
        child_process_1["default"].execSync("npm link " + "modloader64_api");
        console.log("Setting up TypeScript compiler...");
        child_process_1["default"].execSync("tsc --init");
        fs_1["default"].copyFileSync(path_1["default"].join(__dirname, "../", "tsconfig.json"), "./tsconfig.json");
    }
}
if (commander_1["default"].setroms !== undefined) {
    sdk_cfg.ModLoader64.SDK.roms_dir = path_1["default"].resolve(commander_1["default"].setroms);
    var original_dir_2 = process.cwd();
    process.chdir(path_1["default"].join(__dirname, "../"));
    fs_1["default"].writeFileSync("./SDK-config.json", JSON.stringify(sdk_cfg, null, 2));
    process.chdir(original_dir_2);
}
if (commander_1["default"].bumpversion) {
    var original_dir_3 = process.cwd();
    child_process_1["default"].execSync("npm version --no-git-tag-version patch");
    var meta = JSON.parse(fs_1["default"].readFileSync("./package.json").toString());
    var p = "./src/" + meta.name;
    process.chdir(p);
    child_process_1["default"].execSync("npm version --no-git-tag-version patch");
    meta = JSON.parse(fs_1["default"].readFileSync("./package.json").toString());
    console.log("New version number: " + meta.version);
    process.chdir(original_dir_3);
}
if (commander_1["default"].build) {
    var original_dir_4 = process.cwd();
    console.log("Building mod. Please wait...");
    if (!fs_1["default"].existsSync("./cores")) {
        fs_1["default"].mkdirSync("./cores");
    }
    child_process_1["default"].execSync("npx tsc");
    fs_extra_1["default"].copySync("./src", "./build/src");
    if (!fs_1["default"].existsSync("./build/cores")) {
        fs_1["default"].mkdirSync("./build/cores");
    }
    if (!fs_1["default"].existsSync("./libs")) {
        fs_1["default"].mkdirSync("./libs");
    }
    fs_extra_1["default"].copySync("./cores", "./build/cores");
    fs_extra_1["default"].copySync("./build/cores", "./libs");
    fs_1["default"].readdirSync("./libs").forEach(function (file) {
        var p = path_1["default"].join("./libs", file);
        if (fs_1["default"].lstatSync(p).isDirectory()) {
            child_process_1["default"].execSync("npm link --local " + p);
        }
    });
    process.chdir(original_dir_4);
}
if (commander_1["default"].run) {
    console.log("Running mod. Please wait while we load the emulator...");
    var original_dir_5 = process.cwd();
    process.chdir(path_1["default"].join(__dirname, "../"));
    var ml = child_process_1["default"].exec("npm run start -- --mods=" + path_1["default"].join(original_dir_5, "build", "src") + " --roms=" + path_1["default"].resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path_1["default"].join(original_dir_5, "libs") + " --config=" + path_1["default"].join(original_dir_5, "modloader64-config.json"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    ml.on('error', function (err) {
        console.log(err);
    });
    ml.stderr.on('data', function (data) {
        console.log(data);
    });
    process.chdir(original_dir_5);
}
if (commander_1["default"].dist) {
    var original_dir_6 = process.cwd();
    var fsExtra = require('fs-extra');
    fsExtra.emptyDirSync("./dist");
    if (!fs_1["default"].existsSync("./dist")) {
        fs_1["default"].mkdirSync("./dist");
    }
    var f1_1 = path_1["default"].join(__dirname, "../");
    fs_extra_1["default"].copySync("./build/src", "./dist");
    fs_extra_1["default"].copySync("./build/cores", "./dist");
    process.chdir(path_1["default"].join(".", "dist"));
    fs_1["default"].readdirSync(".").forEach(function (file) {
        var p = path_1["default"].join(".", file);
        if (fs_1["default"].lstatSync(p).isDirectory()) {
            child_process_1["default"].execSync("node " + path_1["default"].join(f1_1, "/bin/paker.js") + " --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\"");
            console.log("Generated pak for " + file + ".");
        }
    });
    process.chdir(original_dir_6);
}
if (commander_1["default"].runp2) {
    console.log("Running mod. Please wait while we load the emulator...");
    var original_dir_7 = process.cwd();
    var cfg = JSON.parse(fs_1["default"].readFileSync(path_1["default"].join(original_dir_7, "modloader64-config.json")).toString());
    cfg["ModLoader64"]["isServer"] = false;
    fs_1["default"].writeFileSync(path_1["default"].join(original_dir_7, "modloader64-p2-config.json"), JSON.stringify(cfg, null, 2));
    process.chdir(path_1["default"].join(__dirname, "../"));
    var ml = child_process_1["default"].exec("npm run start_2 -- --mods=" + path_1["default"].join(original_dir_7, "build", "src") + " --roms=" + path_1["default"].resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path_1["default"].join(original_dir_7, "libs") + " --config=" + path_1["default"].join(original_dir_7, "modloader64-p2-config.json"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    ml.on('error', function (err) {
        console.log(err);
    });
    process.chdir(original_dir_7);
}
if (commander_1["default"].update) {
    var original_dir_8 = process.cwd();
    process.chdir(path_1["default"].join(__dirname, "../"));
    console.log("Updating ModLoader64...");
    child_process_1["default"].execSync("git reset --hard origin/master");
    child_process_1["default"].execSync("git pull");
    var ml = child_process_1["default"].exec("npm install");
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
    process.chdir(original_dir_8);
}
if (commander_1["default"].install !== undefined) {
    console.log("Installing " + commander_1["default"].install + "...");
    var original_dir_9 = process.cwd();
    if (!fs_1["default"].existsSync("./dependencies")) {
        fs_1["default"].mkdirSync("./dependencies");
    }
    var meta_1 = JSON.parse(fs_1["default"].readFileSync("./package.json").toString());
    if (!meta_1.hasOwnProperty("modloader64_deps")) {
        meta_1["modloader64_deps"] = {};
    }
    var mod_meta_1 = JSON.parse(fs_1["default"].readFileSync(path_1["default"].join(".", "src", meta_1.name, "package.json")).toString());
    if (!mod_meta_1.hasOwnProperty("modloader64_deps")) {
        mod_meta_1["modloader64_deps"] = {};
    }
    process.chdir("./dependencies");
    child_process_1["default"].execSync("git clone " + commander_1["default"].install);
    var cores_1 = [];
    fs_1["default"].readdirSync(".").forEach(function (file) {
        var p = path_1["default"].join(".", file);
        var b = process.cwd();
        if (fs_1["default"].lstatSync(p).isDirectory()) {
            process.chdir(p);
            child_process_1["default"].execSync("modloader64 --init --build");
            cores_1.push(path_1["default"].resolve("./build/cores"));
            fs_1["default"].readdirSync("./build/cores").forEach(function (file) {
                var b2 = process.cwd();
                var meta2 = JSON.parse(fs_1["default"].readFileSync("./package.json").toString());
                child_process_1["default"].execSync("npm link " + meta2.name);
                process.chdir(original_dir_9);
                child_process_1["default"].execSync("npm link " + meta2.name);
                process.chdir(b2);
                if (!meta_1["modloader64_deps"].hasOwnProperty("meta2.name")) {
                    meta_1["modloader64_deps"][meta2.name] = commander_1["default"].install;
                }
                if (!mod_meta_1["modloader64_deps"].hasOwnProperty("meta2.name")) {
                    mod_meta_1["modloader64_deps"][meta2.name] = commander_1["default"].install;
                }
            });
        }
        process.chdir(b);
    });
    process.chdir(original_dir_9);
    fs_1["default"].writeFileSync("./package.json", JSON.stringify(meta_1, null, 2));
    fs_1["default"].writeFileSync(path_1["default"].join(".", "src", meta_1.name, "package.json"), JSON.stringify(mod_meta_1, null, 2));
    if (!fs_1["default"].existsSync("./libs")) {
        fs_1["default"].mkdirSync("./libs");
    }
    for (var i = 0; i < cores_1.length; i++) {
        var c = cores_1[i];
        fs_extra_1["default"].copySync(c, "./libs");
    }
}
