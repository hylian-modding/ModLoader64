import { vec2, vec4 } from "./vec";
import { WindowRef } from "./SDL";
import { Scancode } from "./Keybd";

export const enum Emulator_Callbacks {
    new_frame = "new-frame",
    core_started = "core-started",
    vi_update = "vi-update",
    create_resources = "create-resources"
}

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
    PlatformHasViewports = 1 << 10, HasMouseHoveredViewport = 1 << 11, RendererHasViewports = 1 << 12
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
    platformHandle?: WindowRef;
    center: vec2;
    workPos: vec2;
    workSize: vec2;
}

export interface IImGui {
    getIo(): IoRef;
    getStyle(): StyleRef;

    showDemoWindow(open?: bool_ref): void;
    showAboutWindow(open?: bool_ref): void;
    showMetricsWindow(open?: bool_ref): void;
    showStyleEditor(): void;
    showStyleSelector(): void;
    showFontSelector(): void;
    showUserGuide(): void;
    getVersion(): string;

    styleColorsDark(): void;
    styleColorsClassic(): void;
    styleColorsLight(): void;

    begin(name: string, open?: bool_ref, flags?: WindowFlags): boolean;
    end(): void;

    beginChild(strId: string, size?: vec2, border?: boolean, flags?: WindowFlags): boolean;
    beginChild(id: number, size?: vec2, border?: boolean, flags?: WindowFlags): boolean;
    endChild(): void;

    isWindowAppearing(): boolean;
    isWindowCollapsed(): boolean;
    isWindowFocused(flags?: FocusedFlags): boolean;
    isWindowHovered(flags?: HoveredFlags): boolean;
    getWindowDrawList(): DrawListRef;
    getWindowDpiScale(): number;
    getWindowViewport(): ViewportRef;
    getWindowPos(): vec2;
    getWindowSize(): vec2;
    getWindowWidth(): number;
    getWindowHeight(): number;

    setNextWindowPos(pos: vec2, cond?: Cond, pivot?: vec2): void;
    setNextWindowSize(size: vec2, cond?: Cond): void;
    setNextWindowSizeConstraints(sizeMin: vec2, sizeMax: vec2): void;
    setNextWindowContentSize(size: vec2): void;
    setNextWindowCollapsed(collapsed: boolean, cond?: Cond): void;
    setNextWindowFocus(): void;
    setNextWindowBgAlpha(alpha: number): void;
    setNextWindowViewport(viewportId: number): void;
    setWindowPos(pos: vec2, cond?: Cond): void;
    setWindowSize(size: vec2, cond?: Cond): void;
    setWindowCollapsed(collapsed: boolean, cond?: Cond): void;
    setWindowFocus(): void;
    setWindowFontScale(scale: number): void;
    setWindowPos(name: string, pos: vec2, cond?: Cond): void;
    setWindowSize(name: string, size: vec2, cond?: Cond): void;
    setWindowCollapsed(name: string, collapsed: boolean, cond?: Cond): void;
    setWindowFocus(name: string): void;

    getContentRegionMax(): vec2;
    getContentRegionAvail(): vec2;
    getWindowContentRegionMin(): vec2;
    getWindowContentRegionMax(): vec2;
    getWindowContentRegionWidth(): number;

    getScrollX(): number;
    getScrollY(): number;
    getScrollMaxX(): number;
    getScrollMaxY(): number;
    setScrollX(scrollX: number): void;
    setScrollY(scrollY: number): void;
    setScrollHereX(centerXRatio?: number): void;
    setScrollHereY(centerYRatio?: number): void;
    setScrollFromPosX(localX: number, centerXRatio?: number): void;
    setScrollFromPosY(localY: number, centerYRatio?: number): void;

    pushFont(font?: FontRef): void;
    popFont(): void;
    pushStyleColor(idx: Col, col: vec4): void;
    popStyleColor(count?: number): void;
    pushStyleVar(idx: StyleVar, val: number): void;
    pushStyleVar(idx: StyleVar, val: vec2): void;
    popStyleVar(count?: number): void;
    getStyleColor(idx: Col): vec4;
    getFont(): FontRef;
    getFontSize(): number;
    getFontTexUvWhitePixel(): vec2;
    getColor(idx: Col, alphaMul?: number): vec4;
    getColor(col: vec4): vec4;

