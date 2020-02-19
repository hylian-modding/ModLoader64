import * as fs from 'fs-extra';
import program from 'commander';
import path from 'path';
import findRemoveSync from 'find-remove';
var recursive = require("recursive-readdir");
import crypto from 'crypto';
import child_process from 'child_process';

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
    case "player2": {
        player2();
        break;
    }
}

function getEmulator() {
    let platformkey = '';
    if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
        platformkey = process.platform.trim() + 'x64';
    } else {
        platformkey = process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
    }
    if (!fs.existsSync("./Mupen64Plus")) {
        fs.mkdirSync("./Mupen64Plus");
    }
    if (platformkey.indexOf("win32") > -1) {
        fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows/emulator.tar.gz", "./Mupen64Plus/emulator.tar.gz");
    } else if (platformkey.indexOf("linux") > -1) {
        fs.copyFileSync("./node_modules/modloader64-platform-deps/Linux/emulator.tar.gz", "./Mupen64Plus/emulator.tar.gz");
    }
}

function pushModules() {
    console.log("Cleaning...");
    let original_dir: string = process.cwd();

    if (fs.existsSync("./build")){
        fs.removeSync("./build");
    }
    if (fs.existsSync("./build2")){
        fs.removeSync("./build2");
    }
    if (fs.existsSync("./dist")){
        fs.removeSync("./dist");
    }
    console.log("Building...");
    child_process.execSync("npm run build_dist");
    fs.removeSync("./build/roms");

    const srcDir = '.';
    const dstDir = './build';
    console.log("Copying node_modules...");
    copyNodeModules(srcDir, dstDir, { devDependencies: false }, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!fs.existsSync("./build/node_modules/modloader64_api")) {
            fs.mkdirSync("./build/node_modules/modloader64_api");
        }

        fs.copySync("./API/build", "./build/node_modules/modloader64_api");

        fs.mkdirSync("./dist");
        console.log("Putting together platform specific files...");
        fs.copySync("./build", "./dist/windows");
        fs.copySync("./build", "./dist/linux");
        //fs.copySync("./build", "./dist/mac");
        //fs.copySync("./build", "./dist/switch");
        console.log("Copying emulator files...");
        fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows/emulator.tar.gz", "./dist/windows/emulator_windows.tar.gz");
        process.chdir("./dist/windows");
        child_process.execSync("npx tar -xzvf ./emulator_windows.tar.gz");
        process.chdir(original_dir);
        fs.copyFileSync("./node_modules/modloader64-platform-deps/Linux/emulator.tar.gz", "./dist/linux/emulator_linux.tar.gz");
        process.chdir("./dist/linux");
        child_process.execSync("npx tar -xzvf ./emulator_linux.tar.gz");
        process.chdir(original_dir);
        if (fs.existsSync("./dist/windows/emulator_windows.tar.gz")){
            fs.unlinkSync("./dist/windows/emulator_windows.tar.gz");
        }
        if (fs.existsSync("./dist/linux/emulator_linux.tar.gz")){
            fs.unlinkSync("./dist/linux/emulator_linux.tar.gz");
        }
        console.log("Building paks...");
        process.chdir("./dist");
        fs.renameSync("./windows", "./ModLoader");
        child_process.execSync("paker --dir ./ModLoader --output ./");
        fs.renameSync("./ModLoader.pak", "./Windows.pak");
        fs.removeSync("./ModLoader");
        fs.renameSync("./linux", "./ModLoader");
        child_process.execSync("paker --dir ./ModLoader --output ./");
        fs.renameSync("./ModLoader.pak", "./Linux.pak");
        fs.removeSync("./ModLoader");
        process.chdir(original_dir);
        console.log("Building dedi tarball...");
        fs.copySync("./build", "./dist/dedi");
        process.chdir("./dist/dedi");
        child_process.execSync("tar -zcvf ./ModLoader64.tar.gz .");
        process.chdir(original_dir);
        fs.copyFileSync("./dist/dedi/ModLoader64.tar.gz", "./dist/ModLoader64.tar.gz");
        fs.removeSync("./dist/dedi");
    });
}

function prebuild() {

    if (!fs.existsSync("./cores")) {
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
            fs.copySync("./roms", "./build/roms");
        }
    }

    if (!fs.existsSync("./build/emulator")) {
        if (fs.existsSync("./Mupen64Plus/emulator.tar.gz")) {
            fs.unlink("./Mupen64Plus/emulator.tar.gz");
        }
        fs.copySync("./Mupen64Plus", "./build");
    }
}

function build() {
    fs.copySync("./src", "./build/src");
    fs.copySync("./mods", "./build/mods");
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

function player2() {
    fs.copySync("./build", "./build2");
    if (fs.existsSync("./build2/ModLoader64-config.json")) {
        let config = JSON.parse(fs.readFileSync("./build2/ModLoader64-config.json", 'utf8'));
        config.ModLoader64.isServer = false;
        config["NetworkEngine.Client"].nickname = "Test";
        fs.writeFileSync("./build2/ModLoader64-config.json", JSON.stringify(config));
    }
}