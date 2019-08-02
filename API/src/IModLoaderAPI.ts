import IMemory from './IMemory';
import { ILobbyManager, INetworkPlayer, INetwork } from './NetworkHandler';
import IUtils from './IUtils';

export interface ILogger {
  info(msg: string): void;
  error(msg: string): void;
  child(params: object): ILogger;
}

export interface IConfig {
  data: any;
  file: string;
  setData(category: string, key: string, value: any, override?: boolean): void;
  registerConfigCategory(category: string): object;
  save(): void;
}

export interface IModLoaderAPI {
  logger: ILogger;
  config: IConfig;
  emulator: IMemory;
  lobbyManager: ILobbyManager;
  me: INetworkPlayer;
  clientSide: INetwork;
  serverSide: INetwork;
  clientLobby: string;
  utils: IUtils;
}

export interface IPlugin {
  core_dependency: string;
  ModLoader: IModLoaderAPI;
  // This is set by the ModLoader.
  pluginName?: string;
  preinit(): void;
  init(): void;
  postinit(): void;
  onTick(): void;
}

export interface ICore {
  header: string;
  ModLoader: IModLoaderAPI;
  preinit(): void;
  init(): void;
  postinit(): void;
  onTick(): void;
}
