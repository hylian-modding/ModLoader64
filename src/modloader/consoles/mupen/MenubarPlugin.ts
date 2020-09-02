import { IPlugin, IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { onViUpdate } from "modloader64_api/PluginLifecycle";
import { bus } from "modloader64_api/EventHandler";

class MenubarPlugin implements IPlugin {
    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    pluginHash?: string | undefined;
    preinit(): void {
    }
    init(): void {
    }
    postinit(): void {
    }
    onTick(frame?: number | undefined): void {
    }

    @onViUpdate()
    onViUpdate() {
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Utility")) {
                if (this.ModLoader.ImGui.menuItem("Input config")) {
                    bus.emit('openInputConfig', {});
                }
                if (this.ModLoader.ImGui.menuItem("Cheats")) {
                    bus.emit('openCheatConfig', {});
                }
                if (this.ModLoader.ImGui.menuItem("Memory viewer")) {
                    bus.emit('openMemViewer', {});
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