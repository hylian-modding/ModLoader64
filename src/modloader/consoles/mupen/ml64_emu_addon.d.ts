export type vec2 = { x: number, y: number };
export type vec4 = { x: number, y: number, z: number, w: number };

export module Frontend {
    export interface StartInfo {
        windowTitle: string;
        windowWidth: number;
        windowHeight: number;
        windowIcon?: Buffer;
        corePlugin: string;
        rspPlugin: string;
        videoPlugin: string;
        audioPlugin: string;
        inputPlugin: string;
        configDir: string;
        dataDir: string;
    }

    export interface VideoOutputInfo {
        screenWidth: number;
        screenHeight: number;
        left: number;
        top: number;
        width: number;
        height: number;
    }

    export const enum MessageBoxIcon {
        Error,
        Warning,
        Information
    }

    export function startup(startInfo: StartInfo): void;
    export function shutdown(): void;
    export function doEvents(): void;
    export function execute(): void;
    export function stop(): void;
    // @ts-ignore
    export function on(which: string, callback: any);

    export function getVideoOutputInfo(): VideoOutputInfo;
    export function toggleFullScreen(): void;
    export function captureFrame(): void;
    export function getFrameTexture(): Gfx.Texture;
    export function createResourcesNextVi(): void;
    export function takeNextScreenshot(): void;
    export function getMainWindow(): SDL.WindowRef;
    export function showMessageBox(parent: SDL.WindowRef | undefined, icon: MessageBoxIcon,
        title: string, mainInstruction: string, content: string): void;

    export function getDefaultFont(): ImGui.FontRef;
    export function setDefaultFont(font: ImGui.FontRef): void;
    export function getDefaultMonoFont(): ImGui.FontRef;
    export function setDefaultMonoFont(font: ImGui.FontRef): void;

    export function openInputConfig(): void;
    export function closeInputConfig(): void;
    export function isInputConfigOpen(): boolean;
    export function openCheatConfig(): void;
    export function closeCheatConfig(): void;
    export function isCheatConfigOpen(): boolean;
    export function setCheatsCRC(crc: string): void;
    export function disableAllCheats(): void;
    export function openMemViewer(): void;
    export function closeMemViewer(): void;
    export function isMemViewerOpen(): boolean;
}

export module M64p {
    export module Config {
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

        export function saveFile(): void;
        export function hasUnsavedChanges(): boolean;
        export function listSections(): string[];
        export function openSection(name: string): Section;

        export function getSharedDataFilePath(file: string): string;
        export function getUserConfigPath(): string;
        export function getUserDataPath(): string;
        export function getUserCachePath(): string;
    }

    export module Debugger {
        export const enum RunState {
            Paused, Stepping, Running
        }

        export const enum Register {
            r0, at, v0, v1, a0, a1, a2, a3,
            t0, t1, t2, t3, t4, t5, t6, t7,
            s0, s1, s2, s3, s4, s5, s6, s7,
            t8, t9, k0, k1, gp, sp, fp, ra
        }

        export const enum BpFlags {
            Enabled = 0x01, Read = 0x02, Write = 0x04, Exec = 0x08, Log = 0x10,
            All = Enabled | Read | Write | Exec | Log,
            RW = Enabled | Read | Write,
            RWX = Enabled | Read | Write | Exec
        }

        export interface BpStruct {
            address: number,
            endAddress: number,
            flags: BpFlags
        }

        export interface BpTriggerInfo {
            flags: BpFlags,
            address: number
        }

        export const enum MemType {
            NoMem, Nothing, RDRAM, RDRAMReg, RSPMem, RSPReg, RSP, DP, DPS, VI, AI, PI,
            RI, SI, FlashRAMStat, ROM, PIF, MI, Breakpoint
        }

        export const enum MemFlags {
            Readable = 0x01, Writable = 0x02,
            ReadableEmuOnly = 0x04, WritableEmuOnly = 0x08
        }

        export function isSupported(): boolean;
        export function isEnabled(): boolean;
        export function isInitialized(): boolean;

        export function getRunState(): RunState;
        export function setRunState(state: RunState): void;
        export function step(): void;
        export function decodeOp(inst: number, pc: number): string;
        export function memRead64(addr: number): number;
        export function memRead32(addr: number): number;
        export function memRead16(addr: number): number;
        export function memRead8(addr: number): number;
        export function memWrite64(addr: number, val: number): void;
        export function memWrite32(addr: number, val: number): void;
        export function memWrite16(addr: number, val: number): void;
        export function memWrite8(addr: number, val: number): void;
        export function bpCount(): number;
        export function bpLookup(addr: number, size: number, flags: BpFlags): number;
        export function bpAddAddress(addr: number): number;
        export function bpAddStruct(bp: BpStruct): number;
        export function bpReplace(index: number, bp: BpStruct): void;
        export function bpRemoveAddress(addr: number): void;
        export function bpRemoveIndex(index: number): void;
        export function bpEnable(index: number): void;
        export function bpDisable(index: number): void;
        export function bpCheck(addr: number): number;
        export function bpTriggeredBy(): BpTriggerInfo;
        export function getPrevPC(): number;
        export function readPC(): number;
        export function writePC(pc: number): void;
        export function readRegister(reg: Register): number;
        export function writeRegister(reg: Register, val: number): void;
        export function virtualToPhysical(addr: number): number;
        export function getMemType(addr: number): MemType;
        export function getMemFlags(addr: number): MemFlags;
    }

    export module Input {
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

        export function getAxis(cont: number, axis: Axis): number;
        export function setAxis(cont: number, axis: Axis, value: number): void;
        export function setAxisVi(cont: number, axis: Axis, value: number): void;
        export function getButton(cont: number, button: Button): boolean;
        export function getButtonDown(cont: number, button: Button): boolean;
        export function getButtonUp(cont: number, button: Button): boolean;
        export function setButton(cont: number, button: Button, pressed: boolean): boolean;
        export function setButtonDown(cont: number, button: Button): boolean;
        export function getPluginFilter(cont: number): FilterFlags;
        export function setPluginFilter(cont: number, filter: FilterFlags): void;
    }

    export module Memory {
        export function getRdramBuffer(): ArrayBuffer;
        export function getRomBuffer(): ArrayBuffer;
        export function invalidateCachedCode(): void;

