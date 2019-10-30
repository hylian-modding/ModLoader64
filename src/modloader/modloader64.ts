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
  rom_path!: string;
  emulator!: IConsole;
  tunnel!: IGUITunnel;
  done = false;

  constructor(logger: any) {
    if (!fs.existsSync(this.rom_folder)) {
      fs.mkdirSync(this.rom_folder);
    }
    if (!fs.existsSync(this.mods_folder)) {
      fs.mkdirSync(this.mods_folder);
    }
    this.roms = fs.readdirSync(this.rom_folder);
    this.logger = logger as ILogger;
    this.plugins = new pluginLoader(
      [path.resolve(path.join(process.cwd(), 'mods'))],
      this.config,
      this.logger
    );
    this.Server = new NetworkEngine.Server(this.logger, this.config);
    this.Client = new NetworkEngine.Client(this.logger, this.config);

    if (process.platform === 'win32') {
      let rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.on('SIGINT', function() {
        // @ts-ignore
        process.emit('SIGINT');
      });

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

    process.on('SIGINT', function() {
      //graceful shutdown
      internal_event_bus.emit('SHUTDOWN_EVERYTHING', {});
      process.exit(0);
    });

    process.on('message', (msg: string) => {
      let packet: GUITunnelPacket = JSON.parse(msg) as GUITunnelPacket;
      bus.emit(packet.id, packet);
    });
  }

  start() {
    this.tunnel = new GUITunnel(process, 'internal_event_bus', this);
    let ofn = internal_event_bus.emit.bind(internal_event_bus);
    ((inst: ModLoader64) => {
      internal_event_bus.emit = function(
        event: string | symbol,
        ...args: any[]
      ): boolean {
        inst.tunnel.send(event as string, args);
        return ofn(event, args);
      };
    })(this);
    internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
      this.emulator.stopEmulator();
    });
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
    this.config.setData(
      'ModLoader64',
      'supportedConsoles',
      SUPPORTED_CONSOLES,
      true
    );
    this.config.setData('ModLoader64', 'selectedConsole', 'N64');
    this.config.setData('ModLoader64', 'coreOverride', '');

    this.rom_path = path.resolve(path.join(this.rom_folder, this.data['rom']));

    fs.readdirSync(path.resolve(path.join(__dirname, '/cores'))).forEach(
      file => {
        let f = path.join(__dirname, '/cores', file);
        if (!fs.lstatSync(f).isDirectory()) {
          let parse = path.parse(file);
          if (parse.ext === '.js') {
            let p = require(f)[parse.name];
            this.plugins.registerCorePlugin(parse.name, new p() as ICore);
            this.logger.info('Auto-wiring core: ' + parse.name);
          }
        }
      }
    );

    if (this.data.isServer) {
      switch (this.data.selectedConsole) {
        case 'N64': {
          this.emulator = new FakeMupen(this.rom_path);
          break;
        }
      }
    }
    if (this.data.isClient) {
      switch (this.data.selectedConsole) {
        case 'N64': {
          this.emulator = new N64(this.rom_path, this.logger);
          break;
        }
      }
    }
    internal_event_bus.emit('preinit_done', {});
    this.init();
  }

  private init() {
    let loaded_rom_header: IRomHeader;
    if (fs.existsSync(this.rom_path)) {
      this.logger.info('Parsing rom header...');
      loaded_rom_header = this.emulator.getRomHeader();
      let core_match: any = null;
      let core_key = '';
      Object.keys(this.plugins.core_plugins).forEach((key: string) => {
        if (loaded_rom_header.name === this.plugins.core_plugins[key].header) {
          core_match = this.plugins.core_plugins[key];
          core_key = key;
        }
      });
      if (this.data.coreOverride !== '') {
        core_key = this.data.coreOverride;
        core_match = this.plugins.core_plugins[core_key];
      }
      if (core_match !== null) {
        this.logger.info('Auto-selected core: ' + core_key);
        this.plugins.selected_core = core_key;
      } else {
        this.logger.error(
          'Failed to find a compatible core for the selected rom!'
        );
      }
      // Load the plugins
      this.plugins.loadPluginsConstruct(loaded_rom_header);
      bus.emit(ModLoaderEvents.ON_ROM_PATH, this.rom_path);
      bus.emit(ModLoaderEvents.ON_ROM_HEADER_PARSED, loaded_rom_header);
    }
    this.plugins.loadPluginsPreInit(this.emulator);
    internal_event_bus.emit('onPreInitDone', {});
    // Set up networking.
    internal_event_bus.on('onNetworkConnect', (evt: any) => {
      this.postinit(evt);
    });
    if (this.data.isServer) {
      this.Server.setup();
    }
    if (this.data.isClient) {
      this.Client.setup();
    }
    internal_event_bus.emit('onInitDone', {});
  }

  private postinit(result: any) {
    if (this.done) {
      return;
    }
    if (fs.existsSync(this.rom_path) || this.data.isServer) {
      this.plugins.loadPluginsInit(
        result[0].me,
        this.emulator,
        this.Client,
        this.data
      );
      this.logger.info('Setting up Mupen...');
      let instance = this;
      let mupen: IMemory;
      let load_mupen = new Promise(function(resolve, reject) {
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
          if (p.byteLength > 1 && rom_data.byteLength > 1) {
            let BPS = require('./BPS');
            let _BPS = new BPS();
            try {
              let hash = crypto
                .createHash('md5')
                .update(rom_data)
                .digest('hex');
              instance.logger.info('Patching rom...');
              rom_data = _BPS.tryPatch(rom_data, p);
              let newHash = crypto
                .createHash('md5')
                .update(rom_data)
                .digest('hex');
              instance.logger.info(hash);
              instance.logger.info(newHash);
            } catch (err) {
              if (err) {
                process.exit(ModLoaderErrorCodes.BPS_FAILED);
              }
            }
          }
          let evt: any = { rom: rom_data };
          if (instance.data.isClient) {
            bus.emit(ModLoaderEvents.ON_ROM_PATCHED, evt);
          }
          return evt.rom;
        }) as IMemory;
        while (!instance.emulator.isEmulatorReady()) {}
        internal_event_bus.emit('emulator_started', {});
        resolve();
      });
      load_mupen.then(function() {
        instance.logger.info('Finishing plugin init...');
        instance.plugins.loadPluginsPostinit(mupen, instance.emulator);
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
