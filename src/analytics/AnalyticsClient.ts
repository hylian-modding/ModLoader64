import fs from 'fs';
import { AnalyticsConfig } from "./AnalyticsConfig";
import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { Analytics_StorePacket } from 'modloader64_api/analytics/Analytics_StorePacket';
import { AnalyticsPacket } from 'modloader64_api/analytics/AnalyticsPacket';
import { Analytics_ConnectionPacket } from 'modloader64_api/analytics/Analytics_ConnectionPacket';
import { Analytics_StoreConfirmPacket } from 'modloader64_api/analytics/Analytics_StoreConfirmPacket';
import { AnalyticsManager } from 'modloader64_api/analytics/Analytics';
import { Analytics_Event } from 'modloader64_api/analytics/Analytics_Event';
import { Analytics_RetrievePacket } from 'modloader64_api/analytics/Analytics_RetrievePacket';

export class AnalyticsClient {
    
    private io: any = require('socket.io-client');
    private socket: SocketIO.Socket = {} as SocketIO.Socket;
    private config: AnalyticsConfig;
    private me!: INetworkPlayer;
    private packetCallback: (packet: Analytics_StorePacket) => void;

    constructor(packetCallback: ((packet: Analytics_StorePacket) => void)) {
        if (!fs.existsSync("./analytics-config.json")) {
            fs.writeFileSync("./analytics-config.json", JSON.stringify({ port: "7999", enabled: true} as AnalyticsConfig, null, 2));
        }
        this.packetCallback = packetCallback;
        AnalyticsManager.AnalyticsBus.on('send', (evt: Analytics_Event)=>{
            this.send(new Analytics_StorePacket(this.me, evt.key, evt.data));
        });
        AnalyticsManager.AnalyticsBus.on('retrieve', (evt: Analytics_Event)=>{
            this.send(new Analytics_RetrievePacket(this.me, evt.key));
        });
        this.config = JSON.parse(fs.readFileSync("./analytics-config.json").toString());
        if (!this.config.enabled){
            return;
        }
        this.socket = this.io.connect('http://' + "127.0.0.1" + ':' + this.config.port);
        this.socket.on('Analytics_ConnectionPacket', (packet: Analytics_ConnectionPacket) => {
            this.me = packet.to;
            this.send(new Analytics_StorePacket(this.me, "test", { fake: true }));
        });
        this.socket.on('Analytics_StoreConfirmPacket', (packet: Analytics_StoreConfirmPacket) => {
        });
        this.socket.on("Analytics_StorePacket", (packet: Analytics_StorePacket) => {
            this.packetCallback(packet);
        });
    }
    send(packet: AnalyticsPacket) {
        this.socket.emit(packet.packet_id, packet);
    }
}
