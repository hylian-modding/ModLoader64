import { IPlugin, IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { onViUpdate, onCreateResources } from "modloader64_api/PluginLifecycle";
import { bus, EventHandler } from "modloader64_api/EventHandler";
import { MenuEvents } from 'modloader64_api/Sylvain/MenuEvents';
import { vec2, xy, vec4, rgba, xywh, rgb } from "modloader64_api/Sylvain/vec";
import { Texture, FlipFlags, Font } from "modloader64_api/Sylvain/Gfx";
import path from 'path';
import { DrawCornerFlags, FontRef, string_ref } from "modloader64_api/Sylvain/ImGui";
import Vector3 from "modloader64_api/math/Vector3";
import { IActor } from "modloader64_api/OOT/IActor";
import { OotEvents } from "modloader64_api/OOT/OOTAPI";
import fs from 'fs';

class TopNotification {
    text: string;
    pos: vec2;
    color: vec4;
    offscreen: number;

    constructor(text: string) {
        this.text = text;
        this.offscreen = (text.length * 10);
        this.pos = xy(this.offscreen / -1, 0);
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
                if (this.ModLoader.ImGui.menuItem("Script Editor")) {
                    this.openScriptEditor = true;
                }
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
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            if (this.ModLoader.ImGui.button("Stop", xy(100, 60))) {
                this.scriptTick = undefined;
                this.scriptVi = undefined;
            }
            this.ModLoader.ImGui.end();
            if (this.scriptVi !== undefined) {
                try{
                    this.scriptVi();
                }catch(err){
                    this.ModLoader.logger.error("Script error");
                    this.ModLoader.logger.error(err.stack);
                    this.scriptVi = undefined;
                    this.scriptTick = undefined;
                }
            }
        }
    }

    onTick() {
        if (this.scriptTick !== undefined) {
            try{
                this.scriptTick();
            }catch(err){
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

    update() {
        if (this.topNotifications.length > 0 && this.currentTopNotification === undefined) {
            this.currentTopNotification = this.topNotifications.shift();
            return;
        }
        if (this.topBarHeight > 0) {
            this.ModLoader.ImGui.getWindowDrawList().addRectFilled(xy(0, 0), xy(this.ModLoader.ImGui.getWindowWidth(), this.topBarHeight), rgba(0, 0, 0, 255));
        }
        if (this.currentTopNotification !== undefined) {
            if (this.currentTopNotification.pos.x > this.ModLoader.ImGui.getWindowWidth() + this.currentTopNotification.offscreen) {
                this.currentTopNotification = undefined;
                this.retracttopBar = true;
            } else {
                if (this.topBarHeight < this.topBarMaxHeight) {
                    this.topBarHeight++;
                } else {
                    this.ModLoader.ImGui.getWindowDrawList().addTextEx(this.ModLoader.ImGui.getFont(), 36, this.currentTopNotification.pos, this.currentTopNotification.color, this.currentTopNotification.text);
                    this.currentTopNotification.pos.x += 1;
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

    constructor(text: string) {
        this.text = text;
        this.pos = xy(0, 0);
        this.fgcolor = rgba(255, 255, 255, 255);
        this.bgcolor = rgba(0, 0, 0, 255);
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

    loadResources() {
        try {
            this.font = this.ModLoader.Gfx.createFont();
            this.font.loadFromFile(path.resolve(__dirname, "resources", "PolygonParty-3KXM.ttf"), 30, 2);
        } catch (err) {
            this.ModLoader.logger.error(err);
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
                this.pos.y -= 1;
            } else {
                this.currentNotif.fgcolor.w -= 2 / 255;
                this.currentNotif.bgcolor.w -= 2 / 255;
                if (this.currentNotif.fgcolor.w <= 0) {
                    this.currentNotif = undefined;
                    return;
                }
            }
            if (this.currentNotif.icon !== undefined) {
                let dst = xywh(this.pos.x - 32, this.pos.y, this.currentNotif.icon.width, this.currentNotif.icon.height);
                this.ModLoader.Gfx.addSprite(this.ModLoader.ImGui.getWindowDrawList(), this.currentNotif.icon, xywh(0, 0, this.currentNotif.icon.width, this.currentNotif.icon.height), dst, rgba(255, 255, 255, this.currentNotif.fgcolor.w * 255), FlipFlags.None);
            }
            this.ModLoader.Gfx.addText(this.ModLoader.ImGui.getWindowDrawList(), this.font, this.currentNotif.text, this.pos, this.currentNotif.fgcolor, this.currentNotif.bgcolor, xy(1, 1));
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
        } catch (err) {
            this.ModLoader.logger.error(err);
        }
    }

    getmtx(addr: number) {
        let m = [];
        let offset = 0;
        for (let i = 0; i < 4; i++) {
            let a = this.ModLoader.emulator.rdramReadF32(addr + offset + 0);
            let b = this.ModLoader.emulator.rdramReadF32(addr + offset + 4);
            let c = this.ModLoader.emulator.rdramReadF32(addr + offset + 8);
            let d = this.ModLoader.emulator.rdramReadF32(addr + offset + 0xC);
            m.push(a, b, c, d);
            offset += 0x10;
        }
        return m;
    };

    onTick() {
    }

    update() {
    }
}

class MenubarPlugin implements IPlugin {
    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    pluginHash?: string | undefined;
    resourcesLoaded: boolean = false;
    menubar!: MenubarWidget;
    topNotifications!: TopBarWidget;
    bottomRight!: BottomRightWidget;
    achievements!: AchievementWidget;

    preinit(): void {
        this.menubar = new MenubarWidget(this.ModLoader);
        this.topNotifications = new TopBarWidget(this.ModLoader);
        this.bottomRight = new BottomRightWidget(this.ModLoader);
        this.achievements = new AchievementWidget(this.ModLoader);
    }

    init(): void {
    }
    postinit(): void {
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

    @onCreateResources()
    onResourceLoad() {
        if (!this.resourcesLoaded) {
            this.bottomRight.loadResources();
            this.achievements.loadResources();
            this.resourcesLoaded = true;
        }
    }

    @onViUpdate()
    onViUpdate() {
        this.menubar.update();
        this.topNotifications.update();
        this.bottomRight.update();
        this.achievements.update();
    }

}

module.exports = MenubarPlugin;