        export function rdramRead8(addr: number): number;
        export function rdramRead16(addr: number): number;
        export function rdramRead32(addr: number): number;
        export function rdramRead64(addr: number): number;
        export function rdramReadBigInt64(addr: number): BigInt;
        export function rdramReadS8(addr: number): number;
        export function rdramReadS16(addr: number): number;
        export function rdramReadS32(addr: number): number;
        export function rdramReadS64(addr: number): number;
        export function rdramReadBigIntS64(addr: number): BigInt;
        export function rdramReadF32(addr: number): number;
        export function rdramReadF64(addr: number): number;
        export function rdramReadBuffer(addr: number, len: number): Buffer;
        export function rdramWrite8(addr: number, val: number): void;
        export function rdramWrite16(addr: number, val: number): void;
        export function rdramWrite32(addr: number, val: number): void;
        export function rdramWrite64(addr: number, val: number): void;
        export function rdramWriteBigInt64(addr: number, val: BigInt): void;
        export function rdramWriteF32(addr: number, val: number): void;
        export function rdramWriteBuffer(addr: number, buf: Buffer): void;
        export function romRead8(addr: number): number;
        export function romRead16(addr: number): number;
        export function romRead32(addr: number): number;
        export function romReadS8(addr: number): number;
        export function romReadS16(addr: number): number;
        export function romReadS32(addr: number): number;
        export function romReadBuffer(addr: number, len: number): Buffer;
        export function romWrite8(addr: number, val: number): void;
        export function romWrite16(addr: number, val: number): void;
        export function romWrite32(addr: number, val: number): void;
        export function romWriteBuffer(addr: number, buf: Buffer): void;
        export function rdramReadBit8(addr: number, bitoff: number): boolean;
        export function rdramReadBits8(addr: number): Buffer;
        export function rdramReadBitsBuffer(addr: number, len: number): Buffer;
        export function rdramWriteBit8(addr: number, bitoff: number, set: boolean): void;
        export function rdramWriteBits8(addr: number, buf: Buffer): void;
        export function rdramWriteBitsBuffer(addr: number, buf: Buffer): void;

        export function dereferencePointer(addr: number): number;
        export function rdramReadPtr8(addr: number, off: number): number;
        export function rdramReadPtr16(addr: number, off: number): number;
        export function rdramReadPtr32(addr: number, off: number): number;
        export function rdramReadPtrS8(addr: number, off: number): number;
        export function rdramReadPtrS16(addr: number, off: number): number;
        export function rdramReadPtrS32(addr: number, off: number): number;
        export function rdramReadPtrF32(addr: number, off: number): number;
        export function rdramReadPtrBuffer(addr: number, off: number, len: number): Buffer;
        export function rdramWritePtr8(addr: number, off: number, val: number): void;
        export function rdramWritePtr16(addr: number, off: number, val: number): void;
        export function rdramWritePtr32(addr: number, off: number, val: number): void;
        export function rdramWritePtrF32(addr: number, off: number, val: number): void;
        export function rdramWritePtrBuffer(addr: number, off: number, buf: Buffer): void;
        export function rdramReadPtrBit8(addr: number, off: number, bitoff: number): boolean;
        export function rdramReadPtrBits8(addr: number, off: number): Buffer;
        export function rdramReadPtrBitsBuffer(addr: number, off: number, len: number): Buffer;
        export function rdramWritePtrBit8(addr: number, off: number, bitoff: number, set: boolean): void;
        export function rdramWritePtrBits8(addr: number, off: number, buf: Buffer): void;
        export function rdramWritePtrBitsBuffer(addr: number, off: number, buf: Buffer): void;

        export function bitCount8(value: number): number;
        export function bitCount16(value: number): number;
        export function bitCount32(value: number): number;
        export function bitCountBuffer(buf: Buffer, off: number, len: number): void;
    }

    export interface RomHeader {
        init_PI_BSB_DOM1_LAT_REG: number;
        init_PI_BSB_DOM1_PGS_REG: number;
        init_PI_BSB_DOM1_PWD_REG: number;
        init_PI_BSB_DOM1_PGS_REG2: number;
        clockRate: number;
        pc: number;
        release: number;
        crc1: number;
        crc2: number;
        name: string;
        manufacturerId: number;
        cartridgeId: number;
        countryCode: number;
    }

    export interface RomSettings {
        goodname: string;
        md5: string;
        savetype: number;
        status: number;
        players: number;
        rumble: number;
        transferpak: number;
        mempak: number;
        biopak: number;
    }

    export interface CheatCode {
        address: number;
        value: number;
    }

    export const enum EmuState {
        Stopped = 1,
        Running,
        Paused
    }

    export const enum VideoMode {
        None = 1,
        Windowed,
        FullScreen
    }

    export interface VideoSize {
        width: number,
        height: number
    }

    export const enum CoreParam {
        EmuState = 1,
        VideoMode,
        SaveStateSlot,
        SpeedFactor,
        SpeedLimiter,
        VideoSize,
        AudioVolume,
        AudioMute,
        InputGameShark,
        StateLoadComplete,
        StateSaveComplete
    }

    export const enum CoreEvent {
        ChangeWindow,
        StateSetSlot,
        Stop,
        StateSave,
        StateLoad,
        StateIncSlot,
        SoftReset,
        SpeedDown,
        SpeedUp,
        TakeNextScreenshot,
        TogglePause,
        VolumeMute,
        VolumeUp,
        VolumeDown,
        SetFastForward,
        AdvanceOne,
        SetGameShark,
        UnsetFastForward,
        UnsetGameShark
    }

    export function addCheat(name: string, codes: CheatCode[]): void;
    export function setCheatEnabled(name: string, enabled: boolean): void;
    export function getRomSettingsFromCRCs(crc1: number, crc2: number): RomSettings;
    export function openRomFromFile(path: string, newLen?: number): void;
    export function openRomFromMemory(data: Buffer, newLen?: number): void;
    export function closeRom(): void;
    export function getRomHeader(): RomHeader;
    export function getRomSettings(): RomSettings;
    export function pause(): void;
    export function resume(): void;
    export function setStateSlot(slot: number): void;
    export function loadState(): void;
    export function loadStateFromSlot(slot: number): void;
    export function loadStateFromFile(path: string): void;
    export function saveState(): void;
    export function saveStateToSlot(slot: number): void;
    export function saveStateToFile(path: string): void;
    export function takeNextScreenshot(): void;
    export function softReset(): void;
    export function hardReset(): void;
    export function advanceFrame(): void;
    export function getEmuState(): EmuState;
    export function getVideoMode(): VideoMode;
    export function getStateSlot(): number;
    export function getSpeedFactor(): number;
    export function setSpeedFactor(factor: number): void;
    export function isSpeedLimiterEnabled(): boolean;
    export function setSpeedLimiterEnabled(enabled: boolean): void;
    export function getVideoSize(): VideoSize;
    export function getAudioVolume(): number;
    export function setAudioVolume(volume: number): void;
    export function isAudioMuted(): boolean;
    export function setAudioMuted(muted: boolean): void;
    export function isGSButtonPressed(): boolean;
    export function setGSButtonPressed(pressed: boolean): void;

