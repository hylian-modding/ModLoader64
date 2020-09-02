import IConsole from 'modloader64_api/IConsole';
import { FakeN64Memory } from './FakeN64Memory';
import IMemory from 'modloader64_api/IMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { N64Header } from './N64Header';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import crypto from 'crypto';
import { IImGui, IoRef, StyleRef, DrawListRef, ViewportRef, Col, StyleVar, FontRef, Dir, bool_ref, number_ref, string_ref, ColorEditFlags, MouseButton, MouseCursor, WindowFlags, FocusedFlags, HoveredFlags, Cond, ComboFlags, SliderFlags, InputTextFlags, ButtonFlags, TreeNodeFlags, SelectableFlags, PopupFlags, TabBarFlags, TabItemFlags, DockNodeFlags } from 'modloader64_api/Sylvain/ImGui';
import { vec2, vec4 } from 'modloader64_api/Sylvain/vec';
import { Scancode, Keybd, Keycode, Keymod } from 'modloader64_api/Sylvain/Keybd';
import { SDL, WindowRef } from 'modloader64_api/Sylvain/SDL';
import { Mouse, MouseButtons } from 'modloader64_api/Sylvain/Mouse';
import { Gfx, Texture, FlipFlags, Font } from 'modloader64_api/Sylvain/Gfx';
import { Input, Axis, Button, FilterFlags } from 'modloader64_api/Sylvain/Input';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';

export class FakeMupen implements IConsole {
    rom: string;
    rom_data: Buffer;
    ram: FakeN64Memory;

    constructor(rom: string) {
        this.rom = rom;
        this.rom_data = Buffer.alloc(1);
        this.ram = new FakeN64Memory();
    }

    getYaz0Encoder(): IYaz0 {
        return new FakeYaz0();
    }

    getInputAccess(): Input {
        return new FakeInput();
    }
    getGfxAccess(): Gfx {
        return new FakeGfx();
    }

    getSDLAccess(): SDL {
        return new FakeSDL();
    }
    getImGuiAccess(): IImGui {
        return new FakeImGui();
    }

    on(which: string, callback: any): void {
    }

    startEmulator(preStartCallback: Function): IMemory {
        preStartCallback(this.rom_data);
        return this.ram;
    }

    stopEmulator(): void { }

    finishInjects(): void { }

    isEmulatorReady(): boolean {
        return true;
    }

    getLoadedRom(): Buffer {
        return this.rom_data;
    }

    getFrameCount(): number {
        return -1;
    }

    setFrameCount(num: number): void { }

    pauseEmulator(): void { }

    resumeEmulator(): void { }

    getRomHeader(): IRomHeader {
        return new N64Header(Buffer.alloc(0x50));
    }

    getMemoryAccess(): IMemory {
        return this.ram;
    }

    softReset(): void { }

    hardReset(): void { }

    saveState(file: string): void { }

    loadState(file: string): void { }

    setSaveDir(path: string): void { }

    getUtils(): IUtils {
        return new FakeN64Utils();
    }

    getSaveStateManager(): ISaveState {
        return new FakeN64SaveState();
    }
}

class FakeN64SaveState implements ISaveState {
    setStateSlot(slot: number): void {
    }
    loadState(): void {
    }
    loadStateFromSlot(slot: number): void {
    }
    loadStateFromFile(path: string): void {
    }
    saveState(): void {
    }
    saveStateToSlot(slot: number): void {
    }
    saveStateToFile(path: string): void {
    }
}

class FakeN64Utils implements IUtils {

    stopEmulatorThisFrame(): boolean {
        return true;
    }

    cloneBuffer(buf: Buffer): Buffer {
        let b: Buffer = Buffer.alloc(buf.byteLength);
        buf.copy(b);
        return b;
    }
    getUUID(): string {
        return "";
    }
    setTimeoutFrames(fn: Function, frames: number): void { }
    clearBuffer(buf: Buffer): Buffer {
        buf.fill('00', 0, buf.byteLength, 'hex');
        return buf;
    }
    utilBitCount8(value: number): number {
        return -1;
    }
    utilBitCount16(value: number): number {
        return -1;
    }
    utilBitCount32(value: number): number {
        return -1;
    }
    utilBitCountBuffer(buf: Buffer, offset: number, length: number): number {
        return -1;
    }
    memoryCacheRefresh(): void { }
    hashBuffer(buf: Buffer): string {
        return crypto
            .createHash('md5')
            .update(buf)
            .digest('hex');
    }

