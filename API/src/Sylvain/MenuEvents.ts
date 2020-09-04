import { bus } from "../EventHandler";

export const enum MenuEvents{
    DISABLE_CHEATS = "disableCheatMenu",
    DISABLE_MEMORY_VIEWER = "disableMemoryViewer"
}

export function disableCheats(){
    bus.emit(MenuEvents.DISABLE_CHEATS, {});
}

export function disableMemoryViewer(){
    bus.emit(MenuEvents.DISABLE_MEMORY_VIEWER, {});
}