    export function hasInputFocus(): boolean;
    export function getNumElapsedFrames(): number;
    export function AddHiresTexturePath(path: string): void;
    export function RemoveHiresTexturePath(path: string): void;
}

export module Yaz0 {
    export function encode(buf: Buffer): Buffer;
    export function decode(buf: Buffer): Buffer;
}

export module SDL {
    export const enum WindowFlags {
        FullScreen = 0x1, Shown = 0x4, Hidden = 0x8, Borderless = 0x10, Resizable = 0x20, Minimized = 0x40, Maximized = 0x80,
        InputGrabbed = 0x100, InputFocus = 0x200, MouseFocus = 0x400, FullScreenDesktop = (FullScreen | 0x1000), MouseCapture = 0x4000
    }

    export const enum FullScreenMode {
        FullScreen = 0x00000001,
        DesktopFullScreen = (FullScreen | 0x00001000)
    }

    interface WindowRef {
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

    export module Keybd {
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

        export function getKeyFromName(name: string): Keycode;
        export function getKeyFromScancode(scancode: Scancode): Keycode;
        export function getKeyName(key: Keycode): string;
        export function getKeyState(scancode: Scancode): boolean;
        export function getModState(): Keymod;
        export function getScancodeFromKey(key: Keycode): Scancode;
        export function getScancodeFromName(name: string): Scancode;
        export function getScancodeName(scancode: Scancode): string;
    }

    export module Mouse {
        export const enum Button {
            Left = 1,
            Middle,
            Right,
            X1,
            X2
        }

        export function capture(enabled: boolean): void;
        export function getButtonMask(button: Button): number;
        export function getGlobalPosition(): vec2;
        export function getGlobalButtons(): number;
        export function getPosition(): vec2;
        export function getButtons(): number;
        export function getRelativeMode(): boolean;
        export function getRelativePosition(): vec2;
        export function getRelativeButtons(): number;
        export function setRelativeMode(enabled: boolean): void;
        export function warpGlobal(pos: vec2): void;
        export function warpInWindow(window: WindowRef, pos: vec2): void;
        export function showCursor(): void;
        export function hideCursor(): void;
        export function isCursorVisible(): boolean;
    }

    export module Clipboard {
        export function getText(): string;
        export function hasText(): boolean;
        export function setText(text: string): void;
    }
}

export module ImGui {
    export type bool_ref = boolean[];
    export type number_ref = number[];
    export type string_ref = string[];

    export const enum WindowFlags {
        None = 0, NoTitleBar = 1 << 0, NoResize = 1 << 1, NoMove = 1 << 2, NoScrollbar = 1 << 3, NoScrollWithMouse = 1 << 4,
        NoCollapse = 1 << 5, AlwaysAutoResize = 1 << 6, NoBackground = 1 << 7, NoSavedSettings = 1 << 8, NoMouseInputs = 1 << 9,
        MenuBar = 1 << 10, HorizontalScrollbar = 1 << 11, NoFocusOnAppearing = 1 << 12, NoBringToFrontOnFocus = 1 << 13,
        AlwaysVerticalScrollbar = 1 << 14, AlwaysHorizontalScrollbar = 1 << 15, AlwaysUseWindowPadding = 1 << 16, NoNavInputs = 1 << 18,
        NoNavFocus = 1 << 19, UnsavedDocument = 1 << 20, NoDocking = 1 << 21,
        NoNav = NoNavInputs | NoNavFocus,
        NoDecoration = NoTitleBar | NoResize | NoScrollbar | NoCollapse,
        NoInputs = NoMouseInputs | NoNavInputs | NoNavFocus
    }

    export const enum InputTextFlags {
        None = 0, CharsDecimal = 1 << 0, CharsHexadecimal = 1 << 1, CharsUppercase = 1 << 2, CharsNoBlank = 1 << 3, AutoSelectAll = 1 << 4,
        EnterReturnsTrue = 1 << 5, AllowTabInput = 1 << 10, CtrlEnterForNewLine = 1 << 11, NoHorizontalScroll = 1 << 12, AlwaysInsertMode = 1 << 13,
        ReadOnly = 1 << 14, Password = 1 << 15, NoUndoRedo = 1 << 16, CharsScientific = 1 << 17
    }

    export const enum TreeNodeFlags {
        None = 0, Selected = 1 << 0, Framed = 1 << 1, AllowItemOverlap = 1 << 2, NoTreePushOnOpen = 1 << 3, NoAutoOpenOnLog = 1 << 4,
        DefaultOpen = 1 << 5, OpenOnDoubleClick = 1 << 6, OpenOnArrow = 1 << 7, Leaf = 1 << 8, Bullet = 1 << 9, FramePadding = 1 << 10,
        SpanAvailWidth = 1 << 11, SpanFullWidth = 1 << 12, NavLeftJumpsBackHere = 1 << 13,
        CollapsingHeader = Framed | NoTreePushOnOpen | NoAutoOpenOnLog
    }

    export const enum PopupFlags {
        None = 0, MouseButtonLeft = 0, MouseButtonRight = 1, MouseButtonMiddle = 2, MouseButtonMask_ = 0x1F, MouseButtonDefault_ = 1,
        NoOpenOverExistingPopup = 1 << 5, NoOpenOverItems = 1 << 6, AnyPopupId = 1 << 7, AnyPopupLevel = 1 << 8,
        AnyPopup = AnyPopupId | AnyPopupLevel
    }

    export const enum SelectableFlags {
        None = 0, DontClosePopups = 1 << 0, SpanAllColumns = 1 << 1, AllowDoubleClick = 1 << 2, Disabled = 1 << 3, AllowItemOverlap = 1 << 4
    }

    export const enum ComboFlags {
        None = 0, PopupAlignLeft = 1 << 0, HeightSmall = 1 << 1, HeightRegular = 1 << 2, HeightLarge = 1 << 3, HeightLargest = 1 << 4,
        NoArrowButton = 1 << 5, NoPreview = 1 << 6
    }

    export const enum TabBarFlags {
        None = 0, Reorderable = 1 << 0, AutoSelectNewTabs = 1 << 1, TabListPopupButton = 1 << 2, NoCloseWithMiddleMouseButton = 1 << 3,
        NoTabListScrollingButtons = 1 << 4, NoTooltip = 1 << 5, FittingPolicyResizeDown = 1 << 6, FittingPolicyScroll = 1 << 7
    }

    export const enum TabItemFlags {
        None = 0, UnsavedDocument = 1 << 0, SetSelected = 1 << 1, NoCloseWithMiddleMouseButton = 1 << 2, NoPushId = 1 << 3, NoTooltip = 1 << 4
    }

