import { ILogger, IConfig} from '../API/IModLoaderAPI'
import { bus, EventsServer } from '../API/EventHandler';
import {NetworkBus, IPacketHeader, NetworkChannelBus, NetworkChannelBusServer, NetworkBusServer, NetworkSendBusServer, NetworkSendBus, INetworkPlayer, LobbyData, SerializableMap, ILobbyStorage, ILobbyManager } from '../API/NetworkHandler'
import crypto from 'crypto'
import { NetworkPlayer } from '../API/ModLoaderDefaultImpls';

interface IServerConfig {
    port: number
}

interface IClientConfig {
    ip: string
    port: number
    nickname: string
    lobby: string
    password: string
}

class Version {
    major: number
    minor: number
    build: number

    constructor(major: string, minor: string, build: string) {
        this.major = parseInt(major)
        this.minor = parseInt(minor)
        this.build = parseInt(build)
    }

    match(v: Version) {
        return this.major === v.major && this.minor === this.minor
    }
}

class LobbyStorage implements ILobbyStorage{
    config: LobbyData;    
    owner: string;
    data: any;

    constructor(config: LobbyData, owner: string){
        this.config = config;
        this.owner = owner;
        this.data = {};
    }   
}

class LobbyJoin{
    lobbyData: LobbyData
    player: INetworkPlayer

    constructor(lobbyData: LobbyData, player: INetworkPlayer){
        this.lobbyData = lobbyData
        this.player = player
    }
}

namespace NetworkEngine {

    export class Server implements ILobbyManager{
        private app: any = require('express')();
        private http: any = require('http').createServer(this.app);
        io: any = require('socket.io')(this.http);
        logger: ILogger
        masterConfig: IConfig
        config: IServerConfig
        version!: Version

        constructor(logger: ILogger, config: IConfig) {
            this.logger = logger
            this.masterConfig = config
            this.config = config.registerConfigCategory("NetworkEngine.Server") as IServerConfig
            config.setData("NetworkEngine.Server", "port", 8082)
            let temp = global.ModLoader.version.split(".")
            this.version = new Version(temp[0], temp[1], temp[2])
        }

        getLobbies(){
            return this.io.sockets.adapter.rooms
        }

        doesLobbyExist(Lobby: string){
            return this.getLobbies().hasOwnProperty(Lobby)
        }

        createLobbyStorage(ld: LobbyData, owner: string): ILobbyStorage{
            this.getLobbies()[ld.name]["ModLoader64"] = new LobbyStorage(ld, owner)
            return this.getLobbies()[ld.name]["ModLoader64"]
        }

        getLobbyStorage(name: string): ILobbyStorage{
            try{
                return this.getLobbies()[name].ModLoader64
            }catch(err){
            }
            //@ts-ignore
            return null
        }

        sendToTarget(target: string, internalChannel: string, packet: any){
            this.io.sockets.to(target).emit(internalChannel, packet)
        }

        setup() {
            return (function (inst) {
                NetworkSendBusServer.addListener("msg", (data: IPacketHeader) => {
                    inst.sendToTarget(data.lobby, "msg", data)
                });
                NetworkSendBusServer.addListener("toPlayer", (data: any) => {
                    inst.sendToTarget(data.player.uuid, "msg", data.packet)
                });
                inst.io.on('connection', function (socket: SocketIO.Socket) {
                    inst.sendToTarget(socket.id, "uuid", {uuid: socket.id});
                    socket.on('version', function (data: string) {
                        let parse = data.split(".")
                        let v = new Version(parse[0], parse[1], parse[2])
                        if (inst.version.match(v)) {
                            inst.sendToTarget(socket.id, "versionGood", { client: v, server: inst.version, uuid: socket.id })
                        } else {
                            inst.sendToTarget(socket.id, "versionBad", { client: v, server: inst.version })
                            setTimeout(function(){
                                socket.disconnect()
                            }, 1000);
                        }
                    });
                    socket.on("LobbyRequest", function(lj: LobbyJoin){
                        lj.lobbyData.data = new SerializableMap(lj.lobbyData.data)
                        if (inst.doesLobbyExist(lj.lobbyData.name)){
                            // Lobby already exists.
                            var storage: ILobbyStorage = inst.getLobbyStorage(lj.lobbyData.name)
                            if (storage.config.key === lj.lobbyData.key){
                                socket.join(storage.config.name)
                                bus.emit(EventsServer.ON_LOBBY_JOIN, lj.player)
                                inst.sendToTarget(socket.id, "LobbyReady", storage.config)
                            }else{
                                inst.sendToTarget(socket.id, "LobbyDenied_BadPassword", lj)
                            }
                        }else{
                            // Lobby does not exist.
                            socket.join(lj.lobbyData.name)
                            var storage: ILobbyStorage = inst.createLobbyStorage(lj.lobbyData, socket.id)
                            bus.emit(EventsServer.ON_LOBBY_CREATE, storage)
                            bus.emit(EventsServer.ON_LOBBY_JOIN, lj.player)
                            inst.sendToTarget(socket.id, "LobbyReady", storage.config)
                        }
                    });
                    socket.on('msg', function(data: IPacketHeader){
                        NetworkBusServer.emit(data.packet_id, data);
                        NetworkChannelBusServer.emit(data.channel, data);
                        socket.to(data.lobby).emit("msg", data);
                    });
                    socket.on('toSpecificPlayer', function(data: any){
                        inst.sendToTarget(data.player.uuid, "msg", data.packet)
                    });
                });
                let promise = new Promise(function (resolve, reject) {
                    try {
                        inst.http.listen(inst.config.port, function () {
                            inst.logger.info("NetworkEngine.Server set up on port " + inst.config.port + ".")
                            resolve(true)
                        });
                    } catch (err) {
                        reject(err)
                    }
                });
                return promise
            })(this)
        }
    }

