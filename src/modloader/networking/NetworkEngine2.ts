/*
    This is a rewrite of ML's networking.
    The original networking was a mess and the oldest code in the codebase.
 */

import { ILogger, IConfig, IPlugin, VersionCheckEvent, IPluginServerConfig } from "modloader64_api/IModLoaderAPI";
import { IClientConfig } from "../IClientConfig";
import IModLoaderConfig from "../IModLoaderConfig";
import { IServerConfig } from "../IServerConfig";
import { internal_event_bus } from "../modloader64";
import { ML_UUID } from "../uuid/mluuid";
import { FakeNetworkPlayer } from "./FakeNetworkPlayer";
import dgram, { Socket, RemoteInfo } from 'dgram';
import { LobbyData, INetworkPlayer, ILobbyStorage, IPacketHeader, IToPlayer, NetworkBusServer, NetworkQueryBusServer, NetworkSendBusServer, SocketType, NetworkChannelBusServer, NetworkEventBus, NetworkBus, NetworkChannelBus, NetworkSendBus, IConnectionCheckEvt } from "modloader64_api/NetworkHandler";
import { getLobbyStorage_event, LobbyJoin, LobbyStorage } from "./LobbyObjects";
import { bus, EventsServer, EventOwnerChanged, EventServerJoined, EventServerLeft, EventsClient } from "modloader64_api/EventHandler";
import { NetworkPlayer, UDPPacket } from "modloader64_api/ModLoaderDefaultImpls";
import { UDPModeOnPacket, UDPModeOffPacket, PongPacket, LatencyInfoPacket, VersionPacket, PingPacket, UDPTestPacket } from "./NetworkingPackets";
import { NetworkingEventBusClient, NetworkingEventBusServer } from "./NetworkingEventBus";
import * as dns from 'dns';
import { AddressInfo } from "net";
import { ModLoaderErrorCodes } from "modloader64_api/ModLoaderErrorCodes";
import crypto from 'crypto';
import path from "path";
import { getAllFiles } from "../getAllFiles";
import zlib from 'zlib';
import fs from 'fs';

const fakePlayer: FakeNetworkPlayer = new FakeNetworkPlayer();

interface Networking {
    setup(): void;
}


/**
 * Storage for event handler stuff.
*/
class NetworkEngine2_ServerEventComponents {
    static NetworkSendBusServer_Targets: Array<{ key: string, prop: string }> = [];
    static NetworkBusServer_Targets: Array<{ key: string, prop: string }> = [];
    static NetworkQueryBusServer_Targets: Array<{ key: string, prop: string }> = [];
    static NetworkingEventBusServer_Targets: Array<{ key: string, prop: string }> = [];
    static protocolServer_Targets: Array<{ key: string, prop: string }> = [];
    static ServerHandlers: Array<{ key: string, fn: (evt: any) => void }> = [];
    static serverDisconnectHandler: (socket: SocketIO.Socket) => void;
    static ServerEmitters: Array<{ key: string, fn: (socket: SocketIO.Socket, data: any) => void }> = [];
}

class NetworkEngine2_ClientEventComponents {
    //Client
    static NetworkSendBusClient_Targets: Array<{ key: string, prop: string }> = [];
    static NetworkBusClient_Targets: Array<{ key: string, prop: string }> = [];
    static NetworkQueryBusClient_Targets: Array<{ key: string, prop: string }> = [];
    static NetworkingEventBusClient_Targets: Array<{ key: string, prop: string }> = [];
    static protocolClient_Targets: Array<{ key: string, prop: string }> = [];
    static ClientHandlers: Array<{ key: string, fn: (evt: any) => void }> = [];
    static clientDisconnectHandler: (socket: SocketIO.Socket) => void;
    static ClientEmitters: Array<{ key: string, fn: (socket: SocketIO.Socket, data: any) => void }> = [];
}

const enum NetworkEngine2_EventType {
    // Server
    NetworkSendBusServer = "NetworkSendBusServer",
    NetworkBusServer = "NetworkBusServer",
    NetworkQueryBusServer = "NetworkQueryBusServer",
    NetworkingEventBusServer = 'NetworkingEventBusServer',
    protocolServer = "protocolServer",
    // Client
    NetworkSendBus = "NetworkSendBus",
    NetworkBus = "NetworkBus",
    NetworkQueryBus = "NetworkQueryBus",
    NetworkingEventBusClient = "NetworkingEventBusClient",
    protocolClient = "protocolClient"
}

function ServerEventHandler(type: NetworkEngine2_EventType, key: string) {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (type === NetworkEngine2_EventType.NetworkBusServer) {
            NetworkEngine2_ServerEventComponents.NetworkBusServer_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.NetworkQueryBusServer) {
            NetworkEngine2_ServerEventComponents.NetworkQueryBusServer_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.NetworkSendBusServer) {
            NetworkEngine2_ServerEventComponents.NetworkSendBusServer_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.NetworkingEventBusServer) {
            NetworkEngine2_ServerEventComponents.NetworkingEventBusServer_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.protocolServer) {
            NetworkEngine2_ServerEventComponents.protocolServer_Targets.push({ key, prop: propertyKey });
        }
    };
}

