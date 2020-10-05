import { ProxySide } from "./SidedProxy";

export class ProxyDateContainer {
    side: ProxySide;
    start: Date;
    end: Date;
    backing: new () => any;

    constructor(side: ProxySide, start: Date, end: Date, backing: new () => any) {
        this.side = side;
        this.backing = backing;
        this.start = start;
        this.end = end;
    }
}

export function DateProxy(side: ProxySide, start: Date, end: Date, inst: new () => any) {
    return function (
        target: any,
        propertyKey: string
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.dateproxies === undefined) {
            target.ModLoader['dateproxies'] = new Map<string, string>();
        }
        target.ModLoader.dateproxies.set(new ProxyDateContainer(side, start, end, inst), propertyKey);
    };
}

export function setupDateProxy(instance: any, isClient: boolean, isServer: boolean): Array<any> {
    let p = Object.getPrototypeOf(instance);
    let arr: Array<any> = [];
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return arr;
        }
        if (p.ModLoader.hasOwnProperty('dateproxies')) {
            p.ModLoader.dateproxies.forEach(function (value: string, key: ProxyDateContainer) {
                let date = new Date();
                console.log((date >= key.start) + " | " + key.start);
                console.log((date <= key.end) + " | " + key.end);
                if (isClient && key.side === ProxySide.CLIENT && (date >= key.start && date <= key.end)) {
                    instance[value] = new key.backing();
                    arr.push(instance[value]);
                } else if (isServer && key.side === ProxySide.SERVER && (date >= key.start && date <= key.end)) {
                    instance[value] = new key.backing();
                    arr.push(instance[value]);
                }
            });
        }
    }
    return arr;
}