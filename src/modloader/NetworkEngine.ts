import {
    ILogger,
    IConfig,
    IPlugin,
    ModLoaderEvents,
    IPluginServerConfig,
    VersionCheckEvent,
} from 'modloader64_api/IModLoaderAPI';
import {
    bus,
    EventsServer,
    EventsClient,
    EventServerJoined,
    EventServerLeft,
    EventBus,
} from 'modloader64_api/EventHandler';
import {
    NetworkBus,
    IPacketHeader,
    NetworkChannelBus,
    NetworkChannelBusServer,
    NetworkBusServer,
    NetworkSendBusServer,
    NetworkSendBus,
    INetworkPlayer,
    LobbyData,
    ILobbyStorage,
    ILobbyManager,
    SocketType,
} from 'modloader64_api/NetworkHandler';
import crypto from 'crypto';
import {
    NetworkPlayer,
    UDPPacket,
} from 'modloader64_api/ModLoaderDefaultImpls';
import IModLoaderConfig from './IModLoaderConfig';
import fs from 'fs';
import { internal_event_bus } from './modloader64';
import zlib from 'zlib';
import dgram, { Socket, RemoteInfo } from 'dgram';
import { AddressInfo } from 'net';
import path from 'path';
import { ModLoaderErrorCodes } from 'modloader64_api/ModLoaderErrorCodes';
import { ML_UUID } from './uuid/mluuid';
import { AnalyticsClient } from '../analytics/AnalyticsClient';
import { Analytics_StorePacket } from 'modloader64_api/analytics/Analytics_StorePacket';
import { getAllFiles } from './getAllFiles';
import { IClientConfig } from './IClientConfig';
import { IServerConfig } from './IServerConfig';

let natUpnp = require('nat-upnp');
let natUpnp_client = natUpnp.createClient();
const NetworkingEventBus: EventBus = new EventBus();

class LobbyStorage implements ILobbyStorage {
    config: LobbyData;
    owner: string;
    data: any;

    constructor(config: LobbyData, owner: string) {
        this.config = config;
        this.owner = owner;
        this.data = {};
    }
}

class LobbyJoin {
    lobbyData: LobbyData;
    player: INetworkPlayer;

    constructor(lobbyData: LobbyData, player: INetworkPlayer) {
        this.lobbyData = lobbyData;
        this.player = player;
    }
}

class FakeNetworkPlayer implements INetworkPlayer {
    nickname: string;
    uuid!: string;
    data: any = {};

