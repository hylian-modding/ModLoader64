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
import NetworkEngine from './NetworkEngine';
import N64 from './consoles/N64';
import IMemory from 'modloader64_api/IMemory';
import IConsole from 'modloader64_api/IConsole';
import { FakeMupen } from './consoles/FakeMupen';
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
import { AnalyticsServer } from '../analytics/AnalyticsServer';
import { ModLoaderRPC } from './rpc/ModLoaderRPC';
import { Cloudmax } from './Cloudmax';

const SUPPORTED_CONSOLES: string[] = ['N64'];
export const internal_event_bus = new EventBus();

class ModLoader64 {
    logger: ILogger;
    config: IConfig = new configuration(
        process.cwd() + '/ModLoader64-config.json'
    );
    data: IModLoaderConfig = this.config.registerConfigCategory(
        'ModLoader64'
    ) as IModLoaderConfig;
    plugins: pluginLoader;
    rom_folder = './roms';
    mods_folder = './mods';
    roms: string[];
    Server: NetworkEngine.Server;
    Client: NetworkEngine.Client;
    RPC: ModLoaderRPC;
    Analytics_Server: AnalyticsServer;
    rom_path!: string;
    emulator!: IConsole;
    tunnel!: IGUITunnel;
    done = false;

    constructor(logger: any) {
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
        let mods_folder_array = [path.resolve(path.join(process.cwd(), 'mods'))];
        if (global.ModLoader.hasOwnProperty("OVERRIDE_MODS_FOLDER")) {
            mods_folder_array.push(this.mods_folder);
        }
        this.plugins = new pluginLoader(
            mods_folder_array,
            this.config,
            this.logger.getLogger("PluginLoader")
        );
        this.Analytics_Server = new AnalyticsServer(this.logger.getLogger("Analytics"));
        this.Server = new NetworkEngine.Server(this.logger.getLogger("NetworkEngine.Server"), this.config);
        this.Client = new NetworkEngine.Client(this.logger.getLogger("NetworkEngine.Client"), this.config);
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

            if (fs.existsSync('./storage')) {
                fs.readdirSync('./storage').forEach((key: string) => {
                    let file: string = path.join('./storage', key);
                    if (fs.existsSync(file)) {
                        let seconds =
                            (new Date().getTime() -
                                new Date(fs.statSync(file).mtime).getTime()) /
                            1000;
                        if (seconds > 2592000) {
                            fs.unlinkSync(file);
                        }
                    }
                });
            }
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
                } catch (err) {
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
        this.preinit();
    }

    private preinit() {
        // Set up config.
        this.config.setData(
            'ModLoader64',
            'rom',
            'Legend of Zelda, The - Ocarina of Time (U) (V1.0) [!].z64'
        );
        this.config.setData('ModLoader64', 'patch', '');
        this.config.setData('ModLoader64', 'isServer', true);
        this.config.setData('ModLoader64', 'isClient', true);
        this.config.setData('ModLoader64', 'isAnalyticsServer', false);
        this.config.setData(
            'ModLoader64',
            'supportedConsoles',
            SUPPORTED_CONSOLES,
            true
        );
        this.config.setData('ModLoader64', 'selectedConsole', 'N64');
        this.config.setData('ModLoader64', 'coreOverride', '');

        let getAllFiles = function(dirPath: string, arrayOfFiles: Array<string>) {
            let files = fs.readdirSync(dirPath);
           
            arrayOfFiles = arrayOfFiles || [];
           
            files.forEach(function(file) {
                if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
                } else {
                    arrayOfFiles.push(path.join(".", dirPath, "/", file));
                }
            });
           
            return arrayOfFiles;
        };

