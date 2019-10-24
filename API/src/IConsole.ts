import IMemory from './IMemory';
import { IRomHeader } from './IRomHeader';
import IUtils from './IUtils';
import ISaveState from './ISaveState';

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

  pauseEmulator(): void;

  resumeEmulator(): void;

  getMemoryAccess(): IMemory;

  setSaveDir(path: string): void;

  getUtils(): IUtils;

  getSaveStateManager(): ISaveState;
}

export default IConsole;
