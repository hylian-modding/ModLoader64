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
  ON_LOBBY_CREATE = 'lobbyCreated',
  ON_LOBBY_JOIN = 'lobbyJoin',
  ON_LOBBY_LEAVE = 'lobbyLeave',
}

export enum EventsClient {
  ON_LOBBY_CREATE = 'lobbyJoined',
  CONFIGURE_LOBBY = 'configureLobby',
  ON_SERVER_CONNECTION = 'onServerConnection',
  ON_LOBBY_LEAVE = 'lobbyLeave',
  ON_LOBBY_JOIN = 'lobbyJoined',
}

export { bus, EventHandler };
