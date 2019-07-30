import path from 'path';
import fs from 'fs';
const BJSON = require('buffer-json');
import uuid from 'uuid';

export class StorageContainer {
  private file: string;

  constructor(file: string) {
    this.file = path.resolve(path.join(process.cwd(), 'Storage', file));
  }

  storeObject(obj: any) {
    if (!fs.existsSync(path.parse(this.file).dir)) {
      fs.mkdirSync(path.parse(this.file).dir);
    }
    fs.writeFileSync(this.file, BJSON.stringify(obj, null, 2));
  }

  loadObject(): any {
    return BJSON.parse(fs.readFileSync(this.file));
  }
}

class StorageKeyManager {
  getStorageKey(): string {
    return uuid.v4();
  }
}

export const KeyManager: StorageKeyManager = new StorageKeyManager();
