import IMemory from './IMemory';

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

  getRomHeader(): Buffer;

  setFrameCallback(fn: Function): void;

  pauseEmulator(): void;

  resumeEmulator(): void;

  getMemoryAccess(): IMemory;
}

export default IConsole;
