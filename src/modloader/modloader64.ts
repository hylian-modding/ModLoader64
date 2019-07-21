import configuration from './config'
import pluginLoader from './pluginLoader'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { ILogger, IConfig, ICore } from '../API/IModLoaderAPI';
import IModLoaderConfig from './IModLoaderConfig'
import NetworkEngine from './NetworkEngine'
import N64 from './consoles/N64'
import IMemory from '../API/IMemory';
import { INetworkPlayer } from '../API/NetworkHandler';
import IConsole from '../API/IConsole';
import { FakeMupen } from './consoles/FakeMupen';

class ModLoader64 {

    logger: ILogger
    config: IConfig = new configuration(process.cwd() + "/ModLoader64-config.json")
    data: IModLoaderConfig = this.config.registerConfigCategory("ModLoader64") as IModLoaderConfig
    plugins: pluginLoader
    rom_folder: string = "./roms"
    roms: string[] = fs.readdirSync(this.rom_folder)
    Server: NetworkEngine.Server
    Client: NetworkEngine.Client
    rom_path!: string
    console!: IConsole

    constructor(logger: any) {
        this.logger = logger as ILogger
        this.plugins = new pluginLoader([path.resolve(path.join(process.cwd(), "mods"))], this.config, this.logger)
        this.Server = new NetworkEngine.Server(this.logger.child({}), this.config)
        this.Client = new NetworkEngine.Client(this.logger.child({}), this.config)
    }

    start() {
        this.preinit()
    }

    private preinit() {
        // Set up config.
        this.config.setData("ModLoader64", "rom", "Legend of Zelda, The - Ocarina of Time (U) (V1.0) [!].z64")
        this.config.setData("ModLoader64", "patch", "")
        this.config.setData("ModLoader64", "isServer", true)
        this.config.setData("ModLoader64", "isClient", true)

        this.rom_path = path.resolve(path.join(this.rom_folder, this.data["rom"]))

        fs.readdirSync(path.resolve(path.join(__dirname, "/cores"))).forEach((file) => {
            let parse = path.parse(file)
            if (parse.ext === ".js") {
                let p = require(path.join(__dirname, "/cores", file))[parse.name]
                this.plugins.registerCorePlugin(parse.name, new p() as ICore)
                this.logger.info("Auto-wiring core: " + parse.name)
            }
        });

        if (this.data.isServer) {
            this.console = new FakeMupen(this.rom_path)
        }
        if (this.data.isClient) {
            this.console = new N64(this.rom_path)
        }

        this.init()
    }

    private init() {
        var loaded_rom_header: Buffer
        if (fs.existsSync(this.rom_path)) {
            this.logger.info("Parsing rom header...")
            loaded_rom_header = this.console.getRomHeader()
            let core_match: any = null
            let core_key: string = ""
            Object.keys(this.plugins.core_plugins).forEach((key: string) => {
                if (loaded_rom_header.includes(this.plugins.core_plugins[key].header, 0, 'utf8')) {
                    core_match = this.plugins.core_plugins[key]
                    core_key = key
                }
            });
            if (core_match !== null) {
                this.logger.info("Auto-selected core: " + core_key)
                this.logger.info("Header hash: " + crypto.createHash('md5').update(loaded_rom_header).digest("hex"))
                this.plugins.selected_core = core_key
            } else {
                this.logger.error("Failed to find a compatible core for the selected rom!")
            }
            // Load the plugins
            this.plugins.loadPluginsConstruct();
        }
        // Set up networking.
        (function (inst) {
            if (inst.data.isServer) {
                inst.Server.setup().then(function (result) {
                    if (inst.data.isClient) {
                        return inst.Client.setup()
                    }else{
                        return result
                    }
                }).then(function (result) {
                    inst.postinit(result)
                })
            } else {
                if (inst.data.isClient) {
                    inst.Client.setup().then(function (result) {
                        inst.postinit(result)
                    })
                }
            }
        })(this)
    }

    private postinit(result: any) {
        if (fs.existsSync(this.rom_path)) {
            this.plugins.loadPluginsStart(this.Server, result.me);
            this.logger.info("Setting up Mupen...")
            var instance = this
            var mupen: IMemory
            var load_mupen = new Promise(function (resolve, reject) {
                mupen = instance.console.startEmulator(() => {
                    let p: Buffer = result.patch as Buffer
                    if (p.byteLength > 1){
                        let rom_data: Buffer = instance.console.getLoadedRom()
                        let BPS = require('./BPS');
                        let _BPS = new BPS()
                        rom_data = _BPS.tryPatch(rom_data, p)
                        return rom_data
                    }else{
                        return p
                    }
                }) as IMemory
                while (!instance.console.isEmulatorReady()) {
                }
                resolve()
            });
            load_mupen.then(function () {
                setTimeout(function () {
                    instance.logger.info("Finishing plugin init...")
                    instance.plugins.loadPluginsEnd(mupen, instance.console)
                    instance.console.finishInjects();
                }, 3000);
            });
        }
    }
}

export default ModLoader64