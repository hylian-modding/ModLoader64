"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NetworkPlayer {
    constructor(nickname, uuid) {
        this.nickname = nickname;
        this.uuid = uuid;
    }
    isSamePlayer(compare) {
        return compare.nickname === this.nickname && compare.uuid === this.uuid;
    }
}
exports.NetworkPlayer = NetworkPlayer;
class Packet {
    constructor(packet_id, channel, lobby, forward = true) {
        this.packet_id = packet_id;
        this.channel = channel;
        this.forward = forward;
        this.socketType = 0 /* TCP */;
        this.lobby = lobby;
    }
}
exports.Packet = Packet;
class UDPPacket extends Packet {
    constructor(packet_id, channel, lobby, forward = true) {
        super(packet_id, channel, lobby, forward);
        this.socketType = 1 /* UDP */;
    }
}
exports.UDPPacket = UDPPacket;
class PacketHelper {
    cloneDestination(_old, _new) {
        _new.lobby = _old.lobby;
        _new.player = _old.player;
    }
}
exports.packetHelper = new PacketHelper();
//# sourceMappingURL=ModLoaderDefaultImpls.js.map