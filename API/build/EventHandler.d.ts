import { INetworkPlayer } from './NetworkHandler';
import { EventEmitter2 } from 'eventemitter2';
export declare class EventBus extends EventEmitter2 {
}
declare const bus: EventBus;
declare function EventHandler(key: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare class EventServerJoined {
    readonly player: INetworkPlayer;
    readonly lobby: string;
    constructor(player: INetworkPlayer, lobby: string);
}
export declare class EventServerLeft extends EventServerJoined {
}
export declare enum EventsServer {
    ON_LOBBY_CREATE = "lobbyCreated_server",
    ON_LOBBY_JOIN = "lobbyJoin_server",
    ON_LOBBY_LEAVE = "lobbyLeave_server",
    ON_PLUGIN_READY = "pluginReady_server"
}
export declare enum EventsClient {
    ON_LOBBY_CREATE = "lobbyJoined_client",
    CONFIGURE_LOBBY = "configureLobby_client",
    ON_SERVER_CONNECTION = "onServerConnection_client",
    ON_PLAYER_LEAVE = "playerLeave_client",
    ON_PLAYER_JOIN = "playerJoin_client",
    ON_LOBBY_JOIN = "lobbyJoined_client",
    ON_PLUGIN_READY = "pluginReady_client",
    ON_INJECT_FINISHED = "plugins_injectFinished",
    ON_PAYLOAD_INJECTED = "plugins_OnPayloadInjected"
}
export declare function setupEventHandlers(instance: any): void;
export { bus, EventHandler };
