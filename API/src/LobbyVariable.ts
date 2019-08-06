import { bus } from './EventHandler';

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
  instance: any;
  prototype: any;
  fieldName: string;
  template: string;
  objectKey: string;

  constructor(
    instance: any,
    prototype: any,
    objectKey: string,
    fieldName: string,
    field: any
  ) {
    this.instance = instance;
    this.prototype = prototype;
    this.fieldName = fieldName;
    this.objectKey = objectKey;
    this.template = JSON.stringify(field);
  }

  setField(data: any) {
    // @ts-ignore
    this.instance[this.fieldName] = data;
  }

  cloneTemplate(): any {
    return JSON.parse(this.template);
  }
}

export function setupLobbyVariable(plugin: any) {
  let prototype = Object.getPrototypeOf(plugin);
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
