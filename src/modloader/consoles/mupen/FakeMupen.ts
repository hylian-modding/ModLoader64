import IConsole from 'modloader64_api/IConsole';
import IMemory from 'modloader64_api/IMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { N64Header } from './N64Header';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import { Debugger } from 'modloader64_api/Sylvain/Debugger';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';
import { Input } from 'modloader64_api/Sylvain/Input';
import { Gfx } from 'modloader64_api/Sylvain/Gfx';
import { SDL } from 'modloader64_api/Sylvain/SDL';
import { IImGui } from 'modloader64_api//Sylvain/ImGui';
import { FakeMemory, FakeRom } from 'modloader64_api/SidedProxy/FakeMemory';
import { ILogger } from 'modloader64_api/IModLoaderAPI';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import path from 'path';
import { IHiResTexture } from 'modloader64_api/IHiResTexture';
import fs from 'fs';

export class FakeMupen implements IConsole {
    rom: string;
    rom_data: Buffer;
    ram: FakeMemory;

    constructor(rom: string, logger: ILogger, lobby: string) {
        this.rom = rom;
        this.rom_data = Buffer.alloc(0x50, 0);
        if (fs.existsSync(rom)){
            let temp = fs.readFileSync(this.rom);
            temp.copy(this.rom_data, 0, 0, 0x50);
        }
        this.ram = new FakeMemory();
    }

    getRomAccess(): IRomMemory {
        return new FakeRom();
    }

    getInternalPlugin(): string {
        return path.resolve(__dirname, "MupenServerPlugin.js");
    }

    getDebuggerAccess(): Debugger {
        return {} as any;
    }

    getRomOriginalSize(): number {
        return -1;
    }

    getYaz0Encoder(): IYaz0 {
        return {} as any;
    }

    getInputAccess(): Input {
        return {} as any;
    }
    getGfxAccess(): Gfx {
        return {} as any;
    }

    getSDLAccess(): SDL {
        return {} as any;
    }
    getImGuiAccess(): IImGui {
        return {} as any;
    }

    on(which: string, callback: any): void {
    }

    startEmulator(preStartCallback: Function): IMemory {
        preStartCallback(this.rom_data);
        return this.ram;
    }

    stopEmulator(): void { }

    finishInjects(): void { }

    isEmulatorReady(): boolean {
        return true;
    }

    getLoadedRom(): Buffer {
        return this.rom_data;
    }

    getFrameCount(): number {
        return -1;
    }

    setFrameCount(num: number): void { }

    pauseEmulator(): void { }

    resumeEmulator(): void { }

    getRomHeader(): IRomHeader {
        return new N64Header(this.rom_data);
    }

    getMemoryAccess(): IMemory {
        return this.ram;
    }

    softReset(): void { }

    hardReset(): void { }

    saveState(file: string): void { }

    loadState(file: string): void { }

    setSaveDir(path: string): void { }

    getUtils(): IUtils {
        return {} as any;
    }

    getSaveStateManager(): ISaveState {
        return {} as any;
    }

    getHiResTextureAccess(): IHiResTexture {
        return {} as any;
    }
}