        let roms = getAllFiles(this.rom_folder, []);
        for (let i = 0; i < roms.length; i++){
            let p = path.parse(roms[i]);
            if (p.base === this.data['rom']){
                this.rom_path = path.resolve(roms[i]);
                break;
            }
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

        let auto_wire_cores: Function = (p: string) => {
            fs.readdirSync(p).forEach(file => {
                let f = path.join(p, file);
                if (!fs.lstatSync(f).isDirectory()) {
                    let parse = path.parse(file);
                    if (parse.ext === '.js') {
                        try {
                            let p = require(path.resolve(f))[parse.name];
                            this.plugins.registerCorePlugin(parse.name, new p() as ICore);
                            this.logger.info('Auto-wiring core: ' + parse.name);
                        } catch (err) {
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
        switch (this.data.selectedConsole) {
        case 'N64': {
            moduleAlias.addAlias("@emulator", path.join(process.cwd(), "/emulator"));
            if (this.data.isServer) {
                this.emulator = new FakeMupen(this.rom_path);
            }
            if (this.data.isClient) {
                this.emulator = new N64(this.rom_path, this.logger);
            }
            break;
        }
        }
        internal_event_bus.emit('preinit_done', {});
        bus.on('SOFT_RESET_PRESSED', () => {
            this.logger.info("Soft reset detected. Sending alert to plugins.");
            bus.emit(ModLoaderEvents.ON_SOFT_RESET_PRE, {});
            this.logger.info("Letting the reset go through...");
            this.emulator.softReset();
            while (!this.emulator.isEmulatorReady()) { }
            this.logger.info("Reinvoking the payload injector...");
            this.plugins.reinject(() => {
                this.logger.info("Soft reset complete. Sending alert to plugins.");
                bus.emit(ModLoaderEvents.ON_SOFT_RESET_POST, {});
            });
        });
        this.init();
    }

    private init() {
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
                if (loaded_rom_header.id === this.plugins.core_plugins[key].header) {
                    core_match = this.plugins.core_plugins[key];
                    core_key = key;
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
        this.plugins.loadPluginsConstruct(loaded_rom_header);
        bus.emit(ModLoaderEvents.ON_ROM_PATH, this.rom_path);
        let evt: any = { rom: this.emulator.getLoadedRom() };
        bus.emit(ModLoaderEvents.ON_PRE_ROM_LOAD, evt);
        (this.emulator.getMemoryAccess() as unknown as IRomMemory).romWriteBuffer(0x0, evt.rom);
        bus.emit(ModLoaderEvents.ON_ROM_HEADER_PARSED, loaded_rom_header);
        this.plugins.loadPluginsPreInit(this.emulator);
        internal_event_bus.emit('onPreInitDone', {});
        // Set up networking.
        internal_event_bus.on('onNetworkConnect', (evt: any) => {
            this.postinit(evt);
        });
        if (this.data.isServer) {
            this.Server.setup();
            if (this.data.isAnalyticsServer) {
                this.Analytics_Server.setup();
            }
        }
        if (this.data.isClient) {
            this.Client.setup();
            this.RPC.setup();
        }
        internal_event_bus.emit('onInitDone', {});
    }

    private postinit(result: any) {
        if (this.done) {
            return;
        }
        if (fs.existsSync(this.rom_path) || this.data.isServer) {
            this.plugins.loadPluginsInit(result[0].me, this.emulator, this.Client);
            this.logger.info('Setting up Mupen...');
            let instance = this;
            let mupen: IMemory;
            let load_mupen = new Promise(function (resolve, reject) {
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
                        bus.emit(ModLoaderEvents.ON_ROM_PATCHED_PRE, evt);
                    }
                    if (p.byteLength > 1 && rom_data.byteLength > 1) {
                        try {
                            let hash = crypto.createHash('md5').update(rom_data).digest('hex');
                            instance.logger.info('Patching rom...');
                            let nbuf: Buffer | undefined = PatchTypes.get(path.parse(result[0].patch_name).ext)!.patch(rom_data, p);
                            if (nbuf !== undefined) {
                                rom_data = nbuf;
                                evt.rom = nbuf;
                            }
                            let newHash = crypto.createHash('md5').update(rom_data).digest('hex');
                            instance.logger.info(hash);
                            instance.logger.info(newHash);
                        } catch (err) {
                            if (err) {
                                instance.logger.error(err);
                                process.exit(ModLoaderErrorCodes.BPS_FAILED);
                            }
                        }
                    }
                    if (instance.data.isClient) {
                        bus.emit(ModLoaderEvents.ON_ROM_PATCHED, evt);
                        bus.emit(ModLoaderEvents.ON_ROM_PATCHED_POST, evt);
                    }
                    return evt.rom;
                }) as IMemory;
                let wait = setInterval(() => {
                    if (instance.emulator.isEmulatorReady()) {
                        clearInterval(wait);
                        internal_event_bus.emit('emulator_started', {});
                        resolve();
                    }
                }, 1);
            });
            load_mupen.then(function () {
                instance.logger.info('Finishing plugin init...');
                instance.plugins.loadPluginsPostinit(
                    mupen,
                    instance.emulator,
                    instance.data
                );
                internal_event_bus.emit('onPostInitDone', {});
                instance.done = true;
                // Detect if the user closed Mupen.
                setInterval(() => {
                    if (!instance.emulator.isEmulatorReady()) {
                        internal_event_bus.emit('SHUTDOWN_EVERYTHING', {});
                        process.exit(ModLoaderErrorCodes.NORMAL_EXIT);
                    }
                }, 1000);
            });
        }
    }
}

export default ModLoader64;
