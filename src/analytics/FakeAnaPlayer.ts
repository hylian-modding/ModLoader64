import { INetworkPlayer } from "modloader64_api/NetworkHandler";

export class FakeAnaPlayer implements INetworkPlayer {
    nickname: string = "AnalyticsServer";
    uuid: string = "AnalyticsServer";
    isSamePlayer(compare: INetworkPlayer): boolean {
        return this.uuid === compare.uuid && this.nickname === compare.nickname;
    }
}
