import fs from 'fs';
import { Pak } from 'modloader64_api/PakFormat';

export class AnalyticsDB {
    db: any = {};
    pak: Pak;
    constructor(file: string) {
        if (!fs.existsSync(file)) {
            this.pak = new Pak(file);
        }
        else {
            this.pak = new Pak(file);
            this.db = JSON.parse(this.pak.load(0));
        }
    }
    store(key: string, data: any): boolean {
        this.db[key] = data;
        this.pak.overwriteFileAtIndex(0, this.db);
        this.pak.update();
        return true;
    }
    retrieve(key: string): any {
        return this.db[key];
    }
}
