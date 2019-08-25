import fs from 'fs';
import zlib from 'zlib';

export interface IPakFileEntry {
  type: string;
  size: number;
  pstart: number;
  pend: number;
}

export class PakFileEntry implements IPakFileEntry {
  type: string;
  size: number;
  pstart: number;
  pend: number;
  data!: Buffer;

  constructor(type: string, size: number, pstart: number, pend: number) {
    this.type = type;
    this.size = size;
    this.pstart = pstart;
    this.pend = pend;
  }
}

export interface IPakHeader {
  ml: string;
  version: number;
  files: PakFileEntry[];
}

export class PakHeader implements IPakHeader {
  ml = 'ModLoader64';
  version = 0x1;
  files: PakFileEntry[] = [];
}

export interface IPakFile {
  header: PakHeader;
  data: Buffer;
  load(file: string): void;
  insert(obj: any, compressed?: boolean): number;
  retrieve(index: number): any;
}

export class PakFile implements IPakFile {
  header: PakHeader = new PakHeader();
  data!: Buffer;

  load(file: string): void {
    this.header.files.length = 0;
    this.data = fs.readFileSync(file);
    let hlength = this.data.readUInt32BE(0x0b);
    let table = this.data.slice(0x10, 0x10 + hlength * 0x10 + 0x1);
    for (let i = 0; i < hlength; i++) {
      let type = table.slice(i * 0x10 + 0x0, i * 0x10 + 0x5).toString();
      let vend = table.readUInt32BE(i * 0x10 + 0x4);
      let pstart = table.readUInt32BE(i * 0x10 + 0x8);
      let pend = table.readUInt32BE(i * 0x10 + 0xc);
      let head = new PakFileEntry(type, vend, pstart, pend);
      head.data = this.data.slice(pstart, pend);
      this.header.files.push(head);
    }
  }

  update(): void {
    let totalSize = 0;
    let headerSize = 0;
    totalSize += 0x10;
    headerSize += 0x10;
    for (let i = 0; i < this.header.files.length; i++) {
      totalSize += 0x10;
      headerSize += 0x10;
      totalSize += this.header.files[i].size;
    }
    this.data = Buffer.alloc(totalSize);
    this.data.write(this.header.ml);
    this.data.writeUInt8(0x1, 0x0f);
    this.data.writeUInt32BE(this.header.files.length, 0x0b);
    let current = headerSize;
    for (let i = 0; i < this.header.files.length; i++) {
      let size = this.header.files[i].size;
      this.data.write(this.header.files[i].type, 0x10 + i * 0x10 + 0x0);
      this.data.writeUInt32BE(this.header.files[i].size, 0x10 + i * 0x10 + 0x4);
      this.data.writeUInt32BE(current, 0x10 + i * 0x10 + 0x8);
      this.header.files[i].data.copy(this.data, current);
      current += size;
      this.data.writeUInt32BE(current, 0x10 + i * 0x10 + 0xc);
    }
  }

  insert(obj: any, compressed = true): number {
    let data: Buffer;
    if (Buffer.isBuffer(obj)) {
      data = obj;
    } else {
      data = Buffer.from(JSON.stringify(obj));
    }
    let type = 'UNCO';
    if (compressed) {
      data = zlib.deflateSync(data);
      type = 'DEFL';
    }
    let entry = new PakFileEntry(type, data.byteLength, 0xffffffff, 0xffffffff);
    entry.data = data;
    this.header.files.push(entry);
    this.update();
    return this.header.files.indexOf(entry);
  }

  retrieve(index: number): any {
    let d = this.header.files[index].data;
    if (this.header.files[index].type === 'DEFL') {
      d = zlib.inflateSync(this.header.files[index].data);
    }
    try {
      JSON.parse(d.toString());
    } catch (err) {
      if (err) {
        return d;
      } else {
        return JSON.parse(d.toString());
      }
    }
  }
}

export interface IPak {
  fileName: string;
  save(obj: any, compressed?: boolean): number;
  load(index: number): any;
}

export class Pak implements IPak {
  fileName: string;
  pak: PakFile = new PakFile();

  constructor(filename: string) {
    this.fileName = filename;
    if (fs.existsSync(this.fileName)) {
      this.pak.load(this.fileName);
    }
  }

  save(obj: any, compressed = true): number {
    let index = this.pak.insert(obj);
    fs.writeFileSync(this.fileName, this.pak.data);
    return index;
  }

  load(index = 0): any {
    return this.pak.retrieve(index);
  }
}
