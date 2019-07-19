interface IMemory{

    rdramRead8(addr: number): number

    rdramWrite8(addr: number, value: number): void

    rdramRead16(addr: number): number

    rdramWrite16(addr: number, value: number): void

    rdramWriteU32(addr: number, value: number): void

    rdramWrite32(addr: number, value: number): void

    rdramReadU32(addr: number): number

    rdramRead32(addr: number): number

    rdramWriteU64(addr: number, value: number): void

    rdramWrite64(addr: number, value: number): void

    rdramReadU64(addr: number): number

    rdramRead64(addr: number): number

    rdramReadBuffer(addr: number, size: number): Buffer

    rdramWriteBuffer(addr: number, buf: Buffer): void

    rdramReadUBuffer(addr: number, size: number): Buffer

    rdramWriteUBuffer(addr: number, buf: Buffer): void

}

export default IMemory