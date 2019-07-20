export interface IRomMemory{
    romRead8(addr: number): number

    romWrite8(addr: number, value: number): void

    romRead16(addr: number): number

    romWrite16(addr: number, value: number): void

    romRead32(addr: number): number

    romWrite32(addr: number, value: number): void

    romReadU32(addr: number): number

    romWriteU32(addr: number, value: number): void

    romRead64(addr: number): number

    romWrite64(addr: number, value: number): void

    romReadU64(addr: number): number

    romWriteU64(addr: number, value: number): void
}