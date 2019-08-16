import fs from 'fs';
import zlib from 'zlib';

export interface IPak {
  fileName: string;
  save(obj: any, size?: number): void;
  load(): any;
}

export class Pak implements IPak {
  fileName: string;

  constructor(filename: string) {
    this.fileName = filename;
  }

  save(obj: any, size?: number): void {
    let data: any;
    if (Buffer.isBuffer(obj)) {
      data = obj;
    } else {
      data = JSON.stringify(obj);
    }
    let comp: Buffer = zlib.deflateSync(data);
    if (size === undefined) {
      size = comp.byteLength + 0x4;
    } else {
      if (comp.byteLength + 0x4 > size) {
        size = comp.byteLength + 0x4;
      }
    }
    let buf: Buffer = Buffer.alloc(size);
    buf.writeUInt32BE(comp.byteLength, 0x0);
    comp.copy(buf, 0x4);
    fs.writeFileSync(this.fileName, buf);
  }

  load(): any {
    let buf: Buffer = fs.readFileSync(this.fileName);
    let size: number = buf.readUInt32BE(0x0);
    let comp: Buffer = buf.slice(0x4, size + 0x4);
    let decomp: Buffer = zlib.inflateSync(comp);
    let str: string = decomp.toString();
    // Is this JSON?
    try {
      return JSON.parse(str);
    } catch (e) {
      // Not JSON. Must be a raw Buffer.
      return decomp;
    }
  }
}
