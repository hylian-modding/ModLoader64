import { IPlugin, IModLoaderAPI, ModLoaderEvents } from "modloader64_api/IModLoaderAPI";
import { onViUpdate, onCreateResources } from "modloader64_api/PluginLifecycle";
import { bus, EventHandler } from "modloader64_api/EventHandler";
import { MenuEvents } from 'modloader64_api/Sylvain/MenuEvents';
import { vec2, xy, vec4, rgba, xywh } from "modloader64_api/Sylvain/vec";
import { Texture, FlipFlags, Font } from "modloader64_api/Sylvain/Gfx";
import path from 'path';
import { bool_ref, Dir, number_ref, string_ref } from "modloader64_api/Sylvain/ImGui";
import fs from 'fs';
import { addToSystemNotificationQueue, AnnouncementChannels, IKillFeedMessage, ISystemNotification, NotificationEvents } from 'modloader64_api/Announcements';
import IConsole from "modloader64_api/IConsole";
import { CoreEvent, CoreParam, IMupen } from "./IMupen";
import { NetworkHandler } from "modloader64_api/NetworkHandler";
import { AnnouncePacket } from "./AnnouncePacket";

class TexturePack {
    name: string;
    folder: string;
    enabled: bool_ref;

    constructor(name: string, folder: string) {
        this.name = name;
        this.folder = folder;
        this.enabled = [false];
    }
}

interface TexturePackConfig {
    texturePackStatus: any;
}

class TexturePackManager {
    ModLoader: IModLoaderAPI;
    packs: Array<TexturePack> = [];
    isWindowOpen: boolean = false;
    config: TexturePackConfig;

    constructor(ModLoader: IModLoaderAPI) {
        this.ModLoader = ModLoader;
        let p = path.resolve("./texture_packs");
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p)
        }
        bus.on(ModLoaderEvents.LOAD_HD_TEXTURES, this.onRegister.bind(this));
        fs.readdirSync(p).forEach((f: string) => {
            let file = path.resolve(p, f);
            if (fs.lstatSync(file).isDirectory()) {
                bus.emit(ModLoaderEvents.LOAD_HD_TEXTURES, { name: path.parse(file).name, folder: file });
            }
        });
        this.config = this.ModLoader.config.registerConfigCategory("N64TexturePacks") as TexturePackConfig;
        this.ModLoader.config.setData('N64TexturePacks', 'texturePackStatus', {});
        for (let i = 0; i < this.packs.length; i++) {
            if (this.config.texturePackStatus.hasOwnProperty(this.packs[i].name)) {
                this.packs[i].enabled[0] = Boolean(this.config.texturePackStatus[this.packs[i].name]);
            }
            this.config.texturePackStatus[this.packs[i].name] = this.packs[i].enabled[0];
        }
        this.ModLoader.config.save();
    }

    onRegister(evt: { name: string, folder: string }) {
        console.log(evt);
        this.packs.push(new TexturePack(evt.name, evt.folder));
    }

    clearAll() {
        for (let i = 0; i < this.packs.length; i++) {
            this.ModLoader.hires_texture_management.RemoveHiresTexturePath(this.packs[i].folder);
        }
    }

    enableSelected() {
        this.config.texturePackStatus = {};
        for (let i = 0; i < this.packs.length; i++) {
            if (this.packs[i].enabled[0]) {
                this.ModLoader.hires_texture_management.AddHiresTexturePath(this.packs[i].folder);
            }
        }
        for (let i = 0; i < this.packs.length; i++) {
            this.config.texturePackStatus[this.packs[i].name] = this.packs[i].enabled[0];
        }
        this.ModLoader.config.save();
    }

    moveItem(index: number, dir: Dir) {
        if (dir === Dir.Up && index === 0) return;
        if (dir === Dir.Down && index === (this.packs.length - 1)) return;
        let itr = dir === Dir.Up ? -1 : 1;
        let next = index + itr;
        let item = this.packs[next];
        let cur = this.packs[index];
        if (item === undefined || cur === undefined) return;
        this.packs[next] = cur;
        this.packs[index] = item;

        this.clearAll();
        this.enableSelected();
    }

    post() {
        this.ModLoader.utils.setTimeoutFrames(() => {
            this.clearAll();
            this.enableSelected();
        }, 20);
    }

    update() {
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Utility")) {
                if (this.ModLoader.ImGui.beginMenu("Texture Packs")) {
                    if (this.ModLoader.ImGui.menuItem("Open Texture Pack Manager", undefined, this.isWindowOpen)) {
                        this.isWindowOpen = !this.isWindowOpen;
                    }
                    this.ModLoader.ImGui.endMenu();
                }
                this.ModLoader.ImGui.endMenu();
            }
        }
        this.ModLoader.ImGui.endMainMenuBar();
        if (this.isWindowOpen) {
            if (this.ModLoader.ImGui.begin("Texture Pack Manager")) {
                for (let i = 0; i < this.packs.length; i++) {
                    if (this.ModLoader.ImGui.arrowButton(`up###${this.packs[i].name}_dirup`, Dir.Up)) {
                        this.moveItem(i, Dir.Up);
                    }
                    this.ModLoader.ImGui.sameLine();
                    if (this.ModLoader.ImGui.arrowButton(`down###${this.packs[i].name}_dirdown`, Dir.Down)) {
                        this.moveItem(i, Dir.Down);
                    }
                    this.ModLoader.ImGui.sameLine();
                    if (this.ModLoader.ImGui.checkbox(this.packs[i].name, this.packs[i].enabled)) {
                        this.clearAll();
                        this.enableSelected();
                    }
                }
            }
            this.ModLoader.ImGui.end();
        }
    }
}

