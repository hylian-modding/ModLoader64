import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
let fx = require('mkdir-recursive');
import crypto from 'crypto';
import os from 'os';
import slash from 'slash';

class lzmaWrapper {
    private lzma: any = require("lzma");

    compress(buf: Buffer) {
        return Buffer.from(this.lzma.compress(buf));
    }

    decompress(buf: Buffer) {
        return Buffer.from(this.lzma.decompress(buf));
    }
}

const lzmaInstance: lzmaWrapper = new lzmaWrapper();

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

export interface IPakFooter {
    footer: Buffer;
}

export class PakHeader implements IPakHeader {
    ml = 'ModLoader64';
    version = 0x3;
    files: PakFileEntry[] = [];
}

export class PakFooter implements IPakFooter {
    footer!: Buffer;
    _hash!: string;

    generateHash(buf: Buffer) {
        this._hash = crypto
            .createHash('sha512')
            .update(buf)
            .digest('hex');
        let hash = Buffer.from(this._hash, 'hex');
        let tag: Buffer = Buffer.from(
            os.userInfo().username +
            '@' +
            os.hostname() +
            ' ' +
            new Date().toISOString()
        );
        let tag_size: number = tag.byteLength;
        while (tag_size % 0x10 !== 0) {
            tag_size++;
        }
        let foot1: Buffer = Buffer.alloc(0x10 + tag_size);
        foot1.write('MLPublish.......');
        tag.copy(foot1, 0x10);
        let f2_size: number = 0x10 + hash.byteLength;
        let foot2: Buffer = Buffer.alloc(f2_size);
        foot2.write('MLVerify........');
        hash.copy(foot2, 0x10);
        this.footer = Buffer.alloc(foot1.byteLength + foot2.byteLength);
        foot1.copy(this.footer);
        foot2.copy(this.footer, foot1.byteLength);
    }
}

export interface IPakFile {
    header: PakHeader;
    data: Buffer;
    load(file: string): void;
    insert(obj: any, compressed?: IPakFileCompressionOptions): number;
    insertFile(file: string, compressed?: IPakFileCompressionOptions): number;
    retrieve(index: number): Buffer;
    footer: PakFooter;
    verify(): boolean;
}

export interface IPakFileCompressionOptions {
    enabled: true;
    algo: string;
}

export class PakFile implements IPakFile {
    header: PakHeader = new PakHeader();
    data!: Buffer;
    footer: PakFooter = new PakFooter();

    load(file: string): void {
        this.header.files.length = 0;
        this.data = fs.readFileSync(file);
        this._load();
    }

    _load() {
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
        let find_footer: number = this.data.indexOf(
            Buffer.from('MLPublish.......')
        );
        if (find_footer > -1) {
            this.footer.footer = Buffer.alloc(this.data.byteLength - find_footer);
            this.data.copy(this.footer.footer, 0, find_footer);
        }
        let find_hash: number = this.data.indexOf(Buffer.from('MLVerify........'));
        if (find_hash > -1) {
            let _temp: Buffer = Buffer.alloc(
                this.data.byteLength - (find_hash + 0x10)
            );
            this.data.copy(_temp, 0, find_hash + 0x10);
            this.footer._hash = _temp.toString('hex');
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
        // Padding so the footer is byte alligned.
        while (totalSize % 0x10 !== 0) {
            totalSize++;
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
        this.footer.generateHash(this.data);
        let nSize: number = this.data.byteLength + this.footer.footer.byteLength;
        let f: Buffer = Buffer.alloc(nSize);
        this.data.copy(f);
        this.footer.footer.copy(f, this.data.byteLength);
        this.data = f;
    }

    overwrite(
        index: number,
        obj: any,
        compressed = { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions,
        filename = 'obj.json'
    ): number {
        let type = 'UNCO';
        let data: Buffer;
        if (Buffer.isBuffer(obj)) {
            data = obj;
        } else {
            let json = JSON.stringify(obj);
            data = Buffer.from(json);
        }
        if (compressed.enabled) {
            switch (compressed.algo) {
                case "DEFL":
                    data = zlib.deflateSync(data);
                    type = 'DEFL';
                    break;
                case "LZMA":
                    data = lzmaInstance.compress(data);
                    type = "LZMA";
                    break;
            }
        }
        let entry = new PakFileEntry(
            slash(filename),
            type,
            data.byteLength,
            0xffffffff,
            0xffffffff
        );
        entry.data = data;
        this.header.files[index] = entry;
        return this.header.files.indexOf(entry);
    }

    insert(obj: any, compressed = { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions, filename = 'obj.json'): number {
        let type = 'UNCO';
        let data: Buffer;
        if (Buffer.isBuffer(obj)) {
            data = obj;
        } else {
            let json = JSON.stringify(obj);
            data = Buffer.from(json);
        }
        if (compressed.enabled) {
            switch (compressed.algo) {
                case "DEFL":
                    data = zlib.deflateSync(data);
                    type = 'DEFL';
                    break;
                case "LZMA":
                    data = lzmaInstance.compress(data);
                    type = "LZMA";
                    break;
            }
        }
        let entry = new PakFileEntry(
            slash(filename),
            type,
            data.byteLength,
            0xffffffff,
            0xffffffff
        );
        entry.data = data;
        this.header.files.push(entry);
        return this.header.files.indexOf(entry);
    }

    insertFile(file: string, compressed = { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions): number {
        return this.insert(fs.readFileSync(file), compressed, file);
    }

    retrieve(index: number): Buffer {
        let d = this.header.files[index].data;
        if (this.header.files[index].type === 'DEFL') {
            d = zlib.inflateSync(this.header.files[index].data);
        } else if (this.header.files[index].type === 'LZMA') {
            d = lzmaInstance.decompress(this.header.files[index].data);
        }
        return d;
    }

    verify(): boolean {
        try {
            let find_footer: number = this.data.indexOf(
                Buffer.from('MLPublish.......')
            );
            let _hash = crypto
                .createHash('sha512')
                .update(this.data.slice(0, find_footer))
                .digest('hex');
            return this.footer._hash === _hash;
        } catch (err) {
        }
        return false;
    }
}

export interface IPak {
    fileName: string;
    save(obj: any, compressed?: IPakFileCompressionOptions): number;
    save_file(file: string, compressed?: IPakFileCompressionOptions): number;
    load(index: number): Buffer;
    extractAll(target: string): void;
    update(): void;
    overwriteFileAtIndex(index: number, obj: any, compressed?: IPakFileCompressionOptions): number;
    verify(): boolean;
}

export class Pak implements IPak {
    fileName: string;
    pak: PakFile = new PakFile();

    constructor(filename: string, buf?: Buffer) {
        this.fileName = filename;
        if (buf !== undefined) {
            this.pak.data = buf;
            this.pak._load();
        } else {
            if (fs.existsSync(this.fileName)) {
                this.pak.load(this.fileName);
            }
        }
    }

    overwriteFileAtIndex(index: number, obj: any, compressed = { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions): number {
        let i = this.pak.overwrite(index, obj, compressed);
        return i;
    }

    save(obj: any, compressed = { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions): number {
        let index = this.pak.insert(obj, compressed);
        return index;
    }

    save_file(file: string, compressed = { enabled: true, algo: "DEFL" } as IPakFileCompressionOptions) {
        let index = this.pak.insertFile(file, compressed);
        return index;
    }

    update() {
        this.pak.update();
        fs.writeFileSync(this.fileName, this.pak.data);
    }

    load(index = 0): Buffer {
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

    verify(): boolean {
        return this.pak.verify();
    }
}