function ClientEventHandler(type: NetworkEngine2_EventType, key: string) {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (type === NetworkEngine2_EventType.NetworkBus) {
            NetworkEngine2_ClientEventComponents.NetworkBusClient_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.NetworkQueryBus) {
            NetworkEngine2_ClientEventComponents.NetworkQueryBusClient_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.NetworkSendBus) {
            NetworkEngine2_ClientEventComponents.NetworkSendBusClient_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.NetworkingEventBusClient) {
            NetworkEngine2_ClientEventComponents.NetworkingEventBusClient_Targets.push({ key, prop: propertyKey });
        } else if (type === NetworkEngine2_EventType.protocolClient) {
            NetworkEngine2_ClientEventComponents.protocolClient_Targets.push({ key, prop: propertyKey });
        }
    };
}

export class NetworkEngine2_Server implements Networking {

    io: any;
    udpServer: Socket = dgram.createSocket('udp4');
    udpPort = -1;
    logger: ILogger;
    masterConfig: IConfig;
    config: IServerConfig;
    modLoaderconfig: IModLoaderConfig;
    lobbyStorage: any = {};
    plugins: any = {};
    core: string = "";
    lobby_names: Array<string> = [];
    protocol: NetworkEventBus = new NetworkEventBus();

    constructor(logger: ILogger, config: IConfig) {
        // Configuration.
        this.logger = logger;
        this.masterConfig = config;
        this.config = config.registerConfigCategory('NetworkEngine.Server') as IServerConfig;
        config.setData('NetworkEngine.Server', 'port', 8082);
        config.setData('NetworkEngine.Server', 'udpPort', 8082);
        config.setData('NetworkEngine.Server', 'patchSizeLimitMB', 10);
        this.modLoaderconfig = this.masterConfig.registerConfigCategory('ModLoader64') as IModLoaderConfig;

        NetworkEngine2_ServerEventComponents.serverDisconnectHandler = this.onSocketDisconnect.bind(this);

        internal_event_bus.on('PLUGIN_LOADED', (args: any[]) => {
            let p: any = args[0].meta;
            this.plugins[p.name] = { version: p.version, hash: args[0].hash };
        });
        internal_event_bus.on('CORE_LOADED', (args: any[]) => {
            this.core = args[0].name;
            if ((config.registerConfigCategory("NetworkEngine.Client") as IClientConfig).isSinglePlayer) {
                this.config.port = parseInt("8082");
                (config.registerConfigCategory('ModLoader64') as IModLoaderConfig).isServer = true;
            }
        });

        NetworkingEventBusServer.on('getLobbyStorage', (evt: getLobbyStorage_event) => {
            evt.obj = this.getLobbyStorage(evt.lobbyName, evt.plugin);
        });

        NetworkingEventBusServer.on(
            'createLobbyStorage',
            (evt: getLobbyStorage_event) => {
                this.createLobbyStorage(evt.lobbyName, evt.plugin, evt.obj);
            }
        );

        NetworkingEventBusServer.on('getAllLobbies', (evt: any) => {
            evt["r"] = this.getAllLobbies();
        });

        NetworkQueryBusServer.on('isPlayerConnected', (evt: IConnectionCheckEvt) => {
            evt.connected = this.io.sockets.sockets[evt.player.uuid] !== undefined;
        });
    }

    getLobbies() {
        return this.io.sockets.adapter.rooms;
    }

    doesLobbyExist(Lobby: string) {
        return this.getLobbies().hasOwnProperty(Lobby);
    }

    createLobbyStorage_internal(ld: LobbyData, owner: INetworkPlayer): ILobbyStorage {
        if (this.getLobbyStorage_internal(ld.name) !== null) {
            delete this.lobbyStorage[ld.name];
        }
        this.lobbyStorage[ld.name] = {};
        this.lobbyStorage[ld.name]['ModLoader64'] = new LobbyStorage(ld, owner);
        return this.lobbyStorage[ld.name]['ModLoader64'];
    }

    getLobbyStorage_internal(lobbyName: string): ILobbyStorage | null {
        try {
            return this.lobbyStorage[lobbyName].ModLoader64;
        } catch (err: any) { }
        return null;
    }

    createLobbyStorage(lobbyName: string, plugin: IPlugin, obj: any): void {
        let mathisore: LobbyStorage = this.lobbyStorage[lobbyName]['ModLoader64'];
        if (!mathisore.hasOwnProperty('data')) {
            mathisore['data'] = {};
        }
        mathisore.data[plugin.pluginName as string] = obj;
    }

    getAllLobbies(): any {
        return this.lobbyStorage;
    }

    getLobbyStorage(lobbyName: string, plugin: IPlugin): Object | null {
        try {
            return this.lobbyStorage[lobbyName].ModLoader64.data[
                plugin.pluginName as string
            ];
        } catch (err: any) { }
        return null;
    }

