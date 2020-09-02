import { Frontend } from "./ml64_emu_addon";

export class StartInfoImpl implements Frontend.StartInfo{
    windowTitle: string;
    windowWidth: number;
    windowHeight: number;
    windowIcon?: Buffer | undefined;
    corePlugin: string;
    rspPlugin: string;
    videoPlugin: string;
    audioPlugin: string;
    inputPlugin: string;
    configDir: string;
    dataDir: string;

    constructor(windowTitle: string, windowWidth: number, windowHeight: number, corePlugin: string, rspPlugin: string, videoPlugin: string, audioPlugin: string, inputPlugin: string, configDir: string, dataDir: string){
        this.windowTitle = windowTitle;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.corePlugin = corePlugin;
        this.rspPlugin = rspPlugin;
        this.videoPlugin = videoPlugin;
        this.audioPlugin = audioPlugin;
        this.inputPlugin = inputPlugin;
        this.configDir = configDir;
        this.dataDir = dataDir;
    }
}