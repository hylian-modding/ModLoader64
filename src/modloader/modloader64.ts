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
import { FakeN64Memory } from './consoles/FakeN64Memory';

class ModLoader64 {

    logger: ILogger
    config: IConfig = new configuration(process.cwd() + "/ModLoader64-config.json")
    data: IModLoaderConfig = this.config.registerConfigCategory("ModLoader64") as IModLoaderConfig
    plugins: pluginLoader
    rom_folder: string = "./roms"
    roms: string[] = fs.readdirSync(this.rom_folder)
    loaded_rom!: Buffer
    loaded_rom_header: Buffer = Buffer.alloc(0x50)
    Server: NetworkEngine.Server
    Client: NetworkEngine.Client
    rom_path!: string

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

        this.init()
    }

    private init() {
        if (fs.existsSync(this.rom_path)) {
            this.logger.info("Loading rom \"" + this.data["rom"] + "\"...")
            this.loaded_rom = fs.readFileSync(this.rom_path)
            this.logger.info("Parsing rom header...")
            this.loaded_rom.copy(this.loaded_rom_header, 0, 0, 0x50)
            let core_match: any = null
            let core_key: string = ""
            Object.keys(this.plugins.core_plugins).forEach((key: string) => {
                if (this.loaded_rom.includes(this.plugins.core_plugins[key].header, 0, 'utf8')) {
                    core_match = this.plugins.core_plugins[key]
                    core_key = key
                }
            });
            if (core_match !== null) {
                this.logger.info("Auto-selected core: " + core_key)
                this.logger.info("Header hash: " + crypto.createHash('md5').update(this.loaded_rom_header).digest("hex"))
                this.logger.info("Rom hash: " + crypto.createHash("md5").update(this.loaded_rom).digest("hex"))
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
                    }
                }).then(function (result) {
                    inst.postinit()
                })
            } else {
                if (inst.data.isClient) {
                    inst.Client.setup().then(function (result) {
                        inst.postinit()
                    })
                }
            }
        })(this)
    }

    private postinit() {
        if (fs.existsSync(this.rom_path)) {
            this.plugins.loadPluginsStart(this.Server);
            if (this.data.isClient) {
                this.logger.info("Setting up Mupen...")
                var instance = this
                var n64 = new N64()
                var mupen: IMemory = {} as IMemory
                var load_mupen = new Promise(function (resolve, reject) {
                    mupen = n64.startEmulator(instance.rom_path) as IMemory
                    while (n64.mupen.coreEmuState() !== 2) {
                    }
                    resolve()
                });
                load_mupen.then(function () {
                    setTimeout(function () {
                        instance.logger.info("Finishing plugin init...")
                        instance.plugins.loadPluginsEnd(mupen)
                        n64.finishInjects();
                    }, 3000);
                });
            } else {
                setTimeout(function () {
                    instance.logger.info("Finishing plugin init...")
                    instance.plugins.loadPluginsEnd(new FakeN64Memory())
                }, 3000);
            }
        }
    }
}

export default ModLoader64