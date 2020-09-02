import { vec2, vec4 } from "./vec";
import { Keybd } from "./Keybd";
import { Mouse } from "./Mouse";

export const enum WindowFlags {
    FullScreen = 0x1, Shown = 0x4, Hidden = 0x8, Borderless = 0x10, Resizable = 0x20, Minimized = 0x40, Maximized = 0x80,
    InputGrabbed = 0x100, InputFocus = 0x200, MouseFocus = 0x400, FullScreenDesktop = (FullScreen | 0x1000), MouseCapture = 0x4000
}

export const enum FullScreenMode {
    FullScreen = 0x00000001,
    DesktopFullScreen = (FullScreen | 0x00001000)
}

export interface WindowRef {
    getFlags(): WindowFlags;
    getMaximumSize(): vec2;
    getMinimumSize(): vec2;
    getOpacity(): number;
    getPosition(): vec4;
    getSize(): vec2;
    getTitle(): string;
    hide(): void;
    maximize(): void;
    minimize(): void;
    raise(): void;
    restore(): void;
    setBordered(bordered: boolean): void;
    setFullScreen(mode: FullScreenMode): void;
    setInputFocus(): void;
    setMaximumSize(size: vec2): void;
    setMinimumSize(size: vec2): void;
    setOpacity(opacity: number): void;
    setPosition(pos: vec2): void;
    setResizable(resizable: boolean): void;
    setSize(size: vec2): void;
    setTitle(title: string): void;
    show(): void;
    equalsTo(other: WindowRef): boolean;
}

export interface SDL{
    Keybd: Keybd;
    Mouse: Mouse;
    Clipboard: Clipboard;
}