    export const enum FocusedFlags {
        None = 0, ChildWindows = 1 << 0, RootWindow = 1 << 1, AnyWindow = 1 << 2,
        RootAndChildWindows = RootWindow | ChildWindows
    }

    export const enum HoveredFlags {
        None = 0, ChildWindows = 1 << 0, RootWindow = 1 << 1, AnyWindow = 1 << 2, AllowWhenBlockedByPopup = 1 << 3,
        AllowWhenBlockedByActiveItem = 1 << 5, AllowWhenOverlapped = 1 << 6, AllowWhenDisabled = 1 << 7,
        RectOnly = AllowWhenBlockedByPopup | AllowWhenBlockedByActiveItem | AllowWhenOverlapped,
        RootAndChildWindows = RootWindow | ChildWindows
    }

    export const enum DockNodeFlags {
        None = 0, KeepAliveOnly = 1 << 0, NoDockingInCentralNode = 1 << 2, PassthruCentralNode = 1 << 3, NoSplit = 1 << 4, NoResize = 1 << 5,
        AutoHideTabBar = 1 << 6
    }

    export const enum Dir {
        None = -1, Left = 0, Right = 1, Up = 2, Down = 3
    }

    export const enum ConfigFlags {
        None = 0, NavEnableKeyboard = 1 << 0, NavEnableGamepad = 1 << 1, NavEnableSetMousePos = 1 << 2, NavNoCaptureKeyboard = 1 << 3,
        NoMouse = 1 << 4, NoMouseCursorChange = 1 << 5,
        DockingEnable = 1 << 6,
        ViewportsEnable = 1 << 10, DpiEnableScaleViewports = 1 << 14, DpiEnableScaleFonts = 1 << 15,
        IsSRGB = 1 << 20, IsTouchScreen = 1 << 21
    }

    export const enum BackendFlags {
        None = 0, HasGamepad = 1 << 0, HasMouseCursors = 1 << 1, HasSetMousePos = 1 << 2, RendererHasVtxOffset = 1 << 3,
        PlatformHasViewports = 1 << 10, HasMouseHoveredViewport =1 << 11, RendererHasViewports = 1 << 12
    }

    export const enum Col {
        Text, TextDisabled, WindowBg, ChildBg, PopupBg, Border, BorderShadow, FrameBg, FrameBgHovered, FrameBgActive, TitleBg, TitleBgActive,
        TitleBgCollapsed, MenuBarBg, ScrollbarBg, ScrollbarGrab, ScrollbarGrabHovered, ScrollbarGrabActive, CheckMark, SliderGrab, SliderGrabActive,
        Button, ButtonHovered, ButtonActive, Header, HeaderHovered, HeaderActive, Separator, SeparatorHovered, SeparatorActive, ResizeGrip,
        ResizeGripHovered, ResizeGripActive, Tab, TabHovered, TabActive, TabUnfocused, TabUnfocusedActive, DockingPreview, DockingEmptyBg, PlotLines,
        PlotLinesHovered, PlotHistogram, PlotHistogramHovered, TextSelectedBg, DragDropTarget, NavHighlight, NavWindowingHighlight, NavWindowingDimBg,
        ModalWindowDimBg
    }

    export const enum StyleVar {
        Alpha, WindowPadding, WindowRounding, WindowBorderSize, WindowMinSize, WindowTitleAlign, ChildRounding, ChildBorderSize, PopupRounding,
        PopupBorderSize, FramePadding, FrameRounding, FrameBorderSize, ItemSpacing, ItemInnerSpacing, IndentSpacing, ScrollbarSize, ScrollbarRounding,
        GrabMinSize, GrabRounding, TabRounding, ButtonTextAlign, SelectableTextAlign
    }

    export const enum ButtonFlags {
        None = 0, MouseButtonLeft = 1 << 0, MouseButtonRight = 1 << 1, MouseButtonMiddle = 1 << 2
    }

    export const enum ColorEditFlags {
        None = 0, NoAlpha = 1 << 1, NoPicker = 1 << 2, NoOptions = 1 << 3, NoSmallPreview = 1 << 4, NoInputs = 1 << 5, NoTooltip = 1 << 6,
        NoLabel = 1 << 7, NoSidePreview = 1 << 8, NoDragDrop = 1 << 9, NoBorder = 1 << 10,
        AlphaBar = 1 << 16, AlphaPreview = 1 << 17, AlphaPreviewHalf = 1 << 18, HDR = 1 << 19, DisplayRGB = 1 << 20, DisplayHSV = 1 << 21,
        DisplayHex = 1 << 22, Uint8 = 1 << 23, Float = 1 << 24, PickerHueBar = 1 << 25, PickerHueWheel = 1 << 26, InputRGB = 1 << 27,
        InputHSV = 1 << 28
    }

    export const enum SliderFlags {
        None = 0, ClampOnInput = 1 << 4, Logarithmic = 1 << 5, NoRoundToFormat = 1 << 6, NoInput = 1 << 7,
    }

    export const enum MouseButton {
        Left = 0, Right = 1, Middle = 2
    }

    export const enum MouseCursor {
        None = -1, Arrow = 0, TextInput, ResizeAll, ResizeNS, ResizeEW, ResizeNESW, ResizeNWSE, Hand, NotAllowed
    }

    export const enum Cond {
        None = 0, Always = 1 << 0, Once = 1 << 1, FirstUseEver = 1 << 2, Appearing = 1 << 3
    }

    export const enum DrawCornerFlags {
        None = 0, TopLeft = 1 << 0, TopRight = 1 << 1, BotLeft = 1 << 2, BotRight = 1 << 3, Top = TopLeft | TopRight, Bot = BotLeft | BotRight,
        Left = TopLeft | BotLeft, Right = TopRight | BotRight, All = 0xF
    }

    export const enum DrawListFlags {
        None = 0, AntiAliasedLines = 1 << 0, AntiAliasedLinesUseTex = 1 << 1, AntiAliasedFill = 1 << 2, AllowVtxOffset = 1 << 3
    }

    export const enum ViewportFlags {
        None = 0, NoDecoration = 1 << 0, NoTaskBarIcon = 1 << 1, NoFocusOnAppearing = 1 << 2, NoFocusOnClick = 1 << 3, NoInputs = 1 << 4,
        NoRendererClear = 1 << 5, TopMost = 1 << 6, Minimized = 1 << 7, NoAutoMerge = 1 << 8, CanHostOtherWindows = 1 << 9
    }

    export interface DrawListRef {
        flags: DrawListFlags;

        pushClipRect(clipRectMin: vec2, clipRectMax: vec2, intersectWithCurrentClipRect?: boolean): void;
        pushClipRectFullScreen(): void;
        popClipRect(): void;
        pushTextureId(textureId: number): void;
        popTextureId(): void;
        getClipRectMin(): vec2;
        getClipRectMax(): vec2;

