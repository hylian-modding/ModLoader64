import { EventEmitter } from "events";

class EventBus extends EventEmitter{
}

const bus: EventBus = new EventBus()

function EventHandler(key: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.ModLoader === undefined){
            target["ModLoader"] = {}
        }
        if (target.ModLoader.eventHandlers === undefined){
            target.ModLoader["eventHandlers"] = new Map<string, Function>()
        }
        target.ModLoader.eventHandlers.set(key, propertyKey)
    };
}

export enum EventsServer{
    ON_LOBBY_CREATE = "lobbyCreated",
    ON_LOBBY_JOIN = "lobbyJoin"
}

export enum EventsClient{
    LOBBY_JOINED = "lobbyJoined",
    CONFIGURE_LOBBY = "configureLobby",
    ON_SERVER_CONNECTION = "onServerConnection"
}

export {bus, EventHandler}