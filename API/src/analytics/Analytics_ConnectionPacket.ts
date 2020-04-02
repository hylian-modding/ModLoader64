import { INetworkPlayer } from "../NetworkHandler";
import { AnalyticsPacket } from "./AnalyticsPacket";

export class Analytics_ConnectionPacket extends AnalyticsPacket {
    constructor(player: INetworkPlayer) {
        super("Analytics_ConnectionPacket", player);
    }
}
