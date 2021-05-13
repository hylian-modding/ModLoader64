import { IPlugin } from "../IModLoaderAPI";

export const enum ProxySide {
    CLIENT,
    SERVER
}

export class ProxySideContainer {
    side: ProxySide;
    backing: (new () => any) | string;

    constructor(side: ProxySide, backing: (new () => any) | string) {
        this.side = side;
        this.backing = backing;
    }
}

export function SidedProxy(side: ProxySide, inst: (new () => any) | string) {
    return function (
        target: any,
        propertyKey: string
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.sidedproxies === undefined) {
            target.ModLoader['sidedproxies'] = new Map<string, string>();
        }
        target.ModLoader.sidedproxies.set(new ProxySideContainer(side, inst), propertyKey);
    };
}

export function setupSidedProxy(instance: any, isClient: boolean, isServer: boolean): Array<any> {
    let p = Object.getPrototypeOf(instance);
    let arr: Array<any> = [];
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return arr;
        }
        if (p.ModLoader.hasOwnProperty('sidedproxies')) {
            p.ModLoader.sidedproxies.forEach(function (value: string, key: ProxySideContainer) {
                if (isClient && key.side === ProxySide.CLIENT) {
                    if (typeof (key.backing) === 'string') {
                        let c = require(key.backing).default;
                        instance[value] = new c();
                    } else {
                        instance[value] = new key.backing();
                    }
                    arr.push(instance[value]);
                } else if (isServer && key.side === ProxySide.SERVER) {
                    if (typeof (key.backing) === 'string') {
                        let c = require(key.backing).default;
                        instance[value] = new c();
                    } else {
                        instance[value] = new key.backing();
                    }
                    arr.push(instance[value]);
                }
            });
        }
    }
    return arr;
}

export function ParentReference() {
    return function (
        target: any,
        propertyKey: string
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.ParentReference === undefined) {
            target.ModLoader['ParentReference'] = new Map<string, string>();
        }
        target.ModLoader.ParentReference.set(propertyKey, propertyKey);
    };
}

export function setupParentReference(instance: any, parent: IPlugin) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return;
        }
        if (p.ModLoader.hasOwnProperty('ParentReference')) {
            p.ModLoader.ParentReference.forEach(function (value: string, key: string) {
                instance[key] = parent;
            });
        }
    }
}