    constructor() {
        this.nickname = 'FakeNetworkPlayer';
        this.uuid = ML_UUID.getUUID();
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

export class LobbyManagerAbstract implements ILobbyManager {
    getLobbyStorage(lobbyName: string, plugin: IPlugin) {
        let evt: getLobbyStorage_event = new getLobbyStorage_event(
            lobbyName,
            plugin
        );
        NetworkingEventBus.emit('getLobbyStorage', evt);
        return evt.obj;
    }

    createLobbyStorage(lobbyName: string, plugin: IPlugin, obj: any): void {
        NetworkingEventBus.emit(
            'createLobbyStorage',
            new createLobbyStorage_event(lobbyName, plugin, obj)
        );
    }
}

namespace NetworkEngine {
    export class Server implements ILobbyManager {
        io: any;
        logger: ILogger;
        masterConfig: IConfig;
        config: IServerConfig;
        modLoaderconfig: IModLoaderConfig;
        fakePlayer: FakeNetworkPlayer = new FakeNetworkPlayer();
        udpServer: Socket = dgram.createSocket('udp4');
        udpPort = -1;
        plugins: any = {};
        core: string = "";
        analytics!: AnalyticsClient;
        lobby_names: Array<string> = [];
        lobbyStorage: any = {};

        constructor(logger: ILogger, config: IConfig) {
            this.logger = logger;
            this.masterConfig = config;
            this.config = config.registerConfigCategory(
                'NetworkEngine.Server'
            ) as IServerConfig;
            config.setData('NetworkEngine.Server', 'port', 8082);
            config.setData('NetworkEngine.Server', 'udpPort', 8082);
            config.setData('NetworkEngine.Server', 'patchSizeLimitMB', 10);
            this.modLoaderconfig = this.masterConfig.registerConfigCategory('ModLoader64') as IModLoaderConfig;
            internal_event_bus.on('PLUGIN_LOADED', (args: any[]) => {
                let p: any = args[0].meta;
                this.plugins[p.name] = { version: p.version, hash: args[0].hash };
            });
            internal_event_bus.on('CORE_LOADED', (args: any[]) => {
                this.core = args[0].name;
                if ((config.registerConfigCategory("NetworkEngine.Client") as IClientConfig).isSinglePlayer) {
                    this.config.port = parseInt("8082");
                    (config.registerConfigCategory('ModLoader64') as IModLoaderConfig).isServer = true;
                }
            });

            NetworkingEventBus.on('getLobbyStorage', (evt: getLobbyStorage_event) => {
                evt.obj = this.getLobbyStorage(evt.lobbyName, evt.plugin);
            });

            NetworkingEventBus.on(
                'createLobbyStorage',
                (evt: getLobbyStorage_event) => {
                    this.createLobbyStorage(evt.lobbyName, evt.plugin, evt.obj);
                }
            );
        }

        getLobbies() {
            return this.io.sockets.adapter.rooms;
        }

        doesLobbyExist(Lobby: string) {
            return this.getLobbies().hasOwnProperty(Lobby);
        }

        createLobbyStorage_internal(ld: LobbyData, owner: string): ILobbyStorage {
            if (this.getLobbyStorage_internal(ld.name) !== null) {
                delete this.lobbyStorage[ld.name];
            }
            this.lobbyStorage[ld.name] = {};
            this.lobbyStorage[ld.name]['ModLoader64'] = new LobbyStorage(ld, owner);
            return this.lobbyStorage[ld.name]['ModLoader64'];
        }

        getLobbyStorage_internal(lobbyName: string): ILobbyStorage | null {
            try {
                return this.lobbyStorage[lobbyName].ModLoader64;
            } catch (err) { }
            return null;
        }

        createLobbyStorage(lobbyName: string, plugin: IPlugin, obj: any): void {
            let mainStore: LobbyStorage = this.lobbyStorage[lobbyName]['ModLoader64'];
            if (!mainStore.hasOwnProperty('data')) {
                mainStore['data'] = {};
            }
            mainStore.data[plugin.pluginName as string] = obj;
        }

        getLobbyStorage(lobbyName: string, plugin: IPlugin): Object | null {
            try {
                return this.lobbyStorage[lobbyName].ModLoader64.data[
                    plugin.pluginName as string
                ];
            } catch (err) { }
            return null;
        }

        sendToTarget(target: string, internalChannel: string, packet: any) {
            this.io.to(target).emit(internalChannel, packet);
        }

        setup() {
            const server = require('http').createServer();

            this.io = require('socket.io')(server);

            server.listen(this.config.port);

            internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
                this.logger.info('SHUTDOWN DETECTED.');
            });

            this.logger.info(
                'NetworkEngine.Server set up on port ' + this.config.port + '.'
            );

            this.analytics = new AnalyticsClient((packet: Analytics_StorePacket) => {
                NetworkBusServer.emit(packet.packet_id, packet);
                NetworkChannelBusServer.emit(packet.channel, packet);
            });

            if (!this.modLoaderconfig.isClient) {
                internal_event_bus.emit('onNetworkConnect', {
                    me: this.fakePlayer,
                    patch: Buffer.alloc(1),
                });
            }

            setInterval(() => {
                let rm: Array<string> = [];
                let lobbies: any = {};
                for (let i = 0; i < this.lobby_names.length; i++) {
                    if (this.getLobbyStorage_internal(this.lobby_names[i]) !== null) {
                        if (this.getLobbies()[this.lobby_names[i]] !== undefined) {
                            lobbies[this.lobby_names[i]] = Object.keys(this.getLobbies()[this.lobby_names[i]]['sockets']).length;
                        } else {
                            rm.push(this.lobby_names[i]);
                        }
                    } else {
                        rm.push(this.lobby_names[i]);
                    }
                }
                if (rm.length > 0) {
                    for (let i = 0; i < rm.length; i++) {
                        let index = this.lobby_names.indexOf(rm[i]);
                        let name = this.lobby_names.splice(index, 1)[0].trim();
                        this.logger.info("lobby " + name + " terminated.");
                        delete this.lobbyStorage[name];
                    }
                }
                fs.writeFile("./lobbies.json", JSON.stringify(lobbies), () => { });
            }, 60 * 1000);

            (function (inst) {
                natUpnp_client.portMapping(
                    {
                        public: inst.config.port,
                        private: inst.config.port,
                        ttl: 10,
                    },
                    function (err: any) {
                        if (err) {
                            inst.logger.error("Didn't open port for TCP server.");
                        } else {
                            inst.logger.info('Opened port for TCP server.');
                        }
                    }
                );
                natUpnp_client.portMapping(
                    {
                        public: inst.config.udpPort,
                        private: inst.config.udpPort,
                        ttl: 10,
                    },
                    function (err: any) {
                        if (err) {
                            inst.logger.error("Didn't open port for UDP server.");
                        } else {
                            inst.logger.info('Opened port for UDP server.');
                        }
                    }
                );
                inst.udpPort = inst.config.udpPort;
                inst.udpServer.bind(inst.config.udpPort);
                NetworkSendBusServer.addListener('msg', (data: IPacketHeader) => {
                    if (data.player === undefined) {
                        data.player = inst.fakePlayer;
                    }
                    inst.sendToTarget(data.lobby, 'msg', data);
                });
                NetworkSendBusServer.addListener('toPlayer', (data: any) => {
                    inst.sendToTarget(data.player.uuid, 'msg', data.packet);
                });
                inst.io.on('connection', function (socket: SocketIO.Socket) {
                    inst.logger.info('Client ' + socket.id + ' connected.');
                    inst.sendToTarget(socket.id, 'uuid', { uuid: socket.id });
                    socket.on('version', function (packet: VersionPacket) {
                        let mismatch = false;
                        try {
                            Object.keys(inst.plugins).forEach((name: string) => {
                                if (packet.plugins.hasOwnProperty(name)) {
                                    if (inst.plugins[name].version !== packet.plugins[name].version) {
                                        mismatch = true;
                                    } else {
                                        inst.logger.info('Plugin ' + name + ' version check passed.');
                                        if (inst.plugins[name].hash === packet.plugins[name].hash) {
                                            inst.logger.info('Plugin ' + name + ' hash check passed.');
                                        } else {
                                            mismatch = true;
                                        }
                                    }
                                }
                            });
                        } catch (err) {
                            inst.sendToTarget(socket.id, 'versionBad', {
                                client: { ml: packet.ml, plugins: packet.plugins, core: packet.core },
                                server: new VersionPacket(
                                    global.ModLoader.version,
                                    inst.plugins,
                                    inst.core,
                                    packet.discord
                                ),
                            });
                        }
                        if (inst.core !== packet.core) {
                            mismatch = true;
                        }
                        let evt = new VersionCheckEvent(packet.ml, packet.plugins);
                        evt.canceled = mismatch;
                        bus.emit(EventsServer.ON_VERSION_CHECK, evt);
                        mismatch = evt.canceled;
                        if (global.ModLoader.version === packet.ml && mismatch === false) {
                            inst.sendToTarget(socket.id, 'versionGood', {
                                client: packet.ml,
                                server: new VersionPacket(global.ModLoader.version, inst.plugins, inst.core, packet.discord),
                                patchLimit: inst.config.patchSizeLimitMB
                            });
                            socket.join("__GLOBAL__");
                        } else {
                            inst.sendToTarget(socket.id, 'versionBad', {
                                client: { ml: packet.ml, plugins: packet.plugins, core: packet.core },
                                server: new VersionPacket(
                                    global.ModLoader.version,
                                    inst.plugins,
                                    inst.core,
                                    packet.discord
                                ),
                            });
                            setTimeout(function () {
                                try {
                                    socket.disconnect();
                                } catch (err) { }
                            }, 1000);
                        }
                    });
                    socket.on('LobbyRequest', function (lj: LobbyJoin) {
                        if (inst.doesLobbyExist(lj.lobbyData.name)) {
                            // Lobby already exists.
                            let storage: ILobbyStorage = inst.getLobbyStorage_internal(
                                lj.lobbyData.name
                            ) as ILobbyStorage;
                            if (storage.config.key === lj.lobbyData.key) {
                                socket.join(storage.config.name);
                                bus.emit(
                                    EventsServer.ON_LOBBY_JOIN,
                                    new EventServerJoined(lj.player, lj.lobbyData.name)
                                );
                                //@ts-ignore
                                socket['ModLoader64'] = {
                                    lobby: storage.config.name,
                                    player: lj.player,
                                };
                                inst.sendToTarget(socket.id, 'LobbyReady', {
                                    storage: storage.config,
                                    udp: inst.udpPort,
                                });
                                inst.sendToTarget(lj.lobbyData.name, 'playerJoined', lj.player);
                            } else {
                                inst.sendToTarget(socket.id, 'LobbyDenied_BadPassword', lj);
                            }
                        } else {
                            // Lobby does not exist.
                            inst.logger.info('Creating lobby ' + lj.lobbyData.name + '.');
                            socket.join(lj.lobbyData.name);
                            let storage: ILobbyStorage = inst.createLobbyStorage_internal(
                                lj.lobbyData,
                                socket.id
                            );
                            bus.emit(EventsServer.ON_LOBBY_CREATE, lj.lobbyData.name);
                            bus.emit(
                                EventsServer.ON_LOBBY_JOIN,
                                new EventServerJoined(lj.player, lj.lobbyData.name)
                            );
                            //@ts-ignore
                            socket['ModLoader64'] = {
                                lobby: storage.config.name,
                                player: lj.player,
                            };
                            inst.sendToTarget(socket.id, 'LobbyReady', {
                                storage: storage.config,
                                udp: inst.udpPort,
                            });
                            inst.sendToTarget(lj.lobbyData.name, 'playerJoined', lj.player);
                            inst.lobby_names.push(lj.lobbyData.name);
                        }
                    });
                    socket.on('playerJoined_reply', function (data: any) {
                        inst.sendToTarget(
                            data.dest.uuid,
                            'playerJoined_bounce',
                            data.player
                        );
                    });
                    socket.on('msg', function (data: IPacketHeader) {
                        try {
                            NetworkBusServer.emit(data.packet_id, data);
                            NetworkChannelBusServer.emit(data.channel, data);
                            if (data.forward) {
                                socket.to(data.lobby).emit('msg', data);
                            }
                        } catch (err) {
                            inst.logger.error(err);
                        }
                    });
                    socket.on('toSpecificPlayer', function (data: any) {
                        inst.sendToTarget(data.player.uuid, 'msg', data.packet);
                    });
                    socket.on('onCrash', function (data: any) {
                        console.log("Receiving crash dump...");
                        if (!fs.existsSync("./crashlogs")) {
                            fs.mkdirSync("./crashlogs");
                        }
                        let f = "./crashlogs/" + Date.now().toString(16) + ".bin";
                        fs.writeFileSync(f, JSON.parse(data.dump).dump);
                        bus.emit(ModLoaderEvents.ON_RECEIVED_CRASH_LOG, { name: path.parse(f).name, dump: zlib.inflateSync(fs.readFileSync(f)) });
                    });
                    socket.on('disconnect', () => {
                        //@ts-ignore
                        let ML = socket.ModLoader64;
                        if (ML === undefined) return;
                        if (inst.getLobbyStorage_internal(ML.lobby) === null) return;
                        bus.emit(
                            EventsServer.ON_LOBBY_LEAVE,
                            new EventServerLeft(ML.player, ML.lobby)
                        );
                        inst.sendToTarget(ML.lobby, 'left', ML.player as INetworkPlayer);
                    });
                });
                inst.udpServer.on('error', (err: any) => {
                    inst.logger.error(`server error:\n${err.stack}`);
                    inst.udpServer.close();
                });
                inst.udpServer.on('message', (buf: Buffer, rinfo: RemoteInfo) => {
                    try {
                        let msg: string = buf.toString();
                        if (msg.charAt(0) !== '{') {
                            return;
                        }
                        let data: IPacketHeader = JSON.parse(msg);
                        if (data.packet_id === 'UDPTestPacket') {
                            let reply: IPacketHeader = JSON.parse(JSON.stringify(data));
                            reply.player = inst.fakePlayer;
                            inst.sendToTarget(data.player.uuid, 'udpTest', reply);
                            return;
                        }
                        if (inst.getLobbyStorage_internal(data.lobby) === null) {
                            return;
                        }
                        NetworkBusServer.emit(data.packet_id, data);
                        NetworkChannelBusServer.emit(data.channel, data);
                        if (data.forward) {
                            Object.keys(
                                inst.io.sockets.adapter.rooms[data.lobby].sockets
                            ).forEach((key: string) => {
                                if (key !== data.player.uuid) {
                                    inst.sendToTarget(key, 'msg', data);
                                }
                            });
                        }
                    } catch (err) {
                        inst.logger.error(err);
                    }
                });
                inst.udpServer.on('listening', () => {
                    const address = inst.udpServer.address() as AddressInfo;
                    inst.logger.info(
                        `UDP socket listening ${address.address}:${address.port}`
                    );
                });
            })(this);
        }
    }