    export class Client {

        private io: any = require('socket.io-client')
        socket: SocketIO.Socket = {} as SocketIO.Socket
        logger: ILogger
        config: IClientConfig
        masterConfig: IConfig
        me!: INetworkPlayer

        constructor(logger: ILogger, config: IConfig) {
            this.logger = logger
            this.config = config.registerConfigCategory("NetworkEngine.Client") as IClientConfig
            config.setData("NetworkEngine.Client", "ip", "127.0.0.1")
            config.setData("NetworkEngine.Client", "port", 8082)
            config.setData("NetworkEngine.Client", "lobby", require('human-readable-ids').hri.random())
            config.setData("NetworkEngine.Client", "nickname", "Player")
            config.setData("NetworkEngine.Client", "password", "")
            this.masterConfig = config
        }

        setup() {
            return (function (inst) {
                let promise = new Promise(function (resolve, reject) {
                    try {
                        let release = function (me: INetworkPlayer) {
                            resolve(me)
                        }
                        inst.logger.info("Starting up NetworkEngine.Client...")
                        inst.socket = inst.io.connect('http://' + inst.config.ip + ":" + inst.config.port);
                        NetworkSendBus.addListener("msg", (data: IPacketHeader) => {
                            inst.socket.emit("msg", data);
                        });
                        NetworkSendBus.addListener("toPlayer", (data: any) => {
                            inst.socket.emit("toSpecificPlayer", data);
                        });
                        inst.socket.on('connect', () => {
                            inst.logger.info("Connected.")
                        });
                        inst.socket.on("uuid", (data: any) => {
                            inst.me = new NetworkPlayer(inst.config.nickname, data.uuid)
                            inst.socket.emit('version', global.ModLoader.version)
                        });
                        inst.socket.on("versionGood", (data: any) => {
                            inst.logger.info("Version good! " + JSON.stringify(data.server))
                            let ld = new LobbyData(inst.config.lobby, crypto.createHash("md5").update(Buffer.from(inst.config.password)).digest("hex"))
                            bus.emit("configureLobby", ld)
                            inst.socket.emit("LobbyRequest", new LobbyJoin(ld, inst.me))
                            bus.emit("onServerConnection", {})
                        });
                        inst.socket.on("versionBad", (data: any) => {
                            inst.logger.info("Version bad! " + JSON.stringify(data.server))
                        });
                        inst.socket.on("LobbyReady", (ld: LobbyData) => {
                            ld.data = new SerializableMap(ld.data)
                            bus.emit("lobbyJoined", ld)
                            inst.logger.info("Joined lobby " + ld.name + ".")
                            release(inst.me)
                        });
                        inst.socket.on("LobbyDenied_BadPassword", (ld: LobbyData) =>{
                            inst.logger.error("Failed to join lobby. :(")
                        });
                        inst.socket.on("msg", (data: IPacketHeader) => {
                            NetworkBus.emit(data.packet_id, data);
                            NetworkChannelBus.emit(data.channel, data);
                        });
                    } catch (err) {
                        reject(err)
                    }
                })
                return promise
            })(this)
        }
    }
}

export default NetworkEngine