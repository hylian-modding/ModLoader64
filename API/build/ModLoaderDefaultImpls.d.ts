import { INetworkPlayer, IPacketHeader, SocketType } from './NetworkHandler';
export declare class NetworkPlayer implements INetworkPlayer {
    nickname: string;
    uuid: string;
    constructor(nickname: string, uuid: string);
    isSamePlayer(compare: INetworkPlayer): boolean;
}
export declare class Packet implements IPacketHeader {
    packet_id: string;
    lobby: string;
    channel: string;
    player: INetworkPlayer;
    forward: boolean;
    socketType: SocketType;
    constructor(packet_id: string, channel: string, lobby: string, forward?: boolean);
}
export declare class UDPPacket extends Packet {
    constructor(packet_id: string, channel: string, lobby: string, forward?: boolean);
}
declare class PacketHelper {
    cloneDestination(_old: IPacketHeader, _new: IPacketHeader): void;
}
export declare const packetHelper: PacketHelper;
export {};
