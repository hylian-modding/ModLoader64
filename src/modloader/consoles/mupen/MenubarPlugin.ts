import { IPlugin, IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { onViUpdate } from "modloader64_api/PluginLifecycle";
import { bus, EventHandler } from "modloader64_api/EventHandler";
import {MenuEvents} from 'modloader64_api/Sylvain/MenuEvents';

class MenubarPlugin implements IPlugin {
    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    pluginHash?: string | undefined;
    cheatMenuEnabled: boolean = true;
    memoryViewerEnabled: boolean = true;

    preinit(): void {
    }
    init(): void {
    }
    postinit(): void {
    }
    onTick(frame?: number | undefined): void {
    }

    @EventHandler(MenuEvents.DISABLE_CHEATS)
    onDisableCheats(evt: any){
        this.cheatMenuEnabled = false;
    }

    @EventHandler(MenuEvents.DISABLE_MEMORY_VIEWER)
    onDisableMemoryViewer(evt: any){
        this.memoryViewerEnabled = false;
    }

    @onViUpdate()
    onViUpdate() {
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Utility")) {
                if (this.ModLoader.ImGui.menuItem("Input config")) {
                    bus.emit('openInputConfig', {});
                }
                if (this.cheatMenuEnabled){
                    if (this.ModLoader.ImGui.menuItem("Cheats")) {
                        bus.emit('openCheatConfig', {});
                    }
                }
                if (this.memoryViewerEnabled){
                    if (this.ModLoader.ImGui.menuItem("Memory viewer")) {
                        bus.emit('openMemViewer', {});
                    }
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
    }

}

module.exports = MenubarPlugin;