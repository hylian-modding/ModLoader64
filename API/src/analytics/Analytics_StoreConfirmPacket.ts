import { AnalyticsPacket } from './AnalyticsPacket';
import { INetworkPlayer } from '../NetworkHandler';

export class Analytics_StoreConfirmPacket extends AnalyticsPacket {
    key: string;
    done: boolean;
    constructor(player: INetworkPlayer, key: string, done: boolean) {
        super("Analytics_StoreConfirmPacket", player);
        this.key = key;
        this.done = done;
    }
}
