import fs from 'fs-extra';
import path from 'path';
import {
  ILogger,
  IConfig,
  IPlugin,
  IModLoaderAPI,
  ICore,
} from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import {
  bus,
  EventsClient,
  EventsServer,
  setupEventHandlers,
} from 'modloader64_api/EventHandler';
import {
  ILobbyManager,
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
import { GameShark } from 'modloader64_api/GameShark';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import NetworkEngine from './NetworkEngine';
import { Pak } from 'modloader64_api/PakFormat';
import crypto from 'crypto';
import { GUIAPI } from 'modloader64_api/GUITunnel';

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

  constructor(dirs: string[], config: IConfig, logger: ILogger) {
    this.plugin_directories = dirs;
    this.config = config;
    this.logger = logger;
    let cleanup: Function = function() {
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

  verifySignature(file: string, key: string, sig: string): boolean {
    const hasher = crypto.createHash('sha256');
    hasher.update(fs.readFileSync(file));
    const digest = hasher.digest('hex');
    const publicKey = fs.readFileSync(key);
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(digest);
    if (!fs.existsSync(sig)) {
      return false;
    }
    const testSignature = verifier.verify(
      publicKey,
      fs.readFileSync(sig).toString(),
      'base64'
    );
    return testSignature;
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
      // Unpak first.
      let ndir: string = fs.mkdtempSync('ModLoader64_temp_');
      let pakFile: Pak = new Pak(path.resolve(dir));
      pakFile.extractAll(ndir);
      dir = path.join(ndir, parse.name);
      let pub: string = path.join(dir, 'public_key.pem');
      if (fs.existsSync(pub)) {
        if (
          !this.verifySignature(
            pakFile.fileName,
            path.resolve(pub),
            path.resolve(path.join(parse.dir, parse.name + '.sig'))
          )
        ) {
          this.logger.error(
            'Signature check failed for plugin ' + parse.name + '. Skipping.'
          );
          return;
        } else {
          this.logger.info(
            'Signature check for plugin ' + parse.name + ' passed.'
          );
        }
      }
    } else if (parse.ext === '.sig') {
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

  loadPluginsPreInit(manager: ILobbyManager, iconsole: IConsole) {
    this.loaded_core.preinit();
    this.loaded_core.ModLoader.lobbyManager = manager;
    this.loaded_core.ModLoader.clientSide = ClientController;
    this.loaded_core.ModLoader.serverSide = ServerController;

    let utils: IUtils = iconsole.getUtils();
    utils.hashBuffer = (buf: Buffer) => {
      return crypto
        .createHash('md5')
        .update(buf)
        .digest('hex');
    };
    this.loaded_core.ModLoader.utils = utils;
    this.loaded_core.ModLoader.clientLobby = this.config.data[
      'NetworkEngine.Client'
    ]['lobby'];
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.lobbyManager = manager;
      plugin.ModLoader.utils = utils;
      plugin.ModLoader.clientSide = ClientController;
      plugin.ModLoader.serverSide = ServerController;
      plugin.ModLoader.clientLobby = this.config.data['NetworkEngine.Client'][
        'lobby'
      ];
      plugin.preinit();
    });
  }

  loadPluginsInit(
    me: INetworkPlayer,
    iconsole: IConsole,
    net: NetworkEngine.Client,
    config: IModLoaderConfig
  ) {
    this.loaded_core.ModLoader.me = me;
    this.loaded_core.init();
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.me = me;
      plugin.init();
    });
    this.onTickHandle = () => {
      if (iconsole.getFrameCount() > -1) {
        this.loaded_core.onTick();
        this.plugins.forEach((plugin: IPlugin) => {
          plugin.onTick();
        });
        net.onTick();
        iconsole.setFrameCount(-1);
      }
    };
    if (config.isClient) {
      setInterval(this.onTickHandle, 0);
    }
  }

  loadPluginsPostinit(emulator: IMemory, iconsole: IConsole) {
    let mainConfig = this.config.registerConfigCategory(
      'ModLoader64'
    ) as IModLoaderConfig;
    this.loaded_core.ModLoader.emulator = emulator;
    this.loaded_core.ModLoader.savestates = (emulator as unknown) as ISaveState;
    this.loaded_core.ModLoader.gui = new GUIAPI('core', this.loaded_core);
    this.loaded_core.postinit();
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.emulator = emulator;
      plugin.ModLoader.gui = new GUIAPI(plugin.pluginName as string, plugin);
      plugin.ModLoader.savestates = (emulator as unknown) as ISaveState;
      plugin.postinit();
      if (mainConfig.isClient) {
        bus.emit(EventsClient.ON_PLUGIN_READY, plugin);
      }
      if (mainConfig.isServer) {
        bus.emit(EventsServer.ON_PLUGIN_READY, plugin);
      }
    });
    iconsole.finishInjects();
    let gameshark = new GameShark(this.logger, emulator);
    this.plugin_folders.forEach((dir: string) => {
      let test = path.join(
        dir,
        'payloads',
        this.header.country_code + this.header.revision.toString()
      );
      if (fs.existsSync(test)) {
        if (fs.lstatSync(test).isDirectory) {
          fs.readdirSync(test).forEach((payload: string) => {
            gameshark.read(path.resolve(path.join(test, payload)));
          });
        }
      }
    });
    bus.emit(EventsClient.ON_INJECT_FINISHED, {});
    iconsole.finishInjects();
  }
}

export default pluginLoader;
