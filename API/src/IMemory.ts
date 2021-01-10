import IDynarecCache from "./IDynarecCache";

interface IMemory extends IDynarecCache {
  //--------------------
  // Normal ram functions
  //--------------------

  rdramRead8(addr: number): number;

  rdramWrite8(addr: number, value: number): void;

  rdramRead16(addr: number): number;

  rdramWrite16(addr: number, value: number): void;

  rdramWrite32(addr: number, value: number): void;

  rdramRead32(addr: number): number;

  rdramReadBuffer(addr: number, size: number): Buffer;

  rdramWriteBuffer(addr: number, buf: Buffer): void;

  dereferencePointer(addr: number): number;

  rdramReadS8(addr: number): number;

  rdramReadS16(addr: number): number;

  rdramReadS32(addr: number): number;

  //--------------------
  // Bit level functions
  //--------------------

  rdramReadBitsBuffer(addr: number, bytes: number): Buffer;

  rdramReadBits8(addr: number): Buffer;

  rdramReadBit8(addr: number, bitoffset: number): boolean;

  rdramWriteBitsBuffer(addr: number, buf: Buffer): void;

  rdramWriteBits8(addr: number, buf: Buffer): void;

  rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void;

  //--------------------
  // Pointer ram functions
  //--------------------

  rdramReadPtr8(addr: number, offset: number): number;

  rdramWritePtr8(addr: number, offset: number, value: number): void;

  rdramReadPtr16(addr: number, offset: number): number;

  rdramWritePtr16(addr: number, offset: number, value: number): void;

  rdramWritePtr32(addr: number, offset: number, value: number): void;

  rdramReadPtr32(addr: number, offset: number): number;

  rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer;

  rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void;

  rdramReadPtrS8(addr: number, offset: number): number;

  rdramReadPtrS16(addr: number, offset: number): number;

  rdramReadPtrS32(addr: number, offset: number): number;

  //--------------------
  // Pointer Bit level functions
  //--------------------

  rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer;

  rdramReadPtrBits8(addr: number, offset: number): Buffer;

  rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean;

  rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void;

  rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void;

  rdramWritePtrBit8(
    addr: number,
    offset: number,
    bitoffset: number,
    bit: boolean
  ): void;

  //--------------------
  // Float functions
  //--------------------

  rdramReadF32(addr: number): number;

  rdramReadPtrF32(addr: number, offset: number): number;

  rdramWriteF32(addr: number, value: number): void;

  rdramWritePtrF32(addr: number, offset: number, value: number): void;

  bitCount8(value: number): number;
  bitCount16(value: number): number;
  bitCount32(value: number): number;
  bitCountBuffer(buf: Buffer, off: number, len: number): number;

  getRdramBuffer(): ArrayBuffer;

}

export default IMemory;
