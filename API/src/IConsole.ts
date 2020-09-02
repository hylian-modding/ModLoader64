import IMemory from './IMemory';
import { IRomHeader } from './IRomHeader';
import IUtils from './IUtils';
import ISaveState from './ISaveState';
import { IImGui } from './Sylvain/ImGui';
import { SDL } from './Sylvain/SDL';
import { Gfx } from './Sylvain/Gfx';
import { Input } from './Sylvain/Input';
import { IYaz0 } from './Sylvain/Yaz0';

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

  on(which: string, callback: any): void;

  getImGuiAccess(): IImGui;

  getSDLAccess(): SDL;

  getGfxAccess(): Gfx;

  getInputAccess(): Input;

  getYaz0Encoder(): IYaz0;

}

export default IConsole;