        addLine(p1: vec2, p2: vec2, col: vec4, thickness?: number): void;
        addRect(pMin: vec2, pMax: vec2, col: vec4, rounding?: number, roundingCorners?: DrawCornerFlags, thickness?: number): void;
        addRectFilled(pMin: vec2, pMax: vec2, col: vec4, rounding?: number, roundingCorners?: DrawCornerFlags): void;
        addRectFilledMultiColor(pMin: vec2, pMax: vec2, colUprLeft: vec4, colUprRight: vec4, colBotRight: vec4, colBotLeft: vec4): void;
        addQuad(p1: vec2, p2: vec2, p3: vec2, p4: vec2, col: vec4, thickness?: number): void;
        addQuadFilled(p1: vec2, p2: vec2, p3: vec2, p4: vec2, col: vec4): void;
        addTriangle(p1: vec2, p2: vec2, p3: vec2, col: vec4, thickness?: number): void;
        addTriangleFilled(p1: vec2, p2: vec2, p3: vec2, col: vec4): void;
        addCircle(center: vec2, radius: number, col: vec4, numSegments?: number, thickness?: number): void;
        addCircleFilled(center: vec2, radius: number, col: vec4, numSegments?: number): void;
        addNgon(center: vec2, radius: number, col: vec4, numSegments: number, thickness?: number): void;
        addNgonFilled(center: vec2, radius: number, col: vec4, numSegments: number): void;
        addText(pos: vec2, col: vec4, text: string): void;
        addTextEx(font: FontRef, fontSize: number, pos: vec2, col: vec4, text: string, wrapWidth?: number): void;
        addPolyline(points: vec2[], col: vec4, closed: boolean, thickness: number): void;
        addConvexPolyFilled(points: vec2[], col: vec4): void;
        addBezierCurve(p1: vec2, p2: vec2, p3: vec2, p4: vec2, col: vec4, thickness: number, numSegments?: number): void;

        addImage(textureId: number, pMin: vec2, pMax: vec2, uvMin?: vec2, uvMax?: vec2, col?: vec4): void;
        addImageQuad(textureId: number, p1: vec2, p2: vec2, p3: vec2, p4: vec2, uv1?: vec2, uv2?: vec2, uv3?: vec2, uv4?: vec2, col?: vec4): void;
        addImageRounded(textureId: number, pMin: vec2, pMax: vec2, uvMin: vec2, uvMax: vec2, col: vec4, rounding: number, roundingCorners?: DrawCornerFlags): void;

        pathClear(): void;
        pathLineTo(pos: vec2): void;
        pathLineToMergeDuplicate(pos: vec2): void;
        pathFillConvex(col: vec4): void;
        pathStroke(col: vec4, closed: boolean, thickness?: number): void;
        pathArcTo(center: vec2, radius: number, aMin: number, aMax: number, numSegments?: number): void;
        pathArcToFast(center: vec2, radius: number, aMin12: number, aMax12: number): void;
        pathBezierCurveTo(p2: vec2, p3: vec2, p4: vec2, numSegments?: number): void;
        pathRect(rectMin: vec2, rectMax: vec2, rounding?: number, roundingCorners?: DrawListFlags): void;

        addDrawCmd(): void;
    }

    export interface FontAtlasRef {
        addFontFromFile(filename: string, sizePixels: number): FontRef;
        addFontFromMemory(font: Buffer, sizePixels: number): FontRef;
        addFontFromMemoryCompressed(compressedFont: Buffer, sizePixels: number): FontRef;
    }

    export interface FontRef {
        size: number;
        scale: number;
    }

    export interface IoRef {
        configFlags: ConfigFlags;
        backendFlags: BackendFlags;
        displaySize: vec2;
        deltaTime: number;
        iniSavingRate: number;
        iniFilename?: string;
        logFilename?: string;
        mouseDoubleClickTime: number;
        mouseDoubleClickMaxDist: number;
        mouseDragThreshold: number;
        keyRepeatDelay: number;
        keyRepeatRate: number;

        fonts: FontAtlasRef;
        fontGlobalScale: number;
        fontAllowUserScaling: boolean;
        fontDefault: FontRef;
        displayFramebufferScale: vec2;

        configDockingNoSplit: boolean;
        configDockingWithShift: boolean;
        configDockingAlwaysTabBar: boolean;
        configDockingTransparentPayload: boolean;

        configViewportsNoAutoMerge: boolean;
        configViewportsNoTaskBarIcon: boolean;
        configViewportsNoDecoration: boolean;
        configViewportsNoDefaultParent: boolean;

        configMouseDrawCursor: boolean;
        configInputTextCursorBlink: boolean;
        configWindowsResizeFromEdges: boolean;
        configWindowsMoveFromTitleBarOnly: boolean;
        configWindowsMemoryCompactTimer: boolean;

        backendPlatformName: string;
        backendRendererName: string;

        wantCaptureMouse: boolean;
        wantCaptureKeyboard: boolean;
        wantTextInput: boolean;
        wantSetMousePos: boolean;
        wantSaveIniSettings: boolean;
        navActive: boolean;
        navVisible: boolean;
        framerate: number;
        metricsRenderVertices: number;
        metricsRenderWindows: number;
        metricsActiveWindows: number;
        metricsActiveAllocations: number;
        mouseDelta: vec2;
        mouseWheel: vec2;
    }

    export interface StyleRef {
        alpha: number;
        windowPadding: vec2;
        windowRounding: number;
        windowBorderSize: number;
        windowMinSize: vec2;
        windowTitleAlign: vec2;
        windowMenuButtonPosition: Dir;
        childRounding: number;
        childBorderSize: number;
        popupRounding: number;
        popupBorderSize: number;
        framePadding: vec2;
        frameRounding: number;
        frameBorderSize: number;
        itemSpacing: vec2;
        itemInnerSpacing: vec2;
        touchExtraPadding: vec2;
        indentSpacing: number;
        columnsMinSpacing: number;
        scrollbarSize: number;
        scrollbarRounding: number;
        grabMinSize: number;
        grabRounding: number;
        logSliderDeadzone: number;
        tabRounding: number;
        tabBorderSize: number;
        tabMinWidthForUnselectedCloseButton: number;
        colorButtonPosition: Dir;
        buttonTextAlign: vec2;
        selectableTextAlign: vec2;
        displayWindowPadding: vec2;
        displaySafeAreaPadding: vec2;
        mouseCursorScale: number;
        antiAliasedLines: boolean;
        antiAliasedFill: boolean;
        curveTessallationTol: number;
        circleSegmentMaxError: number;

