import fs from 'fs';

export class AnalyticsDB {
    db: any = {};
    file: string = "";

    constructor(file: string) {
        if (fs.existsSync(file)){
            this.db = JSON.parse(fs.readFileSync(file).toString());
        }
        this.file = file;
    }
    store(key: string, data: any): boolean {
        this.db[key] = data;
        fs.writeFileSync(this.file, JSON.stringify(this.db, null, 2));
        return true;
    }
    retrieve(key: string): any {
        if (this.db.hasOwnProperty(key)){
            return this.db[key];
        }else{
            return {};
        }
    }
}
