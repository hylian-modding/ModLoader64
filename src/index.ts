import { addHook } from 'pirates';
import crypto from 'crypto';
import { publicKey } from './publicKey';

addHook((code: string, filename: string) => {
    let json = JSON.parse(code);
    let c = Buffer.from(json.code, 'base64');
    const verifier = crypto.createVerify('sha256');
    verifier.update(c);
    verifier.end();
    const verified = verifier.verify(publicKey, Buffer.from(json.sig, 'base64'));
    if (verified) {
        return c.toString();
    } else {
        throw new Error("Failed to verify mls file: " + filename + ".");
    }
}, { exts: ['.mls'] });

addHook((code: string, filename: string) => {
    let lzma: any = require("lzma");
    let d = Buffer.from(code, 'base64');
    let c = Buffer.from(lzma.decompress(d)).toString();
    return c;
}, { exts: ['.mlz'] });

require('./loader');