    getPlayerRinfo(player: INetworkPlayer | string): RemoteInfo | undefined {
        if (typeof (player) === 'string') {
            if (this.io.sockets.sockets[player] === undefined) return undefined;
            if (this.io.sockets.sockets[player]["ModLoader64"] === undefined) return undefined;
            return this.io.sockets.sockets[player].ModLoader64["rinfo"];
        } else {
            if (this.io.sockets.sockets[player.uuid] === undefined) return undefined;
            if (this.io.sockets.sockets[player.uuid]["ModLoader64"] === undefined) return undefined;
            return this.io.sockets.sockets[player.uuid].ModLoader64["rinfo"];
        }
    }

    sendToTarget(target: string, internalChannel: string, packet: any) {
        this.io.to(target).emit(internalChannel, packet);
    }

    onSocketDisconnect(socket: SocketIO.Socket) {
        //@ts-ignore
        let ML = socket.ModLoader64;
        if (ML === undefined) return;
        if (this.getLobbyStorage_internal(ML.lobby) === null) return;
        let lobby = this.getLobbyStorage_internal(ML.lobby)!;
        if (lobby.owner === ML.player.uuid) {
            // Owner left. Reassign.
            let index = lobby.players.indexOf(ML.player.uuid);
            if (index > -1) {
                lobby.players.splice(index, 1);
                if (lobby.players.length > 0) {
                    lobby.owner = lobby.players[0];
                } else {
                    lobby.owner.uuid = "null";
                    lobby.owner.nickname = "null";
                }
            }
        }
        bus.emit(EventsServer.ON_LOBBY_LEAVE, new EventServerLeft(ML.player, ML.lobby));
        this.sendToTarget(ML.lobby, 'left', ML.player as INetworkPlayer);
        bus.emit(EventsServer.ON_LOBBY_OWNER_CHANGE, new EventOwnerChanged(lobby.config.name, lobby.owner));
        this.sendToTarget(ML.lobby, 'newOwner', lobby.owner);
    }

    onUDPPacket(buf: Buffer, rinfo: RemoteInfo) {
        try {
            let msg: string = buf.toString();
            if (msg.charAt(0) !== '{') {
                return;
            }
            let data: IPacketHeader = JSON.parse(msg);
            Object.defineProperty(data, "rinfo", {
                value: rinfo,
                writable: false,
            });
            Object.freeze(data);
            if (this.getLobbyStorage_internal(data.lobby) === null) {
                return;
            }
            NetworkBusServer.emit(data.packet_id, data);
            NetworkChannelBusServer.emit(data.channel, data);
            if (data.forward) {
                let json = JSON.stringify(data);
                let players = Object.keys(this.io.sockets.adapter.rooms[data.lobby].sockets);
                for (let i = 0; i < players.length; i++) {
                    if (players[i] === data.player.uuid) continue;
                    let rinfo = this.getPlayerRinfo(players[i]);
                    if (rinfo !== undefined) {
                        this.udpServer.send(json, rinfo.port, rinfo.address);
                    } else {
                        this.sendToTarget(players[i], 'msg', data);
                    }
                }
            }
        } catch (err: any) {
            this.logger.error(err);
        }
    }