class TopNotification {
    text: string;
    pos: vec2;
    color: vec4;
    offscreen: number;

    constructor(text: string) {
        this.text = text;
        this.offscreen = (text.length * 50) / -1;
        this.pos = xy(500, 0);
        this.color = rgba(255, 255, 255, 255);
    }
}

class MenubarWidget {

    cheatMenuEnabled: boolean = true;
    memoryViewerEnabled: boolean = true;
    ModLoader: IModLoaderAPI;
    openScriptEditor: boolean = false;
    script: string_ref = [fs.readFileSync(path.resolve(__dirname, "resources", "basescript.js2")).toString()];
    scriptTick!: Function | undefined;
    scriptVi!: Function | undefined;
    openPlayerList: boolean = false;

    constructor(ModLoader: IModLoaderAPI) {
        this.ModLoader = ModLoader;
    }

    update() {
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Utility")) {
                if (this.ModLoader.ImGui.menuItem("Input config")) {
                    bus.emit('openInputConfig', {});
                }
                if (this.cheatMenuEnabled) {
                    if (this.ModLoader.ImGui.menuItem("Cheats")) {
                        bus.emit('openCheatConfig', {});
                    }
                }
                if (this.memoryViewerEnabled) {
                    if (this.ModLoader.ImGui.menuItem("Memory viewer")) {
                        bus.emit('openMemViewer', {});
                    }
                }
                /* if (this.ModLoader.ImGui.menuItem("Script Editor")) {
                    this.openScriptEditor = true;
                } */
                this.ModLoader.ImGui.endMenu();
            }

