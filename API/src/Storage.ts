import path from 'path';
import fs from 'fs';
import { IPak, Pak } from './PakFormat';

export class StorageContainer {
  private pak: IPak;

  constructor(key: string) {
    let file = path.resolve(path.join(process.cwd(), 'storage', key + '.pak'));
    this.pak = new Pak(file);
  }

  storeObject(obj: any) {
    if (!fs.existsSync(path.parse(this.pak.fileName).dir)) {
      fs.mkdirSync(path.parse(this.pak.fileName).dir);
    }
    this.pak.save(obj);
  }

  loadObject(): any {
    return this.pak.load(0);
  }
}

class StorageKeyManager {
  private readonly MAX: number = 0xffffffff;

  getStorageKey(): string {
    let b = true;
    let v = '';
    while (b) {
      let possible = Math.floor(
        Math.random() * (this.MAX - 0 + 1) + 0
      ).toString(16);
      let file = path.resolve(
        path.join(process.cwd(), 'storage', possible + '.pak')
      );
      if (!fs.existsSync(file)) {
        v = possible;
        b = false;
      }
    }
    return v;
  }
}

export const KeyManager: StorageKeyManager = new StorageKeyManager();
