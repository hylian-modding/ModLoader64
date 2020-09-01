interface IUtils {
  
  hashBuffer(buf: Buffer): string;

  yaz0Encode(buf: Buffer): Buffer;

  yaz0Decode(buf: Buffer): Buffer;

  clearBuffer(buf: Buffer): Buffer;

  setTimeoutFrames(fn: Function, frames: number): void;

  getUUID(): string;

  cloneBuffer(buf: Buffer): Buffer;
  
}

export default IUtils;