            if (this.ModLoader.ImGui.beginMenu("View")) {
                if (this.ModLoader.ImGui.menuItem("Toggle FullScreen")) {
                    bus.emit('toggleFullScreen', {});
                }
                this.ModLoader.ImGui.endMenu();
            }
        }
        this.ModLoader.ImGui.endMainMenuBar();
        if (this.openScriptEditor) {
            this.ModLoader.ImGui.begin("Script Editor", [this.openScriptEditor]);
            this.ModLoader.ImGui.inputTextMultiline("code", this.script, xy(500, 500));
            if (this.ModLoader.ImGui.button("Run", xy(100, 60))) {
                try {
                    if (this.scriptTick === undefined) {
                        var requireFromString = require('require-from-string');
                        let m = requireFromString(this.script[0]);
                        let i = new m();
                        i["ModLoader"] = this.ModLoader;
                        this.scriptTick = i["onTick"].bind(i);
                        this.scriptVi = i["onVi"].bind(i);
                        i["start"].bind(i)();
                    }
                } catch (err: any) {
                    console.log(err);
                }
            }
            if (this.ModLoader.ImGui.button("Stop", xy(100, 60))) {
                this.scriptTick = undefined;
                this.scriptVi = undefined;
            }
            this.ModLoader.ImGui.end();
            if (this.scriptVi !== undefined) {
                try {
                    this.scriptVi();
                } catch (err: any) {
                    this.ModLoader.logger.error("Script error");
                    this.ModLoader.logger.error(err.stack);
                    this.scriptVi = undefined;
                    this.scriptTick = undefined;
                }
            }
        }
        if (this.openPlayerList) {
            this.ModLoader.ImGui.begin("Player List", [true]);
            this.ModLoader.ImGui.text(this.ModLoader.me.nickname);
            this.ModLoader.ImGui.end();
        }
    }

    onTick() {
        if (this.scriptTick !== undefined) {
            try {
                this.scriptTick();
            } catch (err: any) {
                this.ModLoader.logger.error("Script error");
                this.ModLoader.logger.error(err.stack);
                this.scriptVi = undefined;
                this.scriptTick = undefined;
            }
        }
    }
}

class TopBarWidget {

    topNotifications: Array<TopNotification> = [];
    currentTopNotification!: TopNotification | undefined;
    topBarHeight: number = 0;
    topBarMaxHeight: number = 36;
    retracttopBar: boolean = false;
    ModLoader: IModLoaderAPI;

    constructor(ModLoader: IModLoaderAPI) {
        this.ModLoader = ModLoader;
    }

    add(notif: ISystemNotification) {
        this.topNotifications.push(new TopNotification(notif.text));
    }

    update() {
        if (this.topNotifications.length > 0 && this.currentTopNotification === undefined) {
            this.currentTopNotification = this.topNotifications.shift();
            return;
        }
        if (this.topBarHeight > 0) {
            this.ModLoader.ImGui.getWindowDrawList().addRectFilled(xy(0, 0), xy(this.ModLoader.ImGui.getWindowWidth(), this.topBarHeight), rgba(0, 0, 0, 255));
        }
        if (this.currentTopNotification !== undefined) {
            if (this.currentTopNotification.pos.x < this.ModLoader.ImGui.getWindowWidth() + this.currentTopNotification.offscreen) {
                this.currentTopNotification = undefined;
                this.retracttopBar = true;
            } else {
                if (this.topBarHeight < this.topBarMaxHeight) {
                    this.topBarHeight++;
                } else {
                    this.ModLoader.ImGui.getWindowDrawList().addTextEx(this.ModLoader.ImGui.getFont(), 36, this.currentTopNotification.pos, this.currentTopNotification.color, this.currentTopNotification.text);
                    this.currentTopNotification.pos.x -= 1;
                }
            }
        } else {
            if (this.retracttopBar && this.topBarHeight > 0) {
                this.topBarHeight--;
                if (this.topBarHeight === 0) {
                    this.retracttopBar = false;
                }
            }
        }
    }
}

class BottomRightNotification {
    text: string;
    fgcolor: vec4;
    bgcolor: vec4;
    pos: vec2;
    icon?: Texture;
    timer: number = 0;
    readonly MAX_TIMER: number = 200;

    constructor(text: string, icon?: Texture, color?: vec4) {
        this.text = text;
        this.pos = xy(0, 0);
        this.bgcolor = rgba(0, 0, 0, 255);

        if (color !== undefined) {
            this.fgcolor = color;
        } else {
            this.fgcolor = rgba(255, 255, 255, 255);
        }

        if (icon !== undefined) {
            this.icon = icon;
        }
    }
}

class BottomRightWidget {
    ModLoader: IModLoaderAPI;
    pos: vec2 = xy(0, 0);
    size: vec2 = xy(0, 0);
    timer: number = 0;
    readonly TIMER_MAX: number = 200;
    targetPos: vec2 = xy(0, 0);
    notifs: Array<BottomRightNotification> = [];
    currentNotif!: BottomRightNotification | undefined;
    font!: Font;

