"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class NetworkEventBus extends events_1.EventEmitter {
}
exports.NetworkEventBus = NetworkEventBus;
// Client
exports.NetworkBus = new NetworkEventBus();
exports.NetworkChannelBus = new NetworkEventBus();
exports.NetworkSendBus = new NetworkEventBus();
// Server
exports.NetworkBusServer = new NetworkEventBus();
exports.NetworkChannelBusServer = new NetworkEventBus();
exports.NetworkSendBusServer = new NetworkEventBus();
function NetworkHandler(key) {
    return function (target, propertyKey, descriptor) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.NetworkHandler === undefined) {
            target.ModLoader['NetworkHandler'] = {};
        }
        if (target.ModLoader.NetworkHandler.PacketHandlers === undefined) {
            target.ModLoader.NetworkHandler['PacketHandlers'] = new Map();
        }
        target.ModLoader.NetworkHandler.PacketHandlers.set(key, propertyKey);
    };
}
exports.NetworkHandler = NetworkHandler;
function NetworkChannelHandler(key) {
    return function (target, propertyKey, descriptor) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.NetworkHandler === undefined) {
            target.ModLoader['NetworkHandler'] = {};
        }
        if (target.ModLoader.NetworkHandler.ChannelHandlers === undefined) {
            target.ModLoader.NetworkHandler['ChannelHandlers'] = new Map();
        }
        target.ModLoader.NetworkHandler.ChannelHandlers.set(key, propertyKey);
    };
}
exports.NetworkChannelHandler = NetworkChannelHandler;
function ServerNetworkHandler(key) {
    return function (target, propertyKey, descriptor) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler === undefined) {
            target.ModLoader['ServerNetworkHandler'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler.PacketHandlers === undefined) {
            target.ModLoader.ServerNetworkHandler['PacketHandlers'] = new Map();
        }
        target.ModLoader.ServerNetworkHandler.PacketHandlers.set(key, propertyKey);
    };
}
exports.ServerNetworkHandler = ServerNetworkHandler;
function ServerNetworkChannelHandler(key) {
    return function (target, propertyKey, descriptor) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler === undefined) {
            target.ModLoader['ServerNetworkHandler'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler.ChannelHandlers === undefined) {
            target.ModLoader.ServerNetworkHandler['ChannelHandlers'] = new Map();
        }
        target.ModLoader.ServerNetworkHandler.ChannelHandlers.set(key, propertyKey);
    };
}
exports.ServerNetworkChannelHandler = ServerNetworkChannelHandler;
class Server {
    sendPacket(packet) {
        exports.NetworkSendBusServer.emit('msg', packet);
    }
    sendPacketToSpecificPlayer(packet, dest) {
        exports.NetworkSendBusServer.emit('toPlayer', { packet, player: dest });
    }
}
exports.Server = Server;
class Client {
    sendPacket(packet) {
        exports.NetworkSendBus.emit('msg', packet);
    }
    sendPacketToSpecificPlayer(packet, dest) {
        exports.NetworkSendBus.emit('toPlayer', { packet, player: dest });
    }
}
exports.Client = Client;
exports.ServerController = new Server();
exports.ClientController = new Client();
class LobbyData {
    constructor(name, key) {
        this.name = name;
        this.key = key;
        this.data = {};
    }
}
exports.LobbyData = LobbyData;
function setupNetworkHandlers(instance) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty('NetworkHandler')) {
            // Setup packet decorator handlers
            if (p.ModLoader.NetworkHandler.hasOwnProperty('PacketHandlers') !== null) {
                p.ModLoader.NetworkHandler.PacketHandlers.forEach(function (value, key) {
                    let a = instance[value].bind(instance);
                    exports.NetworkBus.addListener(key, a);
                });
            }
            if (p.ModLoader.NetworkHandler.hasOwnProperty('ChannelHandlers')) {
                // Setup channel decorator handlers
                p.ModLoader.NetworkHandler.ChannelHandlers.forEach(function (value, key) {
                    let a = instance[value].bind(instance);
                    exports.NetworkChannelBus.addListener(key, a);
                });
            }
        }
        if (p.ModLoader.hasOwnProperty('ServerNetworkHandler')) {
            // Setup server-side packet decorator handlers
            if (p.ModLoader.ServerNetworkHandler.hasOwnProperty('PacketHandlers') !==
                null) {
                p.ModLoader.ServerNetworkHandler.PacketHandlers.forEach(function (value, key) {
                    let a = instance[value].bind(instance);
                    exports.NetworkBusServer.addListener(key, a);
                });
            }
            if (p.ModLoader.ServerNetworkHandler.hasOwnProperty('ChannelHandlers')) {
                // Setup server-side channel decorator handlers
                p.ModLoader.ServerNetworkHandler.ChannelHandlers.forEach(function (value, key) {
                    let a = instance[value].bind(instance);
                    exports.NetworkChannelBusServer.addListener(key, a);
                });
            }
        }
    }
}
exports.setupNetworkHandlers = setupNetworkHandlers;
//# sourceMappingURL=NetworkHandler.js.map