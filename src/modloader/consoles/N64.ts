import * as path from 'path'
import IMupen from './IMupen';
import IMemory from '../../API/IMemory';
import IConsole from '../../API/IConsole';

class N64 implements IConsole{
    
    mupen: IMupen

    constructor() {
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

    }

    startEmulator(rom: string): IMemory {
        this.mupen.runEmulatorAsync(rom);
        return this.mupen
    }

    stopEmulator(): void {
    }

    finishInjects(): void {
        this.mupen.savestatesRefreshHack();
    }

}

export default N64

