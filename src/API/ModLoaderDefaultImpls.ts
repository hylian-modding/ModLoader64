import { INetworkPlayer, IPacketHeader } from "./NetworkHandler";

export class NetworkPlayer implements INetworkPlayer{

    nickname: string;    
    uuid: string;

    constructor(nickname: string, uuid: string){
        this.nickname = nickname
        this.uuid = uuid
    }
    
}

export class Packet implements IPacketHeader{

    packet_id: string;    
    lobby: string;
    channel: string;
    player: INetworkPlayer;

    constructor(packet_id: string, lobby: string, channel: string, player: INetworkPlayer){
        this.packet_id = packet_id
        this.lobby = lobby
        this.channel = channel
        this.player = player
    }
}