    setup(): void {
        // Setup the socket.
        const server = require('http').createServer();
        this.io = require('socket.io')(server);
        server.listen(this.config.port);
        this.logger.info(`NetworkEngine2_Server set up on port ${this.config.port}.`);
        // If we are only a server fake this event so the process doesn't hang.
        if (!this.modLoaderconfig.isClient) {
            internal_event_bus.emit('onNetworkConnect', {
                me: fakePlayer,
                patch: Buffer.alloc(1),
            });
        }

        this.udpPort = this.config.udpPort;
        this.udpServer.bind(this.config.udpPort);

        NetworkEngine2_ServerEventComponents.NetworkBusServer_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkBusServer.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ServerEventComponents.NetworkQueryBusServer_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkQueryBusServer.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ServerEventComponents.NetworkSendBusServer_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkSendBusServer.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ServerEventComponents.protocolServer_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            this.protocol.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ServerEventComponents.NetworkingEventBusServer_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkingEventBusServer.on(entry.key, fn.bind(this));
        });
        let protocol: string[] = ['version', 'LobbyRequest', 'playerJoined_reply', 'msg', 'toSpecificPlayer', 'onCrash'];
        protocol.forEach((str: string) => {
            NetworkEngine2_ServerEventComponents.ServerEmitters.push({
                key: str, fn: (socket: SocketIO.Socket, data: any) => {
                    this.protocol.emit(str, socket, data);
                }
            });
        });
        this.io.on('connection', (socket: SocketIO.Socket) => {
            NetworkEngine2_ServerEventComponents.ServerHandlers.forEach((value: { key: string, fn: (evt: any) => void }) => {
                socket.on(value.key, value.fn);
            });
            NetworkEngine2_ServerEventComponents.ServerEmitters.forEach((value: { key: string, fn: (socket: SocketIO.Socket, data: any) => void }) => {
                socket.on(value.key, (data: any)=>{
                    value.fn(socket, data);
                });
            });
            socket.on('disconnect', NetworkEngine2_ServerEventComponents.serverDisconnectHandler);
            NetworkingEventBusServer.emit('connection', socket);
        });

        this.udpServer.on('error', (err: any) => {
            this.logger.error(`server error:\n${err.stack}`);
            this.udpServer.close();
        });
        this.udpServer.on('message', this.onUDPPacket.bind(this));
        this.udpServer.on('listening', () => {
            const address = this.udpServer.address() as AddressInfo;
            this.logger.info(`UDP socket listening ${address.address}:${address.port}`);
        });
    }

    /**
     * Main handler for mod packet broadcasts.
     * @param data 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkSendBusServer, 'msg')
    onMsg(data: IPacketHeader) {
        if (data.player === undefined) {
            data.player = fakePlayer;
        }
        if (data.socketType === SocketType.TCP) {
            this.sendToTarget(data.lobby, 'msg', data);
        } else {
            let uuids = Object.keys(this.io.sockets.adapter.rooms[data.lobby]);
            for (let i = 0; i < uuids.length; i++) {
                let mlo = this.io.sockets.sockets[uuids[i]].ModLoader64;
                if (mlo.hasOwnProperty("rinfo")) {
                    let rinfo: RemoteInfo = mlo.rinfo;
                    this.udpServer.send(JSON.stringify(data), rinfo.port, rinfo.address);
                }
            }
        }
    }

    /**
     * Handler for player to player direct communications.
     * @param data 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkSendBusServer, 'toPlayer')
    onToPlayer(data: IToPlayer) {
        if (data.player === undefined) {
            data.player = fakePlayer;
        }
        if (data.packet.socketType === SocketType.TCP) {
            this.sendToTarget(data.player.uuid, 'msg', data.packet);
        } else {
            let rinfo = this.getPlayerRinfo(data.player);
            if (rinfo !== undefined) {
                this.udpServer.send(JSON.stringify(data.packet), rinfo.port, rinfo.address);
            } else {
                this.sendToTarget(data.player.uuid, 'msg', data.packet);
            }
        }
    }

    /**
     * UDP test packet handler
     * @param packet 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkBusServer, 'UDPTestPacket')
    onUDPTest(packet: UDPPacket) {
        let reply: UDPPacket = JSON.parse(JSON.stringify(packet));
        reply.player = fakePlayer;
        this.udpServer.send(JSON.stringify(reply), packet.rinfo!.port, packet.rinfo!.address);
    }

    /**
     * UDP handler for turning UDP mode on for a client.
     * @param packet 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkBusServer, 'UDPModeOnPacket')
    onUDPModeOnPacket(packet: UDPModeOnPacket) {
        this.io.sockets.sockets[packet.player.uuid].ModLoader64["rinfo"] = packet.rinfo;
    }

    /**
     * UDP handler for turning UDP mode off for a client.
     * @param packet 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkBusServer, 'UDPModeOffPacket')
    onUDPModeOffPacket(packet: UDPModeOffPacket) {
        delete this.io.sockets.sockets[packet.player.uuid].ModLoader64["rinfo"];
    }

    /**
     * Final response in the ping/pong chain. Gives client latency info.
     * @param packet 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkBusServer, 'PongPacket')
    onPongPacket(packet: PongPacket) {
        let ping = packet.timestamp - packet.serverTime;
        let roundtrip = Date.now() - packet.serverTime;
        this.sendToTarget(packet.player.uuid, 'msg', new LatencyInfoPacket(packet.lobby, ping, roundtrip));
    }

    /**
     * Gets the owner of a lobby.
     * @param evt 
     * @returns 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkQueryBusServer, 'getOwner')
    onGetOwner(evt: any) {
        let lobby = this.getLobbyStorage_internal(evt.lobby);
        if (lobby === null) return;
        evt.owner = lobby.owner;
    }

    /**
     * Sets the owner of a lobby.
     * @param evt 
     * @returns 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkQueryBusServer, 'promoteOwner')
    onPromoteOwner(evt: any) {
        let lobby = this.getLobbyStorage_internal(evt.lobby);
        if (lobby === null) return;
        lobby.owner = evt.owner;
        bus.emit(EventsServer.ON_LOBBY_OWNER_CHANGE, new EventOwnerChanged(lobby.config.name, lobby.owner));
        this.sendToTarget(lobby.config.name, 'newOwner', lobby.owner);
    }

    /**
     * Main connection handler.
     * @param socket 
     */
    @ServerEventHandler(NetworkEngine2_EventType.NetworkingEventBusServer, 'connection')
    onConnection(socket: SocketIO.Socket) {
        this.logger.info('Client ' + socket.id + ' connected.');
        this.sendToTarget(socket.id, 'uuid', { uuid: socket.id });
    }

    /**
     * Check the client's version.
     * @param socket 
     * @param packet 
     */
    @ServerEventHandler(NetworkEngine2_EventType.protocolServer, 'version')
    onVersionCheck(socket: SocketIO.Socket, packet: VersionPacket) {
        let mismatch = false;
        try {
            Object.keys(this.plugins).forEach((name: string) => {
                if (packet.plugins.hasOwnProperty(name)) {
                    if (this.plugins[name].version !== packet.plugins[name].version) {
                        mismatch = true;
                    } else {
                        this.logger.info('Plugin ' + name + ' version check passed.');
                        if (this.plugins[name].hash === packet.plugins[name].hash) {
                            this.logger.info('Plugin ' + name + ' hash check passed.');
                        } else {
                            mismatch = true;
                        }
                    }
                }
            });
        } catch (err: any) {
            this.sendToTarget(socket.id, 'versionBad', {
                client: { ml: packet.ml, plugins: packet.plugins, core: packet.core },
                server: new VersionPacket(
                    global.ModLoader.version,
                    this.plugins,
                    this.core,
                    packet.discord
                ),
            });
        }
        if (this.core !== packet.core) {
            mismatch = true;
        }
        let evt = new VersionCheckEvent(packet.ml, packet.plugins);
        evt.canceled = mismatch;
        bus.emit(EventsServer.ON_VERSION_CHECK, evt);
        mismatch = evt.canceled;
        if (global.ModLoader.version === packet.ml && mismatch === false) {
            this.sendToTarget(socket.id, 'versionGood', {
                client: packet.ml,
                server: new VersionPacket(global.ModLoader.version, this.plugins, this.core, packet.discord),
                patchLimit: this.config.patchSizeLimitMB
            });
            socket.join("__GLOBAL__");
        } else {
            this.sendToTarget(socket.id, 'versionBad', {
                client: { ml: packet.ml, plugins: packet.plugins, core: packet.core },
                server: new VersionPacket(
                    global.ModLoader.version,
                    this.plugins,
                    this.core,
                    packet.discord
                ),
            });
            setTimeout(function () {
                try {
                    socket.disconnect();
                } catch (err: any) { }
            }, 1000);
        }
    }

    /**
     * Player is requesting to join a lobby.
     * @param socket 
     * @param lj 
     */
    @ServerEventHandler(NetworkEngine2_EventType.protocolServer, 'LobbyRequest')
    onLobbyRequest(socket: SocketIO.Socket, lj: LobbyJoin) {
        if (this.doesLobbyExist(lj.lobbyData.name) && this.getLobbyStorage_internal(lj.lobbyData.name) !== null) {
            // Lobby already exists.
            let storage: ILobbyStorage = this.getLobbyStorage_internal(lj.lobbyData.name) as ILobbyStorage;
            if (storage.config.key === lj.lobbyData.key) {
                socket.join(storage.config.name);
                bus.emit(EventsServer.ON_LOBBY_JOIN, new EventServerJoined(lj.player, lj.lobbyData.name));
                //@ts-ignore
                socket['ModLoader64'] = {
                    lobby: storage.config.name,
                    player: lj.player
                };

                storage.players.push(lj.player);
                if (storage.owner.uuid === "null") {
                    storage.owner = lj.player;
                }

                this.sendToTarget(socket.id, 'LobbyReady', { storage: storage.config, udp: this.udpPort, owner: storage.owner });
                this.sendToTarget(lj.lobbyData.name, 'playerJoined', lj.player);
            } else {
                this.sendToTarget(socket.id, 'LobbyDenied_BadPassword', lj);
            }
        } else {
            // Lobby does not exist.
            this.logger.info('Creating lobby ' + lj.lobbyData.name + '.');
            socket.join(lj.lobbyData.name);
            let storage: ILobbyStorage = this.createLobbyStorage_internal(lj.lobbyData, lj.player);
            bus.emit(EventsServer.ON_LOBBY_CREATE, lj.lobbyData.name);
            bus.emit(EventsServer.ON_LOBBY_DATA, storage.config);
            bus.emit(EventsServer.ON_LOBBY_JOIN, new EventServerJoined(lj.player, lj.lobbyData.name));
            //@ts-ignore
            socket['ModLoader64'] = {
                lobby: storage.config.name,
                player: lj.player,
            };
            this.sendToTarget(socket.id, 'LobbyReady', { storage: storage.config, udp: this.udpPort, owner: storage.owner });
            this.sendToTarget(lj.lobbyData.name, 'playerJoined', lj.player);
            bus.emit(EventsServer.ON_LOBBY_OWNER_CHANGE, new EventOwnerChanged(lj.lobbyData.name, storage.owner));
            this.lobby_names.push(lj.lobbyData.name);
        }
    }

    /**
     * Player replying to a join message.
     * @param socket 
     * @param data 
     */
    @ServerEventHandler(NetworkEngine2_EventType.protocolServer, 'playerJoined_reply')
    onJoinReply(socket: SocketIO.Socket, data: any) {
        this.sendToTarget(data.dest.uuid, 'playerJoined_bounce', data.player);
    }

    /**
     * Main message handler for sockets.
     * @param socket 
     * @param data 
     */
    @ServerEventHandler(NetworkEngine2_EventType.protocolServer, 'msg')
    onSocketMessage(socket: SocketIO.Socket, data: IPacketHeader) {
        Object.freeze(data);
        try {
            NetworkBusServer.emit(data.packet_id, data);
            NetworkChannelBusServer.emit(data.channel, data);
            if (data.forward) {
                socket.to(data.lobby).emit('msg', data);
            }
        } catch (err: any) {
            this.logger.error(err.stack);
            this.logger.error(JSON.stringify(data));
        }
    }

    /**
     * Send message to specific player.
     * @param socket 
     * @param data 
     */
    @ServerEventHandler(NetworkEngine2_EventType.protocolServer, 'toSpecificPlayer')
    toSpecificPlayer(socket: SocketIO.Socket, data: IToPlayer) {
        this.sendToTarget(data.player.uuid, 'msg', data.packet);
    }

    /**
     * Unused handler.
     * @param socket 
     * @param data 
     */
    @ServerEventHandler(NetworkEngine2_EventType.protocolServer, 'onCrash')
    onCrash(socket: SocketIO.Socket, data: IToPlayer) {
    }
}

