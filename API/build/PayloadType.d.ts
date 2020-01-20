/// <reference types="node" />
export declare abstract class PayloadType {
    ext: string;
    constructor(ext: string);
    abstract parse(file: string, buf: Buffer, dest: Buffer): any;
}
export interface IPayloadManager {
    parseFile(file: string): any;
    registerPayloadType(type: PayloadType): void;
}
