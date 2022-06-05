import { IPlugin } from 'modloader64_api/IModLoaderAPI';
import {
    INetworkPlayer,
    LobbyData,
    ILobbyStorage
} from 'modloader64_api/NetworkHandler';

export class LobbyStorage implements ILobbyStorage {
    config: LobbyData;
    owner: INetworkPlayer;
    players: INetworkPlayer[];
    data: any;

    constructor(config: LobbyData, owner: INetworkPlayer) {
        this.config = config;
        this.owner = owner;
        this.data = {};
        this.players = [];
        this.players.push(owner);
    }
}
export class LobbyJoin {
    lobbyData: LobbyData;
    player: INetworkPlayer;

    constructor(lobbyData: LobbyData, player: INetworkPlayer) {
        this.lobbyData = lobbyData;
        this.player = player;
    }
}

export class createLobbyStorage_event {
    lobbyName: string;
    plugin: IPlugin;
    obj: any;

    constructor(lobbyName: string, plugin: IPlugin, obj: any) {
        this.lobbyName = lobbyName;
        this.plugin = plugin;
        this.obj = obj;
    }
}

export class getLobbyStorage_event {
    lobbyName: string;
    plugin: IPlugin;
    obj: any;

    constructor(lobbyName: string, plugin: IPlugin) {
        this.lobbyName = lobbyName;
        this.plugin = plugin;
    }
}
