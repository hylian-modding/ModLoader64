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
    EventBus,
    setupPrivateEventHandlers,
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
import { setupCoreInject } from 'modloader64_api/CoreInjection';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import NetworkEngine, { LobbyManagerAbstract } from './NetworkEngine';
import { Pak, PakFooter } from 'modloader64_api/PakFormat';
import crypto from 'crypto';
import { GUIAPI } from 'modloader64_api/GUITunnel';
import { frameTimeoutContainer } from './frameTimeoutContainer';
import { PayloadManager } from './PayloadManager';
import { pakVerifier } from './pakVerifier';
import moduleAlias from 'module-alias';
import { IMath } from 'modloader64_api/math/IMath';
import { Math } from './Math';
import { setupMLInjects } from 'modloader64_api/ModLoaderAPIInjector';
import { setupLifecycle, LifeCycleEvents, lifecyclebus, setupLifecycle_IPlugin } from 'modloader64_api/PluginLifecycle';
import { ML_UUID } from './uuid/mluuid';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { MonkeyPatch_Yaz0Encode, MonkeyPatch_Yaz0Decode } from '../monkeypatches/Utils';
import { ModLoadOrder } from './ModLoadOrder';
import { setupSidedProxy, setupParentReference } from 'modloader64_api/SidedProxy/SidedProxy';
import { getAllFiles } from './getAllFiles';
import zip from 'adm-zip';
import { SoundSystem } from './AudioAPI/API/SoundSystem';
import { FakeSoundImpl } from 'modloader64_api/Sound/ISoundSystem';
import { Emulator_Callbacks } from 'modloader64_api/Sylvain/ImGui';
import { AnalyticsManager } from '../analytics/AnalyticsManager';
import { setupBindVar } from 'modloader64_api/BindVar';
import { Heap } from 'modloader64_api/heap';

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
    frameIntervals: Map<string, frameTimeoutContainer> = new Map<
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

    private processInternalPlugin(pluginPath: string, iconsole: IConsole) {
        if (pluginPath === "") return;
        let file: string = pluginPath;
        let parse = path.parse(pluginPath);
        if (!fs.existsSync(pluginPath)) {
            // Try all combos.
            let np = path.resolve(parse.dir, parse.name + ".mls");
            if (fs.existsSync(np)) {
                pluginPath = np;
            } else {
                np = path.resolve(parse.dir, parse.name + ".mlz");
                if (fs.existsSync(np)) {
                    pluginPath = np;
                }
            }
        }
        if (parse.ext.indexOf('js') > -1 || parse.ext.indexOf("mls")) {
            let p = require(file);
            let plugin: any = new p();
            plugin['ModLoader'] = {} as IModLoaderAPI;
            plugin['ModLoader']['logger'] = this.logger.getLogger(parse.name);
            plugin['ModLoader']['config'] = this.config;
            plugin['ModLoader']['publicBus'] = bus;
            plugin['ModLoader']['privateBus'] = new EventBus();
            plugin["Binding"] = iconsole;
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
            setupEventHandlers(plugin, bus);
            setupPrivateEventHandlers(plugin, plugin.ModLoader.privateBus);
            setupNetworkHandlers(plugin);
            setupCoreInject(plugin, this.loaded_core);
            setupLifecycle_IPlugin(plugin);
            setupLifecycle(plugin);
            Object.keys(plugin).forEach((key: string) => {
                if (plugin[key] !== null && plugin[key] !== undefined) {
                    setupParentReference((plugin as any)[key], plugin);
                    setupMLInjects((plugin as any)[key], plugin.ModLoader);
                    setupCoreInject((plugin as any)[key], this.loaded_core);
                    setupEventHandlers((plugin as any)[key], bus);
                    setupPrivateEventHandlers((plugin as any)[key], plugin.ModLoader.privateBus);
                    setupNetworkHandlers((plugin as any)[key]);
                    setupLifecycle((plugin as any)[key]);
                    setupBindVar((plugin as any)[key], iconsole.getMemoryAccess());
                    markPrototypeProcessed((plugin as any)[key]);
                }
            });

            let fn = (instance: any, parent: any) => {
                setupParentReference(instance, parent);
                setupMLInjects(instance, parent.ModLoader);
                setupCoreInject(instance, this.loaded_core);
                setupEventHandlers(instance, bus);
                setupPrivateEventHandlers(instance, parent.ModLoader.privateBus);
                setupNetworkHandlers(instance);
                setupLifecycle(instance);
                Object.keys(instance).forEach((key: string) => {
                    if (instance[key] !== null && instance[key] !== undefined) {
                        setupParentReference((instance as any)[key], parent);
                        setupMLInjects((instance as any)[key], plugin.ModLoader);
                        setupCoreInject((instance as any)[key], this.loaded_core);
                        setupEventHandlers((instance as any)[key], bus);
                        setupPrivateEventHandlers((instance as any)[key], parent.ModLoader.privateBus);
                        setupNetworkHandlers((instance as any)[key]);
                        setupLifecycle((instance as any)[key]);
                        setupBindVar((instance as any)[key], iconsole.getMemoryAccess());
                        markPrototypeProcessed((instance as any)[key]);
                    }
                });
                let children = setupSidedProxy(instance, mlconfig.isClient, mlconfig.isServer, this.selected_core);
                for (let i = 0; i < children.length; i++) {
                    fn(children[i], plugin);
                }
                markPrototypeProcessed(instance);
            };
            let children = setupSidedProxy(plugin, mlconfig.isClient, mlconfig.isServer, this.selected_core);
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

    private processFolder(dir: string, iconsole: IConsole) {
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
        parse = path.parse(file);
        let p: any;
        if (p === undefined && fs.existsSync(path.resolve(parse.dir, parse.name + ".js"))) {
            p = require(path.resolve(parse.dir, parse.name + ".js"));
        }
        if (p === undefined && fs.existsSync(path.resolve(parse.dir, parse.name + ".mls"))) {
            p = require(path.resolve(parse.dir, parse.name + ".mls"));
        }
        if (p === undefined && fs.existsSync(path.resolve(parse.dir, parse.name + ".mlz"))) {
            p = require(path.resolve(parse.dir, parse.name + ".mlz"));
        }
        if (p.hasOwnProperty("default")){
            if (p["default"] !== undefined){
                p = p["default"];
            }
        }
        let plugin: any = new p();
        plugin['ModLoader'] = {} as IModLoaderAPI;
        plugin['ModLoader']['logger'] = this.logger.getLogger(parse.name);
        plugin['ModLoader']['config'] = this.config;
        plugin['ModLoader']['publicBus'] = bus;
        plugin['ModLoader']['privateBus'] = new EventBus();
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
        setupEventHandlers(plugin, bus);
        setupPrivateEventHandlers(plugin, plugin.ModLoader.privateBus);
        setupNetworkHandlers(plugin);
        setupCoreInject(plugin, this.loaded_core);
        setupLifecycle_IPlugin(plugin);
        setupLifecycle(plugin);
        setupBindVar(plugin, iconsole.getMemoryAccess());
        Object.keys(plugin).forEach((key: string) => {
            if (plugin[key] !== null && plugin[key] !== undefined) {
                setupParentReference((plugin as any)[key], plugin);
                setupMLInjects((plugin as any)[key], plugin.ModLoader);
                setupCoreInject((plugin as any)[key], this.loaded_core);
                setupEventHandlers((plugin as any)[key], bus);
                setupPrivateEventHandlers((plugin as any)[key], plugin.ModLoader.privateBus);
                setupNetworkHandlers((plugin as any)[key]);
                setupLifecycle((plugin as any)[key]);
                setupBindVar((plugin as any)[key], iconsole.getMemoryAccess());
                markPrototypeProcessed((plugin as any)[key]);
            }
        });

        let fn = (instance: any, parent: any) => {
            setupParentReference(instance, parent);
            setupMLInjects(instance, parent.ModLoader);
            setupCoreInject(instance, this.loaded_core);
            setupEventHandlers(instance, bus);
            setupPrivateEventHandlers(instance, parent.ModLoader.privateBus);
            setupNetworkHandlers(instance);
            setupLifecycle(instance);
            Object.keys(instance).forEach((key: string) => {
                if (instance[key] !== null && instance[key] !== undefined) {
                    setupParentReference((instance as any)[key], parent);
                    setupMLInjects((instance as any)[key], plugin.ModLoader);
                    setupCoreInject((instance as any)[key], this.loaded_core);
                    setupEventHandlers((instance as any)[key], bus);
                    setupPrivateEventHandlers((instance as any)[key], plugin.ModLoader.privateBus);
                    setupNetworkHandlers((instance as any)[key]);
                    setupLifecycle((instance as any)[key]);
                    setupBindVar((instance as any)[key], iconsole.getMemoryAccess());
                    markPrototypeProcessed((instance as any)[key]);
                }
            });
            let children = setupSidedProxy(instance, mlconfig.isClient, mlconfig.isServer, this.selected_core);
            for (let i = 0; i < children.length; i++) {
                fn(children[i], plugin);
            }
            markPrototypeProcessed(instance);
        };
        let children = setupSidedProxy(plugin, mlconfig.isClient, mlconfig.isServer, this.selected_core);
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
        core['ModLoader']['publicBus'] = bus;
        core['ModLoader']['privateBus'] = new EventBus();
        this.loaded_core = core;

        Object.defineProperty(this.loaded_core, 'rom_header', {
            value: header,
            writable: false,
        });

        Object.defineProperty(this.loaded_core, 'pluginName', {
            value: this.selected_core,
            writable: false,
        });

        setupEventHandlers(this.loaded_core, bus);
        setupPrivateEventHandlers(this.loaded_core, this.loaded_core.ModLoader.privateBus);
        setupNetworkHandlers(this.loaded_core);
        setupLifecycle(this.loaded_core);
        markPrototypeProcessed(this.loaded_core);
        Object.keys(this.loaded_core).forEach((key: string) => {
            if ((this.loaded_core as any)[key] !== null && (this.loaded_core as any)[key] !== undefined) {
                setupMLInjects((this.loaded_core as any)[key], this.loaded_core.ModLoader);
                setupCoreInject((this.loaded_core as any)[key], this.loaded_core);
                setupEventHandlers((this.loaded_core as any)[key], bus);
                setupPrivateEventHandlers((this.loaded_core as any)[key], this.loaded_core.ModLoader.privateBus);
                setupLifecycle((this.loaded_core as any)[key]);
                setupNetworkHandlers((this.loaded_core as any)[key]);
                setupBindVar((this.loaded_core as any)[key], this.loaded_core.ModLoader.emulator);
                markPrototypeProcessed((this.loaded_core as any)[key]);
            }
        });

        internal_event_bus.emit("CORE_LOADED", { name: this.selected_core, obj: this.loaded_core });

        // Start internal plugins.
        this.processInternalPlugin(console.getInternalPlugin(), console);

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
                        this.processFolder(path.resolve(files[i]), console);
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
                        this.processFolder(temp2, console);
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
            let id = ML_UUID.getUUID();
            this.frameTimeouts.set(id, new frameTimeoutContainer(fn, frames));
            return id;
        };
        utils.setIntervalFrames = (fn: Function, frames: number): string => {
            if (frames <= 0) {
                frames = 1;
            }
            let id = ML_UUID.getUUID();
            this.frameIntervals.set(id, new frameTimeoutContainer(fn, frames));
            return id;
        };
        utils.clearIntervalFrames = (id: string): boolean => {
            if (this.frameIntervals.has(id)) {
                return this.frameIntervals.delete(id);
            }
            return false;
        };
        utils.getUUID = () => { return ML_UUID.getUUID(); };

        // Backwards compatibility is arse.
        global.ModLoader["deprecationWarnings"] = { utilBitCount8: false, utilBitCount16: false, utilBitCount32: false, utilBitCountBuffer: false };
        utils.utilBitCount8 = (value: number) => {
            if (!global.ModLoader.deprecationWarnings.utilBitCount8) {
                this.logger.warn("utilBitCount8 is deprecated. Please use bitCount8 on IMemory instead.");
                global.ModLoader.deprecationWarnings.utilBitCount8 = true;
            }
            return iconsole.getMemoryAccess().bitCount8(value);
        };
        utils.utilBitCount16 = (value: number) => {
            if (!global.ModLoader.deprecationWarnings.utilBitCount16) {
                this.logger.warn("utilBitCount16 is deprecated. Please use bitCount16 on IMemory instead.");
                global.ModLoader.deprecationWarnings.utilBitCount16 = true;
            }
            return iconsole.getMemoryAccess().bitCount16(value);
        };
        utils.utilBitCount32 = (value: number) => {
            if (!global.ModLoader.deprecationWarnings.utilBitCount32) {
                this.logger.warn("utilBitCount32 is deprecated. Please use bitCount32 on IMemory instead.");
                global.ModLoader.deprecationWarnings.utilBitCount32 = true;
            }
            return iconsole.getMemoryAccess().bitCount32(value);
        };
        utils.utilBitCountBuffer = (buf: Buffer, offset: number, length: number) => {
            if (!global.ModLoader.deprecationWarnings.utilBitCountBuffer) {
                this.logger.warn("utilBitCountBuffer is deprecated. Please use bitCountBuffer on IMemory instead.");
                global.ModLoader.deprecationWarnings.utilBitCountBuffer = true;
            }
            return iconsole.getMemoryAccess().bitCountBuffer(buf, offset, length);
        };

        let fn = (modid: string): boolean => {
            for (let i = 0; i < this.plugins.length; i++) {
                if (this.plugins[i].pluginName === modid) {
                    return true;
                }
            }
            return this.selected_core === modid;
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
        let rom: IRomMemory = Object.freeze(iconsole.getRomAccess());
        let mlconfig = this.config.registerConfigCategory(
            'ModLoader64'
        ) as IModLoaderConfig;
        let ss: any;
        if (mlconfig.isClient) {
            ss = Object.freeze(new SoundSystem());
        } else {
            ss = Object.freeze(new FakeSoundImpl());
        }
        let analytics = Object.freeze(new AnalyticsManager());
        let debug = Object.freeze(iconsole.getDebuggerAccess());
        try {
            this.loaded_core.ModLoader.clientSide = ClientController;
            this.loaded_core.ModLoader.serverSide = ServerController;
            this.loaded_core.ModLoader.utils = utils;
            this.loaded_core.ModLoader.clientLobby = lobby;
            this.loaded_core.ModLoader.lobbyManager = lma;
            this.loaded_core.ModLoader.rom = rom;
            this.loaded_core.ModLoader.isClient = mlconfig.isClient;
            this.loaded_core.ModLoader.isServer = mlconfig.isServer;
            this.loaded_core.ModLoader.isModLoaded = fn;
            this.loaded_core.ModLoader.sound = ss;
            this.loaded_core.ModLoader.analytics = analytics;
            this.loaded_core.ModLoader.debugger = debug;
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
            plugin.ModLoader.isClient = mlconfig.isClient;
            plugin.ModLoader.isServer = mlconfig.isServer;
            plugin.ModLoader.sound = ss;
            plugin.ModLoader.isModLoaded = fn;
            plugin.ModLoader.analytics = analytics;
            plugin.ModLoader.debugger = debug;
        });
        this.lifecycle_funcs.get(LifeCycleEvents.PREINIT)!.forEach((value: Function) => {
            try {
                value();
            } catch (err) {
                this.logger.error("preinit error");
                this.logger.error(err.stack);
                process.exit(1);
            }
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
            try {
                value();
            } catch (err) {
                this.logger.error("init error");
                this.logger.error(err.stack);
                process.exit(1);
            }
        });
        this.onTickHandle = () => {
            try {
                let frame = iconsole.getFrameCount();
                this.loaded_core.onTick(frame);
                for (const [key, value] of this.lifecycle_funcs.get(LifeCycleEvents.ONTICK)!.entries()) {
                    value(frame);
                }
                net.onTick();
                for (const [key, value] of this.lifecycle_funcs.get(LifeCycleEvents.ONPOSTTICK)!.entries()) {
                    value(frame);
                }
                for (const [key, value] of this.frameTimeouts.entries()) {
                    if (value.frames <= 0) {
                        value.fn();
                        this.frameTimeouts.delete(key);
                    } else {
                        value.frames--;
                    }
                }
                for (const [key, value] of this.frameIntervals.entries()) {
                    if (value.frames <= 0) {
                        value.fn();
                        value.frames = value.originalFrames;
                    } else {
                        value.frames--;
                    }
                }
                this.curFrame = frame;
            } catch (err) {
                this.logger.error("onTick error");
                this.logger.error(err.stack);
                process.exit(1);
            }
        };
        this.onViHandle = () => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONVIUPDATE)!.forEach((value: Function) => {
                try {
                    value();
                } catch (err) {
                    this.logger.error("vi update error");
                    this.logger.error(err.stack);
                }
            });
        };
        this.onResourceHandle = () => {
            this.lifecycle_funcs.get(LifeCycleEvents.ONCREATERESOURCES)!.forEach((value: Function) => {
                try {
                    value();
                } catch (err) {
                    this.logger.error("create resources error");
                    this.logger.error(err.stack);
                }
            });
        };
        Object.freeze(this.onTickHandle);
        Object.freeze(this.onViHandle);
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
            try {
                value();
            } catch (err) {
                this.logger.error("postinit error");
                this.logger.error(err.stack);
                process.exit(1);
            }
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
            let heap: Heap | undefined = undefined;
            if (this.loaded_core.heap_size > 0) {
                heap = new Heap(this.loaded_core.ModLoader.emulator, this.loaded_core.heap_start, this.loaded_core.heap_size);
            }
            this.loaded_core.ModLoader.heap = heap;
            this.plugins.forEach((plugin: IPlugin) => {
                plugin.ModLoader.heap = heap;
            });
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
                this.loaded_core.ModLoader.utils.setTimeoutFrames(() => {
                    bus.emit(EventsClient.ON_HEAP_READY, {});
                }, 1);
            }
            this.logger.debug("Injection finished.");
        };
        if (config.isClient) {
            iconsole.on(Emulator_Callbacks.new_frame, this.onTickHandle);
            if (!config.disableVIUpdates) {
                iconsole.on(Emulator_Callbacks.vi_update, this.onViHandle);
                iconsole.on(Emulator_Callbacks.create_resources, this.onResourceHandle);
            }
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
