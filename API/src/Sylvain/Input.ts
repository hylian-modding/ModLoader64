export const enum Button {
    DPadRight, DPadLeft, DPadDown, DPadUp, Start, Z, B, A,
    CRight, CLeft, CDown, CUp, R, L
}

export const enum Axis {
    X, Y
}

export const enum FilterFlags {
    None = 0,
    DPadRight = 1 << 0,
    DPadLeft = 1 << 1,
    DPadDown = 1 << 2,
    DPadUp = 1 << 3,
    Start = 1 << 4,
    Z = 1 << 5,
    B = 1 << 6,
    A = 1 << 7,
    CRight = 1 << 8,
    CLeft = 1 << 9,
    CDown = 1 << 10,
    CUp = 1 << 11,
    R = 1 << 12,
    L = 1 << 13,
    XAxis = 0xff << 16,
    YAxis = 0xff << 24,
    All = 0xffffffff
}

export interface Input {
    getAxis(cont: number, axis: Axis): number;
    setAxis(cont: number, axis: Axis, value: number): void;
    setAxisVi(cont: number, axis: Axis, value: number): void;
    getButton(cont: number, button: Button): boolean;
    getButtonDown(cont: number, button: Button): boolean;
    getButtonUp(cont: number, button: Button): boolean;
    setButton(cont: number, button: Button, pressed: boolean): boolean;
    setButtonDown(cont: number, button: Button): boolean;
    getPluginFilter(cont: number): FilterFlags;
    setPluginFilter(cont: number, filter: FilterFlags): void;
}