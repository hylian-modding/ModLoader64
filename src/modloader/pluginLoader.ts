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
import { GameShark, Code } from './GameShark';
import {
  EventHandler,
  bus,
  EventsClient,
  EventsServer,
} from 'modloader64_api/EventHandler';
import {
  NetworkBus,
  NetworkChannelBus,
  NetworkBusServer,
  NetworkChannelBusServer,
  ILobbyManager,
  INetworkPlayer,
  ClientController,
  ServerController,
} from 'modloader64_api/NetworkHandler';
import IConsole from 'modloader64_api/IConsole';
import { internal_event_bus } from './modloader64';
import { setupLobbyVariable } from 'modloader64_api/LobbyVariable';
import IModLoaderConfig from './IModLoaderConfig';

class pluginLoader {
  plugin_directories: string[];
  core_plugins: any = {};
  plugin_folders: string[] = [];
  plugins: IPlugin[] = [];
  selected_core = '';
  loaded_core: ICore = {} as ICore;
  config: IConfig;
  logger: ILogger;
  onTickHandle: any;

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
          // TODO: Clean this up. Could be done generically.
          if (p.prototype.hasOwnProperty('ModLoader')) {
            // Setup event decorator handlers
            if (p.prototype.ModLoader.hasOwnProperty('eventHandlers')) {
              p.prototype.ModLoader.eventHandlers.forEach(function(
                value: string,
                key: string
              ) {
                let a = (plugin as any)[value].bind(plugin);
                bus.addListener(key, a);
              });
            }
            if (p.prototype.ModLoader.hasOwnProperty('NetworkHandler')) {
              // Setup packet decorator handlers
              if (
                p.prototype.ModLoader.NetworkHandler.hasOwnProperty(
                  'PacketHandlers'
                ) !== null
              ) {
                p.prototype.ModLoader.NetworkHandler.PacketHandlers.forEach(
                  function(value: string, key: string) {
                    let a = (plugin as any)[value].bind(plugin);
                    NetworkBus.addListener(key, a);
                  }
                );
              }
              if (
                p.prototype.ModLoader.NetworkHandler.hasOwnProperty(
                  'ChannelHandlers'
                )
              ) {
                // Setup channel decorator handlers
                p.prototype.ModLoader.NetworkHandler.ChannelHandlers.forEach(
                  function(value: string, key: string) {
                    let a = (plugin as any)[value].bind(plugin);
                    NetworkChannelBus.addListener(key, a);
                  }
                );
              }
            }
            if (p.prototype.ModLoader.hasOwnProperty('ServerNetworkHandler')) {
              // Setup server-side packet decorator handlers
              if (
                p.prototype.ModLoader.ServerNetworkHandler.hasOwnProperty(
                  'PacketHandlers'
                ) !== null
              ) {
                p.prototype.ModLoader.ServerNetworkHandler.PacketHandlers.forEach(
                  function(value: string, key: string) {
                    let a = (plugin as any)[value].bind(plugin);
                    NetworkBusServer.addListener(key, a);
                  }
                );
              }
              if (
                p.prototype.ModLoader.ServerNetworkHandler.hasOwnProperty(
                  'ChannelHandlers'
                )
              ) {
                // Setup server-side channel decorator handlers
                p.prototype.ModLoader.ServerNetworkHandler.ChannelHandlers.forEach(
                  function(value: string, key: string) {
                    let a = (plugin as any)[value].bind(plugin);
                    NetworkChannelBusServer.addListener(key, a);
                  }
                );
              }
            }
            if (p.prototype.ModLoader.hasOwnProperty('InjectCore')) {
              // Inject the core.
              Object.defineProperty(
                plugin,
                p.prototype.ModLoader.InjectCore.get('field')(),
                {
                  value: this.loaded_core,
                  writable: false,
                }
              );
            }
          }
          setupLobbyVariable(plugin, p.prototype);
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

  loadPluginsConstruct(overrideCore = '') {
    // Start the core plugin.
    if (overrideCore !== '') {
      this.selected_core = overrideCore;
    }
    let core = this.core_plugins[this.selected_core];
    core['ModLoader'] = {};
    core['ModLoader']['logger'] = this.logger.child({});
    core['ModLoader']['config'] = this.config;
    this.loaded_core = core;

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

  loadPluginsInit(me: INetworkPlayer) {
    this.loaded_core.ModLoader.me = me;
    this.loaded_core.init();
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.me = me;
      plugin.init();
    });
  }

  loadPluginsPostinit(emulator: IMemory, console: IConsole) {
    console.pauseEmulator();
    let gameshark = new GameShark(this.logger, emulator);
    this.plugin_folders.forEach((dir: string) => {
      let test = path.join(dir, 'payloads');
      if (fs.existsSync(test)) {
        if (fs.lstatSync(test).isDirectory) {
          fs.readdirSync(test).forEach((payload: string) => {
            gameshark.read(path.resolve(path.join(test, payload)));
          });
        }
      }
    });
    let mainConfig = this.config.registerConfigCategory(
      'ModLoader64'
    ) as IModLoaderConfig;
    this.loaded_core.ModLoader.emulator = emulator;
    this.loaded_core.postinit();
    this.plugins.forEach((plugin: IPlugin) => {
      plugin.ModLoader.emulator = emulator;
      plugin.postinit();
      if (mainConfig.isClient) {
        bus.emit(EventsClient.ON_PLUGIN_READY, plugin);
      }
      if (mainConfig.isServer) {
        bus.emit(EventsServer.ON_PLUGIN_READY, plugin);
      }
    });
    (function(inst) {
      inst.onTickHandle = function(frame: number) {
        inst.loaded_core.onTick();
        inst.plugins.forEach((plugin: IPlugin) => {
          plugin.onTick();
        });
      };
      console.setFrameCallback(inst.onTickHandle);
    })(this);
    console.resumeEmulator();
  }
}

export default pluginLoader;
