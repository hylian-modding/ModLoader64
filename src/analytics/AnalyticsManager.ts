import fs from 'fs';
import path from 'path';
import { IAnalyticsManager } from 'modloader64_api/analytics/IAnalyticsManager';

export class AnalyticsManager implements IAnalyticsManager {

    stats: any = {};

    storeStat(key: string, object: any) {
        this.stats[key] = object;
        this.save();
    }

    getStat(key: string): any {
        this.load();
        if (this.stats.hasOwnProperty(key)) {
            return this.stats[key];
        } else {
            return {};
        }
    }

    save() {
        fs.writeFileSync(path.resolve(".", "ML64_Analytics.json"), JSON.stringify(this.stats));
    }

    load() {
        if (fs.existsSync(path.resolve(".", "ML64_Analytics.json"))) {
            this.stats = JSON.parse(fs.readFileSync(path.resolve(".", "ML64_Analytics.json"), JSON.stringify(this.stats)).toString());
        } else {
            this.stats = {};
        }
    }

}