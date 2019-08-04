import IConsole from 'modloader64_api/IConsole';
import { FakeN64Memory } from './FakeN64Memory';
import fs from 'fs';
import { Rom } from '../Rom';
import IMemory from 'modloader64_api/IMemory';

export class FakeMupen implements IConsole {
  rom: string;
  rom_data: Buffer;
  ram: FakeN64Memory;

  constructor(rom: string) {
    this.rom = rom;
    this.rom_data = new Rom(this.rom).bytes;
    this.ram = new FakeN64Memory();
  }

  startEmulator(preStartCallback: Function): IMemory {
    preStartCallback(this.rom_data);
    return this.ram;
  }

  stopEmulator(): void {}

  finishInjects(): void {}

  isEmulatorReady(): boolean {
    return true;
  }

  getLoadedRom(): Buffer {
    return this.rom_data;
  }

  setFrameCallback(fn: Function): void {}

  pauseEmulator(): void {}

  resumeEmulator(): void {}

  getRomHeader(): Buffer {
    let b: Buffer = Buffer.alloc(0x50);
    this.rom_data.copy(b, 0, 0, 0x50);
    return b;
  }

  getMemoryAccess(): IMemory {
    return this.ram;
  }

  softReset(): void {}

  hardReset(): void {}

  saveState(file: string): void {}

  loadState(file: string): void {}
}
