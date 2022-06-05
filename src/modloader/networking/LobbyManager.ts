import { IPlugin } from 'modloader64_api/IModLoaderAPI';
import { ILobbyManager } from 'modloader64_api/NetworkHandler';
import { getLobbyStorage_event, createLobbyStorage_event } from './LobbyObjects';
import { NetworkingEventBusServer } from './NetworkingEventBus';

export class LobbyManager implements ILobbyManager {
    getLobbyStorage(lobbyName: string, plugin: IPlugin) {
        let evt: getLobbyStorage_event = new getLobbyStorage_event(
            lobbyName,
            plugin
        );
        NetworkingEventBusServer.emit('getLobbyStorage', evt);
        return evt.obj;
    }

    createLobbyStorage(lobbyName: string, plugin: IPlugin, obj: any): void {
        NetworkingEventBusServer.emit(
            'createLobbyStorage',
            new createLobbyStorage_event(lobbyName, plugin, obj)
        );
    }

    getAllLobbies(): any {
        let evt = { r: {} };
        NetworkingEventBusServer.emit('getAllLobbies', evt);
        return evt.r;
    }
}
