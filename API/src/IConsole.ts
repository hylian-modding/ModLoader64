import IMemory from './IMemory';
import { IRomHeader } from './IRomHeader';

interface IConsole {
  startEmulator(preStartCallback: Function): IMemory;

  stopEmulator(): void;

  softReset(): void;

  hardReset(): void;

  saveState(file: string): void;

  loadState(file: string): void;

  finishInjects(): void;

  isEmulatorReady(): boolean;

  getLoadedRom(): Buffer;

  getRomHeader(): IRomHeader;

  setFrameCallback(fn: Function): void;

  hookFrameCallback(): void;

  pauseEmulator(): void;

  resumeEmulator(): void;

  getMemoryAccess(): IMemory;
}

export default IConsole;
