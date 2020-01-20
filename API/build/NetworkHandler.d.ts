/// <reference types="node" />
import { EventEmitter } from 'events';
import { IPlugin } from './IModLoaderAPI';
export declare class NetworkEventBus extends EventEmitter {
}
export declare const NetworkBus: NetworkEventBus;
export declare const NetworkChannelBus: NetworkEventBus;
export declare const NetworkSendBus: NetworkEventBus;
export declare const NetworkBusServer: NetworkEventBus;
export declare const NetworkChannelBusServer: NetworkEventBus;
export declare const NetworkSendBusServer: NetworkEventBus;
export declare function NetworkHandler(key: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function NetworkChannelHandler(key: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function ServerNetworkHandler(key: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function ServerNetworkChannelHandler(key: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export interface INetwork {
    sendPacket(packet: IPacketHeader): void;
    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer): void;
}
export declare class Server implements INetwork {
    sendPacket(packet: IPacketHeader): void;
    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer): void;
}
export declare class Client implements INetwork {
    sendPacket(packet: IPacketHeader): void;
    sendPacketToSpecificPlayer(packet: IPacketHeader, dest: INetworkPlayer): void;
}
export declare const ServerController: INetwork;
export declare const ClientController: INetwork;
export interface INetworkPlayer {
    nickname: string;
    uuid: string;
    isSamePlayer(compare: INetworkPlayer): boolean;
}
export declare const enum SocketType {
    TCP = 0,
    UDP = 1
}
export interface IPacketHeader {
    packet_id: string;
    lobby: string;
    channel: string;
    player: INetworkPlayer;
    forward: boolean;
    socketType: SocketType;
}
export declare class LobbyData {
    name: string;
    key: string;
    data: any;
    constructor(name: string, key: string);
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
export declare function setupNetworkHandlers(instance: any): void;
