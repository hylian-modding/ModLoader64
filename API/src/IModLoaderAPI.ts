import IMemory from './IMemory';
import { ILobbyManager, INetworkPlayer, INetwork, INetworkClient } from './NetworkHandler';
import ISaveState from './ISaveState';
import { IRomHeader } from './IRomHeader';
import { IGUIAPI } from './GUITunnel';
import { IPayloadManager } from './PayloadType';
import { IMath } from './math/IMath';
import { IRomMemory } from './IRomMemory';
import { ISoundSystem } from './Sound/ISoundSystem';
import { IImGui } from './Sylvain/ImGui';
import { SDL } from './Sylvain/SDL';
import { Gfx } from './Sylvain/Gfx';
import { Input } from './Sylvain/Input';
import { Debugger } from './Sylvain/Debugger';
import { Heap } from './heap';
import { EventBus } from './EventHandler';
import IUtils from './IUtils';
import { IHiResTexture } from './IHiResTexture';

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
  clientSide: INetworkClient;
  serverSide: INetwork;
  clientLobby: string;
  utils: IUtils;
  gui: IGUIAPI;
  payloadManager: IPayloadManager;
  math: IMath;
  rom: IRomMemory;
  isClient: boolean;
  isServer: boolean;
  sound: ISoundSystem;
  isModLoaded(modid: string): boolean;
  heap: Heap | undefined;
  gfx_heap: Heap | undefined;
  publicBus: EventBus;
  privateBus: EventBus
  hires_texture_management: IHiResTexture;
}

export interface IModLoaderAPI {
  savestates: ISaveState;
}

export interface IModLoaderAPI {
  ImGui: IImGui;
}

export interface IModLoaderAPI {
  SDL: SDL;
}

export interface IModLoaderAPI {
  Gfx: Gfx;
}

export interface IModLoaderAPI {
  Input: Input;
}

export interface IModLoaderAPI {
  debugger: Debugger;
}

export interface IPlugin {
  ModLoader: IModLoaderAPI;
  pluginName?: string;
  pluginHash?: string;
  preinit(): void;
  init(): void;
  postinit(): void;
  onTick(frame?: number): void;
}

export interface ICore {
  header: string | string[];
  ModLoader: IModLoaderAPI;
  rom_header?: IRomHeader;
  preinit(): void;
  init(): void;
  postinit(): void;
  onTick(frame?: number): void;
  heap_start: number;
  heap_size: number;
}

export interface IExtendedCore{
  postconstructor(): void;
}

export interface IPluginServerConfig {
  getServerURL(): string;
}

export enum ModLoaderEvents {
  ON_ROM_PATH = 'ON_ROM_PATH',
  ON_ROM_HEADER_PARSED = 'ON_ROM_HEADER_PARSED',
  ON_CRASH = 'ON_MODLOADER_CRASH',
  ON_PRE_ROM_LOAD = "ON_PRE_ROM_LOAD",
  ON_SOFT_RESET_PRE = "ON_SOFT_RESET_PRE",
  ON_SOFT_RESET_POST = "ON_SOFT_RESET_POST",
  ON_ROM_PATCHED_PRE = "ON_ROM_PATCHED_PRE",
  ON_ROM_PATCHED = 'ON_ROM_PATCHED',
  ON_ROM_PATCHED_POST = "ON_ROM_PATCHED_POST",
  ON_RECEIVED_CRASH_LOG = "ON_RECEIVED_CRASH_LOG",
  ON_VOLUME_CHANGE = "ON_VOLUME_CHANGE",
  OVERRIDE_TEXTURE_PATH = "OVERRIDE_TEXTURE_PATH",
  ON_EXTERNAL_API_REGISTER = "ON_EXTERNAL_API_REGISTER",
  LOAD_HD_TEXTURES = "LOAD_HD_TEXTURES"
}

export class VersionCheckEvent {
  ModLoader: string;
  plugins: any;
  canceled: boolean = false;

  constructor(ModLoader: string, plugins: any) {
    this.ModLoader = ModLoader;
    this.plugins = plugins;
  }
}