        getColor(index: Col): vec4;
        setColor(index: Col, col: vec4): void;
        scaleAllSizes(scaleFactor: number): void;
    }

    export interface ViewportRef {
        id: number;
        flags: ViewportFlags;
        pos: vec2;
        size: vec2;
        workOffsetMin: vec2;
        workOffsetMax: vec2;
        dpiScale: number;
        parentViewportId: number;
        platformHandle?: SDL.WindowRef;
        center: vec2;
        workPos: vec2;
        workSize: vec2;
    }

    export function getIo(): IoRef;
    export function getStyle(): StyleRef;

    export function showDemoWindow(open?: bool_ref): void;
    export function showAboutWindow(open?: bool_ref): void;
    export function showMetricsWindow(open?: bool_ref): void;
    export function showStyleEditor(): void;
    export function showStyleSelector(): void;
    export function showFontSelector(): void;
    export function showUserGuide(): void;
    export function getVersion(): string;

    export function styleColorsDark(): void;
    export function styleColorsClassic(): void;
    export function styleColorsLight(): void;

    export function begin(name: string, open?: bool_ref, flags?: WindowFlags): boolean;
    export function end(): void;

    export function beginChild(strId: string, size?: vec2, border?: boolean, flags?: WindowFlags): boolean;
    export function beginChild(id: number, size?: vec2, border?: boolean, flags?: WindowFlags): boolean;
    export function endChild(): void;

    export function isWindowAppearing(): boolean;
    export function isWindowCollapsed(): boolean;
    export function isWindowFocused(flags?: FocusedFlags): boolean;
    export function isWindowHovered(flags?: HoveredFlags): boolean;
    export function getWindowDrawList(): DrawListRef;
    export function getWindowDpiScale(): number;
    export function getWindowViewport(): ViewportRef;
    export function getWindowPos(): vec2;
    export function getWindowSize(): vec2;
    export function getWindowWidth(): number;
    export function getWindowHeight(): number;

    export function setNextWindowPos(pos: vec2, cond?: Cond, pivot?: vec2): void;
    export function setNextWindowSize(size: vec2, cond?: Cond): void;
    export function setNextWindowSizeConstraints(sizeMin: vec2, sizeMax: vec2): void;
    export function setNextWindowContentSize(size: vec2): void;
    export function setNextWindowCollapsed(collapsed: boolean, cond?: Cond): void;
    export function setNextWindowFocus(): void;
    export function setNextWindowBgAlpha(alpha: number): void;
    export function setNextWindowViewport(viewportId: number): void;
    export function setWindowPos(pos: vec2, cond?: Cond): void;
    export function setWindowSize(size: vec2, cond?: Cond): void;
    export function setWindowCollapsed(collapsed: boolean, cond?: Cond): void;
    export function setWindowFocus(): void;
    export function setWindowFontScale(scale: number): void;
    export function setWindowPos(name: string, pos: vec2, cond?: Cond): void;
    export function setWindowSize(name: string, size: vec2, cond?: Cond): void;
    export function setWindowCollapsed(name: string, collapsed: boolean, cond?: Cond): void;
    export function setWindowFocus(name: string): void;

    export function getContentRegionMax(): vec2;
    export function getContentRegionAvail(): vec2;
    export function getWindowContentRegionMin(): vec2;
    export function getWindowContentRegionMax(): vec2;
    export function getWindowContentRegionWidth(): number;

    export function getScrollX(): number;
    export function getScrollY(): number;
    export function getScrollMaxX(): number;
    export function getScrollMaxY(): number;
    export function setScrollX(scrollX: number): void;
    export function setScrollY(scrollY: number): void;
    export function setScrollHereX(centerXRatio?: number): void;
    export function setScrollHereY(centerYRatio?: number): void;
    export function setScrollFromPosX(localX: number, centerXRatio?: number): void;
    export function setScrollFromPosY(localY: number, centerYRatio?: number): void;

    export function pushFont(font?: FontRef): void;
    export function popFont(): void;
    export function pushStyleColor(idx: Col, col: vec4): void;
    export function popStyleColor(count?: number): void;
    export function pushStyleVar(idx: StyleVar, val: number): void;
    export function pushStyleVar(idx: StyleVar, val: vec2): void;
    export function popStyleVar(count?: number): void;
    export function getStyleColor(idx: Col): vec4;
    export function getFont(): FontRef;
    export function getFontSize(): number;
    export function getFontTexUvWhitePixel(): vec2;
    export function getColor(idx: Col, alphaMul?: number): vec4;
    export function getColor(col: vec4): vec4;

    export function pushItemWidth(itemWidth: number): void;
    export function popItemWidth(): void;
    export function setNextItemWidth(itemWidth: number): void;
    export function calcItemWidth(): number;
    export function pushTextWrapPos(wrapLocalPosX?: number): void;
    export function popTextWrapPos(): void;
    export function pushAllowKeyboardFocus(allowKeyboardFocus: boolean): void;
    export function popAllowKeyboardFocus(): void;
    export function pushButtonRepeat(repeat: boolean): void;
    export function popButtonRepeat(): void;

    export function separator(): void;
    export function sameLine(offsetFromStartX?: number, spacing?: number): void;
    export function newLine(): void;
    export function spacing(): void;
    export function dummy(size: vec2): void;
    export function indent(indentW?: number): void;
    export function unindent(indentW?: number): void;
    export function beginGroup(): void;
    export function endGroup(): void;
    export function getCursorPos(): vec2;
    export function getCursorPosX(): number;
    export function getCursorPosY(): number;
    export function setCursorPos(localPos: vec2): void;
    export function setCursorPosX(localX: number): void;
    export function setCursorPosY(localY: number): void;
    export function getCursorStartPos(): vec2;
    export function getCursorScreenPos(): vec2;
    export function setCursorScreenPos(pos: vec2): void;
    export function alignTextToFramePadding(): void;
    export function getTextLineHeight(): number;
    export function getTextLineHeightWithSpacing(): number;
    export function getFrameHeight(): number;
    export function getFrameHeightWithSpacing(): number;

    export function pushId(strId: string): void;
    export function pushId(ptrId: number): void;
    export function popId(): void;
    export function getId(strId: string): number;
    export function getId(ptrId: number): number;

    export function text(text: string): void;
    export function textColored(text: string, col: vec4): void;
    export function textDisabled(text: string): void;
    export function textWrapped(text: string): void;
    export function labelText(label: string, text: string): void;
    export function bulletText(text: string): void;

