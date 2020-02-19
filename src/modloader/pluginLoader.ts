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
import uuid from 'uuid';
import { ModLoaderErrorCodes } from 'modloader64_api/ModLoaderErrorCodes';
import zlib from 'zlib';
import { PayloadManager } from './PayloadManager';
import { pakVerifier } from './pakVerifier';

class pluginLoader {
    plugin_directories: string[];
    core_plugins: any = {};
    plugin_folders: string[] = [];
    plugins: IPlugin[] = [];
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
    }

    registerCorePlugin(name: string, core: any) {
        this.core_plugins[name] = core;
    }

    private registerPlugin(plugin: any) {
        this.plugins.push(plugin);
    }

    private processFolder(dir: string) {
        let parse = path.parse(dir);
        if (parse.ext === '.pak') {
            let pakFile: Pak = new Pak(path.resolve(dir));
            let v: pakVerifier = new pakVerifier(this.logger);
            if (!v.verifyPak(pakFile, dir)) {
                return;
            }
            // Unpak first.
            dir = v.extractPakToTemp(pakFile, dir);
        } else if (parse.base.indexOf('.disabled') > -1) {
            return;
        } else if (parse.ext === '.bps') {
            return;
        }
        if (!fs.lstatSync(path.resolve(dir)).isDirectory) {
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

        let file: string = path.resolve(path.join(dir, pkg.main));

        parse = path.parse(file);
        if (parse.ext.indexOf('js') > -1) {
            let p = require(file);
            let plugin: IPlugin = new p() as IPlugin;
            plugin['ModLoader'] = {} as IModLoaderAPI;
            plugin['ModLoader']['logger'] = this.logger;
            plugin['ModLoader']['config'] = this.config;
            Object.defineProperty(plugin, 'pluginName', {
                value: parse.name,
                writable: false,
            });
            setupEventHandlers(plugin);
            setupNetworkHandlers(plugin);
            setupCoreInject(plugin, this.loaded_core);
            Object.defineProperty(plugin, 'metadata', {
                value: pkg,
                writable: false,
            });
            this.registerPlugin(plugin);
            this.plugin_folders.push(parse.dir);
        }
        internal_event_bus.emit('PLUGIN_LOADED', pkg);
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
        core['ModLoader']['logger'] = this.logger;
        core['ModLoader']['config'] = this.config;
        this.loaded_core = core;

        Object.defineProperty(this.loaded_core, 'rom_header', {
            value: header,
            writable: false,
        });

        setupEventHandlers(this.loaded_core);
        setupNetworkHandlers(this.loaded_core);

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
        utils.setTimeoutFrames = (fn: Function, frames: number) => {
            if (frames <= 0) {
                frames = 1;
            }
            this.frameTimeouts.set(uuid.v4(), new frameTimeoutContainer(fn, frames));
        };
        Object.freeze(utils);
        let lobby: string = this.config.data['NetworkEngine.Client']['lobby'];
        Object.freeze(lobby);
        let lma: LobbyManagerAbstract = Object.freeze(new LobbyManagerAbstract());

        try {
            this.loaded_core.ModLoader.clientSide = ClientController;
            this.loaded_core.ModLoader.serverSide = ServerController;
            this.loaded_core.ModLoader.utils = utils;
            this.loaded_core.ModLoader.clientLobby = lobby;
            this.loaded_core.ModLoader.lobbyManager = lma;
            this.loaded_core.preinit();
        } catch (err) {
            if (err){
                console.log(err);
                this.logger.error("Failed to configure core?");
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
            plugin.preinit();
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
            plugin.init();
        });
        this.onTickHandle = () => {
            let frame: number = iconsole.getFrameCount();
            if (frame > -1) {
                this.loaded_core.onTick(frame);
                this.plugins.forEach((plugin: IPlugin) => {
                    plugin.onTick(frame);
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
                iconsole.setFrameCount(-1);
            }
        };
        Object.freeze(this.onTickHandle);
        this.crashCheck = () => {
            if (this.lastCrashCheckFrame === this.curFrame) {
                // Emulator probably died. Lets make a crash dump.
                fs.writeFileSync(
                    './crash_dump.bin',
                    zlib.deflateSync(
                        iconsole.getMemoryAccess().rdramReadBuffer(0x0, 0x1000000)
                    )
                );
                internal_event_bus.emit(ModLoaderEvents.ON_CRASH, {});
                bus.emit(ModLoaderEvents.ON_CRASH, {});
                process.exit(ModLoaderErrorCodes.EMULATOR_CORE_FAILURE);
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
        this.loaded_core.ModLoader.emulator = emu;
        this.loaded_core.ModLoader.savestates = (emu as unknown) as ISaveState;
        this.loaded_core.ModLoader.gui = Object.freeze(
            new GUIAPI('core', this.loaded_core)
        );
        this.loaded_core.ModLoader.payloadManager = this.payloadManager;
        this.loaded_core.postinit();
        this.plugins.forEach((plugin: IPlugin) => {
            plugin.ModLoader.emulator = emu;
            plugin.ModLoader.payloadManager = this.payloadManager;
            plugin.ModLoader.gui = Object.freeze(
                new GUIAPI(plugin.pluginName as string, plugin)
            );
            plugin.ModLoader.savestates = (emu as unknown) as ISaveState;
            plugin.postinit();
            if (mainConfig.isClient) {
                bus.emit(EventsClient.ON_PLUGIN_READY, plugin);
            }
            if (mainConfig.isServer) {
                bus.emit(EventsServer.ON_PLUGIN_READY, plugin);
            }
        });
        this.loaded_core.ModLoader.utils.setTimeoutFrames(() => {
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
            bus.emit(EventsClient.ON_INJECT_FINISHED, {});
            iconsole.finishInjects();
        }, 20);
        if (config.isClient) {
            setInterval(this.onTickHandle, 0);
            setInterval(this.crashCheck, 10 * 1000);
        }
    }
}

export default pluginLoader;
