import { IMath } from "modloader64_api/math/IMath";
import IMemory from "modloader64_api/IMemory";
import Vector3 from "modloader64_api/math/Vector3";

export class Math implements IMath {

    private emulator: IMemory;

    constructor(emulator: IMemory) {
        this.emulator = emulator;
    }

    rdramReadPtrV3(addr: number, offset: number): Vector3 {
        return new Vector3(this.emulator.rdramReadPtrF32(addr, offset), this.emulator.rdramReadPtrF32(addr, offset + 4), this.emulator.rdramReadPtrF32(addr, offset + 8));
    }
    rdramWritePtrV3(addr: number, offset: number, rhs: Vector3): void {
        this.emulator.rdramWritePtrF32(addr, offset, rhs.x);
        this.emulator.rdramWritePtrF32(addr, offset + 4, rhs.y);
        this.emulator.rdramWritePtrF32(addr, offset + 8, rhs.y);
    }

    rdramReadV3(addr: number): Vector3 {
        return new Vector3(this.emulator.rdramReadF32(addr),
            this.emulator.rdramReadF32(addr + 4),
            this.emulator.rdramReadF32(addr + 8)
        );
    }
    rdramWriteV3(addr: number, rhs: Vector3): void {
        this.emulator.rdramWriteF32(addr, rhs.x);
        this.emulator.rdramWriteF32(addr + 4, rhs.y);
        this.emulator.rdramWriteF32(addr + 8, rhs.z);
    }
    rdramReadV3i(addr: number): Vector3 {
        return new Vector3(this.emulator.rdramRead32(addr),
            this.emulator.rdramRead32(addr + 4),
            this.emulator.rdramRead32(addr + 8)
        );
    }
    rdramWriteV3i(addr: number, rhs: Vector3): void {
        this.emulator.rdramWrite32(addr, rhs.x);
        this.emulator.rdramWrite32(addr + 4, rhs.y);
        this.emulator.rdramWrite32(addr + 8, rhs.z);
    }
    rdramReadV3i16(addr: number): Vector3 {
        return new Vector3(this.emulator.rdramRead16(addr),
            this.emulator.rdramRead16(addr + 2),
            this.emulator.rdramRead16(addr + 4)
        );
    }
    rdramWriteV3i16(addr: number, rhs: Vector3): void {
        this.emulator.rdramWrite16(addr, rhs.x);
        this.emulator.rdramWrite16(addr + 2, rhs.y);
        this.emulator.rdramWrite16(addr + 4, rhs.z);
    }
    rdramReadV3i8(addr: number): Vector3 {
        return new Vector3(this.emulator.rdramRead8(addr),
            this.emulator.rdramRead8(addr + 1),
            this.emulator.rdramRead8(addr + 2)
        );
    }
    rdramWriteV3i8(addr: number, rhs: Vector3): void {
        this.emulator.rdramWrite8(addr, rhs.x);
        this.emulator.rdramWrite8(addr + 1, rhs.y);
        this.emulator.rdramWrite8(addr + 2, rhs.z);
    }

}