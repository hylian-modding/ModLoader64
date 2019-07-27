interface IMemory{

    rdramRead8(addr: number): number

    rdramWrite8(addr: number, value: number): void

    rdramRead16(addr: number): number

    rdramWrite16(addr: number, value: number): void

    rdramWrite32(addr: number, value: number): void

    rdramRead32(addr: number): number

    rdramReadBuffer(addr: number, size: number): Buffer

    rdramWriteBuffer(addr: number, buf: Buffer): void

    dereferencePointer(addr: number): number

}

export default IMemory