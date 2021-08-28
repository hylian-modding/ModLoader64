import IMemory from './IMemory';
import { IRomHeader } from './IRomHeader';
import ISaveState from './ISaveState';
import { IImGui } from './Sylvain/ImGui';
import { SDL } from './Sylvain/SDL';
import { Gfx } from './Sylvain/Gfx';
import { Input } from './Sylvain/Input';
import { IYaz0 } from './Sylvain/Yaz0';
import { Debugger } from './Sylvain/Debugger';
import IUtils from './IUtils';
import { ProxySide } from './SidedProxy/SidedProxy';
import { IConfig, ILogger } from './IModLoaderAPI';
import { IRomMemory } from './IRomMemory';
import { IHiResTexture } from './IHiResTexture';

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

  getRomOriginalSize(): number;

  getRomHeader(): IRomHeader;

  pauseEmulator(): void;

  resumeEmulator(): void;

  getMemoryAccess(): IMemory;

  setSaveDir(path: string): void;

  getUtils(): IUtils;

  getFrameCount(): number;

  setFrameCount(num: number): void;

  on(which: string, callback: any): void;
}

// #ifdef HAS_SAVESTATES
interface IConsole{
  getSaveStateManager(): ISaveState;
}
// #endif

// #ifdef HAS_IMGUI
interface IConsole{
  getImGuiAccess(): IImGui;
}
// #endif

// #ifdef HAS_SDL
interface IConsole{
  getSDLAccess(): SDL;
}
// #endif

// #ifdef HAS_GFX
interface IConsole{
  getGfxAccess(): Gfx;
}
// #endif

// #ifdef HAS_INPUT
interface IConsole{
  getInputAccess(): Input;
}
// #endif

// #ifdef HAS_YAZ0
interface IConsole{
  getYaz0Encoder(): IYaz0;
}
// #endif

// #ifdef IS_MUPEN
interface IConsole{
  getDebuggerAccess(): Debugger;
}
// #endif

// #ifdef IS_MUPEN
interface IConsole{
  getHiResTextureAccess(): IHiResTexture;
}
// #endif

interface IConsole{
  getInternalPlugin(): string;
  getRomAccess(): IRomMemory;
}

export interface IConsoleDescriptor{
  constructConsole(side: ProxySide, rom: string, logger: ILogger, lobby: string, config: IConfig): IConsole;
  getConsoleLabel(): string;
}

export default IConsole;
