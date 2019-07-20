import * as path from 'path';
import * as fs from 'fs';
import IMupen from './IMupen';
import IMemory from '../../API/IMemory';
import IConsole from '../../API/IConsole';
import { IRomMemory } from '../../API/IRomMemory';

class N64 implements IConsole{
    
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

        var instance = this

        this.mupen.rdramReadBuffer = function(addr: number, size: number){
            let buf = Buffer.alloc(size)
            for (let i = 0; i < buf.byteLength; i++){
                buf.writeUInt8(instance.mupen.rdramRead8(addr + i), i)
            }
            return buf
        }
        
        this.mupen.rdramWriteBuffer = function(addr: number, buf: Buffer){
            for (let i = 0; i < buf.byteLength; i++){
                instance.mupen.rdramWrite8(addr + i, buf.readUInt8(i))
            }
        }

        this.mupen.initialize();
        this.rom_size = fs.readFileSync(rom).byteLength
        this.mupen.loadRom(rom);
    }

    startEmulator(preStartCallback: Function): IMemory {
        let rom_r = this.mupen as IRomMemory
        var buf: Buffer = this.getLoadedRom()
        buf = preStartCallback(buf)
        for (let i = 0; i < buf.byteLength; i++){
            rom_r.romWrite8(i, buf.readUInt8(i))
        }
        this.mupen.runEmulator(true);
        return this.mupen
    }

    stopEmulator(): void {
    }

    finishInjects(): void {
        this.mupen.savestatesRefreshHack();
    }

    isEmulatorReady(): boolean{
        return this.mupen.coreEmuState() === 2
    }

    getLoadedRom(): Buffer{
        let rom_r = this.mupen as IRomMemory
        var buf: Buffer = Buffer.alloc(this.rom_size)
        for (let i = 0; i < buf.byteLength; i++){
            buf.writeUInt8(rom_r.romRead8(i), i)
        }
        return buf
    }

    setFrameCallback(fn: Function): void{
        this.mupen.setFrameCallback(fn)
    }

}

export default N64

