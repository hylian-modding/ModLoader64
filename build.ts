import { ncp } from 'ncp';
import * as fs from 'fs-extra';
import { execSync, fork } from 'child_process';
import program from 'commander';
import path from 'path';
import findRemoveSync from 'find-remove';

var isWin = process.platform === "win32";

const copyNodeModules = require('copy-node-modules');

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
    case "pushModules": {
        pushModules();
        break;
    }
}

function forceAPI() {
    if (isWin) {
        execSync("cd ./Scripts/Windows/ \ncall build_api.bat", { stdio: "inherit" })
    } else {
        execSync("cd ./Scripts/Unix/ \nsh build_api.sh", { stdio: "inherit" })
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
        forceAPI();
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

    if (!fs.existsSync("./build/emulator")) {
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
    if (!fs.existsSync("./build2")) {
        fs.mkdirSync("./build2");
    }
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
