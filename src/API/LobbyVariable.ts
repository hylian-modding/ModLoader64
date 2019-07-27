import { IPlugin } from "./IModLoaderAPI";
import { bus } from "./EventHandler";

export function LobbyVariable(objectKey: string){
    return function(target: any, key: string) {
        if (target.ModLoader === undefined){
            target["ModLoader"] = {}
        }
        if (target.ModLoader.LobbyVariable === undefined){
            target.ModLoader["LobbyVariable"] = new Map<string, Function>()
        }
        target.ModLoader.LobbyVariable.set(key, () => {return [objectKey, key]})
    }
}

export class PluginMeta{
    instance: IPlugin
    prototype: any
    fieldName: string
    template: string
    objectKey: string

    constructor(instance: IPlugin, prototype: any, objectKey: string, fieldName: string, field: any){
        this.instance = instance;
        this.prototype = prototype;
        this.fieldName = fieldName;
        this.objectKey = objectKey;
        this.template = JSON.stringify(field);
    }

    setField(data: any){
        // @ts-ignore
        this.instance[this.fieldName] = data;
    }

    cloneTemplate(): any{
        return JSON.parse(this.template);
    }
}

export function setupLobbyVariable(plugin: IPlugin, prototype: any){
    if (prototype.hasOwnProperty("ModLoader")){
        if (prototype.ModLoader.hasOwnProperty("LobbyVariable")){
            prototype.ModLoader.LobbyVariable.forEach(function (value: Function, key: string) {
                var keys = value();
                // @ts-ignore
                var baseValue = plugin[keys[1]];
                var meta = new PluginMeta(plugin, prototype, keys[0], keys[1], baseValue);
                bus.emit("setupLobbyVariable", meta)
            });
        }
    }
}