export class NetworkEngine2_Client {
    private io: any = require('socket.io-client');
    socket: SocketIO.Socket = {} as SocketIO.Socket;
    logger: ILogger;
    config: IClientConfig;
    modLoaderconfig: IModLoaderConfig;
    masterConfig: IConfig;
    me!: INetworkPlayer;
    udpClient = dgram.createSocket('udp4');
    serverUDPPort = -1;
    isUDPEnabled = false;
    udpTestHandle!: any;
    udpPingHandle!: any;
    lastReceivedPing: PingPacket | undefined;
    packetBuffer: IPacketHeader[] = new Array<IPacketHeader>();
    plugins: any = {};
    core: string = "";
    isConnectionReady = false;
    lastPacketBuffer: IPacketHeader[] = new Array<IPacketHeader>();
    pluginConfiguredConnection: boolean = false;
    connectionTimer: any;
    discord!: string;
    lobbyOwner!: INetworkPlayer;
    protocol: NetworkEventBus = new NetworkEventBus();

    constructor(logger: ILogger, config: IConfig, discord: string) {
        this.logger = logger;
        // Configuration.
        this.config = config.registerConfigCategory('NetworkEngine.Client') as IClientConfig;
        config.setData('NetworkEngine.Client', "isSinglePlayer", false);
        config.setData('NetworkEngine.Client', 'forceServerOverride', false);
        config.setData('NetworkEngine.Client', 'ip', '127.0.0.1');
        config.setData('NetworkEngine.Client', 'port', 8082);
        config.setData('NetworkEngine.Client', 'lobby', ML_UUID.getLobbyName());
        config.setData('NetworkEngine.Client', 'nickname', 'Player');
        config.setData('NetworkEngine.Client', 'password', '');
        config.setData('NetworkEngine.Client', 'forceTCPMode', false);
        this.masterConfig = config;
        this.modLoaderconfig = this.masterConfig.registerConfigCategory('ModLoader64') as IModLoaderConfig;
        internal_event_bus.on('PLUGIN_LOADED', (args: any[]) => {
            let p: any = args[0].meta;
            this.plugins[p.name] = { version: p.version, hash: args[0].hash };
            if (typeof args[0].instance.getServerURL === "function" && !this.config.forceServerOverride && !this.pluginConfiguredConnection && !this.config.isSinglePlayer) {
                this.logger.info("Using plugin server configuration: " + p.name + ".");
                let server_connection_setup: IPluginServerConfig = args[0].thisance as IPluginServerConfig;
                this.config.ip = server_connection_setup.getServerURL().split(":")[0];
                this.config.port = parseInt(server_connection_setup.getServerURL().split(":")[1]);
                this.pluginConfiguredConnection = true;
            }
        });
        internal_event_bus.on('CORE_LOADED', (args: any[]) => {
            this.core = args[0].name;
            if (this.config.isSinglePlayer) {
                this.logger.info("Dropping into single player mode due to config.");
                this.config.ip = "127.0.0.1";
                this.config.port = parseInt("8082");
            }
        });

        this.discord = discord;
    }

