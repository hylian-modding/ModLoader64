/// <reference types="node" />
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
    pauseEmulator(): void;
    resumeEmulator(): void;
    getMemoryAccess(): IMemory;
    setSaveDir(path: string): void;
    getUtils(): IUtils;
    getSaveStateManager(): ISaveState;
    getFrameCount(): number;
    setFrameCount(num: number): void;
}
export default IConsole;
