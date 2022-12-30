import crypto from 'crypto';
import fs from 'fs-extra';
import zip from 'adm-zip';

function hash(file: string) {
    let buf = fs.readFileSync(file);
    let hash = crypto.createHash('md5').update(buf).digest().toString('hex');
    return hash;
}

fs.writeFileSync("./windows.md5", hash("./windows.asar"));
fs.writeFileSync("./linux.md5", hash("./linux.asar"));

let z1 = new zip();
z1.addLocalFile("./windows.asar");
fs.writeFileSync("./windows.zip", z1.toBuffer());

let z2 = new zip();
z2.addLocalFile("./linux.asar");
fs.writeFileSync("./linux.zip", z2.toBuffer());