    constructor(ModLoader: IModLoaderAPI) {
        this.ModLoader = ModLoader;
    }

    add(kill: IKillFeedMessage) {
        this.notifs.push(new BottomRightNotification(kill.text, kill.icon, kill.color));
    }

    loadResources() {
        if (this.font === undefined) {
            try {
                this.font = this.ModLoader.Gfx.createFont();
                this.font.loadFromFile(path.resolve(__dirname, "resources", "PolygonParty-3KXM.ttf"), 30, 2);
                this.ModLoader.logger.debug("Loading default font.");
            } catch (err: any) {
                this.ModLoader.logger.error(err);
            }
        }
    }

    update() {
        if (this.currentNotif === undefined && this.notifs.length > 0) {
            this.currentNotif = this.notifs.shift();
            let textSize = xy(this.currentNotif!.text.length * 20, 0);
            this.targetPos = xy(0 + this.ModLoader.ImGui.getWindowWidth() - textSize.x, 0 + this.ModLoader.ImGui.getWindowHeight() - 200);
            this.pos = xy(0 + this.ModLoader.ImGui.getWindowWidth() - textSize.x, 0 + this.ModLoader.ImGui.getWindowHeight());
            return;
        }
        if (this.currentNotif !== undefined) {
            this.pos.x = this.targetPos.x;
            if (this.pos.y > this.targetPos.y) {
                if (this.notifs.length > 5) {
                    this.pos.y -= 1 * 5;
                } else {
                    this.pos.y -= 1;
                }
            } else {
                if (this.notifs.length > 5) {
                    this.currentNotif.fgcolor.w -= 2 * 5 / 255;
                    this.currentNotif.bgcolor.w -= 2 * 5 / 255;
                } else {
                    this.currentNotif.fgcolor.w -= 2 / 255;
                    this.currentNotif.bgcolor.w -= 2 / 255;
                }
                if (this.currentNotif.fgcolor.w <= 0) {
                    this.currentNotif = undefined;
                    return;
                }
            }
            try {
                if (this.currentNotif.icon !== undefined) {
                    let f = this.ModLoader.Gfx.calcTextSize(this.font, "Test", xy(1, 1));
                    let dst = xywh(this.pos.x - 32, this.pos.y, f.y, f.y);
                    this.ModLoader.Gfx.addSprite(this.ModLoader.ImGui.getWindowDrawList(), this.currentNotif.icon, xywh(0, 0, this.currentNotif.icon.width, this.currentNotif.icon.height), dst, rgba(255, 255, 255, this.currentNotif.fgcolor.w * 255), FlipFlags.None);
                }
                this.ModLoader.Gfx.addText(this.ModLoader.ImGui.getWindowDrawList(), this.font, this.currentNotif.text, this.pos, this.currentNotif.fgcolor, this.currentNotif.bgcolor, xy(1, 1));
            } catch (err: any) {
                this.ModLoader.logger.error(err.stack);
            }
        }
    }
}

class AchievementWidget {

    ModLoader: IModLoaderAPI;
    font!: Font;
    text!: string;

    constructor(ModLoader: IModLoaderAPI) {
        this.ModLoader = ModLoader;
    }

    loadResources() {
        try {
            this.font = this.ModLoader.Gfx.createFont();
            this.font.loadFromFile(path.resolve(__dirname, "resources", "PolygonParty-3KXM.ttf"), 30, 2);
            this.text = "Test";
        } catch (err: any) {
            this.ModLoader.logger.error(err);
        }
    }

    onTick() {
    }

    update() {
    }
}

