import { ncp } from 'ncp';
import * as fs from 'fs-extra';
import { execSync, fork } from 'child_process';
import program from 'commander';
import path from 'path';
import findRemoveSync from 'find-remove';
var recursive = require("recursive-readdir");
import crypto from 'crypto';

var isWin = process.platform === "win32";

const copyNodeModules = require('copy-node-modules');

program.option('-s, --step <type>', 'build step');
program.parse(process.argv);

switch (program.step) {
case "prebuild": {
    prebuild();
    break;
}
case "build": {
    build();
    break;
}
case "postbuild": {
    postbuild();
    break;
}
case "pushModules": {
    pushModules();
    break;
}
case "installEmulator": {
    getEmulator();
    break;
}
case "player2":{
    player2();
    break;
}
}

function getEmulator() {
    let platformkey = '';
    if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
        platformkey = process.platform.trim() + 'x64';
    } else {
        platformkey =process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
    }
    if (!fs.existsSync("./Mupen64Plus")){
        fs.mkdirSync("./Mupen64Plus");
    }
    if (platformkey.indexOf("win32") > -1){
        fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows/emulator.tar.gz", "./Mupen64Plus/emulator.tar.gz");
    }else if (platformkey.indexOf("linux") > -1){
        fs.copyFileSync("./node_modules/modloader64-platform-deps/Linux/emulator.tar.gz", "./Mupen64Plus/emulator.tar.gz");
    }
}

function pushModules() {
    const srcDir = '.';
    const dstDir = './build';
    copyNodeModules(srcDir, dstDir, { devDependencies: false }, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!fs.existsSync("./build/node_modules/modloader64_api")) {
            fs.mkdirSync("./build/node_modules/modloader64_api");
        }
        ncp("./API/build", "./build/node_modules/modloader64_api", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });

        fs.mkdirSync("./dist");

        ncp("./build", "./dist/windows", function (err) {
            if (err) return console.error(err);
        });

        ncp("./build", "./dist/linux", function (err) {
            if (err) return console.error(err);
        });

        ncp("./build", "./dist/mac", function (err) {
            if (err) return console.error(err);
        });

        ncp("./build", "./dist/switch", function (err) {
            if (err) return console.error(err);
        });

        console.log('done!');
    });
}

function prebuild() {

    if (fs.existsSync("./cores")){
        fs.mkdirSync("./cores");
    }

    if (!fs.existsSync("./mods")) {
        fs.mkdirSync("./mods");
    }

    if (!fs.existsSync("./roms")) {
        fs.mkdirSync("./roms");
    }

    if (!fs.existsSync("./build")) {
        fs.mkdirSync("./build");
    }

    if (!fs.existsSync("./build/src")) {
        fs.mkdirSync("./build/src");
    }

    if (!fs.existsSync("./build/mods")) {
        fs.mkdirSync("./build/mods");
    }

    if (!fs.existsSync("./build/roms")) {
        fs.mkdirSync("./build/roms");
        if (fs.existsSync("./roms")) {
            ncp("./roms", "./build/roms", function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('done!');
            });
        }
    }

    if (!fs.existsSync("./build/emulator")) {
        if (fs.existsSync("./Mupen64Plus/emulator.tar.gz")){
            fs.unlink("./Mupen64Plus/emulator.tar.gz");
        }
        ncp("./Mupen64Plus", "./build", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });
    }
}

function build() {
    ncp("./src", "./build/src", function (err) {
        if (err) {
            return console.error(err);
        }
        findRemoveSync('./build', { extensions: ['.ts'] });
        console.log('done!');
    });

    ncp("./mods", "./build/mods", function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('done!');
    });
}

function postbuild() {
    findRemoveSync('./src', { extensions: ['.js'] });
    findRemoveSync('./test', { extensions: ['.js'] });
    if (!fs.existsSync("./build2")) {
        fs.mkdirSync("./build2");
    }
    let hashes = [];
    recursive("./build", function (err, files) {
        for (let i = 0; i < files.length; i++) {
            let _path = path.resolve(files[i]);
            let _parse = path.parse(files[i]);
            let hash = crypto.createHash('md5').update(fs.readFileSync(_path)).digest('hex');
            hashes.push({ file: _parse.base, hash: hash });
        }
        fs.writeFileSync("./build/hashes.json", JSON.stringify(hashes, null, 2));
    });
}

function player2(){
    ncp("./build", "./build2", function (err) {
        if (err) {
            return console.error(err);
        }
        if (fs.existsSync("./build2/ModLoader64-config.json")) {
            let config = JSON.parse(fs.readFileSync("./build2/ModLoader64-config.json", 'utf8'));
            config.ModLoader64.isServer = false;
            config["NetworkEngine.Client"].nickname = "Test";
            fs.writeFileSync("./build2/ModLoader64-config.json", JSON.stringify(config));
        }
        console.log('done!');
    });
}