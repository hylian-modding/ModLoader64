import fs from 'fs-extra';
import os from 'os';
import asar from 'asar';
import child_process from 'child_process';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import path from 'path';

const arch: string = os.arch();
const platform: string = os.platform();

console.log(`${platform} ${arch}`);

const key: string = `${platform}${arch}`;

async function downloadWindowsDeps() {
    console.log("Getting client files from github...")
    let pak = await fetch("https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Windows64/emulator.pak");
    fs.writeFileSync("./emulator.pak", await pak.buffer());
    if (!fs.existsSync("./client")) {
        fs.mkdirSync("./client");
    }
    child_process.execSync(`paker -i ./emulator.pak -o ./client`);
    if (!fs.existsSync("./client/node_modules")) {
        fs.mkdirSync("./client/node_modules");
    }
    fs.copySync("./node_modules", "./client/node_modules", { dereference: true, recursive: true });
    asar.createPackage("./client/node_modules", "./client/node_modules.asar").then(() => {
        asar.createPackage("./build", "./client/modloader64.asar").then(() => {
            fs.removeSync("./client/node_modules");
            asar.createPackage("./client", "./client.asar").then(() => {
                let zip = new AdmZip();
                zip.addLocalFile("./client.asar");
                zip.writeZip("./client.zip");
                fs.writeFileSync("./client.md5", child_process.execSync(`md5 -i ${path.resolve("./client.zip")}`).toString().trim());
            });
        });
    });
}

switch (key) {
    case "win32x64": {
        downloadWindowsDeps();
        break;
    }
}