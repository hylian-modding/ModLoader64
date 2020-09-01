import { Frontend, Gfx, SDL, ImGui, M64p } from './ml64_emu_addon';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import IMemory from 'modloader64_api/IMemory';

export interface IMupen{
    Frontend: IFrontend;
    M64p: IM64p;
    Yaz0: IYaz0;
}

export interface IFrontend {

    startup(startInfo: Frontend.StartInfo): void;
    shutdown(): void;
    doEvents(): void;
    execute(): void;
    stop(): void;
    on(which: string, callback: any): void;

    getVideoOutputInfo(): Frontend.VideoOutputInfo;
    toggleFullScreen(): void;
    captureFrame(): void;
    getFrameTexture(): Gfx.Texture;
    createResourcesNextVi(): void;
    getMainWindow(): SDL.WindowRef;
    showMessageBox(parent: SDL.WindowRef | undefined, icon: Frontend.MessageBoxIcon,
        title: string, mainInstruction: string, content: string): void;

    getDefaultFont(): ImGui.FontRef;
    setDefaultFont(font: ImGui.FontRef): void;
    getDefaultMonoFont(): ImGui.FontRef;
    setDefaultMonoFont(font: ImGui.FontRef): void;

    openInputConfig(): void;
    closeInputConfig(): void;
    isInputConfigOpen(): boolean;
    openCheatConfig(): void;
    closeCheatConfig(): void;
    isCheatConfigOpen(): boolean;
    setCheatsCRC(crc: string): void;
    disableAllCheats(): void;
    openMemViewer(): void;
    closeMemViewer(): void;
    isMemViewerOpen(): boolean;
}

export interface IM64p{
     addCheat(name: string, codes: M64p.CheatCode[]): void;
     setCheatEnabled(name: string, enabled: boolean): void;
     getRomSettingsFromCRCs(crc1: number, crc2: number): M64p.RomSettings;
     openRomFromFile(path: string, newLen?: number): void;
     openRomFromMemory(data: Buffer, newLen?: number): void;
     closeRom(): void;
     getRomHeader(): M64p.RomHeader;
     getRomSettings(): M64p.RomSettings;
     pause(): void;
     resume(): void;
     setStateSlot(slot: number): void;
     loadState(): void;
     loadStateFromSlot(slot: number): void;
     loadStateFromFile(path: string): void;
     saveState(): void;
     saveStateToSlot(slot: number): void;
     saveStateToFile(path: string): void;
     takeNextScreenshot(): void;
     softReset(): void;
     hardReset(): void;
     advanceFrame(): void;
     getEmuState(): EmuState;
     getVideoMode(): M64p.VideoMode;
     getStateSlot(): number;
     getSpeedFactor(): number;
     setSpeedFactor(factor: number): void;
     isSpeedLimiterEnabled(): boolean;
     setSpeedLimiterEnabled(enabled: boolean): void;
     getVideoSize(): M64p.VideoSize;
     getAudioVolume(): number;
     setAudioVolume(volume: number): void;
     isAudioMuted(): boolean;
     setAudioMuted(muted: boolean): void;
     isGSButtonPressed(): boolean;
     setGSButtonPressed(pressed: boolean): void;
     hasInputFocus(): boolean;
     getNumElapsedFrames(): number;
     Memory: IMemory;

}

export interface IYaz0{
    encode(buf: Buffer): Buffer;
    decode(buf: Buffer): Buffer;
}

export const enum EmuState {
    Stopped = 1,
    Running,
    Paused
}

export const enum Emulator_Callbacks{
    new_frame = "new-frame",
    core_started = "core-started"
}