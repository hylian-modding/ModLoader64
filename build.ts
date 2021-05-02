import * as fs from 'fs-extra';
import path from 'path';
import child_process from 'child_process';
import fse from 'fs-extra';

function pushToServer() {
    let Client = require('ssh2-sftp-client');
    let sftp = new Client();
    sftp.connect({
        host: fs.readFileSync('./addr.bin').toString(),
        port: '22',
        username: fs.readFileSync("./user.bin").toString(),
        password: fs.readFileSync("./pw.bin").toString()
    }).then(() => {
        console.log("connected.");
        return sftp.list('/var/www/html/ModLoader64/dev');
    }).then(data => {
        console.log(data);
        console.log("Updating client files.")
        return sftp.uploadDir("./dist", '/var/www/html/ModLoader64/dev/');
    }).then(data => {
        console.log(data);
        console.log("Updating OotO dev server files.")
        child_process.execSync("paker --input ./dist/dedi.pak --output ./dist");
        return sftp.uploadDir("./dist/dedi", "/OotO_200/dev_server")
    }).then(data => {
        console.log(data);
        sftp.end();
    }).catch(err => {
        console.log(err, 'catch error');
    });
}

function pushToLiveServer() {
    child_process.execSync("paker --input ./dist/dedi.pak --output ./dist");
    fs.readdirSync("./dist/dedi/node_modules").forEach((file: string) => {
        let f = path.resolve("./dist/dedi/node_modules", file);
        if (f.indexOf("modloader64_api") === -1) {
            //console.log("Removing " + file + ".");
            //fs.removeSync(f);
        }
    });
    let Client = require('ssh2-sftp-client');
    let sftp = new Client();
    sftp.connect({
        host: fs.readFileSync('./addr.bin').toString(),
        port: '22',
        username: fs.readFileSync("./user.bin").toString(),
        password: fs.readFileSync("./pw.bin").toString()
    }).then(() => {
        console.log("connected.");
        return sftp.list('/var/www/html/ModLoader64/update');
    }).then(data => {
        console.log(data);
        console.log("Updating OotO server files.")
        return sftp.uploadDir("./dist/dedi", "/OotO_200")
    }).then(data => {
        console.log(data);
        console.log("Updating MMO server files.")
        return sftp.uploadDir("./dist/dedi", "/MMARO")
    }).then(data => {
        console.log(data);
        console.log("Updating BKO server files.")
        return sftp.uploadDir("./dist/dedi", "/ML64_Servers/BKO")
    }).then(data => {
        console.log(data);
        console.log("Updating SM64O server files.")
        return sftp.uploadDir("./dist/dedi", "/ML64_Servers/SM64O")
    }).then(data => {
        console.log(data);
        console.log("Updating Mischief Makers server files.")
        return sftp.uploadDir("./dist/dedi", "/ML64_Servers/Mischief")
    }).then(data => {
        console.log(data);
        fse.removeSync("./dist/dedi");
        fse.removeSync("./dist/dedi.pak");
        console.log("Updating client files.")
        return sftp.uploadDir("./dist", '/var/www/html/ModLoader64/update/');
    }).then(data => {
        console.log(data);
        sftp.end();
    }).catch(err => {
        console.log(err, 'catch error');
    });
}