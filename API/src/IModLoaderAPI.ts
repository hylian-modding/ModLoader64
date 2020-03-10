import IMemory from './IMemory';
import { ILobbyManager, INetworkPlayer, INetwork } from './NetworkHandler';
import IUtils from './IUtils';
import ISaveState from './ISaveState';
import { IRomHeader } from './IRomHeader';
import { IGUIAPI } from './GUITunnel';
import { IPayloadManager } from './PayloadType';
import { IMath } from './math/IMath';
import { IRomMemory } from './IRomMemory';

export const enum ILoggerLevels {
  ALL = 'all',
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface ILogger {
  info(...msg: string[]): void;
  warn(...msg: string[]): void;
  error(...msg: string[]): void;
  debug(...msg: string[]): void;
  setLevel(level: ILoggerLevels): void;
  getLogger(id: string): ILogger;
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
  savestates: ISaveState;
  gui: IGUIAPI;
  payloadManager: IPayloadManager;
  math: IMath;
  rom: IRomMemory;
}

export interface IPlugin {
  ModLoader: IModLoaderAPI;
  pluginName?: string;
  preinit(): void;
  init(): void;
  postinit(): void;
  onTick(frame?: number): void;
}

export interface ICore {
  header: string;
  ModLoader: IModLoaderAPI;
  rom_header?: IRomHeader;
  preinit(): void;
  init(): void;
  postinit(): void;
  onTick(frame?: number): void;
}

export enum ModLoaderEvents {
  ON_ROM_PATH = 'ON_ROM_PATH',
  ON_ROM_PATCHED = 'ON_ROM_PATCHED',
  ON_ROM_HEADER_PARSED = 'ON_ROM_HEADER_PARSED',
  ON_CRASH = 'ON_MODLOADER_CRASH',
  ON_PRE_ROM_LOAD = "ON_PRE_ROM_LOAD",
  ON_SOFT_RESET_PRE = "ON_SOFT_RESET_PRE",
  ON_SOFT_RESET_POST = "ON_SOFT_RESET_POST",
  ON_ROM_PATCHED_POST = "ON_ROM_PATCHED_POST"
}