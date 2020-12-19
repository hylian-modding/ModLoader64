import { INetworkPlayer } from './NetworkHandler';
import { EventEmitter2 } from 'eventemitter2';

export class EventBus extends EventEmitter2 {}

const bus: EventBus = new EventBus();

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

export class EventServerJoined {
  readonly player: INetworkPlayer;
  readonly lobby: string;

  constructor(player: INetworkPlayer, lobby: string) {
      this.player = player;
      this.lobby = lobby;
  }
}

export class EventServerLeft extends EventServerJoined {}

export enum EventsServer {
  ON_LOBBY_CREATE = 'lobbyCreated_server',
  ON_LOBBY_JOIN = 'lobbyJoin_server',
  ON_LOBBY_LEAVE = 'lobbyLeave_server',
  ON_PLUGIN_READY = 'pluginReady_server',
  ON_VERSION_CHECK = 'versioncheck_server',
  ON_LOBBY_DATA = "lobbyData_server"
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
}

export function setupEventHandlers(instance: any) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")){
            return;
        }
        if (p.ModLoader.hasOwnProperty('eventHandlers')) {
            p.ModLoader.eventHandlers.forEach(function(value: string, key: string) {
                let a = (instance as any)[value].bind(instance);
                bus.addListener(key, a);
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

export { bus, EventHandler };
