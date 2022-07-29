import configuration from './config';
import pluginLoader from './pluginLoader';
import fs from 'fs';
import path from 'path';
import {
    ILogger,
    IConfig,
    ICore,
    ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import IModLoaderConfig from './IModLoaderConfig';
import IMemory from 'modloader64_api/IMemory';
import IConsole from 'modloader64_api/IConsole';
import { bus, EventBus } from 'modloader64_api/EventHandler';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import {
    IGUITunnel,
    GUITunnel,
    GUITunnelPacket,
} from 'modloader64_api/GUITunnel';
import crypto from 'crypto';
import { ModLoaderErrorCodes } from 'modloader64_api/ModLoaderErrorCodes';
import { pakVerifier } from './pakVerifier';
import { Pak } from 'modloader64_api/PakFormat';
import zip from 'adm-zip';
import moduleAlias from 'module-alias';
import { RomPatchType, registerPatchType, PatchTypes } from 'modloader64_api/Patchers/PatchManager';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { ModLoaderRPC } from './rpc/ModLoaderRPC';
import { Cloudmax } from './Cloudmax';
import { getAllFiles } from './getAllFiles';
import { PakPatch } from './PakPatch';
import { IClientConfig } from './IClientConfig';
import { ExternalAPIData } from 'modloader64_api/ExternalAPIProvider';
import ConsoleManager from './ConsoleManager';
import { MupenDescriptor } from './consoles/mupen/MupenDescriptor';
import { ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import { NetworkEngine2_Client, NetworkEngine2_Server } from './networking/NetworkEngine2';

export const internal_event_bus = new EventBus();

class ModLoader64 {
    logger: ILogger;
    config: IConfig = new configuration(
        process.cwd() + '/ModLoader64-config.json'
    );
    data: IModLoaderConfig = this.config.registerConfigCategory(
        'ModLoader64'
    ) as IModLoaderConfig;
    clientConfig: IClientConfig = this.config.registerConfigCategory(
        'NetworkEngine.Client'
    ) as IClientConfig;
    plugins: pluginLoader;
    rom_folder = './roms';
    mods_folder = './mods';
    roms: string[];
    Server: NetworkEngine2_Server;
    Client: NetworkEngine2_Client;
    RPC: ModLoaderRPC;
    rom_path!: string;
    emulator!: IConsole;
    tunnel!: IGUITunnel;
    done = false;
    isFirstRun: boolean = false;
    consoleDescManager: ConsoleManager;

    constructor(logger: any, discord: string) {
        // TODO: Move this?
        moduleAlias.addAlias("@sound", path.join(process.cwd(), "/emulator"));

        global.ModLoader["logger"] = logger;
        if (global.ModLoader.hasOwnProperty("OVERRIDE_MODS_FOLDER")) {
            this.mods_folder = global.ModLoader.OVERRIDE_MODS_FOLDER;
        }
        if (global.ModLoader.hasOwnProperty("OVERRIDE_ROMS_FOLDER")) {
            this.rom_folder = global.ModLoader.OVERRIDE_ROMS_FOLDER;
        }
        if (!fs.existsSync(this.rom_folder)) {
            fs.mkdirSync(this.rom_folder);
        }
        if (!fs.existsSync(this.mods_folder)) {
            fs.mkdirSync(this.mods_folder);
        }
        this.roms = fs.readdirSync(this.rom_folder);
        this.logger = logger as ILogger;
        this.consoleDescManager = new ConsoleManager(this.logger.getLogger("BindingManager"));
        let mods_folder_array = [this.mods_folder];
        this.plugins = new pluginLoader(
            mods_folder_array,
            this.config,
            this.logger.getLogger("PluginLoader")
        );
        this.Server = new NetworkEngine2_Server(this.logger.getLogger("NetworkEngine.Server"), this.config);
        this.Client = new NetworkEngine2_Client(this.logger.getLogger("NetworkEngine.Client"), this.config, discord);
        this.RPC = new ModLoaderRPC();

        if (process.platform === 'win32') {
            let rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.on('SIGINT', function () {
                // @ts-ignore
                process.emit('SIGINT');
            });
        }

        process.on('SIGINT', function () {
            //graceful shutdown
            internal_event_bus.emit('SHUTDOWN_EVERYTHING', {});
            process.exit(0);
        });

        process.on('message', (msg: string) => {
            let packet: GUITunnelPacket = JSON.parse(msg) as GUITunnelPacket;
            bus.emit(packet.event, packet);
        });
    }

    start() {
        this.tunnel = new GUITunnel(process, 'internal_event_bus', this);
        let ofn = internal_event_bus.emit.bind(internal_event_bus);
        ((inst: ModLoader64) => {
            internal_event_bus.emit = function (
                event: string | string[],
                ...values: any[]
            ): boolean {
                try {
                    inst.tunnel.send(event as string, values);
                } catch (err: any) {
                }
                return ofn(event, values);
            };
        })(this);
        internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
            this.emulator.stopEmulator();
        });
        let BPS = require('./BPS');
        registerPatchType(".bps", new BPS() as RomPatchType);
        registerPatchType(".txt", new Cloudmax());
        registerPatchType(".pak", new PakPatch());
        this.preinit();
    }

    private preinit() {
        // Figure out what consoles we have available.
        this.consoleDescManager.registerConsole(new MupenDescriptor());
        let bindings_dir: string = "./bindings";
        if (!fs.existsSync(bindings_dir)) {
            fs.mkdirSync(bindings_dir);
        }
        fs.readdirSync(bindings_dir).forEach((d: string) => {
            let dir: string = path.resolve(bindings_dir, d);
            let meta: string = path.resolve(dir, "package.json");
            if (!fs.existsSync(meta)) return;
            let data: any = JSON.parse(fs.readFileSync(meta).toString());
            let main: string = path.resolve(dir, data.main);
            let constr: any = require(main).default;
            this.consoleDescManager.registerConsole(new constr());
        });

        // Set up config.
        this.config.setData(
            'ModLoader64',
            'rom',
            'Legend of Zelda, The - Ocarina of Time (U) (V1.0) [!].z64'
        );
        this.config.setData('ModLoader64', 'patch', '');
        this.config.setData('ModLoader64', 'isServer', true);
        this.config.setData('ModLoader64', 'isClient', true);
        this.config.setData('ModLoader64', 'supportedConsoles', this.consoleDescManager.getAllConsoleTags(), true);
        this.config.setData('ModLoader64', 'selectedConsole', 'Mupen64Plus');
        this.config.setData('ModLoader64', 'coreOverride', '');
        this.config.setData('ModLoader64', 'disableVIUpdates', false);
        this.config.setData('ModLoader64', 'enableDebugger', false);


        if (this.data.supportedConsoles.indexOf(this.data.selectedConsole) === -1) {
            this.data.selectedConsole = this.data.supportedConsoles[0];
        }

        if (global.ModLoader["FIRST_RUN"]) {
            process.exit(0);
        }

        let roms = getAllFiles(this.rom_folder, []);
        for (let i = 0; i < roms.length; i++) {
            let p = path.parse(roms[i]);
            if (p.base === this.data['rom']) {
                this.rom_path = path.resolve(roms[i]);
                break;
            }
        }

        if (this.rom_path === undefined) {
            this.rom_path = "";
        }

        if (path.parse(this.rom_path).ext === ".zip") {
            // Some dumbass tried to load a zip file. Babysit it.
            let temp: string = fs.mkdtempSync("ModLoader64_temp_");
            let z: zip = new zip(this.rom_path);
            z.extractAllTo(temp, true);
            fs.readdirSync(temp).forEach((file: string) => {
                let p = path.parse(file);
                this.rom_path = path.resolve(path.join(temp, p.base));
            });
        }

        bus.on(ModLoaderEvents.ON_EXTERNAL_API_REGISTER, (data: ExternalAPIData) => {
            if (!data.processed) {
                data.processed = true;
                this.logger.debug(`Loading API: ${data.name}@${data.version}`);
                moduleAlias.addAlias(data.name, data.path);
                moduleAlias.addAlias(`@${data.name}`, data.path);
            }
        });

        let auto_wire_cores: Function = (p: string) => {
            if (fs.lstatSync(p).isFile()) return;
            fs.readdirSync(p).forEach(file => {
                let f = path.join(p, file);
                if (!fs.lstatSync(f).isDirectory()) {
                    let parse = path.parse(file);
                    if (parse.ext === ".js") {
                        try {
                            let rq = require(path.resolve(f));
                            let p = rq[parse.name];
                            if (rq.hasOwnProperty("default")) {
                                p = rq["default"];
                            }
                            let i = new p();
                            this.plugins.registerCorePlugin(i.constructor.name, i as ICore);
                            this.logger.info('Auto-wiring core: ' + i.constructor.name);
                        } catch (err: any) {
                            console.log(err);
                        }
                    }
                }
            });
        };

        this.logger.info('Loading internal cores...');
        auto_wire_cores(path.resolve(path.join(__dirname, '/cores')));

        let cores_folder: string = "./cores";
        if (global.ModLoader.hasOwnProperty("OVERRIDE_CORES_FOLDER")) {
            cores_folder = global.ModLoader.OVERRIDE_CORES_FOLDER;
        }

        if (!fs.existsSync(cores_folder)) {
            fs.mkdirSync(cores_folder);
        }
        moduleAlias.addPath(path.resolve(cores_folder));

        this.logger.info('Loading external cores...');
        let ext_core_path: string = path.resolve(path.join(cores_folder));
        fs.readdirSync(ext_core_path).forEach(file => {
            let f = path.join(ext_core_path, file);
            if (f.indexOf(".disabled") === -1) {
                if (path.parse(f).ext === ".pak") {
                    let pak: Pak = new Pak(f);
                    let v: pakVerifier = new pakVerifier(this.logger);
                    if (v.verifyPak(pak, f)) {
                        let dir: string = v.extractPakToTemp(pak, f);
                        let d: string = path.resolve(dir, '../');
                        moduleAlias.addPath(d);
                        auto_wire_cores(dir);
                    }
                } else {
                    auto_wire_cores(f);
                }
            }
        });

        let side: ProxySide = ProxySide.UNIVERSAL;
        if (this.data.isServer) side = ProxySide.SERVER;
        if (this.data.isClient) side = ProxySide.CLIENT;
        this.emulator = this.consoleDescManager.getConsole(this.data.selectedConsole).constructConsole(side, this.rom_path, this.logger, this.clientConfig.lobby, this.config);

        internal_event_bus.emit('preinit_done', {});
        this.init();
    }

    private init() {
        global.ModLoader["startupDelay"] = 0;
        let loaded_rom_header: IRomHeader = this.emulator.getRomHeader();
        let core_match: any = null;
        let core_key = '';
        if (this.data.coreOverride !== '') {
            core_key = this.data.coreOverride;
            core_match = this.plugins.core_plugins[core_key];
        }
        if (fs.existsSync(this.rom_path)) {
            this.logger.info('Parsing rom header...');
            Object.keys(this.plugins.core_plugins).forEach((key: string) => {
                if (typeof this.plugins.core_plugins[key].header === "string") {
                    if (loaded_rom_header.id === this.plugins.core_plugins[key].header) {
                        core_match = this.plugins.core_plugins[key];
                        core_key = key;
                    }
                } else if (this.plugins.core_plugins[key].header instanceof Array) {
                    for (let i = 0; i < this.plugins.core_plugins[key].header.length; i++) {
                        if (loaded_rom_header.id === this.plugins.core_plugins[key].header[i]) {
                            core_match = this.plugins.core_plugins[key];
                            core_key = key;
                        }
                    }
                }
            });
        }
        if (core_match !== null) {
            this.logger.info('Auto-selected core: ' + core_key);
            this.plugins.selected_core = core_key;
        } else {
            this.logger.error(
                'Failed to find a compatible core for the selected rom!'
            );
            this.logger.debug(JSON.stringify(loaded_rom_header, null, 2));
            this.logger.info('Setting core to DummyCore.');
            this.plugins.selected_core = 'DummyCore';
        }
        // Load the plugins
        this.plugins.loadPluginsConstruct(loaded_rom_header, this.emulator);
        bus.emit(ModLoaderEvents.ON_ROM_PATH, this.rom_path);
        let evt: any = { rom: this.emulator.getLoadedRom() };
        bus.emit(ModLoaderEvents.ON_PRE_ROM_LOAD, evt);
        if (this.data.isClient) {
            this.emulator.getRomAccess().romWriteBuffer(0x0, evt.rom);
        }
        bus.emit(ModLoaderEvents.ON_ROM_HEADER_PARSED, loaded_rom_header);
        this.plugins.loadPluginsPreInit(this.emulator);
        internal_event_bus.emit('onPreInitDone', {});
        // Set up networking.
        internal_event_bus.on('onNetworkConnect', (evt: any) => {
            let nextStage = new Promise((resolve, reject) => {
                let wait = setInterval(() => {
                    if (global.ModLoader.startupDelay === 0) {
                        clearInterval(wait);
                        resolve(undefined);
                    }
                }, 1);
            }).then(() => {
                this.postinit(evt);
            });
        });
        if (this.data.isServer) {
            this.Server.setup();
        }
        if (this.data.isClient) {
            this.Client.setup();
            this.RPC.setup();
        }
        internal_event_bus.emit('onInitDone', {});
    }

    private postinit(result: any) {
        if (this.done) {
            this.plugins.resetPlayerInstance(result[0].me);
            return;
        }
        if (fs.existsSync(this.rom_path) || this.data.isServer) {
            this.plugins.loadPluginsInit(result[0].me, this.emulator, this.Client);
            this.logger.info(`Setting up ${this.data.selectedConsole}...`);
            let instance = this;
            let mupen: IMemory;
            let load_mupen = new Promise(function (resolve, reject) {
                if (instance.data.isClient) {
                    if (!fs.existsSync('./saves')) {
                        fs.mkdirSync('./saves');
                    }
                    if (
                        !fs.existsSync(path.join('./saves', instance.Client.config.lobby))
                    ) {
                        fs.mkdirSync(path.join('./saves', instance.Client.config.lobby));
                    }
                    instance.emulator.setSaveDir(
                        path.resolve(path.join('./saves', instance.Client.config.lobby)) + '/'
                    );
                    mupen = instance.emulator.startEmulator(() => {
                        let p: Buffer = result[0].patch as Buffer;
                        let rom_data: Buffer = instance.emulator.getLoadedRom();
                        let evt: any = { rom: rom_data };
                        if (instance.data.isClient) {
                            try {
                                bus.emit(ModLoaderEvents.ON_ROM_PATCHED_PRE, evt);
                            } catch (err: any) {
                                throw err;
                            }
                        }
                        if (p.byteLength > 1 && rom_data.byteLength > 1) {
                            try {
                                let hash = crypto.createHash('md5').update(rom_data).digest('hex');
                                instance.logger.info('Patching rom...');
                                let nbuf: Buffer | undefined = PatchTypes.get(path.parse(result[0].patch_name).ext)!.patch(rom_data.slice(0, instance.emulator.getRomOriginalSize()), p);
                                if (nbuf !== undefined) {
                                    nbuf.copy(rom_data);
                                }
                                let newHash = crypto.createHash('md5').update(rom_data).digest('hex');
                                instance.logger.info(hash);
                                instance.logger.info(newHash);
                                evt["hash"] = newHash;
                                evt["oldhash"] = hash;
                            } catch (err: any) {
                                if (err) {
                                    instance.logger.error(err);
                                    process.exit(ModLoaderErrorCodes.BPS_FAILED);
                                }
                            }
                        }
                        try {
                            bus.emit(ModLoaderEvents.ON_ROM_PATCHED, evt);
                            bus.emit(ModLoaderEvents.ON_ROM_PATCHED_POST, evt);
                        } catch (err: any) {
                            throw err;
                        }
                        return evt.rom;
                    }) as IMemory;
                    let wait = setInterval(() => {
                        if (instance.emulator.isEmulatorReady()) {
                            clearInterval(wait);
                            internal_event_bus.emit('emulator_started', {});
                            resolve(undefined);
                        }
                    }, 1);
                } else {
                    resolve(undefined);
                }
            });
            load_mupen.then(function () {
                try {
                    instance.logger.info('Finishing plugin init...');
                    instance.plugins.loadPluginsPostinit(
                        mupen,
                        instance.emulator,
                        instance.data
                    );
                    internal_event_bus.emit('onPostInitDone', {});
                    instance.done = true;
                } catch (err) {
                    console.log(err);
                }
            }).catch((err: any) => {
                this.logger.error(err.stack);
                process.exit(1);
            });
        }
    }
}

export default ModLoader64;
