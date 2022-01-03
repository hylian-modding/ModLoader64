import { IMupen, EmuState, CoreEvent } from './IMupen';
import IMemory from 'modloader64_api/IMemory';
import IConsole from 'modloader64_api/IConsole';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { N64Header } from './N64Header';
import { IConfig, ILogger, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import path from 'path';
import { StartInfoImpl } from './StartInfoImpl';
import fs from 'fs';
import { IImGui } from 'modloader64_api/Sylvain/ImGui';
import { SDL } from 'modloader64_api/Sylvain/SDL';
import { Gfx } from 'modloader64_api/Sylvain/Gfx';
import { Input } from 'modloader64_api/Sylvain/Input';
import { bus } from 'modloader64_api/EventHandler';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';
import { internal_event_bus } from '../../modloader64';
import { vec2, xy } from 'modloader64_api/Sylvain/vec';
import { ModLoaderErrorCodes } from 'modloader64_api/ModLoaderErrorCodes';
import { Debugger, DebuggerEvents, RunState } from 'modloader64_api/Sylvain/Debugger';
import moduleAlias from 'module-alias';
import slash from 'slash';
import IModLoaderConfig from 'src/modloader/IModLoaderConfig';
import { IHiResTexture } from 'API/build/IHiResTexture';
import { MupenMonkeyPatches } from '../../../monkeypatches/Mupen';

interface MupenConfig {
    rsp: string;
    video: string;
    audio: string;
    input: string;
}

class N64 implements IConsole {
    rawModule: any;
    mupen: IMupen;
    rom_size: number;
    logger: ILogger;
    lobby: string;
    isPaused: boolean = false;
    callbacks: Map<string, Array<Function>> = new Map<string, Array<Function>>();
    texPath: string = "";
    cachePath: string = "";

    constructor(rom: string, logger: ILogger, lobby: string, config: IConfig) {
        this.logger = logger;
        this.lobby = lobby;
        moduleAlias.addAlias("@emulator", path.join(process.cwd(), "/emulator"));
        this.rawModule = require('@emulator/ml64_emu_addon.node');
        this.mupen = this.rawModule as IMupen;
        let size: vec2 = xy(800, 600);
        if (global.ModLoader.hasOwnProperty("ScreenWidth") && global.ModLoader.hasOwnProperty("ScreenHeight")) {
            size.x = global.ModLoader["ScreenWidth"];
            size.y = global.ModLoader["ScreenHeight"];
        } else {
            if (fs.existsSync(path.join(".", "emulator", "mupen64plus.cfg"))) {
                let opts: any = {};
                let mupen: string = fs.readFileSync(path.join(".", "emulator", "mupen64plus.cfg")).toString();
                let lines = mupen.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].indexOf("[") > -1) {
                        continue;
                    }
                    if (lines[i].indexOf("#") > -1) {
                        continue;
                    }
                    if (lines[i].trim() === "") {
                        continue;
                    }
                    let s = lines[i].split("=");
                    opts[s[0].trim()] = s[1].trim().replace(/['"]+/g, "");
                }
                global.ModLoader["ScreenWidth"] = parseInt(opts["ScreenWidth"]);
                global.ModLoader["ScreenHeight"] = parseInt(opts["ScreenHeight"]);
            } else {
                global.ModLoader["ScreenWidth"] = 800;
                global.ModLoader["ScreenHeight"] = 600;
            }
        }
        size.x = global.ModLoader["ScreenWidth"];
        size.y = global.ModLoader["ScreenHeight"];

        let emu_dir: string = global["module-alias"]["moduleAliases"]["@emulator"];
        let _config: MupenConfig = config.registerConfigCategory("Mupen64Plus") as MupenConfig;
        config.setData("Mupen64Plus", "rsp", "mupen64plus-rsp-hle");
        config.setData("Mupen64Plus", "video", "mupen64plus-video-gliden64");
        config.setData("Mupen64Plus", "audio", "mupen64plus-audio-sdl");
        config.setData("Mupen64Plus", "input", "mupen64plus-input-sdl");
        this.mupen.Frontend.startup(new StartInfoImpl("ModLoader64", size.x, size.y, emu_dir + "/mupen64plus", `${emu_dir}/${_config.rsp}`, `${emu_dir}/${_config.video}`, `${emu_dir}/${_config.audio}`, `${emu_dir}/${_config.input}`, emu_dir, emu_dir));
        this.texPath = this.mupen.M64p.Config.openSection("Video-GLideN64").getStringOr("txPath", "");
        this.cachePath = this.mupen.M64p.Config.openSection("Video-GLideN64").getStringOr("txCachePath", "");
        let doEvents = setInterval(() => this.mupen.Frontend.doEvents(), 10);
        const _64_MB = 64 * 1024 * 1024;

        let section = this.mupen.M64p.Config.openSection("Core");
        let screenshot_dir: string = path.resolve("./", "screenshots");
        if (!fs.existsSync(screenshot_dir)) {
            fs.mkdirSync(screenshot_dir);
        }
        section.setString("ScreenshotPath", screenshot_dir);
        this.mupen.M64p.Config.saveFile();
        this.registerCallback('window-closing', () => {
            if (this.mupen.M64p.getEmuState() === EmuState.Paused) {
                this.mupen.M64p.resume();
            }
            if (this.mupen.M64p.getEmuState() === EmuState.Running) {
                this.mupen.Frontend.stop();
            }
        });
        this.registerCallback('core-stopped', () => {
            clearInterval(doEvents);
            this.mupen.Frontend.shutdown();
            internal_event_bus.emit('SHUTDOWN_EVERYTHING', {});
            setTimeout(() => {
                process.exit(0);
            }, 3000);
        });
        this.registerCallback('core-event', (event: CoreEvent, data: number) => {
            if (event == CoreEvent.SoftReset) {
                try {
                    internal_event_bus.emit("REGISTER_TICK_TIMEOUT", () => {
                        this.logger.info("Soft reset detected. Sending alert to plugins.");
                        bus.emit(ModLoaderEvents.ON_SOFT_RESET_PRE, {});
                        this.logger.info("Letting the reset go through...");
                        this.softReset();
                        internal_event_bus.emit("CoreEvent.SoftReset", {});
                    });
                } catch (err: any) {
                    this.logger.error(err.stack);
                }
            } else if (event == CoreEvent.TakeNextScreenshot) {
                this.mupen.Frontend.takeNextScreenshot();
            } else if (event == CoreEvent.VolumeUp) {
                this.mupen.M64p.setAudioVolume(this.mupen.M64p.getAudioVolume() + 1);
                global.ModLoader["GLOBAL_VOLUME"] = this.mupen.M64p.getAudioVolume();
                bus.emit(ModLoaderEvents.ON_VOLUME_CHANGE, global.ModLoader["GLOBAL_VOLUME"]);
            } else if (event == CoreEvent.VolumeDown) {
                this.mupen.M64p.setAudioVolume(this.mupen.M64p.getAudioVolume() - 1);
                global.ModLoader["GLOBAL_VOLUME"] = this.mupen.M64p.getAudioVolume();
                bus.emit(ModLoaderEvents.ON_VOLUME_CHANGE, global.ModLoader["GLOBAL_VOLUME"]);
            } else if (event == CoreEvent.VolumeMute) {
                this.mupen.M64p.setAudioMuted(!this.mupen.M64p.isAudioMuted());
            } else if (event == CoreEvent.SetFastForward) {
                this.mupen.M64p.setSpeedFactor(300);
            } else if (event == CoreEvent.UnsetFastForward) {
                this.mupen.M64p.setSpeedFactor(100);
            } else if (event == CoreEvent.SpeedUp) {
                this.mupen.M64p.setSpeedFactor(this.mupen.M64p.getSpeedFactor() + 1);
            } else if (event == CoreEvent.SpeedDown) {
                this.mupen.M64p.setSpeedFactor(this.mupen.M64p.getSpeedFactor() - 1);
            } else if (event == CoreEvent.TogglePause) {
                if (!this.isPaused) {
                    this.mupen.M64p.pause();
                    this.isPaused = true;
                } else {
                    this.mupen.M64p.resume();
                    this.isPaused = false;
                }
            } else if (event == CoreEvent.Stop) {
                internal_event_bus.emit("SHUTDOWN_EVERYTHING", {});
                setTimeout(() => {
                    process.exit(0);
                }, 3000);
            } else if (event == CoreEvent.ChangeWindow) {
                this.mupen.Frontend.toggleFullScreen();
            }
        });
        if ((config.registerConfigCategory("ModLoader64") as IModLoaderConfig).enableDebugger) {
            let conf = this.mupen.M64p.Config.openSection("Core");
            conf.setInt("R4300Emulator", 0);
            conf.setBool("EnableDebugger", true);
            conf.save();
            this.registerCallback("debug-init", () => {
                console.log("DEBUGGER INITIALIZED");
                this.mupen.M64p.Debugger.setRunState(RunState.Running);
            });
            this.registerCallback("debug-update", (pc: number) => {
                console.log(`DEBUGGER: ${pc.toString(16)}`);
                let trig = this.mupen.M64p.Debugger.bpTriggeredBy();
                bus.emit(DebuggerEvents.UPDATE, trig);
            });
        }else{
            let conf = this.mupen.M64p.Config.openSection("Core");
            conf.setInt("R4300Emulator", 2);
            conf.setBool("EnableDebugger", false);
            conf.save();
        }
        logger.info("Loading rom: " + rom + ".");
        if (rom === "") {
            this.logger.error("No rom selected!");
            process.exit(ModLoaderErrorCodes.NO_ROM);
        }
        if (!fs.existsSync(rom)) {
            this.logger.error("No rom selected!");
            process.exit(ModLoaderErrorCodes.NO_ROM);
        }
        let _rom: Buffer = fs.readFileSync(rom);
        this.mupen.M64p.openRomFromMemory(_rom, _64_MB);
        this.rom_size = _rom.byteLength;
        bus.on('openInputConfig', () => {
            this.mupen.Frontend.openInputConfig();
        });
        bus.on('openMemViewer', () => {
            this.mupen.Frontend.openMemViewer();
        });
        bus.on('openCheatConfig', () => {
            this.mupen.Frontend.openCheatConfig();
        });
        bus.on('toggleFullScreen', () => {
            this.mupen.Frontend.toggleFullScreen();
        });
        bus.on(ModLoaderEvents.OVERRIDE_TEXTURE_PATH, (p: string) => {
            this.mupen.M64p.Config.openSection("Video-GLideN64").setString("txPath", p);
            this.mupen.M64p.Config.openSection("Video-GLideN64").setString("txCachePath", path.resolve(path.parse(p).dir, "cache"));
            this.mupen.M64p.Config.openSection("Video-GLideN64").setBool("txHiresEnable", true);
            this.mupen.M64p.Config.openSection("Video-GLideN64").setBool("txHiresFullAlphaChannel", true);
            this.mupen.M64p.Config.openSection("Video-GLideN64").setBool("txEnhancedTextureFileStorage", false);
            this.mupen.M64p.Config.openSection("Video-GLideN64").setBool("txHiresTextureFileStorage", false);
            this.mupen.M64p.Config.openSection("Video-GLideN64").setBool("txSaveCache", true);
            this.mupen.M64p.Config.saveFile();
        });

        MupenMonkeyPatches.patch(this.mupen);
    }

    private registerCallback(type: string, callback: Function) {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
            this.mupen.Frontend.on(type, (event: any, data: any) => {
                for (let i = 0; i < this.callbacks.get(type)!.length; i++) {
                    this.callbacks.get(type)![i](event, data);
                }
            });
        }
        this.callbacks.get(type)!.push(callback);
    }

    getYaz0Encoder(): IYaz0 {
        return this.mupen.Yaz0;
    }

    getInputAccess(): Input {
        return this.mupen.M64p.Input;
    }

    getGfxAccess(): Gfx {
        return this.mupen.Gfx;
    }

    getSDLAccess(): SDL {
        return this.mupen.SDL;
    }

    getImGuiAccess(): IImGui {
        return this.mupen.ImGui;
    }

    on(which: string, callback: any): void {
        this.registerCallback(which, callback);
    }

    startEmulator(preStartCallback: Function): IMemory {
        let rom_r = ((this.mupen.M64p.Memory as unknown) as IRomMemory);
        let buf: Buffer = preStartCallback();;
        if (Buffer.isBuffer(buf)) {
            rom_r.romWriteBuffer(0x0, buf);
        }
        this.setSaveDir(path.relative(path.resolve(global["module-alias"]["moduleAliases"]["@emulator"]), path.resolve(global["module-alias"]["moduleAliases"]["@emulator"], "saves", this.lobby)));
        this.mupen.Frontend.execute();
        internal_event_bus.on('emulator_started', () => {
            global.ModLoader["GLOBAL_VOLUME"] = this.mupen.M64p.getAudioVolume();
            bus.emit(ModLoaderEvents.ON_VOLUME_CHANGE, global.ModLoader["GLOBAL_VOLUME"]);
        });
        internal_event_bus.on('emulator_started', () => {
            if (this.texPath !== "") {
                /** @TODO rewrite all this shit. */
                this.mupen.M64p.Config.openSection("Video-GLideN64").setString("txPath", slash(this.texPath));
                this.mupen.M64p.Config.openSection("Video-GLideN64").setString("txCachePath", slash(this.cachePath));
            }
            this.mupen.M64p.Config.saveFile();
        });
        return this.mupen.M64p.Memory as IMemory;
    }

    stopEmulator(): void {
        this.mupen.Frontend.stop();
    }

    finishInjects(): void {
        this.mupen.M64p.Memory.invalidateCachedCode();
    }

    isEmulatorReady(): boolean {
        return this.mupen.M64p.getEmuState() === EmuState.Running;
    }

    getLoadedRom(): Buffer {
        let rom_r = ((this.mupen.M64p.Memory as unknown) as IRomMemory);
        const _64_MB = 64 * 1024 * 1024;
        let buf: Buffer = rom_r.romReadBuffer(0x0, _64_MB);
        return buf;
    }

    getRomOriginalSize(): number {
        return this.rom_size;
    }

    getFrameCount(): number {
        return this.mupen.M64p.getNumElapsedFrames();
    }

    setFrameCount(num: number): void {
    }

    pauseEmulator(): void {
        this.mupen.M64p.pause();
    }

    resumeEmulator(): void {
        this.mupen.M64p.resume();
    }

    getRomHeader(): IRomHeader {
        let raw = ((this.mupen.M64p.Memory as unknown) as IRomMemory).romReadBuffer(0x0, 0x50);
        return new N64Header(raw);
    }

    getMemoryAccess(): IMemory {
        return this.mupen.M64p.Memory;
    }

    getRomAccess(): IRomMemory {
        return this.mupen.M64p.Memory as any;
    }

    softReset(): void {
        this.mupen.M64p.softReset();
    }

    hardReset(): void {
        this.mupen.M64p.hardReset();
    }

    saveState(file: string): void {
        this.mupen.M64p.saveStateToFile(file);
    }

    loadState(file: string): void {
        this.mupen.M64p.loadStateFromFile(file);
    }

    setSaveDir(path: string): void {
        let section = this.mupen.M64p.Config.openSection('Core');
        section.setString('SaveSRAMPath', path);
        section.save();
    }

    getUtils(): IUtils {
        return (this.mupen.Yaz0 as unknown) as IUtils;
    }

    getSaveStateManager(): ISaveState {
        return this.mupen.M64p as ISaveState;
    }

    getDebuggerAccess(): Debugger {
        return this.mupen.M64p.Debugger;
    }

    getInternalPlugin(): string {
        return path.resolve(__dirname, "MenubarPlugin.js");
    }

    getHiResTextureAccess(): IHiResTexture {
        return this.mupen.M64p as IHiResTexture;
    }
}

export default N64;
