import * as path from 'path';
import * as fs from 'fs';
import IMupen from './IMupen';
import IMemory from '../../API/IMemory';
import IConsole from '../../API/IConsole';
import { IRomMemory } from '../../API/IRomMemory';

class N64 implements IConsole {

    mupen: IMupen
    rom_size: number

    constructor(rom: string) {
        this.mupen = require(process.cwd() + '/emulator/mupen64plus.node') as IMupen;

        this.mupen.dereferencePointer = (addr: number)=>{
            return this.mupen.rdramRead32(addr) - 0x80000000
        }

        this.mupen.setConfigDir(process.cwd() + "/emulator");
        this.mupen.setDataDir(process.cwd() + "/emulator");
        this.mupen.setPluginDir(process.cwd() + "/emulator");

        this.mupen.initialize();

        this.rom_size = this.mupen.loadRom(rom);
    }

    startEmulator(preStartCallback: Function): IMemory {
        let rom_r = this.mupen as IRomMemory
        let buf: Buffer = preStartCallback()
        if (buf.byteLength > 1){
            rom_r.romWriteBuffer(0x0, buf)
        }
        this.mupen.runEmulator(true);
        return this.mupen
    }

    stopEmulator(): void {
    }

    finishInjects(): void {
        //this.mupen.memoryCacheRefresh();
        this.mupen.hookFrameCallback();
    }

    isEmulatorReady(): boolean {
        return this.mupen.coreEmuState() === 2
    }

    getLoadedRom(): Buffer {
        let rom_r = this.mupen as IRomMemory
        var buf: Buffer = rom_r.romReadBuffer(0x0, this.rom_size)
        return buf
    }

    setFrameCallback(fn: Function): void {
        this.mupen.setFrameCallback(fn)
    }

    pauseEmulator(): void{
        this.mupen.pauseEmulator()
    }

    resumeEmulator(): void{
        this.mupen.resumeEmulator()
    }

    getRomHeader(): Buffer{
        return this.mupen.romReadBuffer(0x0, 0x50)
    }

    getMemoryAccess(): IMemory{
        return this.mupen;
    }

}

export default N64

