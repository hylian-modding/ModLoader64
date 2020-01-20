/// <reference types="node" />
export interface IPakFileEntry {
    type: string;
    size: number;
    pstart: number;
    pend: number;
}
export declare class PakFileEntry implements IPakFileEntry {
    filename: string;
    type: string;
    size: number;
    filename_offset: number;
    pstart: number;
    pend: number;
    data: Buffer;
    constructor(filename: string, type: string, size: number, pstart: number, pend: number);
}
export interface IPakHeader {
    ml: string;
    version: number;
    files: PakFileEntry[];
}
export interface IPakFooter {
    footer: Buffer;
}
export declare class PakHeader implements IPakHeader {
    ml: string;
    version: number;
    files: PakFileEntry[];
}
export declare class PakFooter implements IPakFooter {
    footer: Buffer;
    _hash: string;
    generateHash(buf: Buffer): void;
}
export interface IPakFile {
    header: PakHeader;
    data: Buffer;
    load(file: string): void;
    insert(obj: any, compressed?: boolean): number;
    insertFile(file: string, compressed?: boolean): number;
    retrieve(index: number): any;
    footer: PakFooter;
}
export declare class PakFile implements IPakFile {
    header: PakHeader;
    data: Buffer;
    footer: PakFooter;
    load(file: string): void;
    update(): void;
    overwrite(index: number, obj: any, compressed?: boolean, filename?: string): number;
    insert(obj: any, compressed?: boolean, filename?: string): number;
    insertFile(file: string, compressed?: boolean): number;
    retrieve(index: number): any;
}
export interface IPak {
    fileName: string;
    save(obj: any, compressed?: boolean): number;
    save_file(file: string, compressed?: boolean): number;
    load(index: number): any;
    extractAll(target: string): void;
    update(): void;
    overwriteFileAtIndex(index: number, obj: any, compressed?: boolean): number;
}
export declare class Pak implements IPak {
    fileName: string;
    pak: PakFile;
    constructor(filename: string);
    overwriteFileAtIndex(index: number, obj: any, compressed?: boolean): number;
    save(obj: any, compressed?: boolean): number;
    save_file(file: string, compressed?: boolean): number;
    update(): void;
    load(index?: number): any;
    extractAll(target: string): void;
}
