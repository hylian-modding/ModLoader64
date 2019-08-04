interface IUtils {
  utilBitCount8(value: number): number;

  utilBitCount16(value: number): number;

  utilBitCount32(value: number): number;

  utilBitCountBuffer(buf: Buffer): number;

  memoryCacheRefresh(): void;
}

export default IUtils;