    class UDPTestPacket extends UDPPacket {
        constructor() {
            super('UDPTestPacket', 'ModLoader64', 'TEST_LOBBY_PLEASE_IGNORE', false);
        }
    }

    class VersionPacket {
        ml: string;
        plugins: any;
        core: string;
        discord: string;

        constructor(ml: string, plugins: any, core: string, discord: string) {
            this.ml = ml;
            this.plugins = plugins;
            this.core = core;
            this.discord = discord;
        }
    }

    export class Client {
        private io: any = require('socket.io-client');
        socket: SocketIO.Socket = {} as SocketIO.Socket;
        logger: ILogger;
        config: IClientConfig;
        modLoaderconfig: IModLoaderConfig;
        masterConfig: IConfig;
        me!: INetworkPlayer;
        udpClient = dgram.createSocket('udp4');
        serverUDPPort = -1;
        isUDPEnabled = false;
        udpTestHandle!: any;
        packetBuffer: IPacketHeader[] = new Array<IPacketHeader>();
        plugins: any = {};
        core: string = "";
        isConnectionReady = false;
        lastPacketBuffer: IPacketHeader[] = new Array<IPacketHeader>();
        pluginConfiguredConnection: boolean = false;
        connectionTimer: any;
        discord: string;

        constructor(logger: ILogger, config: IConfig, discord: string) {
            this.discord = discord;
            this.logger = logger;
            this.config = config.registerConfigCategory(
                'NetworkEngine.Client'
            ) as IClientConfig;
            config.setData('NetworkEngine.Client', "isSinglePlayer", false);
            config.setData('NetworkEngine.Client', 'forceServerOverride', false);
            config.setData('NetworkEngine.Client', 'ip', '127.0.0.1');
            config.setData('NetworkEngine.Client', 'port', 8082);
            config.setData('NetworkEngine.Client', 'lobby', ML_UUID.getLobbyName());
            config.setData('NetworkEngine.Client', 'nickname', 'Player');
            config.setData('NetworkEngine.Client', 'password', '');
            this.masterConfig = config;
            if (this.config.nickname.indexOf("\n")) {
                this.config.nickname = this.config.nickname.replace("\n", "");
                if (this.config.nickname.length > 20) {
                    this.config.nickname = this.config.nickname.substr(0, 20);
                }
            }
            this.modLoaderconfig = this.masterConfig.registerConfigCategory(
                'ModLoader64'
            ) as IModLoaderConfig;
            internal_event_bus.on('PLUGIN_LOADED', (args: any[]) => {
                let p: any = args[0].meta;
                this.plugins[p.name] = { version: p.version, hash: args[0].hash };
                if (typeof args[0].instance.getServerURL === "function" && !this.config.forceServerOverride && !this.pluginConfiguredConnection && !this.config.isSinglePlayer) {
                    this.logger.info("Using plugin server configuration: " + p.name + ".");
                    let server_connection_setup: IPluginServerConfig = args[0].instance as IPluginServerConfig;
                    this.config.ip = server_connection_setup.getServerURL().split(":")[0];
                    this.config.port = parseInt(server_connection_setup.getServerURL().split(":")[1]);
                    this.pluginConfiguredConnection = true;
                }
            });
            internal_event_bus.on('CORE_LOADED', (args: any[]) => {
                this.core = args[0].name;
                if (this.config.isSinglePlayer) {
                    this.logger.info("Dropping into single player mode due to config.");
                    this.config.ip = "127.0.0.1";
                    this.config.port = parseInt("8082");
                }
            });
            internal_event_bus.on(ModLoaderEvents.ON_CRASH, (args: any[]) => {
                /* this.logger.info("Sending crashlog...");
                this.socket.emit('onCrash', {
                    dump: JSON.stringify({dump: args[0]})
                }); */
            });
        }

