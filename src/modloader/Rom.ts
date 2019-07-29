const fs = require('fs');
const path = require('path');

function byteswap(bs: Buffer) {
  let length = bs.byteLength / 4;
  for (let i = 0; i < length; i++) {
    let word_start = i * 4;
    let temp = Buffer.alloc(4);
    let temp2 = Buffer.alloc(4);
    bs.copy(temp, 0, word_start, word_start + 4);
    let backwards = 3;
    for (let k = 0; k < temp.byteLength; k++) {
      temp2.writeUInt8(temp.readUInt8(backwards), k);
      backwards--;
    }
    temp2.copy(bs, word_start, 0, temp2.byteLength);
  }
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
