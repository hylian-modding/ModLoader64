import { vec2 } from "./vec";
import { WindowRef } from "./SDL";

export const enum MouseButtons {
    Left = 1,
    Middle,
    Right,
    X1,
    X2
}

export interface Mouse {
    capture(enabled: boolean): void;
    getButtonMask(button: MouseButtons): number;
    getGlobalPosition(): vec2;
    getGlobalButtons(): number;
    getPosition(): vec2;
    getButtons(): number;
    getRelativeMode(): boolean;
    getRelativePosition(): vec2;
    getRelativeButtons(): number;
    setRelativeMode(enabled: boolean): void;
    warpGlobal(pos: vec2): void;
    warpInWindow(window: WindowRef, pos: vec2): void;
    showCursor(): void;
    hideCursor(): void;
    isCursorVisible(): boolean;
}