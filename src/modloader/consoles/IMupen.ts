import IMemory from 'modloader64_api/IMemory';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';

interface IMupen extends IMemory, IRomMemory, IUtils, ISaveState {
  setConfigDir(path: string): void;

  setDataDir(path: string): void;

  setPluginDir(path: string): void;

  runEmulator(bool: boolean): number;

  memoryCacheRefresh(): void;

  coreEmuState(): number;

  setFrameCallback(fn: Function): void;

  initialize(): number;

  loadRom(rom: string): number;

  pauseEmulator(): void;

  stopEmulator(): void;

  resumeEmulator(): void;

  hookFrameCallback(): void;

  softReset(): void;

  hardReset(): void;
}

export default IMupen;