        onTick() {
            this.lastPacketBuffer.length = 0;
            while (this.packetBuffer.length > 0) {
                try {
                    let data: IPacketHeader = this.packetBuffer.shift() as IPacketHeader;
                    this.lastPacketBuffer.push(data);
                    NetworkBus.emit(data.packet_id, data);
                    NetworkChannelBus.emit(data.channel, data);
                } catch (err) {
                    this.logger.error(err);
                }
            }
        }

        setup() {
            (function (inst) {
                inst.connectionTimer = setTimeout(() => {
                    inst.logger.error("Failed to connect.");
                    process.exit(0);
                }, 30 * 1000);
                inst.logger.info('Starting up NetworkEngine.Client...');
                inst.socket = inst.io.connect(
                    'http://' + inst.config.ip + ':' + inst.config.port
                );
                NetworkSendBus.addListener('msg', (data: IPacketHeader) => {
                    data.player = inst.me;
                    data.lobby = inst.config.lobby;
                    if (data.player === undefined) {
                        inst.logger.error("Tried to send a packet with no local INetworkPlayer!");
                        return;
                    }
                    if (
                        data.socketType === SocketType.UDP &&
                        inst.isUDPEnabled &&
                        inst.isConnectionReady
                    ) {
                        inst.udpClient.send(
                            JSON.stringify(data),
                            inst.serverUDPPort,
                            inst.config.ip
                        );
                    } else {
                        inst.socket.emit('msg', data);
                    }
                });
                NetworkSendBus.addListener('toPlayer', (data: any) => {
                    data.packet.player = inst.me;
                    data.packet.lobby = inst.config.lobby;
                    inst.socket.emit('toSpecificPlayer', data);
                });
                inst.socket.on('connect', () => {
                    inst.logger.info('Connected.');
                    clearTimeout(inst.connectionTimer);
                });
                inst.socket.on('uuid', (data: any) => {
                    inst.me = new NetworkPlayer(inst.config.nickname, data.uuid);
                    inst.socket.emit(
                        'version',
                        new VersionPacket(global.ModLoader.version, inst.plugins, inst.core, inst.discord)
                    );
                });
                inst.socket.on('versionGood', (data: any) => {
                    if (data.server.discord !== "") {
                        inst.me.data["discord"] = data.server.discord;
                        inst.logger.info("Local INetworkPlayer linked with Discord user " + inst.me.data["discord"]);
                    }
                    inst.logger.info('Version good! ' + JSON.stringify(data.server));
                    inst.logger.info("This server has a " + data.patchLimit.toString() + "MB bps patch limit.");
                    let ld = new LobbyData(
                        inst.config.lobby,
                        crypto
                            .createHash('md5')
                            .update(Buffer.from(inst.config.password))
                            .digest('hex')
                    );
                    bus.emit(EventsClient.CONFIGURE_LOBBY, ld);
                    if (inst.modLoaderconfig.patch !== '') {
                        let mods: string = "./mods";
                        if (global.ModLoader.hasOwnProperty("OVERRIDE_MODS_FOLDER")) {
                            mods = global.ModLoader.OVERRIDE_MODS_FOLDER;
                        }
                        let files: Array<string> = getAllFiles(mods, []);
                        let patch_path: string = "";
                        for (let i = 0; i < files.length; i++) {
                            let p = path.parse(files[i]);
                            if (p.base === inst.modLoaderconfig.patch) {
                                patch_path = files[i];
                            }
                        }
                        if (patch_path !== "") {
                            let gzip = zlib.gzipSync(fs.readFileSync(path.resolve(patch_path)));
                            if (gzip.byteLength > (data.patchLimit * 1024 * 1024)) {
                                inst.logger.error("Patch file " + patch_path + " too large.");
                                process.exit(ModLoaderErrorCodes.BPS_FAILED);
                            } else {
                                ld.data['patch'] = gzip;
                                ld.data['patch_name'] = inst.modLoaderconfig.patch;
                            }
                        }
                    }
                    inst.socket.emit('LobbyRequest', new LobbyJoin(ld, inst.me));
                    bus.emit(EventsClient.ON_SERVER_CONNECTION, {});
                });
                inst.socket.on('versionBad', (data: any) => {
                    inst.logger.info('Version bad! ' + JSON.stringify(data));
                    internal_event_bus.emit('VERSION_BAD', JSON.stringify(data));
                    setTimeout(() => {
                        process.exit(ModLoaderErrorCodes.BAD_VERSION);
                    }, 1000);
                });
                inst.socket.on('LobbyReady', (data: any) => {
                    let ld: LobbyData = data.storage as LobbyData;
                    let udpPort: number = data.udp as number;
                    inst.logger.info('Joined lobby ' + ld.name + '.');
                    internal_event_bus.emit("DISCORD_INVITE_SETUP", inst.config);
                    let p: Buffer = Buffer.alloc(1);
                    if (ld.data.hasOwnProperty('patch')) {
                        p = zlib.gunzipSync(ld.data.patch);
                    }
                    let udpTest = new UDPTestPacket();
                    udpTest.player = inst.me;
                    udpTest.lobby = inst.config.lobby;
                    inst.udpTestHandle = setTimeout(() => {
                        inst.isUDPEnabled = false;
                        inst.logger.error('UDP disabled.');
                    }, 30 * 1000);
                    inst.udpClient.send(JSON.stringify(udpTest), udpPort, inst.config.ip);
                    inst.serverUDPPort = udpPort;
                    internal_event_bus.emit('onNetworkConnect', {
                        me: inst.me,
                        patch: p,
                        patch_name: ld.data.patch_name
                    });
                    bus.emit(EventsClient.ON_LOBBY_JOIN, ld);
                    inst.isConnectionReady = true;
                });
                inst.socket.on('disconnect', () => {
                    inst.isConnectionReady = false;
                });
                inst.socket.on('LobbyDenied_BadPassword', (ld: LobbyData) => {
                    inst.logger.error('Failed to join lobby. :(');
                    setTimeout(() => {
                        process.exit(ModLoaderErrorCodes.BAD_LOBBY_PASSWORD);
                    }, 1000);
                });
                inst.socket.on('left', (player: INetworkPlayer) => {
                    bus.emit(EventsClient.ON_PLAYER_LEAVE, player);
                });
                inst.socket.on('playerJoined', (player: INetworkPlayer) => {
                    if (player.uuid !== inst.me.uuid) {
                        bus.emit(EventsClient.ON_PLAYER_JOIN, player);
                        inst.socket.emit('playerJoined_reply', {
                            player: inst.me,
                            dest: player,
                        });
                    }
                });
                inst.socket.on('playerJoined_bounce', (player: INetworkPlayer) => {
                    if (player.uuid !== inst.me.uuid) {
                        bus.emit(EventsClient.ON_PLAYER_JOIN, player);
                    }
                });
                inst.socket.on('msg', (data: IPacketHeader) => {
                    inst.packetBuffer.push(data);
                });
                inst.socket.on('udpTest', (data: IPacketHeader) => {
                    inst.isUDPEnabled = true;
                    clearTimeout(inst.udpTestHandle);
                    inst.logger.info('UDP test passed.');
                });
            })(this);
        }
    }
}

export default NetworkEngine;
