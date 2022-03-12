import { RemoteInfo } from 'dgram';
import { INetworkPlayer, IPacketHeader, SocketType } from './NetworkHandler';

export class NetworkPlayer implements INetworkPlayer {
    readonly uuid: string;
    __nickname: () => string = () => { return "" };
    data: any = {};

    constructor(nickname: string, uuid: string) {
        this.nickname = nickname;
        this.uuid = uuid;
    }

    get nickname(): string {
        return this.__nickname();
    }

    set nickname(s: string) {
        let temp = s;
        if (temp.length > 20) temp = temp.substring(0, 20);
        if (temp.indexOf("\n") > -1) temp = temp.replace("\n", "");
        var nick = temp;
        this.__nickname = Object.freeze(() => {
            return nick;
        });
    }

    toJSON() {
        return { uuid: this.uuid, nickname: this.nickname, data: this.data };
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

    rinfo: RemoteInfo | undefined;

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
