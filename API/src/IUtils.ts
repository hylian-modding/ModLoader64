interface IUtils {
  utilBitCount8(value: number): number;

  utilBitCount16(value: number): number;

  utilBitCount32(value: number): number;

  utilBitCountBuffer(buf: Buffer, offset: number, length: number): number;

  memoryCacheRefresh(): void;

  hashBuffer(buf: Buffer): string;

  yaz0Encode(buf: Buffer): Buffer;

  yaz0Decode(buf: Buffer): Buffer;
}

export default IUtils;
