import { INetworkPlayer, IPacketHeader } from './NetworkHandler';

export class NetworkPlayer implements INetworkPlayer {
  nickname: string;
  uuid: string;

  constructor(nickname: string, uuid: string) {
    this.nickname = nickname;
    this.uuid = uuid;
  }

  isSamePlayer(player: INetworkPlayer) {
    return player.nickname === this.nickname && player.uuid === this.uuid;
  }
}

export class Packet implements IPacketHeader {
  packet_id: string;
  lobby!: string;
  channel: string;
  player!: INetworkPlayer;
  forward: boolean;

  constructor(packet_id: string, channel: string, forward = true) {
    this.packet_id = packet_id;
    this.channel = channel;
    this.forward = forward;
  }
}

class PacketHelper {
  cloneDestination(_old: IPacketHeader, _new: IPacketHeader) {
    _new.lobby = _old.lobby;
    _new.player = _old.player;
  }
}

export const packetHelper: PacketHelper = new PacketHelper();
