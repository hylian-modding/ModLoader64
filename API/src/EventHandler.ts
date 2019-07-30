import { EventEmitter } from 'events';

export class EventBus extends EventEmitter {}

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
      target.ModLoader['eventHandlers'] = new Map<string, Function>();
    }
    target.ModLoader.eventHandlers.set(key, propertyKey);
  };
}

export enum EventsServer {
  ON_LOBBY_CREATE = 'lobbyCreated_server',
  ON_LOBBY_JOIN = 'lobbyJoin_server',
  ON_LOBBY_LEAVE = 'lobbyLeave_server',
  ON_PLUGIN_READY = 'pluginReady_server',
}

export enum EventsClient {
  ON_LOBBY_CREATE = 'lobbyJoined_client',
  CONFIGURE_LOBBY = 'configureLobby_client',
  ON_SERVER_CONNECTION = 'onServerConnection_client',
  ON_PLAYER_LEAVE = 'playerLeave_client',
  ON_PLAYER_JOIN = 'playerJoin_client',
  ON_LOBBY_JOIN = 'lobbyJoined_client',
  ON_PLUGIN_READY = 'pluginReady_client',
}

export { bus, EventHandler };
