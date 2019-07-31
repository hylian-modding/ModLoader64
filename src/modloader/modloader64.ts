import configuration from './config';
import pluginLoader from './pluginLoader';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ILogger, IConfig, ICore } from 'modloader64_api/IModLoaderAPI';
import IModLoaderConfig from './IModLoaderConfig';
import NetworkEngine from './NetworkEngine';
import N64 from './consoles/N64';
import IMemory from 'modloader64_api/IMemory';
import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import IConsole from 'modloader64_api/IConsole';
import { FakeMupen } from './consoles/FakeMupen';
import { bus, EventBus } from 'modloader64_api/EventHandler';

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
  roms: string[] = fs.readdirSync(this.rom_folder);
  Server: NetworkEngine.Server;
  Client: NetworkEngine.Client;
  rom_path!: string;
  emulator!: IConsole;
  done = false;

  constructor(logger: any) {
    this.logger = logger as ILogger;
    this.plugins = new pluginLoader(
      [path.resolve(path.join(process.cwd(), 'mods'))],
      this.config,
      this.logger
    );
    this.Server = new NetworkEngine.Server(this.logger.child({}), this.config);
    this.Client = new NetworkEngine.Client(this.logger.child({}), this.config);

    if (process.platform === 'win32') {
      let rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.on('SIGINT', function() {
        // @ts-ignore
        process.emit('SIGINT');
      });
    }

    process.on('SIGINT', function() {
      //graceful shutdown
      internal_event_bus.emit('SHUTDOWN_EVERYTHING', {});
      process.exit(0);
    });
  }

  start() {
    let ofn = internal_event_bus.emit.bind(internal_event_bus);
    internal_event_bus.emit = function(
      event: string | symbol,
      ...args: any[]
    ): boolean {
      if (process.send) {
        process.send(JSON.stringify({ id: event, data: args }));
      }
      return ofn(event, args);
    };
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

    this.rom_path = path.resolve(path.join(this.rom_folder, this.data['rom']));

    fs.readdirSync(path.resolve(path.join(__dirname, '/cores'))).forEach(
      file => {
        let parse = path.parse(file);
        if (parse.ext === '.js') {
          let p = require(path.join(__dirname, '/cores', file))[parse.name];
          this.plugins.registerCorePlugin(parse.name, new p() as ICore);
          this.logger.info('Auto-wiring core: ' + parse.name);
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
          this.emulator = new N64(this.rom_path);
          break;
        }
      }
    }
    internal_event_bus.emit('preinit_done', {});
    this.init();
  }

  private init() {
    let loaded_rom_header: Buffer;
    if (fs.existsSync(this.rom_path)) {
      this.logger.info('Parsing rom header...');
      loaded_rom_header = this.emulator.getRomHeader();
      let core_match: any = null;
      let core_key = '';
      Object.keys(this.plugins.core_plugins).forEach((key: string) => {
        if (
          loaded_rom_header.includes(
            this.plugins.core_plugins[key].header,
            0,
            'utf8'
          )
        ) {
          core_match = this.plugins.core_plugins[key];
          core_key = key;
        }
      });
      if (core_match !== null) {
        this.logger.info('Auto-selected core: ' + core_key);
        this.logger.info(
          'Header hash: ' +
            crypto
              .createHash('md5')
              .update(loaded_rom_header)
              .digest('hex')
        );
        this.plugins.selected_core = core_key;
      } else {
        this.logger.error(
          'Failed to find a compatible core for the selected rom!'
        );
      }
      // Load the plugins
      this.plugins.loadPluginsConstruct();
      bus.emit('romPath', this.rom_path);
    }
    this.plugins.loadPluginsPreInit(this.Server);
    // Set up networking.
    internal_event_bus.on('onNetworkConnect', (evt: any) => {
      this.postinit(evt);
    });
    (() => {
      if (this.data.isServer) {
        this.Server.setup();
      }
      if (this.data.isClient) {
        this.Client.setup();
      }
    })();
    internal_event_bus.emit('init_done', {});
  }

  private postinit(result: any) {
    if (this.done) {
      return;
    }
    if (fs.existsSync(this.rom_path)) {
      this.plugins.loadPluginsInit(result[0].me);
      this.logger.info('Setting up Mupen...');
      let instance = this;
      let mupen: IMemory;
      let load_mupen = new Promise(function(resolve, reject) {
        mupen = instance.emulator.startEmulator(() => {
          let p: Buffer = result[0].patch as Buffer;
          if (p.byteLength > 1) {
            let rom_data: Buffer = instance.emulator.getLoadedRom();
            let BPS = require('./BPS');
            let _BPS = new BPS();
            rom_data = _BPS.tryPatch(rom_data, p);
            return rom_data;
          } else {
            return p;
          }
        }) as IMemory;
        while (!instance.emulator.isEmulatorReady()) {}
        internal_event_bus.emit('emulator_started', {});
        resolve();
      });
      load_mupen.then(function() {
        setTimeout(function() {
          instance.logger.info('Finishing plugin init...');
          instance.plugins.loadPluginsPostinit(mupen, instance.emulator);
          instance.emulator.finishInjects();
          internal_event_bus.emit('postinit_done', {});
          instance.done = true;
        }, 3000);
      });
    }
  }
}

export default ModLoader64;
