import { Packet } from "../ModLoaderDefaultImpls";
import { INetworkPlayer } from "../NetworkHandler";

export class AnalyticsPacket extends Packet {
    to: INetworkPlayer;
    constructor(packet_id: string, to: INetworkPlayer) {
        super(packet_id, "AnalyticsServer", "AnalyticsServer", false);
        this.to = to;
    }
}
