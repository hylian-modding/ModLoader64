import fs from 'fs-extra';
import path from 'path';
import {
    ILogger,
    IConfig,
    IPlugin,
    IModLoaderAPI,
    ICore,
    ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import {
    bus,
    EventsClient,
    EventsServer,
    setupEventHandlers,
    markPrototypeProcessed,
} from 'modloader64_api/EventHandler';
import {
    INetworkPlayer,
    ClientController,
    ServerController,
    setupNetworkHandlers,
} from 'modloader64_api/NetworkHandler';
import IConsole from 'modloader64_api/IConsole';
import { internal_event_bus } from './modloader64';
import IModLoaderConfig from './IModLoaderConfig';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import { setupCoreInject } from 'modloader64_api/CoreInjection';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import NetworkEngine, { LobbyManagerAbstract } from './NetworkEngine';
import { Pak } from 'modloader64_api/PakFormat';
import crypto from 'crypto';
import { GUIAPI } from 'modloader64_api/GUITunnel';
import { frameTimeoutContainer } from './frameTimeoutContainer';
import { ModLoaderErrorCodes } from 'modloader64_api/ModLoaderErrorCodes';
import zlib from 'zlib';
import { PayloadManager } from './PayloadManager';
import { pakVerifier } from './pakVerifier';
import moduleAlias from 'module-alias';
import { IMath } from 'modloader64_api/math/IMath';
import { Math } from './Math';
import { setupMLInjects } from 'modloader64_api/ModLoaderAPIInjector';
import { setupLifecycle, LifeCycleEvents, lifecyclebus, setupLifecycle_IPlugin } from 'modloader64_api/PluginLifecycle';
import { ML_UUID } from './uuid/mluuid';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { AnalyticsManager } from 'modloader64_api/analytics/Analytics';
import { Analytics } from 'modloader64_api/analytics/Analytics';
import { MonkeyPatch_Yaz0Encode } from '../monkeypatches/Utils';

class pluginLoader {
    plugin_directories: string[];
    core_plugins: any = {};
    plugin_folders: string[] = [];
    plugins: any[] = [];
    selected_core = '';
    loaded_core: ICore = {} as ICore;
    config: IConfig;
    logger: ILogger;
    onTickHandle!: any;
    header!: IRomHeader;
    curFrame = -1;
    frameTimeouts: Map<string, frameTimeoutContainer> = new Map<
        string,
        frameTimeoutContainer
    >();
    crashCheck!: any;
    lastCrashCheckFrame = -1;
    payloadManager!: PayloadManager;
    injector!: Function;
    lifecycle_funcs: Map<LifeCycleEvents, Array<Function>> = new Map<LifeCycleEvents, Array<Function>>();
    processNextFrame: boolean = true;

    constructor(dirs: string[], config: IConfig, logger: ILogger) {
        this.plugin_directories = dirs;
        this.config = config;
        this.logger = logger;
        let cleanup: Function = function () {
            fs.readdirSync(process.cwd()).forEach((file: string) => {
                let parse = path.parse(file);
                if (parse.name.indexOf('ModLoader64_temp_') > -1) {
                    fs.removeSync(file);
                }
            });
        };
        internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
            cleanup();
        });
        cleanup();
        this.lifecycle_funcs.set(LifeCycleEvents.PREINIT, []);
        this.lifecycle_funcs.set(LifeCycleEvents.INIT, []);
        this.lifecycle_funcs.set(LifeCycleEvents.POSTINIT, []);
        this.lifecycle_funcs.set(LifeCycleEvents.ONTICK, []);
        lifecyclebus.on(LifeCycleEvents.PREINIT, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.PREINIT)!.push(handler);
        });
        lifecyclebus.on(LifeCycleEvents.INIT, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.INIT)!.push(handler);
        });
        lifecyclebus.on(LifeCycleEvents.POSTINIT, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.POSTINIT)!.push(handler);
        });
        lifecyclebus.on(LifeCycleEvents.ONTICK, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONTICK)!.push(handler);
        });
    }

    registerCorePlugin(name: string, core: any) {
        this.core_plugins[name] = core;
    }

    private registerPlugin(plugin: any) {
        this.plugins.push(plugin);
    }

    private processFolder(dir: string) {
        let hash: string = "";
        let parse = path.parse(dir);
        if (parse.ext === '.pak') {
            let pakFile: Pak = new Pak(path.resolve(dir));
            let v: pakVerifier = new pakVerifier(this.logger);
            if (!v.verifyPak(pakFile, dir)) {
                return;
            }
            // Unpak first.
            dir = v.extractPakToTemp(pakFile, dir);
            hash = pakFile.pak.footer._hash;
        }
        if (!fs.lstatSync(path.resolve(dir)).isDirectory()) {
            return;
        }
        let pkg_file: string = path.resolve(path.join(dir, 'package.json'));
        if (!fs.existsSync(pkg_file)) {
            this.logger.error(
                'Plugin ' + parse.name + ' is missing package.json. Skipping.'
            );
            return;
        }
        let pkg: any = JSON.parse(fs.readFileSync(pkg_file).toString());
        if (pkg.core !== this.selected_core && pkg.core !== '*') {
            this.logger.info(
                'Plugin ' + pkg.name + ' does not belong to this core. Skipping.'
            );
            return;
        }

        this.logger.info('--------------------');
        this.logger.info('plugin: ' + pkg.name);
        this.logger.info('version: ' + pkg.version);
        this.logger.info('author: ' + pkg.author);
        this.logger.info('additional credits: ' + pkg.credits);

        if (pkg.main === undefined || pkg.main === "") {
            return;
        }

        let file: string = path.resolve(path.join(dir, pkg.main));

        moduleAlias.addAlias("@" + pkg.name.replace(" ", "_"), path.resolve(dir));
        parse = path.parse(file);
        if (parse.ext.indexOf('js') > -1) {
            let p = require(file);
            let plugin: any = new p();
            plugin['ModLoader'] = {} as IModLoaderAPI;
            plugin['ModLoader']['logger'] = this.logger.getLogger(parse.name);
            plugin['ModLoader']['config'] = this.config;
            Object.defineProperty(plugin, 'pluginName', {
                value: parse.name,
                writable: false,
            });
            setupEventHandlers(plugin);
            setupNetworkHandlers(plugin);
            setupCoreInject(plugin, this.loaded_core);
            setupLifecycle_IPlugin(plugin);
            markPrototypeProcessed(plugin);
            Object.keys(plugin).forEach((key: string) => {
                if (plugin[key] !== null && plugin[key] !== undefined) {
                    setupMLInjects((plugin as any)[key], plugin.ModLoader);
                    setupCoreInject((plugin as any)[key], this.loaded_core);
                    setupEventHandlers((plugin as any)[key]);
                    setupNetworkHandlers((plugin as any)[key]);
                    setupLifecycle((plugin as any)[key]);
                    markPrototypeProcessed((plugin as any)[key]);
                }
            });
            Object.defineProperty(plugin, 'metadata', {
                value: pkg,
                writable: false,
            });
            this.logger.info("Registered plugin " + pkg.name + ".");
            this.registerPlugin(plugin);
            this.plugin_folders.push(parse.dir);
            internal_event_bus.emit('PLUGIN_LOADED', { meta: pkg, instance: plugin, hash: hash });
        }
    }

    loadPluginsConstruct(header: IRomHeader, overrideCore = '') {
        // Start the core plugin.
        this.header = header;
        if (overrideCore !== '') {
            this.selected_core = overrideCore;
        }
        let core = this.core_plugins[this.selected_core];
        Object.freeze(this.logger);
        core['ModLoader'] = {};
        core['ModLoader']['logger'] = this.logger.getLogger(this.selected_core);
        core['ModLoader']['config'] = this.config;
        this.loaded_core = core;

        Object.defineProperty(this.loaded_core, 'rom_header', {
            value: header,
            writable: false,
        });

        Object.defineProperty(this.loaded_core, 'pluginName', {
            value: this.selected_core,
            writable: false,
        });

        setupEventHandlers(this.loaded_core);
        setupNetworkHandlers(this.loaded_core);
        markPrototypeProcessed(this.loaded_core);
        Object.keys(this.loaded_core).forEach((key: string) => {
            if ((this.loaded_core as any)[key] !== null && (this.loaded_core as any)[key] !== undefined) {
                setupMLInjects((this.loaded_core as any)[key], this.loaded_core.ModLoader);
                setupCoreInject((this.loaded_core as any)[key], this.loaded_core);
                setupEventHandlers((this.loaded_core as any)[key]);
                setupLifecycle((this.loaded_core as any)[key]);
                setupNetworkHandlers((this.loaded_core as any)[key]);
                markPrototypeProcessed((this.loaded_core as any)[key]);
            }
        });

        internal_event_bus.emit("CORE_LOADED", { name: this.selected_core, obj: this.loaded_core });

        // Start external plugins.
        this.plugin_directories.forEach((dir: string) => {
            if (fs.lstatSync(dir).isDirectory()) {
                let temp1 = path.resolve(path.join(dir));
                fs.readdirSync(temp1).forEach((file: string) => {
                    let temp2 = path.join(temp1, file);
                    this.processFolder(temp2);
                });
            }
        });
        internal_event_bus.on('onNetworkConnect', (evt: any) => {
            this.loaded_core.ModLoader.me = evt.me;
            this.plugins.forEach((plugin: IPlugin) => {
                plugin.ModLoader.me = evt.me;
            });
        });
    }

    loadPluginsPreInit(iconsole: IConsole) {
        Object.freeze(ClientController);
        Object.freeze(ServerController);
        let utils: IUtils = iconsole.getUtils();
        utils.hashBuffer = (buf: Buffer) => {
            return crypto
                .createHash('md5')
                .update(buf)
                .digest('hex');
        };
        utils.clearBuffer = (buf: Buffer) => {
            buf.fill('00', 0, buf.byteLength, 'hex');
            return buf;
        };
        utils.cloneBuffer = (buf: Buffer) => {
            let b: Buffer = Buffer.alloc(buf.byteLength);
            buf.copy(b);
            return b;
        };
        utils.setTimeoutFrames = (fn: Function, frames: number) => {
            if (frames <= 0) {
                frames = 1;
            }
            this.frameTimeouts.set(ML_UUID.getUUID(), new frameTimeoutContainer(fn, frames));
        };
        utils.getUUID = () => { return ML_UUID.getUUID(); };
        utils.stopEmulatorThisFrame = () => {
            this.processNextFrame = false;
            return this.processNextFrame;
        };

        // Monkey patch Yaz0Encode to have a cache.
        let monkeypatch: MonkeyPatch_Yaz0Encode = new MonkeyPatch_Yaz0Encode(utils);
        monkeypatch.patch();

        Object.freeze(utils);
        let lobby: string = this.config.data['NetworkEngine.Client']['lobby'];
        Object.freeze(lobby);
        let lma: LobbyManagerAbstract = Object.freeze(new LobbyManagerAbstract());
        let rom: IRomMemory = Object.freeze((iconsole.getMemoryAccess() as unknown as IRomMemory));
        let analytics: Analytics = Object.freeze(AnalyticsManager);
        let mlconfig = this.config.registerConfigCategory(
            'ModLoader64'
        ) as IModLoaderConfig;
        try {
            this.loaded_core.ModLoader.clientSide = ClientController;
            this.loaded_core.ModLoader.serverSide = ServerController;
            this.loaded_core.ModLoader.utils = utils;
            this.loaded_core.ModLoader.clientLobby = lobby;
            this.loaded_core.ModLoader.lobbyManager = lma;
            this.loaded_core.ModLoader.rom = rom;
            this.loaded_core.ModLoader.analytics = analytics;
            this.loaded_core.ModLoader.isClient = mlconfig.isClient;
            this.loaded_core.ModLoader.isServer = mlconfig.isServer;
            this.loaded_core.preinit();
        } catch (err) {
            if (err) {
                this.logger.error(err);
                this.logger.error("Failed to configure core!");
                this.logger.error(this.selected_core);
                this.logger.error(this.loaded_core.constructor.name);
                process.exit(1);
            }
        }

        this.plugins.forEach((plugin: IPlugin) => {
            plugin.ModLoader.clientSide = ClientController;
            plugin.ModLoader.serverSide = ServerController;
            plugin.ModLoader.utils = utils;
            plugin.ModLoader.clientLobby = lobby;
            plugin.ModLoader.lobbyManager = lma;
            plugin.ModLoader.rom = rom;
            plugin.ModLoader.analytics = analytics;
            plugin.ModLoader.isClient = mlconfig.isClient;
            plugin.ModLoader.isServer = mlconfig.isServer;
        });
        this.lifecycle_funcs.get(LifeCycleEvents.PREINIT)!.forEach((value: Function) => {
            value();
        });
    }

    loadPluginsInit(
        me: INetworkPlayer,
        iconsole: IConsole,
        net: NetworkEngine.Client
    ) {
        Object.freeze(me);
        this.loaded_core.ModLoader.me = me;
        this.loaded_core.init();
        this.plugins.forEach((plugin: IPlugin) => {
            plugin.ModLoader.me = me;
        });
        this.lifecycle_funcs.get(LifeCycleEvents.INIT)!.forEach((value: Function) => {
            value();
        });
        this.onTickHandle = () => {
            let frame: number = iconsole.getFrameCount();
            if (frame > -1) {
                this.loaded_core.onTick(frame);
                this.lifecycle_funcs.get(LifeCycleEvents.ONTICK)!.forEach((value: Function) => {
                    value(frame);
                });
                net.onTick();
                this.frameTimeouts.forEach(
                    (
                        value: frameTimeoutContainer,
                        key: string,
                        map: Map<string, frameTimeoutContainer>
                    ) => {
                        if (value.frames <= 0) {
                            value.fn();
                            this.frameTimeouts.delete(key);
                        } else {
                            value.frames--;
                        }
                    }
                );
                this.curFrame = frame;
                if (this.processNextFrame) {
                    iconsole.setFrameCount(-1);
                } else {
                    this.processNextFrame = true;
                }
            }
        };
        Object.freeze(this.onTickHandle);
        this.crashCheck = () => {
            if (!this.processNextFrame) {
                this.lastCrashCheckFrame = -1;
            }
            if (this.lastCrashCheckFrame === this.curFrame) {
                // Emulator probably died. Lets make a crash dump.
                let dump = zlib.deflateSync(
                    iconsole.getMemoryAccess().rdramReadBuffer(0x0, 0x1000000)
                );
                fs.writeFileSync(
                    './crash_dump.bin',
                    dump
                );
                internal_event_bus.emit(ModLoaderEvents.ON_CRASH, dump);
                bus.emit(ModLoaderEvents.ON_CRASH, dump);
                setTimeout(() => {
                    process.exit(ModLoaderErrorCodes.EMULATOR_CORE_FAILURE);
                }, 5 * 1000);
            } else {
                this.lastCrashCheckFrame = this.curFrame;
            }
        };
        Object.freeze(this.crashCheck);
    }

    loadPluginsPostinit(
        emulator: IMemory,
        iconsole: IConsole,
        config: IModLoaderConfig
    ) {
        this.payloadManager = Object.freeze(
            new PayloadManager(iconsole.getMemoryAccess(), this.logger)
        );
        let mainConfig = this.config.registerConfigCategory(
            'ModLoader64'
        ) as IModLoaderConfig;
        let emu: IMemory = Object.freeze(emulator);
        let math: IMath = Object.freeze(new Math(emu));
        this.loaded_core.ModLoader.emulator = emu;
        this.loaded_core.ModLoader.savestates = (emu as unknown) as ISaveState;
        this.loaded_core.ModLoader.gui = Object.freeze(
            new GUIAPI('core', this.loaded_core)
        );
        this.loaded_core.ModLoader.payloadManager = this.payloadManager;
        this.loaded_core.ModLoader.math = math;
        this.loaded_core.postinit();
        this.plugins.forEach((plugin: IPlugin) => {
            plugin.ModLoader.emulator = emu;
            plugin.ModLoader.payloadManager = this.payloadManager;
            plugin.ModLoader.math = math;
            plugin.ModLoader.gui = Object.freeze(
                new GUIAPI(plugin.pluginName as string, plugin)
            );
            plugin.ModLoader.savestates = (emu as unknown) as ISaveState;
        });
        this.lifecycle_funcs.get(LifeCycleEvents.POSTINIT)!.forEach((value: Function) => {
            value();
        });
        this.plugins.forEach((plugin: IPlugin) => {
            if (mainConfig.isClient) {
                bus.emit(EventsClient.ON_PLUGIN_READY, plugin);
            }
            if (mainConfig.isServer) {
                bus.emit(EventsServer.ON_PLUGIN_READY, plugin);
            }
        });
        this.injector = () => {
            iconsole.finishInjects();
            this.plugin_folders.forEach((dir: string) => {
                let test = path.join(
                    dir,
                    'payloads',
                    this.header.country_code + this.header.revision.toString()
                );
                if (fs.existsSync(test)) {
                    if (fs.lstatSync(test).isDirectory()) {
                        fs.readdirSync(test).forEach((payload: string) => {
                            let result: any = this.payloadManager.parseFile(
                                path.join(test, payload)
                            );
                            bus.emit(EventsClient.ON_PAYLOAD_INJECTED, {
                                file: payload,
                                result,
                            });
                        });
                    }
                }
            });
            iconsole.finishInjects();
            if (config.isClient) {
                bus.emit(EventsClient.ON_INJECT_FINISHED, {});
                setInterval(this.crashCheck, 5 * 1000);
            }
        };
        let testBuffer: Buffer = Buffer.from("MODLOADER64");
        emu.rdramWriteBuffer(0x80800000, testBuffer);
        if (testBuffer.toString() === emu.rdramReadBuffer(0x80800000, testBuffer.byteLength).toString()) {
            this.logger.info("16MB Expansion verified.");
            emu.rdramWriteBuffer(0x80800000, this.loaded_core.ModLoader.utils.clearBuffer(testBuffer));
        }
        this.injector();
        if (config.isClient) {
            setInterval(this.onTickHandle, 0);
        }
    }

    reinject(callback: Function) {
        this.loaded_core.ModLoader.utils.setTimeoutFrames(() => {
            this.injector();
            callback();
        }, 20);
    }
}

export default pluginLoader;
