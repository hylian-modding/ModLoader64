import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
let fx = require('mkdir-recursive');

export interface IPakFileEntry {
  type: string;
  size: number;
  pstart: number;
  pend: number;
}

export class PakFileEntry implements IPakFileEntry {
  filename: string;
  type: string;
  size: number;
  filename_offset!: number;
  pstart: number;
  pend: number;
  data!: Buffer;

  constructor(
    filename: string,
    type: string,
    size: number,
    pstart: number,
    pend: number
  ) {
    this.filename = filename;
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
  version = 0x2;
  files: PakFileEntry[] = [];
}

export interface IPakFile {
  header: PakHeader;
  data: Buffer;
  load(file: string): void;
  insert(obj: any, compressed?: boolean): number;
  insertFile(file: string, compressed?: boolean): number;
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
      let type = table.slice(i * 0x10 + 0x0, i * 0x10 + 0x4).toString();
      let filename_offset = table.readUInt32BE(i * 0x10 + 0x4);
      let pstart = table.readUInt32BE(i * 0x10 + 0x8);
      let pend = table.readUInt32BE(i * 0x10 + 0xc);
      let filename_b = '';
      let current_byte = 0;
      let current_byte_index = 0;
      while (current_byte !== 0xff) {
        current_byte = this.data.readUInt8(
          filename_offset + current_byte_index
        );
        let char_b: Buffer = Buffer.alloc(0x1);
        char_b.writeUInt8(current_byte, 0x0);
        filename_b += char_b.toString();
        current_byte_index++;
      }
      filename_b = filename_b.slice(0, -1);
      let head = new PakFileEntry(filename_b, type, 0, pstart, pend);
      head.data = this.data.slice(pstart, pend);
      head.size = head.data.byteLength;
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
      totalSize += Buffer.from(this.header.files[i].filename).byteLength;
      totalSize += 0x1;
    }
    this.data = Buffer.alloc(totalSize);
    this.data.write(this.header.ml);
    this.data.writeUInt32BE(this.header.files.length, 0x0b);
    this.data.writeUInt8(this.header.version, 0x0f);
    let current = headerSize;
    for (let i = 0; i < this.header.files.length; i++) {
      let fnb: Buffer = Buffer.from(this.header.files[i].filename);
      fnb.copy(this.data, current, 0, fnb.byteLength);
      this.header.files[i].filename_offset = current;
      current += fnb.byteLength;
      this.data.writeUInt8(0xff, current);
      current += 0x1;
    }
    for (let i = 0; i < this.header.files.length; i++) {
      let size = this.header.files[i].size;
      this.data.write(this.header.files[i].type, 0x10 + i * 0x10 + 0x0);
      this.data.writeUInt32BE(
        this.header.files[i].filename_offset,
        0x10 + i * 0x10 + 0x4
      );
      this.data.writeUInt32BE(current, 0x10 + i * 0x10 + 0x8);
      this.header.files[i].data.copy(this.data, current);
      current += size;
      this.data.writeUInt32BE(current, 0x10 + i * 0x10 + 0xc);
    }
  }

  insert(obj: any, compressed = true, filename = 'obj.json'): number {
    let type = 'UNCO';
    let data: Buffer;
    if (Buffer.isBuffer(obj)) {
      data = obj;
    } else {
      let json = JSON.stringify(obj);
      data = Buffer.from(json);
    }
    if (compressed) {
      data = zlib.deflateSync(data);
      type = 'DEFL';
    }
    let entry = new PakFileEntry(
      filename,
      type,
      data.byteLength,
      0xffffffff,
      0xffffffff
    );
    entry.data = data;
    this.header.files.push(entry);
    return this.header.files.indexOf(entry);
  }

  insertFile(file: string, compressed = true): number {
    return this.insert(fs.readFileSync(file), compressed, file);
  }

  retrieve(index: number): any {
    let d = this.header.files[index].data;
    if (this.header.files[index].type === 'DEFL') {
      d = zlib.inflateSync(this.header.files[index].data);
    }
    try {
      JSON.parse(d.toString('ascii'));
    } catch (err) {
      if (err) {
        return d;
      }
    }
    if (path.parse(this.header.files[index].filename).ext === '.json') {
      return d.toString('ascii');
    } else {
      return JSON.parse(d.toString('ascii'));
    }
  }
}

export interface IPak {
  fileName: string;
  save(obj: any, compressed?: boolean): number;
  save_file(file: string, compressed?: boolean): number;
  load(index: number): any;
  extractAll(target: string): void;
  update(): void;
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
    let index = this.pak.insert(obj, compressed);
    return index;
  }

  save_file(file: string, compressed = true) {
    let index = this.pak.insertFile(file, compressed);
    return index;
  }

  update() {
    this.pak.update();
    fs.writeFileSync(this.fileName, this.pak.data);
  }

  load(index = 0): any {
    return this.pak.retrieve(index);
  }

  extractAll(target: string): void {
    for (let i = 0; i < this.pak.header.files.length; i++) {
      let data: Buffer = this.load(i);
      let filename: string = this.pak.header.files[i].filename;
      let dir = path.parse(path.resolve(path.join(target, filename))).dir;
      fx.mkdirSync(dir);
      fs.writeFileSync(path.resolve(path.join(target, filename)), data);
    }
  }
}
