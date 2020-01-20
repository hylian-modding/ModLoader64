/// <reference types="node" />
declare const zeldaStringEncodingMap: Map<number, string>;
export default zeldaStringEncodingMap;
declare class ZeldaString {
    private reverse;
    constructor();
    encode(str: string): Buffer;
    decode(buf: Buffer): string;
}
export declare const zeldaString: ZeldaString;