    yaz0Encode(buf: Buffer): Buffer {
        return Buffer.alloc(1);
    }
    yaz0Decode(buf: Buffer): Buffer {
        return Buffer.alloc(1);
    }
}

class FakeImGui implements IImGui {
    getIo(): IoRef {
        //@ts-ignore
        return null;
    }
    getStyle(): StyleRef {
        //@ts-ignore
        return null;
    }
    showDemoWindow(open?: bool_ref | undefined): void {
    }
    showAboutWindow(open?: bool_ref | undefined): void {
    }
    showMetricsWindow(open?: bool_ref | undefined): void {
    }
    showStyleEditor(): void {
    }
    showStyleSelector(): void {
    }
    showFontSelector(): void {
    }
    showUserGuide(): void {
    }
    getVersion(): string {
        //@ts-ignore
        return null;
    }
    styleColorsDark(): void {
    }
    styleColorsClassic(): void {
    }
    styleColorsLight(): void {

    }
    begin(name: string, open?: bool_ref | undefined, flags?: WindowFlags | undefined): boolean {
        //@ts-ignore
        return null;
    }
    end(): void {
    }
    beginChild(strId: string, size?: vec2 | undefined, border?: boolean | undefined, flags?: WindowFlags | undefined): boolean;
    beginChild(id: number, size?: vec2 | undefined, border?: boolean | undefined, flags?: WindowFlags | undefined): boolean;
    beginChild(id: any, size?: any, border?: any, flags?: any) {
        return false;
    }
    endChild(): void {
    }
    isWindowAppearing(): boolean {
        return false;
    }
    isWindowCollapsed(): boolean {
        return false;
    }
    isWindowFocused(flags?: FocusedFlags | undefined): boolean {
        return false;
    }
    isWindowHovered(flags?: HoveredFlags | undefined): boolean {
        return false;
    }
    getWindowDrawList(): DrawListRef {
        //@ts-ignore
        return null;
    }
    getWindowDpiScale(): number {
        //@ts-ignore
        return null;
    }
    getWindowViewport(): ViewportRef {
        //@ts-ignore
        return null;
    }
    getWindowPos(): vec2 {
        //@ts-ignore
        return null;
    }
    getWindowSize(): vec2 {
        //@ts-ignore
        return null;
    }
    getWindowWidth(): number {
        //@ts-ignore
        return null;
    }
    getWindowHeight(): number {
        //@ts-ignore
        return null;
    }
    setNextWindowPos(pos: vec2, cond?: Cond | undefined, pivot?: vec2 | undefined): void {
    }
    setNextWindowSize(size: vec2, cond?: Cond | undefined): void {
    }
    setNextWindowSizeConstraints(sizeMin: vec2, sizeMax: vec2): void {
    }
    setNextWindowContentSize(size: vec2): void {
    }
    setNextWindowCollapsed(collapsed: boolean, cond?: Cond | undefined): void {
    }
    setNextWindowFocus(): void {
    }
    setNextWindowBgAlpha(alpha: number): void {
    }
    setNextWindowViewport(viewportId: number): void {
    }
    setWindowPos(pos: vec2, cond?: Cond | undefined): void;
    setWindowPos(name: string, pos: vec2, cond?: Cond | undefined): void;
    setWindowPos(name: any, pos?: any, cond?: any) {
    }
    setWindowSize(size: vec2, cond?: Cond | undefined): void;
    setWindowSize(name: string, size: vec2, cond?: Cond | undefined): void;
    setWindowSize(name: any, size?: any, cond?: any) {
    }
    setWindowCollapsed(collapsed: boolean, cond?: Cond | undefined): void;
    setWindowCollapsed(name: string, collapsed: boolean, cond?: Cond | undefined): void;
    setWindowCollapsed(name: any, collapsed?: any, cond?: any) {
    }
    setWindowFocus(): void;
    setWindowFocus(name: string): void;
    setWindowFocus(name?: any) {
    }
    setWindowFontScale(scale: number): void {
    }
    getContentRegionMax(): vec2 {
        //@ts-ignore
        return null;
    }
    getContentRegionAvail(): vec2 {
        //@ts-ignore
        return null;
    }
    getWindowContentRegionMin(): vec2 {
        //@ts-ignore
        return null;
    }
    getWindowContentRegionMax(): vec2 {
        //@ts-ignore
        return null;
    }
    getWindowContentRegionWidth(): number {
        //@ts-ignore
        return null;
    }
    getScrollX(): number {
        //@ts-ignore
        return null;
    }
    getScrollY(): number {
        //@ts-ignore
        return null;
    }
    getScrollMaxX(): number {
        //@ts-ignore
        return null;
    }
    getScrollMaxY(): number {
        //@ts-ignore
        return null;
    }
    setScrollX(scrollX: number): void {
    }
    setScrollY(scrollY: number): void {
    }
    setScrollHereX(centerXRatio?: number | undefined): void {
    }
    setScrollHereY(centerYRatio?: number | undefined): void {
    }
    setScrollFromPosX(localX: number, centerXRatio?: number | undefined): void {
    }
    setScrollFromPosY(localY: number, centerYRatio?: number | undefined): void {
    }
    pushFont(font?: FontRef | undefined): void {
    }
    popFont(): void {
    }
    pushStyleColor(idx: Col, col: vec4): void {
    }
    popStyleColor(count?: number | undefined): void {
    }
    pushStyleVar(idx: StyleVar, val: number): void;
    pushStyleVar(idx: StyleVar, val: vec2): void;
    pushStyleVar(idx: any, val: any) {
    }
    popStyleVar(count?: number | undefined): void {
    }
    getStyleColor(idx: Col): vec4 {
        //@ts-ignore
        return null;
    }
    getFont(): FontRef {
        //@ts-ignore
        return null;
    }
    getFontSize(): number {
        //@ts-ignore
        return null;
    }
    getFontTexUvWhitePixel(): vec2 {
        //@ts-ignore
        return null;
    }
    getColor(idx: Col, alphaMul?: number | undefined): vec4;
    getColor(col: vec4): vec4;
    getColor(idx: any, alphaMul?: any) {
        return { x: 69, y: 420, z: -69, w: -420 };
    }
    pushItemWidth(itemWidth: number): void {
    }
    popItemWidth(): void {
    }
    setNextItemWidth(itemWidth: number): void {
    }
    calcItemWidth(): number {
        //@ts-ignore
        return null;
    }
    pushTextWrapPos(wrapLocalPosX?: number | undefined): void {
    }
    popTextWrapPos(): void {
    }
    pushAllowKeyboardFocus(allowKeyboardFocus: boolean): void {
    }
    popAllowKeyboardFocus(): void {
    }
    pushButtonRepeat(repeat: boolean): void {
    }
    popButtonRepeat(): void {
    }
    separator(): void {
    }
    sameLine(offsetFromStartX?: number | undefined, spacing?: number | undefined): void {
    }
    newLine(): void {
    }
    spacing(): void {
    }
    dummy(size: vec2): void {
    }
    indent(indentW?: number | undefined): void {
    }
    unindent(indentW?: number | undefined): void {
    }
    beginGroup(): void {
    }
    endGroup(): void {
    }
    getCursorPos(): vec2 {
        //@ts-ignore
        return null;
    }
    getCursorPosX(): number {
        //@ts-ignore
        return null;
    }
    getCursorPosY(): number {
        //@ts-ignore
        return null;
    }
    setCursorPos(localPos: vec2): void {
    }
    setCursorPosX(localX: number): void {
    }
    setCursorPosY(localY: number): void {
    }
    getCursorStartPos(): vec2 {
        //@ts-ignore
        return null;
    }
    getCursorScreenPos(): vec2 {
        //@ts-ignore
        return null;
    }
    setCursorScreenPos(pos: vec2): void {
    }
    alignTextToFramePadding(): void {
    }
    getTextLineHeight(): number {
        return -1;
    }
    getTextLineHeightWithSpacing(): number {
        return -1;
    }
    getFrameHeight(): number {
        return -1;
    }
    getFrameHeightWithSpacing(): number {
        return -1;
    }
    pushId(strId: string): void;
    pushId(ptrId: number): void;
    pushId(ptrId: any) {
    }
    popId(): void {
    }
    getId(strId: string): number;
    getId(ptrId: number): number;
    getId(ptrId: any) {
        return 69;
    }
    text(text: string): void {
    }
    textColored(text: string, col: vec4): void {
    }
    textDisabled(text: string): void {
    }
    textWrapped(text: string): void {
    }
    labelText(label: string, text: string): void {
    }
    bulletText(text: string): void {
    }
    button(label: string, size?: vec2 | undefined): boolean {
        //@ts-ignore
        return null;
    }
    smallButton(label: string): boolean {
        //@ts-ignore
        return null;
    }
    invisibleButton(strId: string, size: vec2, flags?: ButtonFlags | undefined): boolean {
        //@ts-ignore
        return null;
    }
    arrowButton(strId: string, dir: Dir): boolean {
        //@ts-ignore
        return null;
    }
    image(userTextureId: number, size: vec2, uv0?: vec2 | undefined, uv1?: vec2 | undefined, tintCol?: vec4 | undefined, borderCol?: vec4 | undefined): void {
        //@ts-ignore
        return null;
    }
    imageButton(userTextureId: number, size: vec2, uv0?: vec2 | undefined, uv1?: vec2 | undefined, framePadding?: number | undefined, bgCol?: vec4 | undefined, tintCol?: vec4 | undefined): boolean {
        //@ts-ignore
        return null;
    }
    checkbox(label: string, v: bool_ref): boolean {
        //@ts-ignore
        return null;
    }
    checkboxFlags(label: string, flags: number_ref, flagsValue: number): boolean {
        //@ts-ignore
        return null;
    }
    radioButton(label: string, active: boolean): boolean;
    radioButton(label: string, v: number_ref, vButton: number): boolean;
    radioButton(label: any, v: any, vButton?: any) {
        return false;
    }
    progressBar(fraction: number, sizeArg?: vec2 | undefined, overlay?: string | undefined): void {
    }
    bullet(): void {
    }
    beginCombo(label: string, previewValue: string, flags?: ComboFlags | undefined): boolean {
        return false;
    }
    endCombo(): void {
    }
    combo(label: string, currentItem: number_ref, items: any[], popupMaxHeightInItems?: number | undefined): boolean {
        return false;
    }
    dragFloat(label: string, v: number_ref, vSpeed?: number | undefined, vMin?: number | undefined, vMax?: number | undefined, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    dragFloats(label: string, v: number[], vSpeed?: number | undefined, vMin?: number | undefined, vMax?: number | undefined, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    dragFloatRange(label: string, vCurrentMin: number_ref, vCurrentMax: number_ref, vSpeed?: number | undefined, vMin?: number | undefined, vMax?: number | undefined, format?: string | undefined, formatMax?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    dragInt(label: string, v: number_ref, vSpeed?: number | undefined, vMin?: number | undefined, vMax?: number | undefined, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    dragInts(label: string, v: number[], vSpeed?: number | undefined, vMin?: number | undefined, vMax?: number | undefined, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    dragIntRange(label: string, vCurrentMin: number_ref, vCurrentMax: number_ref, vSpeed?: number | undefined, vMin?: number | undefined, vMax?: number | undefined, format?: string | undefined, formatMax?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    sliderFloat(label: string, v: number_ref, vMin: number, vMax: number, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    sliderFloats(label: string, v: number[], vMin: number, vMax: number, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    sliderAngle(label: string, vRad: number_ref, vDegreesMin?: number | undefined, vDegreesMax?: number | undefined, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    sliderInt(label: string, v: number_ref, vMin: number, vMax: number, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    sliderInts(label: string, v: number[], vMin: number, vMax: number, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;

    }
    vSliderFloat(label: string, size: vec2, v: number_ref, vMin: number, vMax: number, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    vSliderInt(label: string, size: vec2, v: number_ref, vMin: number, vMax: number, format?: string | undefined, flags?: SliderFlags | undefined): boolean {
        return false;
    }
    inputText(label: string, text: string_ref, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputTextMultiline(label: string, text: string_ref, size?: vec2 | undefined, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputTextWithHint(label: string, hint: string, text: string_ref, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputFloat(label: string, v: number_ref, step?: number | undefined, stepFast?: number | undefined, format?: string | undefined, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputFloats(label: string, v: number[], step?: number | undefined, stepFast?: number | undefined, format?: string | undefined, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputInt(label: string, v: number_ref, step?: number | undefined, stepFast?: number | undefined, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputInts(label: string, v: number[], step?: number | undefined, stepFast?: number | undefined, format?: string | undefined, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    inputDouble(label: string, v: number_ref, step?: number | undefined, stepFast?: number | undefined, format?: string | undefined, flags?: InputTextFlags | undefined): boolean {
        return false;
    }
    colorEdit3(label: string, col: vec4, flags?: ColorEditFlags | undefined): boolean {
        return false;
    }
    colorEdit4(label: string, col: vec4, flags?: ColorEditFlags | undefined): boolean {
        return false;
    }
    colorPicker3(label: string, col: vec4, flags?: ColorEditFlags | undefined): boolean {
        return false;
    }
    colorPicker4(label: string, col: vec4, flags?: ColorEditFlags | undefined, refColor?: vec4 | undefined): boolean {
        return false;
    }
    colorButton(descId: string, col: vec4, flags?: ColorEditFlags | undefined, size?: vec2 | undefined): boolean {
        return false;
    }
    setColorEditOptions(flags: ColorEditFlags): void {

    }
    treeNode(label: string, flags?: TreeNodeFlags | undefined): boolean {
        return false;
    }
    treeNodeEx(strId: string, label: string, flags?: TreeNodeFlags | undefined): boolean;
    treeNodeEx(ptrId: number, label: string, flags?: TreeNodeFlags | undefined): boolean;
    treeNodeEx(ptrId: any, label: any, flags?: any) {
        return false;
    }
    treePush(strId: string): void;
    treePush(ptrId: number): void;
    treePush(): void;
    treePush(ptrId?: any) {

    }
    treePop(): void {

    }
    getTreeNodeToLabelSpacing(): number {
        return 69;
    }
    collapsingHeader(label: string, flags?: TreeNodeFlags | undefined): boolean;
    collapsingHeader(label: string, open: bool_ref, flags?: TreeNodeFlags | undefined): boolean;
    collapsingHeader(label: any, open?: any, flags?: any) {
        return false;
    }
    setNextItemOpen(isOpen: boolean, cond?: Cond | undefined): void {

    }
    selectable(label: string, selected?: boolean | undefined, flags?: SelectableFlags | undefined, size?: vec2 | undefined): boolean;
    selectable(label: string, selected: bool_ref, flags?: SelectableFlags | undefined, size?: vec2 | undefined): boolean;
    selectable(label: any, selected?: any, flags?: any, size?: any) {
        return false;
    }
    listBox(label: string, currentItem: number_ref, items: any[], heightInItems?: number | undefined): boolean {
        return false;
    }
    listBoxHeader(label: string, size?: vec2 | undefined): boolean;
    listBoxHeader(label: string, itemsCount: number, heightInItems?: number | undefined): boolean;
    listBoxHeader(label: any, itemsCount?: any, heightInItems?: any) {
        return false;
    }
    listBoxFooter(): void {
    }
    plotLines(label: string, values: number[], valuesOffset?: number | undefined, overlayText?: string | undefined, scaleMin?: number | undefined, scaleMax?: number | undefined, graphSize?: vec2 | undefined): void {

    }
    plotHistogram(label: string, values: number[], valuesOffset?: number | undefined, overlayText?: string | undefined, scaleMin?: number | undefined, scaleMax?: number | undefined, graphSize?: vec2 | undefined): void {

    }
    valueBool(prefix: string, b: boolean): void {

    }
    valueInt(prefix: string, v: number): void {

    }
    valueFloat(prefix: string, v: number, format?: string | undefined): void {

    }
    beginMenuBar(): boolean {
        return false;
    }
    endMenuBar(): void {

    }
    beginMainMenuBar(): boolean {
        return false;
    }
    endMainMenuBar(): void {

    }
    beginMenu(label: string, enabled?: boolean | undefined): boolean {
        return false;
    }
    endMenu(): void {

    }
    menuItem(label: string, shortcut?: string | undefined, selected?: boolean | undefined, enabled?: boolean | undefined): boolean;
    menuItem(label: string, shortcut: string, selected: bool_ref, enabled?: boolean | undefined): boolean;
    menuItem(label: any, shortcut?: any, selected?: any, enabled?: any) {
        return false;
    }
    beginTooltip(): void {

    }
    endTooltip(): void {

    }
    setTooltip(text: string): void {

    }
    beginPopup(strId: string, flags?: WindowFlags | undefined): boolean {
        return false;
    }
    beginPopupModal(name: string, open?: bool_ref | undefined, flags?: WindowFlags | undefined): boolean {
        return false;
    }
    endPopup(): void {

    }
    openPopup(strId: string, popupFlags?: PopupFlags | undefined): void {

    }
    openPopupContextItem(strId?: string | undefined, popupFlags?: PopupFlags | undefined): boolean {
        return false;
    }
    closeCurrentPopup(): void {

    }
    beginPopupContextItem(strId?: string | undefined, popupFlags?: PopupFlags | undefined): boolean {
        return false;
    }
    beginPopupContextWindow(strId?: string | undefined, popupFlags?: PopupFlags | undefined): boolean {
        return false;
    }
    beginPopupContextVoid(strId?: string | undefined, popupFlags?: PopupFlags | undefined): boolean {
        return false;
    }
    isPopupOpen(strId: string, flags?: PopupFlags | undefined): boolean {
        return false;
    }
    columns(count?: number | undefined, id?: string | undefined, border?: boolean | undefined): void {

    }
    nextColumn(): void {

    }
    getColumnIndex(): number {
        return 69;
    }
    getColumnWidth(columnIndex?: number | undefined): number {
        return 69;
    }
    setColumnWidth(columnIndex: number, width: number): void {

    }
    getColumnOffset(columnIndex?: number | undefined): number {
        return 69;
    }
    setColumnOffset(columnIndex: number, offsetX: number): void {

    }
    getColumnsCount(): number {
        return 69;
    }
    beginTabBar(strId: string, flags?: TabBarFlags | undefined): boolean {
        return false;
    }
    endTabBar(): void {

    }
    beginTabItem(label: string, open?: bool_ref | undefined, flags?: TabItemFlags | undefined): boolean {
        return false;
    }
    endTabItem(): void {

    }
    setTabItemClosed(tabOrDockedWindowLabel: string): void {

    }
    dockSpace(id: number, size?: vec2 | undefined, flags?: DockNodeFlags | undefined): void {
    }
    dockSpaceOverViewport(viewport?: ViewportRef | undefined, flags?: DockNodeFlags | undefined): void {

    }
    getWindowDockId(): number {
        return 69;
    }
    isWindowDocked(): boolean {
        return false;
    }
    logToTTY(autoOpenDepth?: number | undefined): void {

    }
    logToFile(autoOpenDepth?: number | undefined, filename?: string | undefined): void {

    }
    logToClipboard(autoOpenDepth?: number | undefined): void {

    }
    logFinish(): void {

    }
    logButtons(): void {

    }
    logText(text: string): void {

    }
    pushClipRect(clipRectMin: vec2, clipRectMax: vec2, intersectWithCurrentClipRect: boolean): void {

    }
    popClipRect(): void {

    }
    setItemDefaultFocus(): void {

    }
    setKeyboardFocusHere(offset?: number | undefined): void {

    }
    isItemHovered(flags?: HoveredFlags | undefined): boolean {
        return false;
    }
    isItemActive(): boolean {
        return false;
    }
    isItemFocused(): boolean {
        return false;
    }
    isItemClicked(mouseButton?: MouseButton | undefined): boolean {
        return false;
    }
    isItemVisible(): boolean {
        return false;
    }
    isItemEdited(): boolean {
        return false;
    }
    isItemActivated(): boolean {
        return false;
    }
    isItemDeactivated(): boolean {
        return false;
    }
    isItemDeactivatedAfterEdit(): boolean {
        return false;
    }
    isItemToggledOpen(): boolean {
        return false;
    }
    isAnyItemHovered(): boolean {
        return false;
    }
    isAnyItemActive(): boolean {
        return false;
    }
    isAnyItemFocused(): boolean {
        return false;
    }
    getItemRectMin(): vec2 {
        return { x: 0, y: 0 };
    }
    getItemRectMax(): vec2 {
        return { x: 0, y: 0 };
    }
    getItemRectSize(): vec2 {
        return { x: 0, y: 0 };
    }
    setItemAllowOverlap(): void {

    }
    isRectVisible(size: vec2): boolean;
    isRectVisible(rectMin: vec2, rectMax: vec2): boolean;
    isRectVisible(rectMin: any, rectMax?: any) {
        return false;
    }
    getTime(): number {
        return 69;
    }
    getFrameCount(): number {
        return 69;
    }
    getBackgroundDrawList(): DrawListRef;
    getBackgroundDrawList(viewport: ViewportRef): DrawListRef;
    getBackgroundDrawList(viewport?: any) {
        return {} as DrawListRef;
    }
    getForegroundDrawList(): DrawListRef;
    getForegroundDrawList(viewport: ViewportRef): DrawListRef;
    getForegroundDrawList(viewport?: any) {
        return {} as DrawListRef;
    }
    getStyleColorName(idx: Col): string {
        return "";
    }
    calcListClipping(itemsCount: number, itemsHeight: number): vec2 {
        return { x: 0, y: 0 };
    }
    beginChildFrame(id: number, size: vec2, flags?: WindowFlags | undefined): boolean {
        return false;
    }
    endChildFrame(): void {

    }
    calcTextSize(text: string, hideTextAfterDoubleHash?: boolean | undefined, wrapWidth?: number | undefined): vec2 {
        //@ts-ignore
        return null;
    }
    colorConvertRGBtoHSV(color: vec4): vec4 {
        //@ts-ignore
        return null;
    }
    colorConvertHSVtoRGB(color: vec4): vec4 {
        //@ts-ignore
        return null;
    }
    isKeyDown(keyIndex: Scancode): boolean {
        return false;
    }
    isKeyPressed(keyIndex: Scancode, repeat?: boolean | undefined): boolean {
        return false;
    }
    isKeyReleased(keyIndex: Scancode): boolean {
        return false;
    }
    getKeyPressedAmount(keyIndex: Scancode, repeatDelay: number, rate: number): number {
        return 69;
    }
    captureKeyboardFromApp(wantCaptureKeyboardValue: boolean): void {

    }
    isMouseDown(button: MouseButton): boolean {
        return false;
    }
    isMouseClicked(button: MouseButton, repeat?: boolean | undefined): boolean {
        return false;
    }
    isMouseReleased(button: MouseButton): boolean {
        return false;
    }
    isMouseDoubleClicked(button: MouseButton): boolean {
        return false;
    }
    isMouseHoveringRect(rMin: vec2, rMax: vec2, clip?: boolean | undefined): boolean {
        return false;
    }
    isMousePosValid(mousePos?: vec2 | undefined): boolean {
        return false;
    }
    isAnyMouseDown(): boolean {
        return false;
    }
    getMousePos(): vec2 {
        //@ts-ignore
        return null;
    }
    getMousePosOnOpeningCurrentPopup(): vec2 {
        //@ts-ignore
        return null;
    }
    isMouseDragging(button: MouseButton, lockThreshold?: number | undefined): boolean {
        return false;
    }
    getMouseDragDelta(button?: MouseButton | undefined, lockThreshold?: number | undefined): vec2 {
        //@ts-ignore
        return null;
    }
    resetMouseDragDelta(button?: MouseButton | undefined): void {

    }
    getMouseCursor(): MouseCursor {
        return {} as MouseCursor;
    }
    setMouseCursor(cursorType: MouseCursor): void {

    }
    captureMouseFromApp(wantCaptureMouseValue?: boolean | undefined): void {

    }
    getClipboardText(): string {
        return "";
    }
    setClipboardText(text: string): void {

    }
    loadIniSettingsFromDisk(iniFilename: string): void {

    }
    loadIniSettingsFromMemory(iniData: Buffer): void {

    }
    saveIniSettingsToDisk(iniFilename: string): void {

    }
    saveIniSettingsToMemory(): Buffer {
        return Buffer.alloc(0x69);
    }
    getMainViewport(): ViewportRef {
        return {} as ViewportRef;
    }
    findViewportById(id: number): ViewportRef {
        return {} as ViewportRef;
    }
    pushItemDisabled(disabled: boolean): void {

    }
    popItemDisabled(): void {

    }

}

class FakeSDL implements SDL {
    Keybd: Keybd = new FakeKeybd();
    Mouse: Mouse = new FakeMouse();
    Clipboard: Clipboard = new FakeClipboard();
}

class FakeKeybd implements Keybd {
    getKeyFromName(name: string): Keycode {
        //@ts-ignore
        return null;
    }
    getKeyFromScancode(scancode: Scancode): Keycode {
        //@ts-ignore
        return null;
    }
    getKeyName(key: Keycode): string {
        //@ts-ignore
        return null;
    }
    getKeyState(scancode: Scancode): boolean {
        //@ts-ignore
        return null;
    }
    getModState(): Keymod {
        //@ts-ignore
        return null;
    }
    getScancodeFromKey(key: Keycode): Scancode {
        //@ts-ignore
        return null;
    }
    getScancodeFromName(name: string): Scancode {
        //@ts-ignore
        return null;
    }
    getScancodeName(scancode: Scancode): string {
        //@ts-ignore
        return null;
    }
}

class FakeMouse implements Mouse {
    capture(enabled: boolean): void {
    }
    getButtonMask(button: MouseButtons): number {
        //@ts-ignore
        return null;
    }
    getGlobalPosition(): vec2 {
        //@ts-ignore
        return null;
    }
    getGlobalButtons(): number {
        //@ts-ignore
        return null;
    }
    getPosition(): vec2 {
        //@ts-ignore
        return null;
    }
    getButtons(): number {
        //@ts-ignore
        return null;
    }
    getRelativeMode(): boolean {
        //@ts-ignore
        return null;
    }
    getRelativePosition(): vec2 {
        //@ts-ignore
        return null;
    }
    getRelativeButtons(): number {
        //@ts-ignore
        return null;
    }
    setRelativeMode(enabled: boolean): void {

    }
    warpGlobal(pos: vec2): void {

    }
    warpInWindow(window: WindowRef, pos: vec2): void {

    }
    showCursor(): void {

    }
    hideCursor(): void {

    }
    isCursorVisible(): boolean {
        //@ts-ignore
        return null;
    }

}

class FakeClipboard implements Clipboard {
    readText(): Promise<string> {
        //@ts-ignore
        return null;
    }
    writeText(data: string): Promise<void> {
        //@ts-ignore
        return null;
    }
    addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void {
    }
    dispatchEvent(event: Event): boolean {
        //@ts-ignore
        return null;
    }
    removeEventListener(type: string, callback: EventListener | EventListenerObject | null, options?: boolean | EventListenerOptions | undefined): void {
    }

}

class FakeGfx implements Gfx {
    createTexture(): Texture {
        //@ts-ignore
        return null;
    }
    addSprite(dl: DrawListRef, texture: Texture, src: vec4, dst: vec4, tint: vec4, flip: FlipFlags): void {
    }
    addSpriteRotated(dl: DrawListRef, texture: Texture, src: vec4, dst: vec4, tint: vec4, flip: FlipFlags, angle: number): void {
    }
    calcSpriteRotatedBounds(dst: vec4, angle: number): vec4 {
        //@ts-ignore
        return null;
    }
    addText(dl: DrawListRef, font: Font, str: string, pos: vec2, fgcol: vec4, bgcol: vec4, scale: vec2): void {
    }
    calcTextSize(font: Font, str: string, scale: vec2): vec2 {
        //@ts-ignore
        return null;
    }

}

class FakeInput implements Input {
    getAxis(cont: number, axis: Axis): number {
        //@ts-ignore
        return null;
    }
    setAxis(cont: number, axis: Axis, value: number): void {
    }
    setAxisVi(cont: number, axis: Axis, value: number): void {
    }
    getButton(cont: number, button: Button): boolean {
        return false;
    }
    getButtonDown(cont: number, button: Button): boolean {
        //@ts-ignore
        return null;
    }
    getButtonUp(cont: number, button: Button): boolean {
        //@ts-ignore
        return null;
    }
    setButton(cont: number, button: Button, pressed: boolean): boolean {
        //@ts-ignore
        return null;
    }
    setButtonDown(cont: number, button: Button): boolean {
        //@ts-ignore
        return null;
    }
    getPluginFilter(cont: number): FilterFlags {
        //@ts-ignore
        return null;
    }
    setPluginFilter(cont: number, filter: FilterFlags): void {

    }

}

class FakeYaz0 implements IYaz0{
    encode(buf: Buffer): Buffer {
        return Buffer.alloc(1);
    }
    decode(buf: Buffer): Buffer {
        return Buffer.alloc(1);
    }
    
}