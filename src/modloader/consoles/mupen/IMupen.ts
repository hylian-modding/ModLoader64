import { Frontend, ImGui, M64p } from './ml64_emu_addon';
import IMemory from 'modloader64_api/IMemory';
import { IImGui } from 'modloader64_api/Sylvain/ImGui';
import { SDL, WindowRef } from 'modloader64_api/Sylvain/SDL';
import { Gfx, Texture } from 'modloader64_api/Sylvain/Gfx';
import { Input } from 'modloader64_api/Sylvain/Input';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';

export interface IMupen {
    Frontend: IFrontend;
    M64p: IM64p;
    Yaz0: IYaz0;
    ImGui: IImGui;
    SDL: SDL;
    Gfx: Gfx;
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
    getFrameTexture(): Texture;
    createResourcesNextVi(): void;
    getMainWindow(): WindowRef;
    showMessageBox(parent: WindowRef | undefined, icon: Frontend.MessageBoxIcon,
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

export interface IM64p {
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
    Input: Input;
    Config: Config;
}

export const enum EmuState {
    Stopped = 1,
    Running,
    Paused
}

export const enum ParamType {
    Int = 1, Float, Bool, String
}

export interface Param {
    name: string;
    type: ParamType;
}

export interface Section {
    getName(): string;
    listParams(): Param[];
    save(): void;
    hasUnsavedChanges(): boolean;
    erase(): void;
    revertChanges(): void;

    getHelp(name: string): string;
    setHelp(name: string, help: string): void;
    getType(name: string): ParamType;

    setDefaultInt(name: string, value: number): void;
    setDefaultFloat(name: string, value: number): void;
    setDefaultBool(name: string, value: boolean): void;
    setDefaultString(name: string, value: string): void;

    getInt(name: string): number;
    getIntOr(name: string, value: number): number;
    setInt(name: string, value: number): void;
    getFloat(name: string): number;
    getFloatOr(name: string, value: number): number;
    setFloat(name: string, value: number): void;
    getBool(name: string): boolean;
    getBoolOr(name: string, value: boolean): boolean;
    setBool(name: string, value: boolean): void;
    getString(name: string): string;
    getStringOr(name: string, value: string): string;
    setString(name: string, value: string): void;
}

export interface Config {
    saveFile(): void;
    hasUnsavedChanges(): boolean;
    listSections(): string[];
    openSection(name: string): Section;
    getSharedDataFilePath(file: string): string;
    getUserConfigPath(): string;
    getUserDataPath(): string;
    getUserCachePath(): string;
}