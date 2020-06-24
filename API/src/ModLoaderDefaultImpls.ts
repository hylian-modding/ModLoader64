import { INetworkPlayer, IPacketHeader, SocketType } from './NetworkHandler';

export class NetworkPlayer implements INetworkPlayer {
  nickname: string;
  uuid: string;
  data: any = {};

  constructor(nickname: string, uuid: string) {
      this.nickname = nickname;
      this.uuid = uuid;
  }
}

export class Packet implements IPacketHeader {
  packet_id: string;
  lobby: string;
  channel: string;
  player!: INetworkPlayer;
  forward: boolean;
  socketType: SocketType;

  constructor(
      packet_id: string,
      channel: string,
      lobby: string,
      forward = true
  ) {
      this.packet_id = packet_id;
      this.channel = channel;
      this.forward = forward;
      this.socketType = SocketType.TCP;
      this.lobby = lobby;
  }
}

export class UDPPacket extends Packet {
    constructor(
        packet_id: string,
        channel: string,
        lobby: string,
        forward = true
    ) {
        super(packet_id, channel, lobby, forward);
        this.socketType = SocketType.UDP;
    }
}

class PacketHelper {
    cloneDestination(_old: IPacketHeader, _new: IPacketHeader) {
        _new.lobby = _old.lobby;
        _new.player = _old.player;
    }
}

export const packetHelper: PacketHelper = new PacketHelper();
