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
import { Pak, PakFooter } from 'modloader64_api/PakFormat';
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
import { MonkeyPatch_Yaz0Encode, MonkeyPatch_Yaz0Decode } from '../monkeypatches/Utils';
import { ModLoadOrder } from './ModLoadOrder';
import { setupSidedProxy, setupParentReference } from 'modloader64_api/SidedProxy/SidedProxy';
import { getAllFiles } from './getAllFiles';
import zip from 'adm-zip';
import { SoundSystem } from './AudioAPI/API/SoundSystem';
import { FakeSoundImpl } from 'modloader64_api/Sound/ISoundSystem';
import { Emulator_Callbacks } from 'modloader64_api/Sylvain/ImGui';
import bitwise from 'bitwise';

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
    onViHandle!: any;
    onResourceHandle!: any;
    header!: IRomHeader;
    curFrame = -1;
    frameTimeouts: Map<string, frameTimeoutContainer> = new Map<
        string,
        frameTimeoutContainer
    >();
    payloadManager!: PayloadManager;
    injector!: Function;
    lifecycle_funcs: Map<LifeCycleEvents, Array<Function>> = new Map<LifeCycleEvents, Array<Function>>();
    processNextFrame: boolean = true;
    resetting: boolean = false;

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
        this.lifecycle_funcs.set(LifeCycleEvents.ONPOSTTICK, []);
        this.lifecycle_funcs.set(LifeCycleEvents.ONVIUPDATE, []);
        this.lifecycle_funcs.set(LifeCycleEvents.ONCREATERESOURCES, []);
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
        lifecyclebus.on(LifeCycleEvents.ONPOSTTICK, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONPOSTTICK)!.push(handler);
        });
        lifecyclebus.on(LifeCycleEvents.ONVIUPDATE, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONVIUPDATE)!.push(handler);
        });
        lifecyclebus.on(LifeCycleEvents.ONCREATERESOURCES, (handler: Function) => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONCREATERESOURCES)!.push(handler);
        });
    }

    registerCorePlugin(name: string, core: any) {
        this.core_plugins[name] = core;
    }

    private registerPlugin(plugin: any) {
        this.plugins.push(plugin);
    }

    private processInternalPlugin(pluginPath: string, console: IConsole) {
        let file: string = pluginPath;
        let parse = path.parse(pluginPath);
        if (parse.ext.indexOf('js') > -1) {
            let p = require(file);
            let plugin: any = new p();
            plugin['ModLoader'] = {} as IModLoaderAPI;
            plugin['ModLoader']['logger'] = this.logger.getLogger(parse.name);
            plugin['ModLoader']['config'] = this.config;
            plugin["Binding"] = console;
            Object.defineProperty(plugin, 'pluginName', {
                value: pluginPath,
                writable: false,
            });
            Object.defineProperty(plugin, 'pluginHash', {
                value: "",
                writable: false,
            });
            let mlconfig = this.config.registerConfigCategory(
                'ModLoader64'
            ) as IModLoaderConfig;
            setupEventHandlers(plugin);
            setupNetworkHandlers(plugin);
            setupCoreInject(plugin, this.loaded_core);
            setupLifecycle_IPlugin(plugin);
            setupLifecycle(plugin);
            Object.keys(plugin).forEach((key: string) => {
                if (plugin[key] !== null && plugin[key] !== undefined) {
                    setupParentReference((plugin as any)[key], plugin);
                    setupMLInjects((plugin as any)[key], plugin.ModLoader);
                    setupCoreInject((plugin as any)[key], this.loaded_core);
                    setupEventHandlers((plugin as any)[key]);
                    setupNetworkHandlers((plugin as any)[key]);
                    setupLifecycle((plugin as any)[key]);
                    markPrototypeProcessed((plugin as any)[key]);
                }
            });

            let fn = (instance: any, parent: any) => {
                setupParentReference(instance, parent);
                setupMLInjects(instance, parent.ModLoader);
                setupCoreInject(instance, this.loaded_core);
                setupEventHandlers(instance);
                setupNetworkHandlers(instance);
                setupLifecycle(instance);
                Object.keys(instance).forEach((key: string) => {
                    if (instance[key] !== null && instance[key] !== undefined) {
                        setupParentReference((instance as any)[key], parent);
                        setupMLInjects((instance as any)[key], plugin.ModLoader);
                        setupCoreInject((instance as any)[key], this.loaded_core);
                        setupEventHandlers((instance as any)[key]);
                        setupNetworkHandlers((instance as any)[key]);
                        setupLifecycle((instance as any)[key]);
                        markPrototypeProcessed((instance as any)[key]);
                    }
                });
                let children = setupSidedProxy(instance, mlconfig.isClient, mlconfig.isServer);
                for (let i = 0; i < children.length; i++) {
                    fn(children[i], plugin);
                }
                markPrototypeProcessed(instance);
            };
            let children = setupSidedProxy(plugin, mlconfig.isClient, mlconfig.isServer);
            for (let i = 0; i < children.length; i++) {
                fn(children[i], plugin);
            }
            markPrototypeProcessed(plugin);
            Object.defineProperty(plugin, 'metadata', {
                value: {},
                writable: false,
            });
            this.registerPlugin(plugin);
        }
    }

    private processFolder(dir: string) {
        if (!fs.existsSync(dir)) {
            return;
        }
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
        if (parse.ext === ".zip") {
            let zipFile: zip = new zip(path.resolve(dir));
            let ndir: string = fs.mkdtempSync('ModLoader64_temp_');
            zipFile.extractAllTo(ndir);
            let d = "";
            fs.readdirSync(ndir).forEach((dir: string) => {
                d = dir;
            });
            dir = path.join(ndir, d);
            let f = new PakFooter();
            f.generateHash(zipFile.toBuffer());
            hash = f._hash;
        }
        if (!fs.lstatSync(path.resolve(dir)).isDirectory()) {
            return;
        }
        let pkg_file: string = path.resolve(path.join(dir, 'package.json'));
        if (!fs.existsSync(pkg_file)) {
            this.logger.error('Plugin ' + parse.name + ' is missing package.json. Skipping.');
            return;
        }
        let pkg: any = JSON.parse(fs.readFileSync(pkg_file).toString());
        if (typeof pkg.core === "string") {
            if (pkg.core !== this.selected_core && pkg.core !== '*') {
                this.logger.info(
                    'Plugin ' + pkg.name + ' does not belong to this core. Skipping.'
                );
                return;
            }

        } else if (pkg.core instanceof Array) {
            let possibles: Array<string> = pkg.core as Array<string>;
            let yes: boolean = false;
            for (let i = 0; i < possibles.length; i++) {
                if (possibles[i] === this.selected_core) {
                    yes = true;
                }
            }
            if (!yes) {
                this.logger.info(
                    'Plugin ' + pkg.name + ' does not belong to this core. Skipping.'
                );
                return;
            }
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
        if (pkg.hasOwnProperty("modloader64_aliases")) {
            let aliases: any = pkg.modloader64_aliases;
            Object.keys(aliases).forEach((key: string) => {
                this.logger.debug("Aliasing " + aliases[key][0] + " as " + key + ".");
                moduleAlias.addAlias(key, path.resolve(dir, aliases[key][0]));
            });
        }
        parse = path.parse(file);
        if (parse.ext.indexOf('js') > -1) {
            let p = require(file);
            let plugin: any = new p();
            plugin['ModLoader'] = {} as IModLoaderAPI;
            plugin['ModLoader']['logger'] = this.logger.getLogger(parse.name);
            plugin['ModLoader']['config'] = this.config;
            Object.defineProperty(plugin, 'pluginName', {
                value: pkg.name,
                writable: false,
            });
            Object.defineProperty(plugin, 'pluginHash', {
                value: hash,
                writable: false,
            });
            let mlconfig = this.config.registerConfigCategory(
                'ModLoader64'
            ) as IModLoaderConfig;
            setupEventHandlers(plugin);
            setupNetworkHandlers(plugin);
            setupCoreInject(plugin, this.loaded_core);
            setupLifecycle_IPlugin(plugin);
            setupLifecycle(plugin);
            Object.keys(plugin).forEach((key: string) => {
                if (plugin[key] !== null && plugin[key] !== undefined) {
                    setupParentReference((plugin as any)[key], plugin);
                    setupMLInjects((plugin as any)[key], plugin.ModLoader);
                    setupCoreInject((plugin as any)[key], this.loaded_core);
                    setupEventHandlers((plugin as any)[key]);
                    setupNetworkHandlers((plugin as any)[key]);
                    setupLifecycle((plugin as any)[key]);
                    markPrototypeProcessed((plugin as any)[key]);
                }
            });

            let fn = (instance: any, parent: any) => {
                setupParentReference(instance, parent);
                setupMLInjects(instance, parent.ModLoader);
                setupCoreInject(instance, this.loaded_core);
                setupEventHandlers(instance);
                setupNetworkHandlers(instance);
                setupLifecycle(instance);
                Object.keys(instance).forEach((key: string) => {
                    if (instance[key] !== null && instance[key] !== undefined) {
                        setupParentReference((instance as any)[key], parent);
                        setupMLInjects((instance as any)[key], plugin.ModLoader);
                        setupCoreInject((instance as any)[key], this.loaded_core);
                        setupEventHandlers((instance as any)[key]);
                        setupNetworkHandlers((instance as any)[key]);
                        setupLifecycle((instance as any)[key]);
                        markPrototypeProcessed((instance as any)[key]);
                    }
                });
                let children = setupSidedProxy(instance, mlconfig.isClient, mlconfig.isServer);
                for (let i = 0; i < children.length; i++) {
                    fn(children[i], plugin);
                }
                markPrototypeProcessed(instance);
            };
            let children = setupSidedProxy(plugin, mlconfig.isClient, mlconfig.isServer);
            for (let i = 0; i < children.length; i++) {
                fn(children[i], plugin);
            }
            markPrototypeProcessed(plugin);
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

    loadPluginsConstruct(header: IRomHeader, console: IConsole, overrideCore = '') {
        // Start the core plugin.
        this.header = header;
        global.ModLoader["ROM_HEADER"] = this.header;
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
        setupLifecycle(this.loaded_core);
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

        // Start internal plugins.
        this.processInternalPlugin('./consoles/mupen/MenubarPlugin.js', console);

        // Start external plugins.
        if (fs.existsSync("./load_order.json")) {
            let order: ModLoadOrder = new ModLoadOrder();
            order = JSON.parse(fs.readFileSync("./load_order.json").toString());
            this.logger.info("Using load order saved from GUI...");
            let files: Array<string> = [];
            this.plugin_directories.forEach((dir: string) => {
                files = getAllFiles(dir, files);
            });
            Object.keys(order.loadOrder).forEach((key: string) => {
                for (let i = 0; i < files.length; i++) {
                    let p = path.parse(files[i]).base;
                    if (p === key && order.loadOrder[key] === true) {
                        this.processFolder(path.resolve(files[i]));
                        break;
                    }
                }
            });
        } else {
            this.plugin_directories.forEach((dir: string) => {
                if (fs.lstatSync(dir).isDirectory()) {
                    let temp1 = path.resolve(path.join(dir));
                    fs.readdirSync(temp1).forEach((file: string) => {
                        let temp2 = path.join(temp1, file);
                        this.processFolder(temp2);
                    });
                }
            });
        }
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

        // Reimplementing stuff from the old binding.
        utils.utilBitCount8 = (value: number) => {
            let r = 0;
            let b = bitwise.byte.read(value as any);
            for (let i = 0; i < b.length; i++) {
                if (b[i] > 0) {
                    r++;
                }
            }
            return r;
        };
        utils.utilBitCount16 = (value: number) => {
            let r = 0;
            let buf: Buffer = Buffer.alloc(0x2);
            buf.writeUInt16BE(value, 0);
            for (let i = 0; i < buf.byteLength; i++) {
                let b = bitwise.byte.read(buf.readUInt8(i) as any);
                for (let j = 0; j < b.length; j++) {
                    r++;
                }
            }
            return r;
        };
        utils.utilBitCount32 = (value: number) => {
            let r = 0;
            let buf: Buffer = Buffer.alloc(0x4);
            buf.writeUInt16BE(value, 0);
            for (let i = 0; i < buf.byteLength; i++) {
                let b = bitwise.byte.read(buf.readUInt8(i) as any);
                for (let j = 0; j < b.length; j++) {
                    r++;
                }
            }
            return r;
        };
        utils.utilBitCountBuffer = (buf: Buffer, offset: number, length: number) => {
            let r = 0;
            let buf2: Buffer = buf.slice(offset, offset + length);
            for (let i = 0; i < buf2.byteLength; i++) {
                let b = bitwise.byte.read(buf2.readUInt8(i) as any);
                for (let j = 0; j < b.length; j++) {
                    r++;
                }
            }
            return r;
        };

        let fn = (modid: string): boolean => {
            for (let i = 0; i < this.plugins.length; i++) {
                if (this.plugins[i].pluginName === modid) {
                    return true;
                }
            }
            return this.core_plugins.hasOwnProperty(modid);
        };
        fn = Object.freeze(fn);

        // Monkey patch Yaz0Encode to have a cache.
        let monkeypatch: MonkeyPatch_Yaz0Encode = new MonkeyPatch_Yaz0Encode(utils, iconsole.getYaz0Encoder());
        monkeypatch.patch();
        let monkeypatch2: MonkeyPatch_Yaz0Decode = new MonkeyPatch_Yaz0Decode(utils, iconsole.getYaz0Encoder());
        monkeypatch2.patch();

        Object.freeze(utils);
        let lobby: string = this.config.data['NetworkEngine.Client']['lobby'];
        Object.freeze(lobby);
        let lma: LobbyManagerAbstract = Object.freeze(new LobbyManagerAbstract());
        let rom: IRomMemory = Object.freeze((iconsole.getMemoryAccess() as unknown as IRomMemory));
        let analytics: Analytics = Object.freeze(AnalyticsManager);
        let mlconfig = this.config.registerConfigCategory(
            'ModLoader64'
        ) as IModLoaderConfig;
        let ss: any;
        if (mlconfig.isClient) {
            ss = Object.freeze(new SoundSystem());
        } else {
            ss = Object.freeze(new FakeSoundImpl());
        }
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
            this.loaded_core.ModLoader.isModLoaded = fn;
            this.loaded_core.ModLoader.sound = ss;
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
            plugin.ModLoader.sound = ss;
            plugin.ModLoader.isModLoaded = fn;
        });
        this.lifecycle_funcs.get(LifeCycleEvents.PREINIT)!.forEach((value: Function) => {
            value();
        });
    }

    resetPlayerInstance(me: INetworkPlayer) {
        this.loaded_core.ModLoader.me = me;
        this.plugins.forEach((plugin: IPlugin) => {
            plugin.ModLoader.me = me;
        });
    }

    loadPluginsInit(
        me: INetworkPlayer,
        iconsole: IConsole,
        net: NetworkEngine.Client
    ) {
        this.resetPlayerInstance(me);
        this.loaded_core.init();
        this.lifecycle_funcs.get(LifeCycleEvents.INIT)!.forEach((value: Function) => {
            value();
        });
        this.onTickHandle = () => {
            try {
                let frame = iconsole.getFrameCount();
                this.loaded_core.onTick(frame);
                this.lifecycle_funcs.get(LifeCycleEvents.ONTICK)!.forEach((value: Function) => {
                    value(frame);
                });
                this.lifecycle_funcs.get(LifeCycleEvents.ONPOSTTICK)!.forEach((value: Function) => {
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
            } catch (err) {
                this.logger.error(err.stack);
                throw err;
            }
        };
        this.onViHandle = () => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONVIUPDATE)!.forEach((value: Function) => {
                value();
            });
        };
        this.onResourceHandle = () => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONCREATERESOURCES)!.forEach((value: Function) => {
                value();
            });
        };
        Object.freeze(this.onTickHandle);
        Object.freeze(this.onViHandle);
        let emu: IMemory = iconsole.getMemoryAccess();
        iconsole.on(Emulator_Callbacks.core_started, () => {
            this.loaded_core.ModLoader.utils.setTimeoutFrames(() => {
                this.injector();
            }, 1);
        });
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
        let savestates = iconsole.getSaveStateManager();
        Object.freeze(savestates);
        this.loaded_core.ModLoader.savestates = savestates;
        this.loaded_core.ModLoader.gui = Object.freeze(
            new GUIAPI('core', this.loaded_core)
        );
        this.loaded_core.ModLoader.payloadManager = this.payloadManager;
        this.loaded_core.ModLoader.math = math;
        let imgui = iconsole.getImGuiAccess();
        let sdl = iconsole.getSDLAccess();
        let gfx = iconsole.getGfxAccess();
        let input = iconsole.getInputAccess();
        gfx.createTexture = () => {
            //@ts-ignore
            let t = new gfx.Texture();
            return t;
        };
        gfx.createFont = () => {
            //@ts-ignore
            let f = new gfx.Font();
            return f;
        };
        Object.freeze(imgui);
        Object.freeze(sdl);
        Object.freeze(gfx);
        Object.freeze(input);
        this.loaded_core.ModLoader.ImGui = imgui;
        this.loaded_core.ModLoader.SDL = sdl;
        this.loaded_core.ModLoader.Gfx = gfx;
        this.loaded_core.ModLoader.Input = input;
        this.loaded_core.postinit();
        this.plugins.forEach((plugin: IPlugin) => {
            plugin.ModLoader.emulator = emu;
            plugin.ModLoader.payloadManager = this.payloadManager;
            plugin.ModLoader.math = math;
            plugin.ModLoader.gui = Object.freeze(
                new GUIAPI(plugin.pluginName as string, plugin)
            );
            plugin.ModLoader.savestates = savestates;
            plugin.ModLoader.ImGui = imgui;
            plugin.ModLoader.SDL = sdl;
            plugin.ModLoader.Gfx = gfx;
            plugin.ModLoader.Input = input;
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
            let testBuffer: Buffer = Buffer.from("MODLOADER64");
            emu.rdramWriteBuffer(0x80800000, testBuffer);
            if (testBuffer.toString() === emu.rdramReadBuffer(0x80800000, testBuffer.byteLength).toString()) {
                this.logger.info("16MB Expansion verified.");
                emu.rdramWriteBuffer(0x80800000, this.loaded_core.ModLoader.utils.clearBuffer(testBuffer));
            }
            this.logger.debug("Starting injection...");
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
            }
            this.logger.debug("Injection finished.");
        };
        if (config.isClient) {
            iconsole.on(Emulator_Callbacks.new_frame, this.onTickHandle);
            iconsole.on(Emulator_Callbacks.vi_update, this.onViHandle);
            iconsole.on(Emulator_Callbacks.create_resources, this.onResourceHandle);
            internal_event_bus.on('CoreEvent.SoftReset', () => {
                this.logger.info("Reinvoking the payload injector...");
                this.reinject(() => {
                    this.logger.info("Soft reset complete. Sending alert to plugins.");
                    bus.emit(ModLoaderEvents.ON_SOFT_RESET_POST, {});
                });
            });
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