    pushItemWidth(itemWidth: number): void;
    popItemWidth(): void;
    setNextItemWidth(itemWidth: number): void;
    calcItemWidth(): number;
    pushTextWrapPos(wrapLocalPosX?: number): void;
    popTextWrapPos(): void;
    pushAllowKeyboardFocus(allowKeyboardFocus: boolean): void;
    popAllowKeyboardFocus(): void;
    pushButtonRepeat(repeat: boolean): void;
    popButtonRepeat(): void;

    separator(): void;
    sameLine(offsetFromStartX?: number, spacing?: number): void;
    newLine(): void;
    spacing(): void;
    dummy(size: vec2): void;
    indent(indentW?: number): void;
    unindent(indentW?: number): void;
    beginGroup(): void;
    endGroup(): void;
    getCursorPos(): vec2;
    getCursorPosX(): number;
    getCursorPosY(): number;
    setCursorPos(localPos: vec2): void;
    setCursorPosX(localX: number): void;
    setCursorPosY(localY: number): void;
    getCursorStartPos(): vec2;
    getCursorScreenPos(): vec2;
    setCursorScreenPos(pos: vec2): void;
    alignTextToFramePadding(): void;
    getTextLineHeight(): number;
    getTextLineHeightWithSpacing(): number;
    getFrameHeight(): number;
    getFrameHeightWithSpacing(): number;

    pushId(strId: string): void;
    pushId(ptrId: number): void;
    popId(): void;
    getId(strId: string): number;
    getId(ptrId: number): number;

    text(text: string): void;
    textColored(text: string, col: vec4): void;
    textDisabled(text: string): void;
    textWrapped(text: string): void;
    labelText(label: string, text: string): void;
    bulletText(text: string): void;

    button(label: string, size?: vec2): boolean;
    smallButton(label: string): boolean;
    invisibleButton(strId: string, size: vec2, flags?: ButtonFlags): boolean;
    arrowButton(strId: string, dir: Dir): boolean;
    image(userTextureId: number, size: vec2, uv0?: vec2, uv1?: vec2, tintCol?: vec4, borderCol?: vec4): void;
    imageButton(userTextureId: number, size: vec2, uv0?: vec2, uv1?: vec2, framePadding?: number, bgCol?: vec4, tintCol?: vec4): boolean;
    checkbox(label: string, v: bool_ref): boolean;
    checkboxFlags(label: string, flags: number_ref, flagsValue: number): boolean;
    radioButton(label: string, active: boolean): boolean;
    radioButton(label: string, v: number_ref, vButton: number): boolean;
    progressBar(fraction: number, sizeArg?: vec2, overlay?: string): void;
    bullet(): void;

    beginCombo(label: string, previewValue: string, flags?: ComboFlags): boolean;
    endCombo(): void;
    combo(label: string, currentItem: number_ref, items: any[], popupMaxHeightInItems?: number): boolean;

