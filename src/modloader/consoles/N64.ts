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
        this.mupen = require(process.cwd() + '/node/m64pnpm.node') as IMupen;

        this.mupen.setCoreLib(process.cwd() + "/mupen64plus.dll");
        this.mupen.setConfigDir(process.cwd());
        this.mupen.setDataDir(process.cwd());

        this.mupen.setPluginDir(process.cwd());
        this.mupen.setPluginAudio(process.cwd() + "/mupen64plus-audio-sdl.dll");
        this.mupen.setPluginGFX(process.cwd() + "/mupen64plus-video-rice.dll");
        this.mupen.setPluginInput(process.cwd() + "/mupen64plus-input-sdl.dll");
        this.mupen.setPluginRSP(process.cwd() + "/mupen64plus-rsp-hle.dll");

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
        this.mupen.savestatesRefreshHack();
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

}

export default N64

