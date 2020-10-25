interface IUtils {
  
  hashBuffer(buf: Buffer): string;

  yaz0Encode(buf: Buffer): Buffer;

  yaz0Decode(buf: Buffer): Buffer;

  clearBuffer(buf: Buffer): Buffer;

  setTimeoutFrames(fn: Function, frames: number): string;

  setIntervalFrames(fn: Function, frames: number): string;

  clearIntervalFrames(id: string): boolean;

  getUUID(): string;

  cloneBuffer(buf: Buffer): Buffer;

  //Deprecated
  utilBitCount8(value: number): number;

  //Deprecated
  utilBitCount16(value: number): number;

  //Deprecated
  utilBitCount32(value: number): number;

  //Deprecated
  utilBitCountBuffer(buf: Buffer, offset: number, length: number): number;
  
}

export default IUtils;
