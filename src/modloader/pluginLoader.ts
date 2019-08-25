import fs from 'fs';
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
import { setupLobbyVariable } from 'modloader64_api/LobbyVariable';
import IModLoaderConfig from './IModLoaderConfig';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import { setupCoreInject } from 'modloader64_api/CoreInjection';
import { GameShark } from 'modloader64_api/GameShark';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import NetworkEngine from './NetworkEngine';

class pluginLoader {
  plugin_directories: string[];
  core_plugins: any = {};
  plugin_folders: string[] = [];
  plugins: IPlugin[] = [];
  selected_core = '';
  loaded_core: ICore = {} as ICore;
  config: IConfig;
  logger: ILogger;
  onTickHandle!: Function;
  onFakeFrameHandler!: any;
  internalFrameCount = -1;
  header!: IRomHeader;

  constructor(dirs: string[], config: IConfig, logger: ILogger) {
    this.plugin_directories = dirs;
    this.config = config;
    this.logger = logger;
  }

  registerCorePlugin(name: string, core: any) {
    this.core_plugins[name] = core;
  }

  private registerPlugin(plugin: any) {
    this.plugins.push(plugin);
  }

  private processFile(file: string) {
    if (!fs.lstatSync(file).isDirectory()) {
      let parse = path.parse(file);
      if (parse.ext.indexOf('js') > -1) {
        let p = require(file);
        let plugin: IPlugin = new p() as IPlugin;
        plugin['ModLoader'] = {} as IModLoaderAPI;
        plugin['ModLoader']['logger'] = this.logger.child({});
        plugin['ModLoader']['config'] = this.config;
        Object.defineProperty(plugin, 'pluginName', {
          value: parse.name,
          writable: false,
        });
        if (
          plugin.core_dependency === this.selected_core ||
          plugin.core_dependency === '*'
        ) {
          setupEventHandlers(plugin);
          setupNetworkHandlers(plugin);
          setupCoreInject(plugin, this.loaded_core);
          setupLobbyVariable(plugin);
          this.registerPlugin(plugin);
          this.plugin_folders.push(parse.dir);
        } else {
          this.logger.info(
            'Plugin ' + parse.name + ' does not belong to this core. Skipping.'
          );
        }
      } else if (parse.ext.indexOf('zip') > -1) {
      }
    }
  }

  loadPluginsConstruct(header: IRomHeader, overrideCore = '') {
    // Start the core plugin.
    this.header = header;
    if (overrideCore !== '') {
      this.selected_core = overrideCore;
    }
    let core = this.core_plugins[this.selected_core];
    core['ModLoader'] = {};
    core['ModLoader']['logger'] = this.logger.child({});
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
          if (fs.lstatSync(temp2).isDirectory) {
            fs.readdirSync(temp2).forEach((file2: string) => {
              let temp3 = path.join(temp2, file2);
              this.processFile(temp3);
            });
          } else {
            this.processFile(file);
          }
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

  loadPluginsPreInit(manager: ILobbyManager) {
    this.loaded_core.preinit();
    this.loaded_core.ModLoader.lobbyManager = manager;
    this.loaded_core.ModLoader.clientSide = ClientController;
    this.loaded_core.ModLoader.serverSide = ServerController;
    this.loaded_core.ModLoader.clientLobby = this.config.data[
      'NetworkEngine.Client'
    ]['lobby'];
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.lobbyManager = manager;

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
    net: NetworkEngine.Client
  ) {
    this.loaded_core.ModLoader.me = me;
    this.loaded_core.init();
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.me = me;
      plugin.init();
    });
    this.onTickHandle = (frame: number) => {
      this.internalFrameCount = frame;
      this.loaded_core.onTick();
      this.plugins.forEach((plugin: IPlugin) => {
        plugin.onTick();
      });
      net.onTick();
    };
    iconsole.setFrameCallback(this.onTickHandle);
  }

  loadPluginsPostinit(emulator: IMemory, iconsole: IConsole) {
    let mainConfig = this.config.registerConfigCategory(
      'ModLoader64'
    ) as IModLoaderConfig;
    let utils: IUtils = (emulator as unknown) as IUtils;
    this.loaded_core.ModLoader.emulator = emulator;
    this.loaded_core.ModLoader.utils = utils;
    this.loaded_core.ModLoader.savestates = (emulator as unknown) as ISaveState;
    this.loaded_core.postinit();
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.emulator = emulator;
      plugin.ModLoader.utils = utils;
      plugin.ModLoader.savestates = (emulator as unknown) as ISaveState;
      plugin.postinit();
      if (mainConfig.isClient) {
        bus.emit(EventsClient.ON_PLUGIN_READY, plugin);
      }
      if (mainConfig.isServer) {
        bus.emit(EventsServer.ON_PLUGIN_READY, plugin);
      }
    });
    this.onFakeFrameHandler = setInterval(() => {
      if (this.internalFrameCount >= 0) {
        clearInterval(this.onFakeFrameHandler);
        iconsole.pauseEmulator();
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
        iconsole.resumeEmulator();
      }
    }, 50);
    iconsole.hookFrameCallback();
  }
}

export default pluginLoader;
