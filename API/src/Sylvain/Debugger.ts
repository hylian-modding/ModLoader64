export const enum RunState {
    Paused, Stepping, Running
}

export const enum Register {
    r0, at, v0, v1, a0, a1, a2, a3,
    t0, t1, t2, t3, t4, t5, t6, t7,
    s0, s1, s2, s3, s4, s5, s6, s7,
    t8, t9, k0, k1, gp, sp, fp, ra
}

export const enum BpFlags {
    Enabled = 0x01, Read = 0x02, Write = 0x04, Exec = 0x08, Log = 0x10,
    All = Enabled | Read | Write | Exec | Log,
    RW = Enabled | Read | Write,
    RWX = Enabled | Read | Write | Exec
}

export interface BpStruct {
    address: number,
    endAddress: number,
    flags: BpFlags
}

export interface BpTriggerInfo {
    flags: BpFlags,
    address: number
}

export const enum MemType {
    NoMem, Nothing, RDRAM, RDRAMReg, RSPMem, RSPReg, RSP, DP, DPS, VI, AI, PI,
    RI, SI, FlashRAMStat, ROM, PIF, MI, Breakpoint
}

export const enum MemFlags {
    Readable = 0x01, Writable = 0x02,
    ReadableEmuOnly = 0x04, WritableEmuOnly = 0x08
}

export interface Debugger {
    isSupported(): boolean;
    isEnabled(): boolean;
    isInitialized(): boolean;
    getRunState(): RunState;
    setRunState(state: RunState): void;
    step(): void;
    decodeOp(inst: number, pc: number): string;
    memRead64(addr: number): number;
    memRead32(addr: number): number;
    memRead16(addr: number): number;
    memRead8(addr: number): number;
    memWrite64(addr: number, val: number): void;
    memWrite32(addr: number, val: number): void;
    memWrite16(addr: number, val: number): void;
    memWrite8(addr: number, val: number): void;
    bpCount(): number;
    bpLookup(addr: number, size: number, flags: BpFlags): number;
    bpAddAddress(addr: number): number;
    bpAddStruct(bp: BpStruct): number;
    bpReplace(index: number, bp: BpStruct): void;
    bpRemoveAddress(addr: number): void;
    bpRemoveIndex(index: number): void;
    bpEnable(index: number): void;
    bpDisable(index: number): void;
    bpCheck(addr: number): number;
    bpTriggeredBy(): BpTriggerInfo;
    getPrevPC(): number;
    readPC(): number;
    writePC(pc: number): void;
    readRegister(reg: Register): number;
    writeRegister(reg: Register, val: number): void;
    virtualToPhysical(addr: number): number;
    getMemType(addr: number): MemType;
    getMemFlags(addr: number): MemFlags;
}