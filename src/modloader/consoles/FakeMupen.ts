import IConsole from "../../API/IConsole";
import { FakeN64Memory } from "./FakeN64Memory";
import fs from 'fs';
import { Rom } from "../Rom";

export class FakeMupen implements IConsole{

    rom: string
    rom_data: Buffer
    
    constructor(rom: string){
        this.rom = rom
        this.rom_data = new Rom(this.rom).bytes
    }

    startEmulator(preStartCallback: Function): import("../../API/IMemory").default {
        preStartCallback(this.rom_data)
        return new FakeN64Memory()
    }    

    stopEmulator(): void {
    }

    finishInjects(): void {
    }

    isEmulatorReady(): boolean {
        return true
    }

    getLoadedRom(): Buffer {
        return this.rom_data
    }

    setFrameCallback(fn: Function): void {
    }
}