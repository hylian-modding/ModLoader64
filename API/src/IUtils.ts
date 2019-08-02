interface IUtils {
  utilBitCount8(value: number): number;

  utilBitCount16(value: number): number;

  utilBitCount32(value: number): number;

  utilBitCountBuffer(buf: Buffer): number;
}

export default IUtils;