    dragFloat(label: string, v: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    dragFloats(label: string, v: number[], vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    dragFloatRange(label: string, vCurrentMin: number_ref, vCurrentMax: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, formatMax?: string, flags?: SliderFlags): boolean;
    dragInt(label: string, v: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    dragInts(label: string, v: number[], vSpeed?: number, vMin?: number, vMax?: number, format?: string, flags?: SliderFlags): boolean;
    dragIntRange(label: string, vCurrentMin: number_ref, vCurrentMax: number_ref, vSpeed?: number, vMin?: number, vMax?: number, format?: string, formatMax?: string, flags?: SliderFlags): boolean;

    sliderFloat(label: string, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    sliderFloats(label: string, v: number[], vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    sliderAngle(label: string, vRad: number_ref, vDegreesMin?: number, vDegreesMax?: number, format?: string, flags?: SliderFlags): boolean;
    sliderInt(label: string, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    sliderInts(label: string, v: number[], vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    vSliderFloat(label: string, size: vec2, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;
    vSliderInt(label: string, size: vec2, v: number_ref, vMin: number, vMax: number, format?: string, flags?: SliderFlags): boolean;

    inputText(label: string, text: string_ref, flags?: InputTextFlags): boolean;
    inputTextMultiline(label: string, text: string_ref, size?: vec2, flags?: InputTextFlags): boolean;
    inputTextWithHint(label: string, hint: string, text: string_ref, flags?: InputTextFlags): boolean;
    inputFloat(label: string, v: number_ref, step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;
    inputFloats(label: string, v: number[], step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;
    inputInt(label: string, v: number_ref, step?: number, stepFast?: number, flags?: InputTextFlags): boolean;
    inputInts(label: string, v: number[], step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;
    inputDouble(label: string, v: number_ref, step?: number, stepFast?: number, format?: string, flags?: InputTextFlags): boolean;

    colorEdit3(label: string, col: vec4, flags?: ColorEditFlags): boolean;
    colorEdit4(label: string, col: vec4, flags?: ColorEditFlags): boolean;
    colorPicker3(label: string, col: vec4, flags?: ColorEditFlags): boolean;
    colorPicker4(label: string, col: vec4, flags?: ColorEditFlags, refColor?: vec4): boolean;
    colorButton(descId: string, col: vec4, flags?: ColorEditFlags, size?: vec2): boolean;
    setColorEditOptions(flags: ColorEditFlags): void;

    treeNode(label: string, flags?: TreeNodeFlags): boolean;
    treeNodeEx(strId: string, label: string, flags?: TreeNodeFlags): boolean;
    treeNodeEx(ptrId: number, label: string, flags?: TreeNodeFlags): boolean;
    treePush(strId: string): void;
    treePush(ptrId: number): void;
    treePush(): void;
    treePop(): void;
    getTreeNodeToLabelSpacing(): number;
    collapsingHeader(label: string, flags?: TreeNodeFlags): boolean;
    collapsingHeader(label: string, open: bool_ref, flags?: TreeNodeFlags): boolean;
    setNextItemOpen(isOpen: boolean, cond?: Cond): void;

    selectable(label: string, selected?: boolean, flags?: SelectableFlags, size?: vec2): boolean;
    selectable(label: string, selected: bool_ref, flags?: SelectableFlags, size?: vec2): boolean;

    listBox(label: string, currentItem: number_ref, items: any[], heightInItems?: number): boolean;
    listBoxHeader(label: string, size?: vec2): boolean;
    listBoxHeader(label: string, itemsCount: number, heightInItems?: number): boolean;
    listBoxFooter(): void;

    plotLines(label: string, values: number[], valuesOffset?: number, overlayText?: string, scaleMin?: number, scaleMax?: number, graphSize?: vec2): void;
    plotHistogram(label: string, values: number[], valuesOffset?: number, overlayText?: string, scaleMin?: number, scaleMax?: number, graphSize?: vec2): void;

    valueBool(prefix: string, b: boolean): void;
    valueInt(prefix: string, v: number): void;
    valueFloat(prefix: string, v: number, format?: string): void;

    beginMenuBar(): boolean;
    endMenuBar(): void;
    beginMainMenuBar(): boolean;
    endMainMenuBar(): void;
    beginMenu(label: string, enabled?: boolean): boolean;
    endMenu(): void;
    menuItem(label: string, shortcut?: string, selected?: boolean, enabled?: boolean): boolean;
    menuItem(label: string, shortcut: string, selected: bool_ref, enabled?: boolean): boolean;

    beginTooltip(): void;
    endTooltip(): void;
    setTooltip(text: string): void

    beginPopup(strId: string, flags?: WindowFlags): boolean;
    beginPopupModal(name: string, open?: bool_ref, flags?: WindowFlags): boolean;
    endPopup(): void;

    openPopup(strId: string, popupFlags?: PopupFlags): void;
    openPopupContextItem(strId?: string, popupFlags?: PopupFlags): boolean;
    closeCurrentPopup(): void;

    beginPopupContextItem(strId?: string, popupFlags?: PopupFlags): boolean;
    beginPopupContextWindow(strId?: string, popupFlags?: PopupFlags): boolean;
    beginPopupContextVoid(strId?: string, popupFlags?: PopupFlags): boolean;

    isPopupOpen(strId: string, flags?: PopupFlags): boolean;

    columns(count?: number, id?: string, border?: boolean): void;
    nextColumn(): void;
    getColumnIndex(): number;
    getColumnWidth(columnIndex?: number): number;
    setColumnWidth(columnIndex: number, width: number): void;
    getColumnOffset(columnIndex?: number): number;
    setColumnOffset(columnIndex: number, offsetX: number): void;
    getColumnsCount(): number;

    beginTabBar(strId: string, flags?: TabBarFlags): boolean;
    endTabBar(): void;
    beginTabItem(label: string, open?: bool_ref, flags?: TabItemFlags): boolean;
    endTabItem(): void;
    setTabItemClosed(tabOrDockedWindowLabel: string): void;

    dockSpace(id: number, size?: vec2, flags?: DockNodeFlags): void;
    dockSpaceOverViewport(viewport?: ViewportRef, flags?: DockNodeFlags): void;
    getWindowDockId(): number;
    isWindowDocked(): boolean;

    logToTTY(autoOpenDepth?: number): void;
    logToFile(autoOpenDepth?: number, filename?: string): void;
    logToClipboard(autoOpenDepth?: number): void;
    logFinish(): void;
    logButtons(): void;
    logText(text: string): void;

    pushClipRect(clipRectMin: vec2, clipRectMax: vec2, intersectWithCurrentClipRect: boolean): void;
    popClipRect(): void;

    setItemDefaultFocus(): void;
    setKeyboardFocusHere(offset?: number): void;

    isItemHovered(flags?: HoveredFlags): boolean;
    isItemActive(): boolean;
    isItemFocused(): boolean;
    isItemClicked(mouseButton?: MouseButton): boolean;
    isItemVisible(): boolean;
    isItemEdited(): boolean;
    isItemActivated(): boolean;
    isItemDeactivated(): boolean;
    isItemDeactivatedAfterEdit(): boolean;
    isItemToggledOpen(): boolean;
    isAnyItemHovered(): boolean;
    isAnyItemActive(): boolean;
    isAnyItemFocused(): boolean;
    getItemRectMin(): vec2;
    getItemRectMax(): vec2;
    getItemRectSize(): vec2;
    setItemAllowOverlap(): void;

    isRectVisible(size: vec2): boolean;
    isRectVisible(rectMin: vec2, rectMax: vec2): boolean;
    getTime(): number;
    getFrameCount(): number;
    getBackgroundDrawList(): DrawListRef;
    getBackgroundDrawList(viewport: ViewportRef): DrawListRef;
    getForegroundDrawList(): DrawListRef;
    getForegroundDrawList(viewport: ViewportRef): DrawListRef;
    getStyleColorName(idx: Col): string;
    calcListClipping(itemsCount: number, itemsHeight: number): vec2;
    beginChildFrame(id: number, size: vec2, flags?: WindowFlags): boolean;
    endChildFrame(): void;

    calcTextSize(text: string, hideTextAfterDoubleHash?: boolean, wrapWidth?: number): vec2;

    colorConvertRGBtoHSV(color: vec4): vec4;
    colorConvertHSVtoRGB(color: vec4): vec4;

    isKeyDown(keyIndex: Scancode): boolean;
    isKeyPressed(keyIndex: Scancode, repeat?: boolean): boolean;
    isKeyReleased(keyIndex: Scancode): boolean;
    getKeyPressedAmount(keyIndex: Scancode, repeatDelay: number, rate: number): number;
    captureKeyboardFromApp(wantCaptureKeyboardValue: boolean): void;

    isMouseDown(button: MouseButton): boolean;
    isMouseClicked(button: MouseButton, repeat?: boolean): boolean;
    isMouseReleased(button: MouseButton): boolean;
    isMouseDoubleClicked(button: MouseButton): boolean;
    isMouseHoveringRect(rMin: vec2, rMax: vec2, clip?: boolean): boolean;
    isMousePosValid(mousePos?: vec2): boolean;
    isAnyMouseDown(): boolean;
    getMousePos(): vec2;
    getMousePosOnOpeningCurrentPopup(): vec2;
    isMouseDragging(button: MouseButton, lockThreshold?: number): boolean;
    getMouseDragDelta(button?: MouseButton, lockThreshold?: number): vec2;
    resetMouseDragDelta(button?: MouseButton): void;
    getMouseCursor(): MouseCursor;
    setMouseCursor(cursorType: MouseCursor): void;
    captureMouseFromApp(wantCaptureMouseValue?: boolean): void;

    getClipboardText(): string;
    setClipboardText(text: string): void;

    loadIniSettingsFromDisk(iniFilename: string): void;
    loadIniSettingsFromMemory(iniData: Buffer): void;
    saveIniSettingsToDisk(iniFilename: string): void;
    saveIniSettingsToMemory(): Buffer;

    getMainViewport(): ViewportRef;
    findViewportById(id: number): ViewportRef;

    pushItemDisabled(disabled: boolean): void;
    popItemDisabled(): void;
}