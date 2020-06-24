import { INetworkPlayer } from "modloader64_api/NetworkHandler";

export class FakeAnaPlayer implements INetworkPlayer {
    nickname: string = "AnalyticsServer";
    uuid: string = "AnalyticsServer";
    data: any = {};
}
