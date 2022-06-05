import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { ML_UUID } from '../uuid/mluuid';

export class FakeNetworkPlayer implements INetworkPlayer {
    nickname: string;
    uuid!: string;
    data: any = {};

    constructor() {
        this.nickname = 'FakeNetworkPlayer';
        this.uuid = ML_UUID.getUUID();
    }
}