    export function button(label: string, size?: vec2): boolean;
    export function smallButton(label: string): boolean;
    export function invisibleButton(strId: string, size: vec2, flags?: ButtonFlags): boolean;
    export function arrowButton(strId: string, dir: Dir): boolean;
    export function image(userTextureId: number, size: vec2, uv0?: vec2, uv1?: vec2, tintCol?: vec4, borderCol?: vec4): void;
    export function imageButton(userTextureId: number, size: vec2, uv0?: vec2, uv1?: vec2, framePadding?: number, bgCol?: vec4, tintCol?: vec4): boolean;
    export function checkbox(label: string, v: bool_ref): boolean;
    export function checkboxFlags(label: string, flags: number_ref, flagsValue: number): boolean;
    export function radioButton(label: string, active: boolean): boolean;
    export function radioButton(label: string, v: number_ref, vButton: number): boolean;
    export function progressBar(fraction: number, sizeArg?: vec2, overlay?: string): void;
    export function bullet(): void;

    export function beginCombo(label: string, previewValue: string, flags?: ComboFlags): boolean;
    export function endCombo(): void;
    export function combo(label: string, currentItem: number_ref, items: any[], popupMaxHeightInItems?: number): boolean;

    export function dragFloat(label: string, v: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    export function dragFloats(label: string, v: number[], vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    export function dragFloatRange(label: string, vCurrentMin: number_ref, vCurrentMax: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, formatMax?: string, flags?: SliderFlags): boolean;
    export function dragInt(label: string, v: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    export function dragInts(label: string, v: number[], vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    export function dragIntRange(label: string, vCurrentMin: number_ref, vCurrentMax: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, formatMax?: string, flags?: SliderFlags): boolean;

    export function sliderFloat(label: string, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    export function sliderFloats(label: string, v: number[], vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    export function sliderAngle(label: string, vRad: number_ref, vDegreesMin?: number, vDegreesMax?: number, format?: string, flags?: SliderFlags): boolean;
    export function sliderInt(label: string, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    export function sliderInts(label: string, v: number[], vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    export function vSliderFloat(label: string, size: vec2, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    export function vSliderInt(label: string, size: vec2, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;

    export function inputText(label: string, text: string_ref, flags?: InputTextFlags): boolean;
    export function inputTextMultiline(label: string, text: string_ref, size?: vec2, flags?: InputTextFlags): boolean;
    export function inputTextWithHint(label: string, hint: string, text: string_ref, flags?: InputTextFlags): boolean;
    export function inputFloat(label: string, v: number_ref, step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;
    export function inputFloats(label: string, v: number[], step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;
    export function inputInt(label: string, v: number_ref, step?: number, stepFast?: number, flags?: InputTextFlags): boolean;
    export function inputInts(label: string, v: number[], step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;
    export function inputDouble(label: string, v: number_ref, step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;

    export function colorEdit3(label: string, col: vec4, flags?: ColorEditFlags): boolean;
    export function colorEdit4(label: string, col: vec4, flags?: ColorEditFlags): boolean;
    export function colorPicker3(label: string, col: vec4, flags?: ColorEditFlags): boolean;
    export function colorPicker4(label: string, col: vec4, flags?: ColorEditFlags, refColor?: vec4): boolean;
    export function colorButton(descId: string, col: vec4, flags?: ColorEditFlags, size?: vec2): boolean;
    export function setColorEditOptions(flags: ColorEditFlags): void;

    export function treeNode(label: string, flags?: TreeNodeFlags): boolean;
    export function treeNodeEx(strId: string, label: string, flags?: TreeNodeFlags): boolean;
    export function treeNodeEx(ptrId: number, label: string, flags?: TreeNodeFlags): boolean;
    export function treePush(strId: string): void;
    export function treePush(ptrId: number): void;
    export function treePush(): void;
    export function treePop(): void;
    export function getTreeNodeToLabelSpacing(): number;
    export function collapsingHeader(label: string, flags?: TreeNodeFlags): boolean;
    export function collapsingHeader(label: string, open: bool_ref, flags?: TreeNodeFlags): boolean;
    export function setNextItemOpen(isOpen: boolean, cond?: Cond): void;

    export function selectable(label: string, selected?: boolean, flags?: SelectableFlags, size?: vec2): boolean;
    export function selectable(label: string, selected: bool_ref, flags?: SelectableFlags, size?: vec2): boolean;

    export function listBox(label: string, currentItem: number_ref, items: any[], heightInItems?: number): boolean;
    export function listBoxHeader(label: string, size?: vec2): boolean;
    export function listBoxHeader(label: string, itemsCount: number, heightInItems?: number): boolean;
    export function listBoxFooter(): void;

    export function plotLines(label: string, values: number[], valuesOffset?: number, overlayText?: string, scaleMin?: number, scaleMax?: number, graphSize?: vec2): void;
    export function plotHistogram(label: string, values: number[], valuesOffset?: number, overlayText?: string, scaleMin?: number, scaleMax?: number, graphSize?: vec2): void;

    export function valueBool(prefix: string, b: boolean): void;
    export function valueInt(prefix: string, v: number): void;
    export function valueFloat(prefix: string, v: number, format?: string): void;

    export function beginMenuBar(): boolean;
    export function endMenuBar(): void;
    export function beginMainMenuBar(): boolean;
    export function endMainMenuBar(): void;
    export function beginMenu(label: string, enabled?: boolean): boolean;
    export function endMenu(): void;
    export function menuItem(label: string, shortcut?: string, selected?: boolean, enabled?: boolean): boolean;
    export function menuItem(label: string, shortcut: string, selected: bool_ref, enabled?: boolean): boolean;

    export function beginTooltip(): void;
    export function endTooltip(): void;
    export function setTooltip(text: string): void

    export function beginPopup(strId: string, flags?: WindowFlags): boolean;
    export function beginPopupModal(name: string, open?: bool_ref, flags?: WindowFlags): boolean;
    export function endPopup(): void;

    export function openPopup(strId: string, popupFlags?: PopupFlags): void;
    export function openPopupContextItem(strId?: string, popupFlags?: PopupFlags): boolean;
    export function closeCurrentPopup(): void;

    export function beginPopupContextItem(strId?: string, popupFlags?: PopupFlags): boolean;
    export function beginPopupContextWindow(strId?: string, popupFlags?: PopupFlags): boolean;
    export function beginPopupContextVoid(strId?: string, popupFlags?: PopupFlags): boolean;

    export function isPopupOpen(strId: string, flags?: PopupFlags): boolean;

    export function columns(count?: number, id?: string, border?: boolean): void;
    export function nextColumn(): void;
    export function getColumnIndex(): number;
    export function getColumnWidth(columnIndex?: number): number;
    export function setColumnWidth(columnIndex: number, width: number): void;
    export function getColumnOffset(columnIndex?: number): number;
    export function setColumnOffset(columnIndex: number, offsetX: number): void;
    export function getColumnsCount(): number;

    export function beginTabBar(strId: string, flags?: TabBarFlags): boolean;
    export function endTabBar(): void;
    export function beginTabItem(label: string, open?: bool_ref, flags?: TabItemFlags): boolean;
    export function endTabItem(): void;
    export function setTabItemClosed(tabOrDockedWindowLabel: string): void;

    export function dockSpace(id: number, size?: vec2, flags?: DockNodeFlags): void;
    export function dockSpaceOverViewport(viewport?: ViewportRef, flags?: DockNodeFlags): void;
    export function getWindowDockId(): number;
    export function isWindowDocked(): boolean;

    export function logToTTY(autoOpenDepth?: number): void;
    export function logToFile(autoOpenDepth?: number, filename?: string): void;
    export function logToClipboard(autoOpenDepth?: number): void;
    export function logFinish(): void;
    export function logButtons(): void;
    export function logText(text: string): void;

    export function pushClipRect(clipRectMin: vec2, clipRectMax: vec2, intersectWithCurrentClipRect: boolean): void;
    export function popClipRect(): void;

    export function setItemDefaultFocus(): void;
    export function setKeyboardFocusHere(offset?: number): void;

    export function isItemHovered(flags?: HoveredFlags): boolean;
    export function isItemActive(): boolean;
    export function isItemFocused(): boolean;
    export function isItemClicked(mouseButton?: MouseButton): boolean;
    export function isItemVisible(): boolean;
    export function isItemEdited(): boolean;
    export function isItemActivated(): boolean;
    export function isItemDeactivated(): boolean;
    export function isItemDeactivatedAfterEdit(): boolean;
    export function isItemToggledOpen(): boolean;
    export function isAnyItemHovered(): boolean;
    export function isAnyItemActive(): boolean;
    export function isAnyItemFocused(): boolean;
    export function getItemRectMin(): vec2;
    export function getItemRectMax(): vec2;
    export function getItemRectSize(): vec2;
    export function setItemAllowOverlap(): void;

    export function isRectVisible(size: vec2): boolean;
    export function isRectVisible(rectMin: vec2, rectMax: vec2): boolean;
    export function getTime(): number;
    export function getFrameCount(): number;
    export function getBackgroundDrawList(): DrawListRef;
    export function getBackgroundDrawList(viewport: ViewportRef): DrawListRef;
    export function getForegroundDrawList(): DrawListRef;
    export function getForegroundDrawList(viewport: ViewportRef): DrawListRef;
    export function getStyleColorName(idx: Col): string;
    export function calcListClipping(itemsCount: number, itemsHeight: number): vec2;
    export function beginChildFrame(id: number, size: vec2, flags?: WindowFlags): boolean;
    export function endChildFrame(): void;

    export function calcTextSize(text: string, hideTextAfterDoubleHash?: boolean, wrapWidth?: number): vec2;

    export function colorConvertRGBtoHSV(color: vec4): vec4;
    export function colorConvertHSVtoRGB(color: vec4): vec4;

    export function isKeyDown(keyIndex: SDL.Keybd.Scancode): boolean;
    export function isKeyPressed(keyIndex: SDL.Keybd.Scancode, repeat?: boolean): boolean;
    export function isKeyReleased(keyIndex: SDL.Keybd.Scancode): boolean;
    export function getKeyPressedAmount(keyIndex: SDL.Keybd.Scancode, repeatDelay: number, rate: number): number;
    export function captureKeyboardFromApp(wantCaptureKeyboardValue: boolean): void;

    export function isMouseDown(button: MouseButton): boolean;
    export function isMouseClicked(button: MouseButton, repeat?: boolean): boolean;
    export function isMouseReleased(button: MouseButton): boolean;
    export function isMouseDoubleClicked(button: MouseButton): boolean;
    export function isMouseHoveringRect(rMin: vec2, rMax: vec2, clip?: boolean): boolean;
    export function isMousePosValid(mousePos?: vec2): boolean;
    export function isAnyMouseDown(): boolean;
    export function getMousePos(): vec2;
    export function getMousePosOnOpeningCurrentPopup(): vec2;
    export function isMouseDragging(button: MouseButton, lockThreshold?: number): boolean;
    export function getMouseDragDelta(button?: MouseButton, lockThreshold?: number): vec2;
    export function resetMouseDragDelta(button?: MouseButton): void;
    export function getMouseCursor(): MouseCursor;
    export function setMouseCursor(cursorType: MouseCursor): void;
    export function captureMouseFromApp(wantCaptureMouseValue?: boolean): void;

    export function getClipboardText(): string;
    export function setClipboardText(text: string): void;

    export function loadIniSettingsFromDisk(iniFilename: string): void;
    export function loadIniSettingsFromMemory(iniData: Buffer): void;
    export function saveIniSettingsToDisk(iniFilename: string): void;
    export function saveIniSettingsToMemory(): Buffer;

    export function getMainViewport(): ViewportRef;
    export function findViewportById(id: number): ViewportRef;

    export function pushItemDisabled(disabled: boolean): void;
    export function popItemDisabled(): void;
}

export module Gfx {
    export const enum TextureFilter {
        Linear,
        Nearest
    }

    export interface Texture {
        id: number;
        width: number;
        height: number;

        loadFromFile(path: string, filter?: TextureFilter /* Nearest */): void;
        loadFromMemoryRGBA32(width: number, height: number, data: Buffer, filter?: TextureFilter /* Nearest */): void;
        isValid(): boolean;
    }

    export var Texture: {
        new(): Texture;
    };

    export interface Font {
        loadFromFile(path: string, ptsize: number, outline: number): void;
        loadFromMemory(data: Buffer, ptsize: number, outline: number): void;
        isValid(): boolean;
        cacheGlyphRange(min: number, max: number): void;
        renderText(str: string, fgcol: vec4, bgcol: vec4, filter?: TextureFilter /* Nearest */): Texture;
    }

    export var Font: {
        new(): Font;
    };

    export const enum FlipFlags {
        None,
        Horizontal,
        Vertical
    }

    export function addSprite(dl: ImGui.DrawListRef, texture: Texture, src: vec4, dst: vec4, tint: vec4, flip: FlipFlags): void;
    export function addSpriteRotated(dl: ImGui.DrawListRef, texture: Texture, src: vec4, dst: vec4, tint: vec4, flip: FlipFlags, angle: number): void;
    export function calcSpriteRotatedBounds(dst: vec4, angle: number): vec4;
    export function addText(dl: ImGui.DrawListRef, font: Font, str: string, pos: vec2, fgcol: vec4, bgcol: vec4, scale: vec2): void;
    export function calcTextSize(font: Font, str: string, scale: vec2): vec2;
}