    onTick() {
        this.lastPacketBuffer.length = 0;
        while (this.packetBuffer.length > 0) {
            try {
                let data: IPacketHeader = this.packetBuffer.shift() as IPacketHeader;
                this.lastPacketBuffer.push(data);
                NetworkBus.emit(data.packet_id, data);
                NetworkChannelBus.emit(data.channel, data);
            } catch (err: any) {
                this.logger.error(err.stack);
            }
        }
    }

    setup() {
        this.connectionTimer = setTimeout(() => {
            this.logger.error("Failed to connect.");
            process.exit(0);
        }, 30 * 1000);
        this.logger.info('Starting up NetworkEngine2_Client...');
        dns.resolve4(`${this.config.ip}`, this.setupPostDNS.bind(this));
    }

    onUDPMessage(msg: Buffer, rinfo: RemoteInfo) {
        let packet: UDPPacket = JSON.parse(msg.toString());
        this.packetBuffer.push(Object.freeze(packet));
    }

    onDisconnect() {
        this.isConnectionReady = false;
    }

    private setupPostDNS(err: NodeJS.ErrnoException | null, addresses: string[] | undefined) {
        if (addresses === undefined) {
            addresses = [this.config.ip];
        }else{
            this.logger.debug(`Resolving ${this.config.ip} to ${addresses}`);
        }
        if (addresses.length === 0) process.exit(ModLoaderErrorCodes.BAD_URL);

        this.config.ip = addresses[0];

        let protocol: Array<string> = ['uuid', 'versionGood', 'versionBad', 'LobbyReady', 'LobbyDenied_BadPassword', 'left', 'newOwner', 'playerJoined', 'playerJoined_bounce', 'msg'];

        this.udpClient.on('message', (msg: Buffer, rinfo: RemoteInfo) => {
            NetworkingEventBusClient.emit('onUDPMessage', msg, rinfo);
        });

        NetworkingEventBusClient.on('onUDPMessage', this.onUDPMessage.bind(this));

        protocol.forEach((str: string) => {
            NetworkEngine2_ClientEventComponents.ClientEmitters.push({
                key: str, fn: (socket: SocketIO.Socket, data: any) => {
                    this.protocol.emit(str, socket, data);
                }
            });
        });

        NetworkEngine2_ClientEventComponents.NetworkBusClient_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkBusServer.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ClientEventComponents.NetworkQueryBusClient_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkQueryBusServer.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ClientEventComponents.NetworkSendBusClient_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkSendBusServer.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ClientEventComponents.protocolClient_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            this.protocol.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ClientEventComponents.NetworkingEventBusClient_Targets.forEach((entry: { key: string, prop: string }) => {
            let fn: () => void = (this as any)[entry.prop];
            NetworkingEventBusClient.on(entry.key, fn.bind(this));
        });
        NetworkEngine2_ClientEventComponents.clientDisconnectHandler = this.onDisconnect.bind(this);

        this.socket = this.io.connect('http://' + this.config.ip + ':' + this.config.port);

        this.socket.on('connect', () => {
            NetworkEngine2_ClientEventComponents.ClientHandlers.forEach((value: { key: string, fn: (evt: any) => void }) => {
                this.socket.on(value.key, value.fn);
            });
            NetworkEngine2_ClientEventComponents.ClientEmitters.forEach((value: { key: string, fn: (socket: SocketIO.Socket, data: any) => void }) => {
                this.socket.on(value.key, (data: any)=>{
                    value.fn(this.socket, data);
                });
            });
            this.socket.on('disconnect', NetworkEngine2_ClientEventComponents.clientDisconnectHandler);
            NetworkingEventBusClient.emit('connect', this.socket);
        });
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkingEventBusClient, 'connect')
    onConnection() {
        this.logger.info('Connected.');
        clearTimeout(this.connectionTimer);
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkSendBus, 'msg')
    onMsgSend(data: IPacketHeader) {
        data.player = this.me;
        data.lobby = this.config.lobby;
        if (data.player === undefined) {
            this.logger.error("Tried to send a packet with no local INetworkPlayer!");
            return;
        }
        if (
            data.socketType === SocketType.UDP &&
            this.isUDPEnabled &&
            this.isConnectionReady
        ) {
            this.udpClient.send(JSON.stringify(data), this.serverUDPPort, this.config.ip);
        } else {
            this.socket.emit('msg', JSON.parse(JSON.stringify(data)));
        }
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkSendBus, 'toPlayer')
    onToPlayer(data: any) {
        data.packet.player = this.me;
        data.packet.lobby = this.config.lobby;
        this.socket.emit('toSpecificPlayer', data);
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkBus, 'UDPTestPacket')
    onUDPTest(data: any) {
        clearInterval(this.udpTestHandle);
        this.logger.info("UDP test passed.");
        let packet = new UDPModeOnPacket(this.config.lobby);
        packet.player = this.me;
        this.udpClient.send(JSON.stringify(packet), this.serverUDPPort, this.config.ip);
        if (this.udpPingHandle === undefined) {
            this.udpPingHandle = setInterval(() => {
                if (this.lastReceivedPing === undefined || this.config.forceTCPMode) {
                    this.isUDPEnabled = false;
                    this.logger.warn('UDP disabled.');
                    NetworkSendBus.emit('msg', new UDPModeOffPacket(this.config.lobby));
                    clearInterval(this.udpPingHandle);
                }
            }, 70 * 1000);
        }
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkBus, 'PingPacket')
    onPing(packet: PingPacket) {
        this.lastReceivedPing = packet;
        if (packet.socketType === SocketType.TCP) {
            NetworkSendBus.emit('msg', new PongPacket(packet.timestamp, this.config.lobby).setType(SocketType.TCP));
        } else {
            NetworkSendBus.emit('msg', new PongPacket(packet.timestamp, this.config.lobby).setType(SocketType.UDP));
        }
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkBus, 'LatencyInfoPacket')
    onLatInfo(packet: LatencyInfoPacket) {
        this.me.data["ninfo"] = { ping: packet.ping, rt: packet.roundtrip };
    }

