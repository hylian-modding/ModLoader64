export const enum Keymod {
    None = 0x0000,
    LeftShift = 0x0001, RightShift = 0x0002,
    LeftCtrl = 0x0040, RightCtrl = 0x0080,
    LeftAlt = 0x0100, RightAlt = 0x0200,
    LeftGui = 0x0400, RightGui = 0x0800,
    Num = 0x1000, Caps = 0x2000, Mode = 0x4000,
    Ctrl = LeftCtrl | RightCtrl,
    Shift = LeftShift | RightShift,
    Alt = LeftAlt | RightAlt,
    Gui = LeftGui | RightGui
}

export const enum Keycode {
    Unknown = 0, Return = 13, Escape = 27, Backspace = 8, Tab, Space = 32, Exclaim, QuoteDbl, Hash, Percent = 37, Dollar = 36, Ampersand = 38, Quote,
    LeftParen, RightParen, Asterisk, Plus, Comma, Minus, Period, Slash, Num0, Num1, Num2, Num3, Num4, Num5, Num6, Num7, Num8, Num9, Colon, Semicolon,
    Less, Equals, Greater, Question, At, LeftBracket = 91, Backslash, RightBracket, Caret, Underscore, BackQuote, A = 97, B, C, D, E, F, G, H, I, J,
    K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, CapsLock = 1073741881, F1 = 1073741882, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
    PrintScreen = 1073741894, ScrollLock, Pause, Insert, Home, PageUp, Delete = 127, End = 1073741901, PageDown, Right, Left, Down, Up,
    NumLockClear = 1073741907, PadDivide, PadMultiply, PadMinus, PadPlus, PadEnter, Pad1, Pad2, Pad3, Pad4, Pad5, Pad6, Pad7, Pad8, Pad9, Pad0,
    PadPeriod, Application = 1073741925, Power, PadEquals, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24, Execute, Help, Menu, Select,
    Stop, Again, Undo, Cut, Copy, Paste, Find, Mute, VolumeUp, VolumeDown, PadComma = 1073741957, PadEqualsAS400, AltErase = 1073741977, SysReg,
    Cancel, Clear, Prior, Return2, Separato, Out, Oper, ClearAgain, CrSel, ExSel, Pad00 = 1073742000, Pad000, ThousandsSeparator, DecimalSeparator,
    CurrencyUnit, CurrencySubUnit, PadLeftParen, PadRightParen, PadLeftBrace, PadRightBrace, PadTab, PadBackspace, PadA, PadB, PadC, PadD, PadE, PadF,
    PadXor, PadPower, PadPercent, PadLess, PadGreater, PadAmpersand, PadDblAmpersand, PadVerticalBar, PadDblVerticalBar, PadColon, PadHash, PadSpace,
    PadAt, PadExclam, PadMemStore, PadMemRecall, PadMemClear, PadMemAdd, PadMemSubtract, PadMemMultiply, PadMemDivide, PadPlusMinus, PadClear,
    PadClearEntry, PadBinary, PadOctal, PadDecimal, PadHexadecimal, LeftCtrl = 1073742048, LeftShift, LeftAlt, LeftGui, RightCtrl, RightShift, RightAlt,
    RightGui, Mode = 1073742081, AudioNext = 1073742082, AudioPrev, AudioStop, AudioPlay, AudioMute, MediaSelect, Www, Mail, Calculator, Computer,
    ACSearch, ACHome, ACBack, ACForward, ACStop, ACRefresh, ACBookmarks, BrightnessDown = 1073742099, BrightnessUp, DisplaySwitch, KbdIllumToggle,
    KbdIllumDown, KbdIllumUp, Eject, Sleep, App1, App2, AudioRewind = 1073742109, AudioFastForward
}

export const enum Scancode {
    Unknown = 0, A = 4, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, Num1, Num2, Num3, Num4, Num5, Num6, Num7, Num8,
    Num9, Num0, Return, Escape, Backspace, Tab, Space, Minus, Equals, LeftBracket, RightBracket, Backslash, NonUsHash, Semicolon, Apostrophe, Grave,
    Comma, Period, Slash, CapsLock, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, PrintScreen, ScrollLock, Pause, Insert, Home, PageUp, Delete,
    End, PageDown, Right, Left, Down, Up, NumLockClear, PadDivide, PadMultiply, PadMinus, PadPlus, PadEnter, Pad1, Pad2, Pad3, Pad4, Pad5, Pad6, Pad7,
    Pad8, Pad9, Pad0, PadPeriod, NonUsBackslash, Application, Power, PadEquals, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24, Execute,
    Help, Menu, Select, Stop, Again, Undo, Cut, Copy, Paste, Find, Mute, VolumeUp, VolumeDown, LockingCapsLock, LockingNumLock, LockingScrollLock,
    PadComma, PadEqualsAS400, International1, International2, International3, International4, International5, International6, International7,
    International8, International9, Lang1, Lang2, Lang3, Lang4, Lang5, Lang6, Lang7, Lang8, Lang9, AltErase, SysReq, Cancel, Clear, Prior, Return2,
    Separator, Out, Oper, ClearAgain, CrSel, ExSel, Pad00 = 176, Pad000, ThousandsSeparator, DecimalSeparator, CurrencyUnit, CurrencySubUnit,
    PadLeftParen, PadRightParen, PadLeftBrace, PadRightBrace, PadTab, PadBackspace, PadA, PadB, PadC, PadD, PadE, PadF, PadXor, PadPower, PadPercent,
    PadLess, PadGreater, PadAmpersand, PadDblAmpersand, PadVerticalBar, PadDblVerticalBar, PadColon, PadHash, PadSpace, PadAt, PadExclam, PadMemStore,
    PadMemRecall, PadMemClear, PadMemAdd, PadMemSubtract, PadMemMultiply, PadMemDivide, PadPlusMinux, PadClear, PadClearEntry, PadBinary, PadOctal,
    PadDecimal, PadHexadecimal, LeftCtrl = 224, LeftShift, LeftAlt, LeftGui, RightCtrl, RightShift, RightAlt, RightGui, Mode = 257, AudioNext, AudioPrev,
    AudioStop, AudioPlay, AudioMute, MediaSelect, Www, Mail, Calculator, Computer, ACSearch, ACHome, ACBack, ACForward, ACStop, ACRefresh, ACBookmarks,
    BrightnessDown, BrightnessUp, DisplaySwitch, KbdIllumToggle, KbdIllumDown, KbdIllumUp, Eject, Sleep, App1, App2, AudioRewind, AudioFastForward
}

export interface Keybd {
    getKeyFromName(name: string): Keycode;
    getKeyFromScancode(scancode: Scancode): Keycode;
    getKeyName(key: Keycode): string;
    getKeyState(scancode: Scancode): boolean;
    getModState(): Keymod;
    getScancodeFromKey(key: Keycode): Scancode;
    getScancodeFromName(name: string): Scancode;
    getScancodeName(scancode: Scancode): string;
}