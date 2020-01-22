"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const zlib_1 = __importDefault(require("zlib"));
const path_1 = __importDefault(require("path"));
let fx = require('mkdir-recursive');
const crypto_1 = __importDefault(require("crypto"));
const os_1 = __importDefault(require("os"));
class PakFileEntry {
    constructor(filename, type, size, pstart, pend) {
        this.filename = filename;
        this.type = type;
        this.size = size;
        this.pstart = pstart;
        this.pend = pend;
    }
}
exports.PakFileEntry = PakFileEntry;
class PakHeader {
    constructor() {
        this.ml = 'ModLoader64';
        this.version = 0x3;
        this.files = [];
    }
}
exports.PakHeader = PakHeader;
class PakFooter {
    generateHash(buf) {
        this._hash = crypto_1.default
            .createHash('sha512')
            .update(buf)
            .digest('hex');
        let hash = Buffer.from(this._hash, 'hex');
        let tag = Buffer.from(os_1.default.userInfo().username +
            '@' +
            os_1.default.hostname() +
            ' ' +
            new Date().toISOString());
        let tag_size = tag.byteLength;
        while (tag_size % 0x10 !== 0) {
            tag_size++;
        }
        let foot1 = Buffer.alloc(0x10 + tag_size);
        foot1.write('MLPublish.......');
        tag.copy(foot1, 0x10);
        let f2_size = 0x10 + hash.byteLength;
        let foot2 = Buffer.alloc(f2_size);
        foot2.write('MLVerify........');
        hash.copy(foot2, 0x10);
        this.footer = Buffer.alloc(foot1.byteLength + foot2.byteLength);
        foot1.copy(this.footer);
        foot2.copy(this.footer, foot1.byteLength);
    }
}
exports.PakFooter = PakFooter;
class PakFile {
    constructor() {
        this.header = new PakHeader();
        this.footer = new PakFooter();
    }
    load(file) {
        this.header.files.length = 0;
        this.data = fs_1.default.readFileSync(file);
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
                current_byte = this.data.readUInt8(filename_offset + current_byte_index);
                let char_b = Buffer.alloc(0x1);
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
        let find_footer = this.data.indexOf(Buffer.from('MLPublish.......'));
        if (find_footer > -1) {
            this.footer.footer = Buffer.alloc(this.data.byteLength - find_footer);
            this.data.copy(this.footer.footer, 0, find_footer);
        }
        let find_hash = this.data.indexOf(Buffer.from('MLVerify........'));
        if (find_hash > -1) {
            let _temp = Buffer.alloc(this.data.byteLength - (find_hash + 0x10));
            this.data.copy(_temp, 0, find_hash + 0x10);
            this.footer._hash = _temp.toString('hex');
        }
    }
    update() {
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
            let fnb = Buffer.from(this.header.files[i].filename);
            fnb.copy(this.data, current, 0, fnb.byteLength);
            this.header.files[i].filename_offset = current;
            current += fnb.byteLength;
            this.data.writeUInt8(0xff, current);
            current += 0x1;
        }
        for (let i = 0; i < this.header.files.length; i++) {
            let size = this.header.files[i].size;
            this.data.write(this.header.files[i].type, 0x10 + i * 0x10 + 0x0);
            this.data.writeUInt32BE(this.header.files[i].filename_offset, 0x10 + i * 0x10 + 0x4);
            this.data.writeUInt32BE(current, 0x10 + i * 0x10 + 0x8);
            this.header.files[i].data.copy(this.data, current);
            current += size;
            this.data.writeUInt32BE(current, 0x10 + i * 0x10 + 0xc);
        }
        this.footer.generateHash(this.data);
        let nSize = this.data.byteLength + this.footer.footer.byteLength;
        let f = Buffer.alloc(nSize);
        this.data.copy(f);
        this.footer.footer.copy(f, this.data.byteLength);
        this.data = f;
    }
    overwrite(index, obj, compressed = true, filename = 'obj.json') {
        let type = 'UNCO';
        let data;
        if (Buffer.isBuffer(obj)) {
            data = obj;
        }
        else {
            let json = JSON.stringify(obj);
            data = Buffer.from(json);
        }
        if (compressed) {
            data = zlib_1.default.deflateSync(data);
            type = 'DEFL';
        }
        let entry = new PakFileEntry(filename, type, data.byteLength, 0xffffffff, 0xffffffff);
        entry.data = data;
        this.header.files[index] = entry;
        return this.header.files.indexOf(entry);
    }
    insert(obj, compressed = true, filename = 'obj.json') {
        let type = 'UNCO';
        let data;
        if (Buffer.isBuffer(obj)) {
            data = obj;
        }
        else {
            let json = JSON.stringify(obj);
            data = Buffer.from(json);
        }
        if (compressed) {
            data = zlib_1.default.deflateSync(data);
            type = 'DEFL';
        }
        let entry = new PakFileEntry(filename, type, data.byteLength, 0xffffffff, 0xffffffff);
        entry.data = data;
        this.header.files.push(entry);
        return this.header.files.indexOf(entry);
    }
    insertFile(file, compressed = true) {
        return this.insert(fs_1.default.readFileSync(file), compressed, file);
    }
    retrieve(index) {
        let d = this.header.files[index].data;
        if (this.header.files[index].type === 'DEFL') {
            d = zlib_1.default.inflateSync(this.header.files[index].data);
        }
        try {
            JSON.parse(d.toString('ascii'));
        }
        catch (err) {
            if (err) {
                return d;
            }
        }
        if (path_1.default.parse(this.header.files[index].filename).ext === '.json') {
            return d.toString('ascii');
        }
        return JSON.parse(d.toString('ascii'));
    }
}
exports.PakFile = PakFile;
class Pak {
    constructor(filename) {
        this.pak = new PakFile();
        this.fileName = filename;
        if (fs_1.default.existsSync(this.fileName)) {
            this.pak.load(this.fileName);
        }
    }
    overwriteFileAtIndex(index, obj, compressed = true) {
        let i = this.pak.overwrite(index, obj, compressed);
        return i;
    }
    save(obj, compressed = true) {
        let index = this.pak.insert(obj, compressed);
        return index;
    }
    save_file(file, compressed = true) {
        let index = this.pak.insertFile(file, compressed);
        return index;
    }
    update() {
        this.pak.update();
        fs_1.default.writeFileSync(this.fileName, this.pak.data);
    }
    load(index = 0) {
        return this.pak.retrieve(index);
    }
    extractAll(target) {
        for (let i = 0; i < this.pak.header.files.length; i++) {
            let data = this.load(i);
            let filename = this.pak.header.files[i].filename;
            let dir = path_1.default.parse(path_1.default.resolve(path_1.default.join(target, filename))).dir;
            fx.mkdirSync(dir);
            fs_1.default.writeFileSync(path_1.default.resolve(path_1.default.join(target, filename)), data);
        }
    }
}
exports.Pak = Pak;
//# sourceMappingURL=PakFormat.js.map