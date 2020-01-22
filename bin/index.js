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
var ncp_1 = require("ncp");
commander_1["default"].option('-init, --init', 'init new project');
commander_1["default"].option('-b, --build', 'build mod');
commander_1["default"].option('-r, --run', 'run mod');
commander_1["default"].option('-d, --dist', 'pack mod');
commander_1["default"].option("-p2, --runp2", "run p2");
commander_1["default"].option("-u, --update", "update");
commander_1["default"].parse(process.argv);
if (commander_1["default"].init) {
    var original_dir = process.cwd();
    console.log("Generating mod scaffolding...");
    child_process_1["default"].execSync("npm init --yes");
    fs_1["default"].mkdirSync("./src");
    var meta = JSON.parse(fs_1["default"].readFileSync("./package.json").toString());
    fs_1["default"].mkdirSync("./src/" + meta.name);
    process.chdir("./src/" + meta.name);
    child_process_1["default"].execSync("npm init --yes");
    process.chdir(original_dir);
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
if (commander_1["default"].build) {
    console.log("Building mod. Please wait...");
    if (!fs_1["default"].existsSync("./cores")) {
        fs_1["default"].mkdirSync("./cores");
    }
    child_process_1["default"].execSync("npx tsc");
    ncp_1.ncp("./src", "./build/src", function (err) {
        if (err) {
            return console.error(err);
        }
    });
    if (!fs_1["default"].existsSync("./build/cores")) {
        fs_1["default"].mkdirSync("./build/cores");
    }
    if (!fs_1["default"].existsSync("./libs")) {
        fs_1["default"].mkdirSync("./libs");
    }
    ncp_1.ncp("./cores", "./build/cores", function (err) {
        if (err) {
            return console.error(err);
        }
        ncp_1.ncp("./build/cores", "./libs", function (err) {
            if (err) {
                return console.error(err);
            }
            fs_1["default"].readdirSync("./libs").forEach(function (file) {
                var p = path_1["default"].join("./libs", file);
                if (fs_1["default"].lstatSync(p).isDirectory()) {
                    child_process_1["default"].execSync("npm link --local " + p);
                }
            });
        });
    });
}
if (commander_1["default"].run) {
    console.log("Running mod. Please wait while we load the emulator...");
    var original_dir = process.cwd();
    process.chdir(path_1["default"].join(__dirname, "../"));
    var ml = child_process_1["default"].exec("npm run start -- --mods=" + path_1["default"].join(original_dir, "build", "src") + " --roms=" + path_1["default"].join(original_dir, "roms") + " --cores=" + path_1["default"].join(original_dir, "build/cores") + " --options=" + path_1["default"].join(original_dir, "modloader64-config.json"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
}
if (commander_1["default"].dist) {
    var original_dir = process.cwd();
    var fsExtra = require('fs-extra');
    fsExtra.emptyDirSync("./dist");
    if (!fs_1["default"].existsSync("./dist")) {
        fs_1["default"].mkdirSync("./dist");
    }
    var f1_1 = path_1["default"].join(__dirname, "../");
    ncp_1.ncp("./build/src", "./dist", function (err) {
        if (err) {
            return console.error(err);
        }
        ncp_1.ncp("./build/cores", "./dist", function (err) {
            if (err) {
                return console.error(err);
            }
            process.chdir(path_1["default"].join(".", "dist"));
            fs_1["default"].readdirSync(".").forEach(function (file) {
                var p = path_1["default"].join(".", file);
                if (fs_1["default"].lstatSync(p).isDirectory()) {
                    child_process_1["default"].execSync("node " + path_1["default"].join(f1_1, "/build/src/tools/paker.js") + " --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\"");
                    console.log("Generated pak for " + file + ".");
                }
            });
        });
    });
}
if (commander_1["default"].runp2) {
    console.log("Running mod. Please wait while we load the emulator...");
    var original_dir = process.cwd();
    process.chdir(path_1["default"].join(__dirname, "../"));
    var ml = child_process_1["default"].exec("npm run start_2 -- --mods=" + path_1["default"].join(original_dir, "build", "src") + " --roms=" + path_1["default"].join(original_dir, "roms") + " --cores=" + path_1["default"].join(original_dir, "build/cores"));
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
}
if (commander_1["default"].update) {
    var original_dir = process.cwd();
    process.chdir(path_1["default"].join(__dirname, "../"));
    console.log("Updating ModLoader64...");
    child_process_1["default"].execSync("git reset --hard origin/master");
    child_process_1["default"].execSync("git pull");
    var ml = child_process_1["default"].exec("npm install");
    ml.stdout.on('data', function (data) {
        console.log(data);
    });
}
