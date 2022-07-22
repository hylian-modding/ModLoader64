import fs from 'fs-extra';
import asar from 'asar';
import child_process from 'child_process';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import path from 'path';

async function downloadWindowsDeps() {
    console.log("Getting windows client files from github...")
    let pak = await fetch("https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Windows64/emulator.pak");
    fs.writeFileSync("./windows.pak", await pak.buffer());
}

async function downloadLinuxDeps() {
    console.log("Getting linux client files from github...")
    let pak = await fetch("https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Linux/emulator.pak");
    fs.writeFileSync("./linux.pak", await pak.buffer());
}

async function doBuild(pak: string, out: string) {
    if (!fs.existsSync("./client")) {
        fs.mkdirSync("./client");
    }
    child_process.execSync(`paker -i ${pak} -o ./client`);
    if (!fs.existsSync("./client/node_modules")) {
        fs.mkdirSync("./client/node_modules");
    }
    fs.copySync("./node_modules", "./client/node_modules", { dereference: true, recursive: true });
    await asar.createPackage("./client/node_modules", "./client/node_modules.asar");
    await asar.createPackage("./build", "./client/modloader64.asar");
    fs.removeSync("./client/node_modules");
    await asar.createPackage("./client", out);
    let zip = new AdmZip();
    zip.addLocalFile(out);
    zip.writeZip(`./${path.parse(out).name}.zip`);
    fs.writeFileSync(`./${path.parse(out).name}.md5`, child_process.execSync(`md5 -i ${path.resolve(`./${path.parse(out).name}.zip`)}`).toString().trim());
    fs.removeSync("./client");
}

(async () => {
    await downloadWindowsDeps();
    await downloadLinuxDeps();
    await doBuild("./windows.pak", "./windows.asar");
    await doBuild("./linux.pak", "./linux.asar");
})();