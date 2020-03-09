import fse from 'fs-extra';
import path from 'path';
import { Imluuid } from 'modloader64_api/Imluuid';

export class mluuid implements Imluuid {

    private nouns: Array<string> = [];
    private adjectives: Array<string> = [];

    constructor() {
        this.nouns = fse.readFileSync(path.join(__dirname, "english-nouns.txt")).toString().split("\n");
        this.adjectives = fse.readFileSync(path.join(__dirname, "english-adjectives.txt")).toString().split("\n");
    }

    randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getUUID(): string {
        let n: string = this.nouns[this.randomIntFromInterval(0, this.nouns.length - 1)];
        let a: string = this.adjectives[this.randomIntFromInterval(0, this.adjectives.length - 1)];
        let z: string = (Math.floor(Math.random() * Math.floor(99))).toString();
        return n + "-" + a + "-" + z;
    }
}

export const ML_UUID: Imluuid = new mluuid();
