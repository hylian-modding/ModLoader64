import Vector3 from "./Vector3";

export interface IMath {
    //--------------------
    // Vector3 functions
    //--------------------

    rdramReadV3(addr: number): Vector3;
    rdramWriteV3(addr: number, rhs: Vector3): void;

    rdramReadPtrV3(addr: number, offset: number): Vector3;
    rdramWritePtrV3(addr: number, offset: number, rhs: Vector3): void;

    rdramReadV3i(addr: number): Vector3;
    rdramWriteV3i(addr: number, rhs: Vector3): void;

    rdramReadV3i16(addr: number): Vector3;
    rdramWriteV3i16(addr: number, rhs: Vector3): void;

    rdramReadV3i8(addr: number): Vector3;
    rdramWriteV3i8(addr: number, rhs: Vector3): void;
}