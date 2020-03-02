import { IModLoaderAPI } from "./IModLoaderAPI";

export function ModLoaderAPIInject() {
    return function(target: any, key: string) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.ModLoaderAPIInject === undefined) {
            target.ModLoader['ModLoaderAPIInject'] = {};
        }
        if (target.ModLoader.ModLoaderAPIInject.Targets === undefined) {
            target.ModLoader.ModLoaderAPIInject['Targets'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.ModLoaderAPIInject.Targets.set(key, "yes");
    };
}

export function setupMLInjects(instance: any, api: IModLoaderAPI) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return;
        }
        if (p.ModLoader.hasOwnProperty('ModLoaderAPIInject')) {
            if (p.ModLoader.ModLoaderAPIInject.hasOwnProperty("Targets")) {
                p.ModLoader.ModLoaderAPIInject.Targets.forEach((value: string, key: string) => {
                    (instance as any)[key] = api;
                });
            }
        }
    }
}