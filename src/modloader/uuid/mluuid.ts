import fse from 'fs-extra';
import path from 'path';
import { Imluuid } from 'modloader64_api/Imluuid';
import crypto from 'crypto';

const byteToHex: Array<string> = [];
for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

export class mluuid implements Imluuid {

    private nouns: Array<string> = [];
    private adjectives: Array<string> = [];

    constructor() {
        this.nouns = fse.readFileSync(path.join(__dirname, "english-nouns.txt")).toString().split("\n");
        this.adjectives = fse.readFileSync(path.join(__dirname, "english-adjectives.txt")).toString().split("\n");
    }

    private randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private bytesToUuid(buf: Buffer, offset: number = 0) {
        var i = offset || 0;
        var bth = byteToHex;
        return [
            bth[buf[i++]],
            bth[buf[i++]],
            bth[buf[i++]],
            bth[buf[i++]],
            '-',
            bth[buf[i++]],
            bth[buf[i++]],
            '-',
            bth[buf[i++]],
            bth[buf[i++]],
            '-',
            bth[buf[i++]],
            bth[buf[i++]],
            '-',
            bth[buf[i++]],
            bth[buf[i++]],
            bth[buf[i++]],
            bth[buf[i++]],
            bth[buf[i++]],
            bth[buf[i++]],
        ].join('');
    }

    private v4() {
        var rnds = crypto.randomBytes(16);
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;
        return this.bytesToUuid(rnds);
    }

    getLobbyName(): string {
        let n: string = this.nouns[this.randomIntFromInterval(0, this.nouns.length - 1)];
        let a: string = this.adjectives[this.randomIntFromInterval(0, this.adjectives.length - 1)];
        let z: string = (Math.floor(Math.random() * Math.floor(99))).toString();
        return n + "-" + a + "-" + z;
    }

    getUUID(): string {
        return this.v4();
    }
}

export const ML_UUID: mluuid = new mluuid();
