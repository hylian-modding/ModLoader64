import IConsole from 'modloader64_api/IConsole';
import { FakeN64Memory } from './FakeN64Memory';
import IMemory from 'modloader64_api/IMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { N64Header } from './N64Header';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import crypto from 'crypto';

export class FakeMupen implements IConsole {
  rom: string;
  rom_data: Buffer;
  ram: FakeN64Memory;

  constructor(rom: string) {
    this.rom = rom;
    this.rom_data = Buffer.alloc(1);
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

  getFrameCount(): number {
    return -1;
  }

  setFrameCount(num: number): void {}

  pauseEmulator(): void {}

  resumeEmulator(): void {}

  getRomHeader(): IRomHeader {
    return new N64Header(Buffer.alloc(0x50));
  }

  getMemoryAccess(): IMemory {
    return this.ram;
  }

  softReset(): void {}

  hardReset(): void {}

  saveState(file: string): void {}

  loadState(file: string): void {}

  setSaveDir(path: string): void {}

  getUtils(): IUtils {
    return new FakeN64Utils();
  }

  getSaveStateManager(): ISaveState {
    return new FakeN64SaveState();
  }
}

class FakeN64SaveState implements ISaveState {
  saveState(file: string): void {}
  loadState(file: string): void {}
}

class FakeN64Utils implements IUtils {
  setTimeoutFrames(fn: Function, frames: number): void {
  }
  clearBuffer(buf: Buffer): Buffer {
    buf.fill('00', 0, buf.byteLength, 'hex');
    return buf;
  }
  utilBitCount8(value: number): number {
    return -1;
  }
  utilBitCount16(value: number): number {
    return -1;
  }
  utilBitCount32(value: number): number {
    return -1;
  }
  utilBitCountBuffer(buf: Buffer, offset: number, length: number): number {
    return -1;
  }
  memoryCacheRefresh(): void {}
  hashBuffer(buf: Buffer): string {
    return crypto
      .createHash('md5')
      .update(buf)
      .digest('hex');
  }

  yaz0Encode(buf: Buffer): Buffer {
    return Buffer.alloc(1);
  }
  yaz0Decode(buf: Buffer): Buffer {
    return Buffer.alloc(1);
  }
}
