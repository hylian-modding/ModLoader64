export interface IRomMemory {
  romRead8(addr: number): number;

  romWrite8(addr: number, value: number): void;

  romRead16(addr: number): number;

  romWrite16(addr: number, value: number): void;

  romRead32(addr: number): number;

  romWrite32(addr: number, value: number): void;

  romReadBuffer(addr: number, size: number): Buffer;

  romWriteBuffer(addr: number, buf: Buffer): void;

  getRomBuffer(): ArrayBuffer;
}

export interface IRomMemory {
  u8: number[];
  u16: number[];
  u32: number[];
}