class MenubarPlugin implements IPlugin {
    ModLoader!: IModLoaderAPI;
    Binding!: IConsole;
    resourcesLoaded: boolean = false;
    menubar!: MenubarWidget;
    topNotifications!: TopBarWidget;
    bottomRight!: BottomRightWidget;
    achievements!: AchievementWidget;
    texturePacks!: TexturePackManager;
    aspect: number_ref = [0];
    aspect_options = ['Stretch', 'Force 4:3', 'Force 16:9', 'Adjust'];
    highres: boolean = false;
    ScreenWidth: number_ref = [0];
    ScreenHeight: number_ref = [0];
    fxaa: boolean = false;
    ms: number_ref = [0];
    ani: number_ref = [0];
    ms_options = [0, 2, 4, 8, 16];
    ani_options = [0, 2, 4, 8, 16];
    htc: boolean = false;
    hts: boolean = false;
    audio_options = ["trivial", "speex-fixed-4", "speex-fixed-10"];
    audio_options_display = ["Fast", "Normal", "Best"];
    audio_selection: number_ref = [0];

    preinit(): void {
        this.menubar = new MenubarWidget(this.ModLoader);
        this.topNotifications = new TopBarWidget(this.ModLoader);
        this.bottomRight = new BottomRightWidget(this.ModLoader);
        this.achievements = new AchievementWidget(this.ModLoader);
        this.texturePacks = new TexturePackManager(this.ModLoader);
    }

    init(): void {
    }

    @NetworkHandler('AnnouncePacket')
    onAnnounce(packet: AnnouncePacket) {
        addToSystemNotificationQueue(packet.text);
    }

    postinit(): void {
        try {
            this.aspect[0] = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-GLideN64").getIntOr("AspectRatio", 1);
            this.highres = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').getBoolOr('txHiresEnable', false);
            this.ScreenWidth[0] = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-General").getIntOr("ScreenWidth", 800);
            this.ScreenHeight[0] = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-General").getIntOr("ScreenHeight", 600);
            this.fxaa = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-GLideN64").getBoolOr("FXAA", false);
            this.htc = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-GLideN64").getBoolOr("txHiresTextureFileStorage", false);
            this.hts = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-GLideN64").getBoolOr("txHiresTextureFileStorage", false);
            this.ms[0] = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-GLideN64").getIntOr("MultiSampling", 0);
            this.ani[0] = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-GLideN64").getIntOr("MaxAnisotropy", 0);
            let audio = ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Audio-SDL").getStringOr("RESAMPLE", "trivial");
            let volumeAdjust = (this.Binding as any).mupen.M64p.Config.openSection('Audio-SDL').getIntOr('VOLUME_ADJUST', 5);
            for (let i = 0; i < this.audio_options.length; i++) {
                if (audio === this.audio_options[i]) {
                    this.audio_selection[0] = i;
                    break;
                }
            }
            this.Binding.on('core-event', (event: CoreEvent, v: number) => {
                if (event == CoreEvent.VolumeDown)
                    (this.Binding as any).mupen.M64p.setAudioVolume((this.Binding as any).mupen.M64p.getAudioVolume() - volumeAdjust);
                else if (event == CoreEvent.VolumeUp)
                    (this.Binding as any).mupen.M64p.setAudioVolume((this.Binding as any).mupen.M64p.getAudioVolume() + volumeAdjust);
            });
            this.Binding.on('core-state-changed', (param: CoreParam, newValue: number) => {
                if (param == CoreParam.AudioVolume) {
                    if (this.ModLoader.sound.listener !== undefined) {
                        this.ModLoader.sound.listener.globalVolume = newValue;
                    } else {
                        console.log("wtf");
                    }
                }
            });
        } catch (err: any) {
            this.ModLoader.logger.error(err);
        }
        this.texturePacks.post();
    }
    onTick(frame?: number | undefined): void {
        this.achievements.onTick();
        this.menubar.onTick();
    }

    @EventHandler(MenuEvents.DISABLE_CHEATS)
    onDisableCheats(evt: any) {
        this.menubar.cheatMenuEnabled = false;
    }

    @EventHandler(MenuEvents.DISABLE_MEMORY_VIEWER)
    onDisableMemoryViewer(evt: any) {
        this.menubar.memoryViewerEnabled = false;
    }

    @EventHandler(AnnouncementChannels.SYSTEM_NOTIFICATION)
    onNotif(notif: ISystemNotification) {
        this.topNotifications.add(notif);
    }

