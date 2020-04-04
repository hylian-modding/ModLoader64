import { MonkeyPatch, IMonkeyPatch } from "./IMonkeyPatch";
import IUtils from "modloader64_api/IUtils";
import fs from 'fs';
import path from 'path';


export class MonkeyPatch_Yaz0Encode extends MonkeyPatch implements IMonkeyPatch {

    obj: IUtils;

    constructor(obj: IUtils) {
        super();
        this.obj = obj;
    }

    patch(): void {
        this.original = (this.obj as any)["yaz0Encode"];
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
        (this.obj as any)["yaz0Encode"] = this.original;
    }
}