// So, JSON.stringify and JSON.parse completely fail at Buffers.
// Lets fix that in the most brute force way possible.
// MONKEY PATCH

const BJSON = require('buffer-json');

export interface IMonkeyPatch {
  patch(): void;
  unpatch(): void;
}

export class MonkeyPatch {
  original!: Function;
  replacement!: Function;
}

export class MonkeyPatch_Stringify extends MonkeyPatch implements IMonkeyPatch {
  patch() {
    this.original = JSON.stringify;
    this.replacement = (
      value: any,
      replacer?: (this: any, key: string, value: any) => any,
      space?: string | number
    ) => {
      if (replacer === undefined) {
        return this.original(value, BJSON.replacer, space);
      } else {
        return this.original(value, replacer, space);
      }
    };
    (JSON as any)['stringify'] = this.replacement as Function;
  }

  unpatch() {
    (JSON as any)['stringify'] = this.original as Function;
  }
}

export class MonkeyPatch_Parse extends MonkeyPatch implements IMonkeyPatch {
  patch(): void {
    this.original = JSON.parse;
    this.replacement = (
      text: string,
      reviver?: (this: any, key: string, value: any) => any
    ) => {
      if (reviver === undefined) {
        return this.original(text, BJSON.reviver);
      } else {
        return this.original(text, reviver);
      }
    };
    (JSON as any)['parse'] = this.replacement as Function;
  }

  unpatch(): void {
    (JSON as any)['parse'] = this.original as Function;
  }
}