    @EventHandler(AnnouncementChannels.KILL_FEED)
    onKillfeed(notif: IKillFeedMessage) {
        this.bottomRight.add(notif);
    }

    @onCreateResources()
    onResourceLoad() {
    }

    @onViUpdate()
    onViUpdate() {
        if (!this.resourcesLoaded) {
            this.bottomRight.loadResources();
            this.achievements.loadResources();
            this.resourcesLoaded = true;
        }
        this.menubar.update();
        this.topNotifications.update();
        this.bottomRight.update();
        this.achievements.update();
        this.texturePacks.update();
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Emulation")) {
                if (this.ModLoader.ImGui.combo('Aspect ratio', this.aspect, this.aspect_options)) {
                    ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('AspectRatio', this.aspect[0]);
                }
                if (this.ModLoader.ImGui.inputInt("Screen Width", this.ScreenWidth)) {
                    let w = Math.floor(this.ScreenWidth[0]);
                    ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-General").setInt("ScreenWidth", w);
                }
                if (this.ModLoader.ImGui.inputInt("Screen Height", this.ScreenHeight)) {
                    let w = Math.floor(this.ScreenHeight[0]);
                    ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Video-General").setInt("ScreenHeight", w);
                }
                if (this.ModLoader.ImGui.beginMenu("Enable High Res Texture Packs")) {
                    if (this.ModLoader.ImGui.menuItem("Rice/HTC", undefined, this.htc, true)) {
                        this.htc = !this.htc;
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txHiresEnable', true);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('txCacheSize', 1000);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txHiresFullAlphaChannel', true);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txEnhancedTextureFileStorage', false);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txHiresTextureFileStorage', false);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txSaveCache', true);
                    }
                    if (this.ModLoader.ImGui.menuItem("HTS", undefined, this.hts, true)) {
                        this.hts = !this.hts;
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txHiresEnable', true);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('txCacheSize', 1000);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txHiresFullAlphaChannel', true);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txEnhancedTextureFileStorage', true);
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('txHiresTextureFileStorage', true);
                    }
                    this.ModLoader.ImGui.endMenu();
                }
                if (this.ModLoader.ImGui.menuItem("FXAA", undefined, this.fxaa, true)) {
                    this.fxaa = !this.fxaa;
                    ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setBool('FXAA', this.fxaa);
                }
                if (this.ModLoader.ImGui.combo("Max Anisotropy", this.ani, this.ani_options)) {
                    if (this.ani[0] === 0) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MaxAnisotropy', 0);
                    }
                    if (this.ani[0] === 1) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MaxAnisotropy', 2);
                    }
                    if (this.ani[0] === 2) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MaxAnisotropy', 4);
                    }
                    if (this.ani[0] === 3) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MaxAnisotropy', 8);
                    }
                    if (this.ani[0] === 4) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MaxAnisotropy', 16);
                    }
                }
                if (this.ModLoader.ImGui.combo("MultiSampling", this.ms, this.ms_options)) {
                    if (this.ms[0] === 0) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MultiSampling', 0);
                    }
                    if (this.ms[0] === 1) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MultiSampling', 2);
                    }
                    if (this.ms[0] === 2) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MultiSampling', 4);
                    }
                    if (this.ms[0] === 3) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MultiSampling', 8);
                    }
                    if (this.ms[0] === 4) {
                        ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection('Video-GLideN64').setInt('MultiSampling', 16);
                    }
                }
                if (this.ModLoader.ImGui.combo("Audio", this.audio_selection, this.audio_options_display)) {
                    ((this.Binding as any)["mupen"] as IMupen).M64p.Config.openSection("Audio-SDL").setString("RESAMPLE", this.audio_options[this.audio_selection[0]]);
                }

                this.ModLoader.ImGui.text("These settings require a restart to take effect.");
                this.ModLoader.ImGui.endMenu();
            }
            this.ModLoader.ImGui.endMainMenuBar();
        }
    }

    @EventHandler(NotificationEvents.CHANGE_FONT)
    onFontChange(font: Font) {
        this.bottomRight.font = font;
    }

}

module.exports = MenubarPlugin;