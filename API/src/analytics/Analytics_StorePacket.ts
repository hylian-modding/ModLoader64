import { AnalyticsPacket } from './AnalyticsPacket';
import { INetworkPlayer } from '../NetworkHandler';

export class Analytics_StorePacket extends AnalyticsPacket {
    key: string;
    data: any;
    constructor(player: INetworkPlayer, key: string, data: any) {
        super("Analytics_StorePacket", player);
        this.key = key;
        this.data = data;
    }
}
