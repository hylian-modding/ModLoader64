import { IPlugin } from './IModLoaderAPI';
import { bus } from './EventHandler';

const BJSON = require('buffer-json');

export function LobbyVariable(objectKey: string) {
  return function(target: any, key: string) {
    if (target.ModLoader === undefined) {
      target['ModLoader'] = {};
    }
    if (target.ModLoader.LobbyVariable === undefined) {
      target.ModLoader['LobbyVariable'] = new Map<string, Function>();
    }
    target.ModLoader.LobbyVariable.set(key, () => [objectKey, key]);
  };
}

export class PluginMeta {
  instance: IPlugin;
  prototype: any;
  fieldName: string;
  template: string;
  objectKey: string;

  constructor(
    instance: IPlugin,
    prototype: any,
    objectKey: string,
    fieldName: string,
    field: any
  ) {
    this.instance = instance;
    this.prototype = prototype;
    this.fieldName = fieldName;
    this.objectKey = objectKey;
    this.template = BJSON.stringify(field);
  }

  setField(data: any) {
    // @ts-ignore
    this.instance[this.fieldName] = data;
  }

  cloneTemplate(): any {
    return BJSON.parse(this.template);
  }
}

export function setupLobbyVariable(plugin: IPlugin, prototype: any) {
  if (prototype.hasOwnProperty('ModLoader')) {
    if (prototype.ModLoader.hasOwnProperty('LobbyVariable')) {
      prototype.ModLoader.LobbyVariable.forEach(function(
        value: Function,
        key: string
      ) {
        let keys = value();
        // @ts-ignore
        let baseValue = plugin[keys[1]];
        let meta = new PluginMeta(
          plugin,
          prototype,
          keys[0],
          keys[1],
          baseValue
        );
        bus.emit('setupLobbyVariable', meta);
      });
    }
  }
}
