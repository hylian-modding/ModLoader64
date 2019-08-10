import IMupen from './IMupen';
import IMemory from 'modloader64_api/IMemory';
import IConsole from 'modloader64_api/IConsole';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { MonkeyPatch_rdramWriteBit8 } from '../../monkeypatches/Mupen';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { N64Header } from './N64Header';

class N64 implements IConsole {
  mupen: IMupen;
  rom_size: number;

  constructor(rom: string) {
    this.mupen = require(process.cwd() +
      '/emulator/mupen64plus.node') as IMupen;

    this.mupen.setConfigDir(process.cwd() + '/emulator/');
    this.mupen.setDataDir(process.cwd() + '/emulator/');
    this.mupen.setPluginDir(process.cwd() + '/emulator/');

    this.mupen.initialize();

    // This function seems broken right now. Monkey patch it for now.
    let monkey = new MonkeyPatch_rdramWriteBit8(this.mupen);
    monkey.patch();

    this.rom_size = this.mupen.loadRom(rom);
  }

  startEmulator(preStartCallback: Function): IMemory {
    let rom_r = this.mupen as IRomMemory;
    let buf: Buffer = preStartCallback();
    if (buf.byteLength > 1) {
      rom_r.romWriteBuffer(0x0, buf);
    }
    this.mupen.runEmulator(true);
    return this.mupen;
  }

  stopEmulator(): void {
    this.mupen.stopEmulator();
  }

  finishInjects(): void {
    this.mupen.memoryCacheRefresh();
  }

  isEmulatorReady(): boolean {
    return this.mupen.coreEmuState() === 2;
  }

  getLoadedRom(): Buffer {
    let rom_r = this.mupen as IRomMemory;
    let buf: Buffer = rom_r.romReadBuffer(0x0, this.rom_size);
    return buf;
  }

  setFrameCallback(fn: Function): void {
    this.mupen.setFrameCallback(fn);
    this.mupen.hookFrameCallback();
  }

  pauseEmulator(): void {
    this.mupen.pauseEmulator();
  }

  resumeEmulator(): void {
    this.mupen.resumeEmulator();
  }

  getRomHeader(): IRomHeader {
    let raw = this.mupen.romReadBuffer(0x0, 0x50);
    return new N64Header(raw);
  }

  getMemoryAccess(): IMemory {
    return this.mupen;
  }

  softReset(): void {
    this.mupen.softReset();
  }

  hardReset(): void {
    this.mupen.hardReset();
  }

  saveState(file: string): void {
    this.mupen.saveState(file);
  }

  loadState(file: string): void {
    this.mupen.loadState(file);
  }
}

export default N64;
