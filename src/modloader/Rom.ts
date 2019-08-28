const fs = require('fs');
const path = require('path');

function byteswap(bs: Buffer) {
  bs.swap32();
  return bs;
}

export class Rom {
  file: string;
  bytes: Buffer;

  constructor(file: string) {
    this.file = file;
    this.bytes = fs.readFileSync(file);
    if (path.extname(file).indexOf('n64') > -1) {
      this.bytes = byteswap(this.bytes);
    }
  }
}
