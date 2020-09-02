import { MonkeyPatch, IMonkeyPatch } from "./IMonkeyPatch";
import IUtils from "modloader64_api/IUtils";
import fs from 'fs';
import path from 'path';
import { IYaz0 } from "modloader64_api/Sylvain/Yaz0";

export class MonkeyPatch_Yaz0Encode extends MonkeyPatch implements IMonkeyPatch {

    obj: IUtils;
    yaz0: IYaz0;

    constructor(obj: IUtils, yaz0: IYaz0) {
        super();
        this.obj = obj;
        this.yaz0 = yaz0;
    }

    patch(): void {
        this.original = (this.yaz0 as any)["encode"];
        this.replacement = (buf: Buffer) => {
            let cache_dir: string = "./cache";
            if (!fs.existsSync(cache_dir)) {
                fs.mkdirSync(cache_dir);
            }
            let hash: string = this.obj.hashBuffer(buf);
            let cached_file: string = path.join(cache_dir, hash);
            if (!fs.existsSync(cached_file)) {
                fs.writeFileSync(cached_file, this.original(buf));
            }
            return fs.readFileSync(cached_file);
        };
        (this.obj as any)["yaz0Encode"] = this.replacement;
    }

    unpatch(): void {
    }
}

export class MonkeyPatch_Yaz0Decode extends MonkeyPatch implements IMonkeyPatch {

    obj: IUtils;
    yaz0: IYaz0;

    constructor(obj: IUtils, yaz0: IYaz0) {
        super();
        this.obj = obj;
        this.yaz0 = yaz0;
    }

    patch(): void {
        this.original = (this.yaz0 as any)["decode"];
        this.replacement = (buf: Buffer) => {
            return this.original(buf);
        };
        (this.obj as any)["yaz0Decode"] = this.replacement;
    }

    unpatch(): void {
    }
}