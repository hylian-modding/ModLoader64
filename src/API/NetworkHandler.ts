import { EventEmitter } from "events";

export class NetworkEventBus extends EventEmitter {
}

// Client
export const NetworkBus: NetworkEventBus = new NetworkEventBus()
export const NetworkChannelBus: NetworkEventBus = new NetworkEventBus()
export const NetworkSendBus: NetworkEventBus = new NetworkEventBus()
// Server
export const NetworkBusServer: NetworkEventBus = new NetworkEventBus()
export const NetworkChannelBusServer: NetworkEventBus = new NetworkEventBus()
export const NetworkSendBusServer: NetworkEventBus = new NetworkEventBus()

export function NetworkHandler(key: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.ModLoader === undefined) {
            target["ModLoader"] = {}
        }
        if (target.ModLoader.NetworkHandler === undefined) {
            target.ModLoader["NetworkHandler"] = {}
        }
        if (target.ModLoader.NetworkHandler.PacketHandlers === undefined) {
            target.ModLoader.NetworkHandler["PacketHandlers"] = new Map<string, Function>()
        }
        target.ModLoader.NetworkHandler.PacketHandlers.set(key, propertyKey)
    };
}

export function NetworkChannelHandler(key: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.ModLoader === undefined) {
            target["ModLoader"] = {}
        }
        if (target.ModLoader.NetworkHandler === undefined) {
            target.ModLoader["NetworkHandler"] = {}
        }
        if (target.ModLoader.NetworkHandler.ChannelHandlers === undefined) {
            target.ModLoader.NetworkHandler["ChannelHandlers"] = new Map<string, Function>()
        }
        target.ModLoader.NetworkHandler.ChannelHandlers.set(key, propertyKey)
    };
}

export function ServerNetworkHandler(key: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.ModLoader === undefined) {
            target["ModLoader"] = {}
        }
        if (target.ModLoader.ServerNetworkHandler === undefined) {
            target.ModLoader["ServerNetworkHandler"] = {}
        }
        if (target.ModLoader.ServerNetworkHandler.PacketHandlers === undefined) {
            target.ModLoader.ServerNetworkHandler["PacketHandlers"] = new Map<string, Function>()
        }
        target.ModLoader.ServerNetworkHandler.PacketHandlers.set(key, propertyKey)
    };
}

export function ServerNetworkChannelHandler(key: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.ModLoader === undefined) {
            target["ModLoader"] = {}
        }
        if (target.ModLoader.ServerNetworkHandler === undefined) {
            target.ModLoader["ServerNetworkHandler"] = {}
        }
        if (target.ModLoader.ServerNetworkHandler.ChannelHandlers === undefined) {
            target.ModLoader.ServerNetworkHandler["ChannelHandlers"] = new Map<string, Function>()
        }
        target.ModLoader.ServerNetworkHandler.ChannelHandlers.set(key, propertyKey)
    };
}

export interface INetwork {
    sendPacket(packet: IPacketHeader): void
    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer): void
}

export class Server implements INetwork {
    sendPacket(packet: IPacketHeader) {
        NetworkSendBusServer.emit("msg", packet)
    }

    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer) {
        NetworkSendBusServer.emit("toPlayer", { packet: packet, player: dest })
    }
}

export class Client implements INetwork {

    sendPacket(packet: IPacketHeader) {
        NetworkSendBus.emit("msg", packet)
    }

    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer) {
        NetworkSendBus.emit("toPlayer", { packet: packet, player: dest })
    }

}

export const ServerController: INetwork = new Server()
export const ClientController: INetwork = new Client()

export interface INetworkPlayer {
    nickname: string
    uuid: string
}

export interface IPacketHeader {
    packet_id: string
    lobby: string
    channel: string
    player: INetworkPlayer
}

export class SerializableMap{

    data: any

    constructor(d: any = {}){
        this.data = d
    }

    get(key: string){
        return this.data[key]
    }

    set(key: string, value: string){
        this.data[key] = value
    }

}

export class LobbyData{
    name: string
    key: string
    data: SerializableMap

    constructor(name: string, key: string){
        this.name = name
        this.key = key
        this.data = new SerializableMap()
    }
}

export interface ILobbyStorage{
    config: LobbyData
    owner: string
    data: any
}

export interface ILobbyManager{
    getLobbyStorage(lobbyName: string): ILobbyStorage
}