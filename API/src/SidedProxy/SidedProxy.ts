import { IPlugin } from "../IModLoaderAPI";
import path from 'path';

export const enum ProxySide {
    CLIENT,
    SERVER,
    UNIVERSAL
}

function custom_dummy() {
    return true;
}

export class ProxySideContainer {
    side: ProxySide;
    backing: (new () => any) | string;
    core?: string;
    custom?: () => boolean;

    constructor(side: ProxySide, backing: (new () => any) | string, core?: string, custom?: () => boolean) {
        this.side = side;
        this.backing = backing;
        this.core = core;
        this.custom = custom;
        if (this.custom === undefined) {
            this.custom = custom_dummy;
        }
    }
}

export function SidedProxy(side: ProxySide, inst: (new () => any) | string, core?: string, custom?: () => boolean) {
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
        target.ModLoader.sidedproxies.set(new ProxySideContainer(side, inst, core, custom), propertyKey);
    };
}

export function setupSidedProxy(instance: any, isClient: boolean, isServer: boolean, core: string): Array<any> {
    let p = Object.getPrototypeOf(instance);
    let arr: Array<any> = [];
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return arr;
        }
        if (p.ModLoader.hasOwnProperty('sidedproxies')) {
            p.ModLoader.sidedproxies.forEach(function (value: string, key: ProxySideContainer) {
                if (key.core !== undefined) {
                    if (key.core !== '*') {
                        if (key.core !== core) return;
                    }
                }
                if (!key.custom!()) return;
                if ((isClient && key.side === ProxySide.CLIENT) || key.side === ProxySide.UNIVERSAL) {
                    if (typeof (key.backing) === 'string') {
                        let c: any;
                        try {
                            if (c === undefined) {
                                c = require(path.resolve(path.parse(key.backing).dir, path.parse(key.backing).name + ".js")).default;
                            }
                        } catch (err) {
                        }
                        try {
                            if (c === undefined) {
                                c = require(path.resolve(path.parse(key.backing).dir, path.parse(key.backing).name + ".mls")).default;
                            }
                        } catch (err) { }
                        try {
                            if (c === undefined) {
                                c = require(path.resolve(path.parse(key.backing).dir, path.parse(key.backing).name + ".mlz")).default;
                            }
                        } catch (err) { }
                        instance[value] = new c();
                    } else {
                        instance[value] = new key.backing();
                    }
                    arr.push(instance[value]);
                } else if (isServer && key.side === ProxySide.SERVER) {
                    if (typeof (key.backing) === 'string') {
                        let c: any;
                        try {
                            if (c === undefined) {
                                c = require(path.resolve(path.parse(key.backing).dir, path.parse(key.backing).name + ".js")).default;
                            }
                        } catch (err) {
                        }
                        try {
                            if (c === undefined) {
                                c = require(path.resolve(path.parse(key.backing).dir, path.parse(key.backing).name + ".mls")).default;
                            }
                        } catch (err) { }
                        try {
                            if (c === undefined) {
                                c = require(path.resolve(path.parse(key.backing).dir, path.parse(key.backing).name + ".mlz")).default;
                            }
                        } catch (err) { }
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