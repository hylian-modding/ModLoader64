import semver from 'semver';
import { bus } from './EventHandler';
import { ModLoaderEvents } from './IModLoaderAPI';

const ExternalAPIs: Map<string, ExternalAPIData> = new Map<string, ExternalAPIData>();

export class ExternalAPIData {
    name: string;
    version: string;
    path: string;
    processed: boolean = false;

    constructor(name: string, version: string, path: string) {
        this.name = name;
        this.version = version;
        this.path = path;
    }
}

export function ExternalAPIProvider(name: string, version: string, path: string) {
    return (ctor: Function)=>{
        if (getExternalAPIData(name) !== undefined) {
            let data = getExternalAPIData(name)!;
            let builds = [data.version, version];
            builds = semver.rsort(builds);
            if (builds[0] === version && data.version !== version) {
                ExternalAPIs.set(name, new ExternalAPIData(name, version, path));
                bus.emit(ModLoaderEvents.ON_EXTERNAL_API_REGISTER, getExternalAPIData(name));
            }
        } else {
            ExternalAPIs.set(name, new ExternalAPIData(name, version, path));
            bus.emit(ModLoaderEvents.ON_EXTERNAL_API_REGISTER, getExternalAPIData(name));
        }
    };
}

export function getExternalAPIData(name: string): ExternalAPIData | undefined {
    return ExternalAPIs.get(name);
}