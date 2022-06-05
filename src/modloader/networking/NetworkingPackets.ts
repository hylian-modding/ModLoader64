import { SocketType } from 'modloader64_api/NetworkHandler';
import {
    Packet,
    UDPPacket
} from 'modloader64_api/ModLoaderDefaultImpls';

export class PingPacket extends UDPPacket {
    timestamp: number = Date.now();

    constructor(lobby: string) {
        super('PingPacket', 'CORE', lobby, false);
    }

    setType(type: SocketType): PingPacket {
        this.socketType = type;
        return this;
    }
}

export class PongPacket extends UDPPacket {
    serverTime: number;
    timestamp: number = Date.now();

    constructor(serverTime: number, lobby: string) {
        super('PongPacket', 'CORE', lobby, false);
        this.serverTime = serverTime;
    }

    setType(type: SocketType): PingPacket {
        this.socketType = type;
        return this;
    }
}

export class LatencyInfoPacket extends Packet {
    ping: number;
    roundtrip: number;

    constructor(lobby: string, ping: number, roundtrip: number) {
        super('LatencyInfoPacket', 'CORE', lobby, false);
        this.ping = ping;
        this.roundtrip = roundtrip;
    }
}

export class UDPTestPacket extends UDPPacket {
    constructor() {
        super('UDPTestPacket', 'ModLoader64', 'TEST_LOBBY_PLEASE_IGNORE', false);
    }
}

export class VersionPacket {
    ml: string;
    plugins: any;
    core: string;
    discord: string;

    constructor(ml: string, plugins: any, core: string, discord: string) {
        this.ml = ml;
        this.plugins = plugins;
        this.core = core;
        this.discord = discord;
    }
}

export class UDPModeOnPacket extends UDPPacket {
    constructor(lobby: string) {
        super('UDPModeOnPacket', 'CORE', lobby, false);
    }
}

export class UDPModeOffPacket extends Packet {
    constructor(lobby: string) {
        super('UDPModeOffPacket', 'CORE', lobby, false);
    }
}
