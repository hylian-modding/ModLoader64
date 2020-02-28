import IMemory from 'modloader64_api/IMemory';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';

interface IMupen extends IMemory, IRomMemory, IUtils, ISaveState {

  runEmulator(bool: boolean): number;

  memoryCacheRefresh(): void;

  coreEmuState(): number;

  initialize(): number;

  loadRom(rom: string): number;

  pauseEmulator(): void;

  stopEmulator(): void;

  resumeEmulator(): void;

  softReset(): void;

  hardReset(): void;

  setSaveDir(path: string): void;

  isMupenReady(): boolean;

  getFrameCount(): number;

  setFrameCount(num: number): void;
}

export default IMupen;
