import { ncp } from 'ncp';
import * as fs from 'fs';
import { execSync } from 'child_process';
import program from 'commander';
import path from 'path';
import findRemoveSync from 'find-remove';

var isWin = process.platform === "win32";

program.option('-s, --step <type>', 'build step')
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
    case "forceAPI": {
        forceAPI();
        break;
    }
}

function forceAPI(){
    if (isWin){
        execSync("build_api.bat", { stdio: "inherit" })
    }else{
        execSync("build_api.sh", { stdio: "inherit" })
    }
}

function prebuild() {
    if (!fs.existsSync("./mods")) {
        fs.mkdirSync("./mods")
    }

    if (!fs.existsSync("./roms")) {
        fs.mkdirSync("./roms")
    }

    if (!fs.existsSync("./build")) {
        fs.mkdirSync("./build")
    }

    if (!fs.existsSync("./build/src")) {
        fs.mkdirSync("./build/src")
    }

    if (!fs.existsSync("./build/mods")) {
        fs.mkdirSync("./build/mods")
    }

    if (!fs.existsSync("./build/roms")) {
        fs.mkdirSync("./build/roms")
    }

    if (!fs.existsSync("./build/emulator/mupen64plus.node")) {
        console.log("Building Mupen...")
        
        if (isWin){
            execSync("build_mupen_win32.bat", { stdio: "inherit" })
        }else{
            execSync("build_mupen_lin64.sh", { stdio: "inherit" })
        }
        ncp("./Mupen64Plus-Script/mupen64plus-binding-npm/bin", "./build", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
            forceAPI();
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

    if (fs.existsSync("./roms")) {
        ncp("./roms", "./build/roms", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });
    }
}

function postbuild() {
    findRemoveSync('./src', { extensions: ['.js'] })
    findRemoveSync('./test', { extensions: ['.js'] })
}