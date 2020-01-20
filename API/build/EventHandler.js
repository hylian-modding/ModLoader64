"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
class EventBus extends eventemitter2_1.EventEmitter2 {
}
exports.EventBus = EventBus;
const bus = new EventBus();
exports.bus = bus;
function EventHandler(key) {
    return function (target, propertyKey, descriptor) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.eventHandlers === undefined) {
            target.ModLoader['eventHandlers'] = new Map();
        }
        target.ModLoader.eventHandlers.set(key, propertyKey);
    };
}
exports.EventHandler = EventHandler;
class EventServerJoined {
    constructor(player, lobby) {
        this.player = player;
        this.lobby = lobby;
    }
}
exports.EventServerJoined = EventServerJoined;
class EventServerLeft extends EventServerJoined {
}
exports.EventServerLeft = EventServerLeft;
var EventsServer;
(function (EventsServer) {
    EventsServer["ON_LOBBY_CREATE"] = "lobbyCreated_server";
    EventsServer["ON_LOBBY_JOIN"] = "lobbyJoin_server";
    EventsServer["ON_LOBBY_LEAVE"] = "lobbyLeave_server";
    EventsServer["ON_PLUGIN_READY"] = "pluginReady_server";
})(EventsServer = exports.EventsServer || (exports.EventsServer = {}));
var EventsClient;
(function (EventsClient) {
    EventsClient["ON_LOBBY_CREATE"] = "lobbyJoined_client";
    EventsClient["CONFIGURE_LOBBY"] = "configureLobby_client";
    EventsClient["ON_SERVER_CONNECTION"] = "onServerConnection_client";
    EventsClient["ON_PLAYER_LEAVE"] = "playerLeave_client";
    EventsClient["ON_PLAYER_JOIN"] = "playerJoin_client";
    EventsClient["ON_LOBBY_JOIN"] = "lobbyJoined_client";
    EventsClient["ON_PLUGIN_READY"] = "pluginReady_client";
    EventsClient["ON_INJECT_FINISHED"] = "plugins_injectFinished";
    EventsClient["ON_PAYLOAD_INJECTED"] = "plugins_OnPayloadInjected";
})(EventsClient = exports.EventsClient || (exports.EventsClient = {}));
function setupEventHandlers(instance) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty('eventHandlers')) {
            p.ModLoader.eventHandlers.forEach(function (value, key) {
                let a = instance[value].bind(instance);
                bus.addListener(key, a);
            });
        }
    }
}
exports.setupEventHandlers = setupEventHandlers;
//# sourceMappingURL=EventHandler.js.map