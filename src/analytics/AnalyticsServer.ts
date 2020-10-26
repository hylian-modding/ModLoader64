import fs from 'fs';
import { AnalyticsConfig } from './AnalyticsConfig';
import { Analytics_StorePacket } from 'modloader64_api/analytics/Analytics_StorePacket';
import { AnalyticsPacket } from 'modloader64_api/analytics/AnalyticsPacket';
import { Analytics_ConnectionPacket } from 'modloader64_api/analytics/Analytics_ConnectionPacket';
import { Analytics_StoreConfirmPacket } from 'modloader64_api/analytics/Analytics_StoreConfirmPacket';
import { Analytics_RetrievePacket } from 'modloader64_api/analytics/Analytics_RetrievePacket';
import { AnalyticsDB } from './AnalyticsDB';
import { FakeAnaPlayer } from './FakeAnaPlayer';
import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { NetworkPlayer } from 'modloader64_api/ModLoaderDefaultImpls';
import { ILogger } from 'modloader64_api/IModLoaderAPI';

export class AnalyticsServer {

    private io: any;
    private config!: AnalyticsConfig;
    private fakePlayer!: INetworkPlayer;
    private db!: AnalyticsDB;
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    setup() {
        if (!fs.existsSync("./analytics-config.json")) {
            fs.writeFileSync("./analytics-config.json", JSON.stringify({ port: "7999", enabled: true } as AnalyticsConfig, null, 2));
        }
        this.db = new AnalyticsDB("./ModLoader64_AnalyticsDB.json");
        this.config = JSON.parse(fs.readFileSync("./analytics-config.json").toString());
        this.fakePlayer = new FakeAnaPlayer();
        const server = require('http').createServer();
        this.io = require('socket.io')(server);
        server.listen(this.config.port);
        this.io.on('connection', (socket: SocketIO.Socket) => {
            this.send(new Analytics_ConnectionPacket(new NetworkPlayer("AnalyticsClient", socket.id)));
            socket.on('Analytics_StorePacket', (packet: Analytics_StorePacket) => {
                this.send(new Analytics_StoreConfirmPacket(packet.to, packet.key, this.db.store(packet.key, packet.data)));
            });
            socket.on('Analytics_RetrievePacket', (packet: Analytics_RetrievePacket) => {
                this.send(new Analytics_StorePacket(packet.to, packet.key, this.db.retrieve(packet.key)));
            });
        });
        this.logger.info("Analytics server started.");
    }

    send(packet: AnalyticsPacket) {
        this.io.to(packet.to.uuid).emit(packet.packet_id, packet);
    }
}