    @ClientEventHandler(NetworkEngine2_EventType.NetworkQueryBus, 'getOwner')
    onOwnerQuery(evt: { owner: INetworkPlayer }) {
        evt.owner = this.lobbyOwner;
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'uuid')
    onUUID(socket: SocketIO.Socket, data: { uuid: string }) {
        this.me = new NetworkPlayer(this.config.nickname, data.uuid);
        this.socket.emit('version', new VersionPacket(global.ModLoader.version, this.plugins, this.core, this.discord));
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'versionGood')
    onVersionCheckGood(socket: SocketIO.Socket, data: any) {
        this.logger.info('Version good! ' + JSON.stringify(data.server));
        this.logger.info("This server has a " + data.patchLimit.toString() + "MB bps patch limit.");
        let ld = new LobbyData(this.config.lobby, crypto.createHash('md5').update(Buffer.from(this.config.password)).digest('hex'));
        bus.emit(EventsClient.CONFIGURE_LOBBY, ld);
        if (this.modLoaderconfig.patch !== '') {
            let mods: string = "./mods";
            if (global.ModLoader.hasOwnProperty("OVERRIDE_MODS_FOLDER")) {
                mods = global.ModLoader.OVERRIDE_MODS_FOLDER;
            }
            let files: Array<string> = getAllFiles(mods, []);
            let patch_path: string = "";
            for (let i = 0; i < files.length; i++) {
                let p = path.parse(files[i]);
                if (p.base === this.modLoaderconfig.patch) {
                    patch_path = files[i];
                }
            }
            if (patch_path !== "") {
                let gzip = zlib.deflateSync(fs.readFileSync(path.resolve(patch_path)));
                if (gzip.byteLength > (data.patchLimit * 1024 * 1024)) {
                    this.logger.error("Patch file " + patch_path + " too large.");
                    process.exit(ModLoaderErrorCodes.BPS_FAILED);
                } else {
                    ld.data['patch'] = gzip;
                    ld.data['patch_name'] = this.modLoaderconfig.patch;
                }
            }
        }
        //@ts-ignore
        this.socket.emit('LobbyRequest', new LobbyJoin(ld, this.me.toJSON()));
        bus.emit(EventsClient.ON_SERVER_CONNECTION, {});
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'versionBad')
    onVersionCheckBad(socket: SocketIO.Socket, data: any) {
        this.logger.info('Version bad! ' + JSON.stringify(data));
        internal_event_bus.emit('VERSION_BAD', JSON.stringify(data));
        setTimeout(() => {
            process.exit(ModLoaderErrorCodes.BAD_VERSION);
        }, 1000);
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'LobbyReady')
    onLobbyReady(socket: SocketIO.Socket, data: any) {
        let ld: LobbyData = data.storage as LobbyData;
        let udpPort: number = data.udp as number;
        this.logger.info('Joined lobby ' + ld.name + '.');
        this.lobbyOwner = data.owner;
        internal_event_bus.emit("DISCORD_INVITE_SETUP", this.config);
        let p: Buffer = Buffer.alloc(1);
        if (ld.data.hasOwnProperty('patch')) {
            p = zlib.inflateSync(ld.data.patch);
        }
        let udpTest = new UDPTestPacket();
        udpTest.player = this.me;
        udpTest.lobby = this.config.lobby;
        this.isUDPEnabled = true;
        this.udpTestHandle = setTimeout(() => {
            this.isUDPEnabled = false;
            this.logger.warn('UDP disabled.');
        }, 30 * 1000);
        this.udpClient.send(JSON.stringify(udpTest), udpPort, this.config.ip);
        this.serverUDPPort = udpPort;
        internal_event_bus.emit('onNetworkConnect', {
            me: this.me,
            patch: p,
            patch_name: ld.data.patch_name
        });
        bus.emit(EventsClient.ON_LOBBY_JOIN, ld);
        this.isConnectionReady = true;
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'LobbyDenied_BadPassword')
    onBadPW(socket: SocketIO.Socket, data: any) {
        this.logger.error('Failed to join lobby. :(');
        setTimeout(() => {
            process.exit(ModLoaderErrorCodes.BAD_LOBBY_PASSWORD);
        }, 1000);
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'left')
    onPlayerLeft(socket: SocketIO.Socket, player: INetworkPlayer) {
        bus.emit(EventsClient.ON_PLAYER_LEAVE, player);
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'newOwner')
    onNewOwner(socket: SocketIO.Socket, owner: INetworkPlayer) {
        this.lobbyOwner = owner;
        bus.emit(EventsClient.ON_LOBBY_OWNER_CHANGE, new EventOwnerChanged(this.config.lobby, this.lobbyOwner));
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'playerJoined')
    onPlayerJoin(socket: SocketIO.Socket, player: INetworkPlayer) {
        if (player.uuid !== this.me.uuid) {
            bus.emit(EventsClient.ON_PLAYER_JOIN, player);
            this.socket.emit('playerJoined_reply', { player: this.me, dest: player });
        }
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'playerJoined_bounce')
    onBounce(socket: SocketIO.Socket, player: INetworkPlayer) {
        if (player.uuid !== this.me.uuid) {
            bus.emit(EventsClient.ON_PLAYER_JOIN, player);
        }
    }

    @ClientEventHandler(NetworkEngine2_EventType.protocolClient, 'msg')
    onMsgHandle(socket: SocketIO.Socket, data: IPacketHeader) {
        this.packetBuffer.push(Object.freeze(data));
    }

}