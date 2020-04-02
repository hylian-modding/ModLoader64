import { AnalyticsPacket } from './AnalyticsPacket';
import { INetworkPlayer } from '../NetworkHandler';

export class Analytics_RetrievePacket extends AnalyticsPacket {
    key: string;
    constructor(player: INetworkPlayer, key: string) {
        super("Analytics_RetrievePacket", player);
        this.key = key;
    }
}
