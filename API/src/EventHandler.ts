import { INetworkPlayer } from './NetworkHandler';
import { EventEmitter2 } from 'eventemitter2';

export class EventBus extends EventEmitter2 {}

const bus: EventBus = Object.freeze(new EventBus());

function EventHandler(key: string) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.eventHandlers === undefined) {
            target.ModLoader['eventHandlers'] = new Map<string, string>();
        }
        target.ModLoader.eventHandlers.set(key, propertyKey);
    };
}

function PrivateEventHandler(key: string) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.PrivateEventHandler === undefined) {
            target.ModLoader['PrivateEventHandler'] = new Map<string, string>();
        }
        target.ModLoader.PrivateEventHandler.set(key, propertyKey);
    };
}

export class EventServerJoined {
  readonly player: INetworkPlayer;
  readonly lobby: string;

  constructor(player: INetworkPlayer, lobby: string) {
      this.player = player;
      this.lobby = lobby;
  }
}

export class EventOwnerChanged{
    readonly lobby: string;
    readonly owner: INetworkPlayer;

    constructor(lobby: string, owner: INetworkPlayer){
        this.lobby = lobby;
        this.owner = owner;
    }
}

export class EventServerLeft extends EventServerJoined {}

export enum EventsServer {
  ON_LOBBY_CREATE = 'lobbyCreated_server',
  ON_LOBBY_JOIN = 'lobbyJoin_server',
  ON_LOBBY_LEAVE = 'lobbyLeave_server',
  ON_PLUGIN_READY = 'pluginReady_server',
  ON_VERSION_CHECK = 'versioncheck_server',
  ON_LOBBY_DATA = "lobbyData_server",
  ON_LOBBY_DESTROY = "lobbyDestroyed_Server",
  ON_LOBBY_OWNER_CHANGE = "lobbyOwnerChanged_server"
}

export enum EventsClient {
  ON_LOBBY_CREATE = 'lobbyJoined_client',
  CONFIGURE_LOBBY = 'configureLobby_client',
  ON_SERVER_CONNECTION = 'onServerConnection_client',
  ON_PLAYER_LEAVE = 'playerLeave_client',
  ON_PLAYER_JOIN = 'playerJoin_client',
  ON_LOBBY_JOIN = 'lobbyJoined_client',
  ON_PLUGIN_READY = 'pluginReady_client',
  ON_INJECT_FINISHED = 'plugins_injectFinished',
  ON_PAYLOAD_INJECTED = 'plugins_OnPayloadInjected',
  ON_HEAP_READY = "ON_HEAP_READY",
  ON_HEAP_SETUP = "ON_HEAP_SETUP",
  ON_LOBBY_OWNER_CHANGE = "lobbyOwnerChanged_client"
}

export function setupEventHandlers(instance: any, _bus: EventBus) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")){
            return;
        }
        if (p.ModLoader.hasOwnProperty('eventHandlers')) {
            p.ModLoader.eventHandlers.forEach(function(value: string, key: string) {
                let a = (instance as any)[value].bind(instance);
                _bus.addListener(key, a);
            });
        }
    }
}

export function setupPrivateEventHandlers(instance: any, _bus: EventBus) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")){
            return;
        }
        if (p.ModLoader.hasOwnProperty('PrivateEventHandler')) {
            p.ModLoader.PrivateEventHandler.forEach(function(value: string, key: string) {
                let a = (instance as any)[value].bind(instance);
                _bus.addListener(key, a);
            });
        }
    }
}

export function markPrototypeProcessed(instance: any){
    let p = Object.getPrototypeOf(instance);
    if (!p.hasOwnProperty('ModLoader')) {
        return;
    }
    p['ModLoader']['hasBeenProcessed'] = true;
}

export { bus, EventHandler, PrivateEventHandler };
