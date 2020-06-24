import { EventEmitter } from 'events';
import { IPlugin } from './IModLoaderAPI';

export class NetworkEventBus extends EventEmitter {}

// Client
export const NetworkBus: NetworkEventBus = new NetworkEventBus();
export const NetworkChannelBus: NetworkEventBus = new NetworkEventBus();
export const NetworkSendBus: NetworkEventBus = new NetworkEventBus();
// Server
export const NetworkBusServer: NetworkEventBus = new NetworkEventBus();
export const NetworkChannelBusServer: NetworkEventBus = new NetworkEventBus();
export const NetworkSendBusServer: NetworkEventBus = new NetworkEventBus();

export function NetworkHandler(key: string) {
    return function(
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.NetworkHandler === undefined) {
            target.ModLoader['NetworkHandler'] = {};
        }
        if (target.ModLoader.NetworkHandler.PacketHandlers === undefined) {
            target.ModLoader.NetworkHandler['PacketHandlers'] = new Map<
        string,
        string
      >();
        }
        target.ModLoader.NetworkHandler.PacketHandlers.set(key, propertyKey);
    };
}

export function NetworkChannelHandler(key: string) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.NetworkHandler === undefined) {
            target.ModLoader['NetworkHandler'] = {};
        }
        if (target.ModLoader.NetworkHandler.ChannelHandlers === undefined) {
            target.ModLoader.NetworkHandler['ChannelHandlers'] = new Map<
        string,
        string
      >();
        }
        target.ModLoader.NetworkHandler.ChannelHandlers.set(key, propertyKey);
    };
}

export function ServerNetworkHandler(key: string) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler === undefined) {
            target.ModLoader['ServerNetworkHandler'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler.PacketHandlers === undefined) {
            target.ModLoader.ServerNetworkHandler['PacketHandlers'] = new Map<
        string,
        string
      >();
        }
        target.ModLoader.ServerNetworkHandler.PacketHandlers.set(key, propertyKey);
    };
}

export function ServerNetworkChannelHandler(key: string) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler === undefined) {
            target.ModLoader['ServerNetworkHandler'] = {};
        }
        if (target.ModLoader.ServerNetworkHandler.ChannelHandlers === undefined) {
            target.ModLoader.ServerNetworkHandler['ChannelHandlers'] = new Map<
        string,
        string
      >();
        }
        target.ModLoader.ServerNetworkHandler.ChannelHandlers.set(key, propertyKey);
    };
}

export interface INetwork {
  sendPacket(packet: IPacketHeader): void;
  sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer): void;
}

export class Server implements INetwork {
    sendPacket(packet: IPacketHeader) {
        NetworkSendBusServer.emit('msg', packet);
    }

    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer) {
        NetworkSendBusServer.emit('toPlayer', { packet, player: dest });
    }
}

export class Client implements INetwork {
    sendPacket(packet: IPacketHeader) {
        NetworkSendBus.emit('msg', packet);
    }

    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer) {
        NetworkSendBus.emit('toPlayer', { packet, player: dest });
    }
}

export const ServerController: INetwork = new Server();
export const ClientController: INetwork = new Client();

export interface INetworkPlayer {
  nickname: string;
  uuid: string;
  data: any;
}

export const enum SocketType {
  TCP,
  UDP,
}

export interface IPacketHeader {
  packet_id: string;
  lobby: string;
  channel: string;
  player: INetworkPlayer;
  forward: boolean;
  socketType: SocketType;
}

export class LobbyData {
  name: string;
  key: string;
  data: any;

  constructor(name: string, key: string) {
      this.name = name;
      this.key = key;
      this.data = {};
  }
}

export interface ILobbyStorage {
  config: LobbyData;
  owner: string;
  data: any;
}

export interface ILobbyManager {
  getLobbyStorage(lobbyName: string, plugin: IPlugin): any;
  createLobbyStorage(lobbyName: string, plugin: IPlugin, obj: any): void;
}

export function setupNetworkHandlers(instance: any) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")){
            return;
        }
        if (p.ModLoader.hasOwnProperty('NetworkHandler')) {
            // Setup packet decorator handlers
            if (
                p.ModLoader.NetworkHandler.hasOwnProperty('PacketHandlers') !== null
            ) {
                p.ModLoader.NetworkHandler.PacketHandlers.forEach(function(
                    value: string,
                    key: string
                ) {
                    let a = (instance as any)[value].bind(instance);
                    NetworkBus.addListener(key, a);
                });
            }
            if (p.ModLoader.NetworkHandler.hasOwnProperty('ChannelHandlers')) {
                // Setup channel decorator handlers
                p.ModLoader.NetworkHandler.ChannelHandlers.forEach(function(
                    value: string,
                    key: string
                ) {
                    let a = (instance as any)[value].bind(instance);
                    NetworkChannelBus.addListener(key, a);
                });
            }
        }
        if (p.ModLoader.hasOwnProperty('ServerNetworkHandler')) {
            // Setup server-side packet decorator handlers
            if (
                p.ModLoader.ServerNetworkHandler.hasOwnProperty('PacketHandlers') !==
        null
            ) {
                p.ModLoader.ServerNetworkHandler.PacketHandlers.forEach(function(
                    value: string,
                    key: string
                ) {
                    let a = (instance as any)[value].bind(instance);
                    NetworkBusServer.addListener(key, a);
                });
            }
            if (p.ModLoader.ServerNetworkHandler.hasOwnProperty('ChannelHandlers')) {
                // Setup server-side channel decorator handlers
                p.ModLoader.ServerNetworkHandler.ChannelHandlers.forEach(function(
                    value: string,
                    key: string
                ) {
                    let a = (instance as any)[value].bind(instance);
                    NetworkChannelBusServer.addListener(key, a);
                });
            }
        }
    }
}
