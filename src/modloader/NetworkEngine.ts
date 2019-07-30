import { ILogger, IConfig } from 'modloader64_api/IModLoaderAPI';
import { bus, EventsServer, EventsClient } from 'modloader64_api/EventHandler';
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
} from 'modloader64_api/NetworkHandler';
import crypto from 'crypto';
import { NetworkPlayer } from 'modloader64_api/ModLoaderDefaultImpls';
import IModLoaderConfig from './IModLoaderConfig';
import fs from 'fs';
import uuid from 'uuid';
import { internal_event_bus } from './modloader64';
import { PluginMeta } from 'modloader64_api/LobbyVariable';
import express from 'express';
import http from 'http';
import {
  EndpointBus,
  EndPointEvents,
  Endpoint,
} from 'modloader64_api/EndpointHandler';

interface IServerConfig {
  port: number;
}

interface IClientConfig {
  ip: string;
  port: number;
  nickname: string;
  lobby: string;
  password: string;
}

class Version {
  major: number;
  minor: number;
  build: number;

  constructor(major: string, minor: string, build: string) {
    this.major = parseInt(major);
    this.minor = parseInt(minor);
    this.build = parseInt(build);
  }

  match(v: Version) {
    return this.major === v.major && this.minor === this.minor;
  }
}

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
  uuid: string;

  constructor() {
    this.nickname = 'FakeNetworkPlayer';
    this.uuid = uuid.v4();
  }
}

namespace NetworkEngine {
  export class Server implements ILobbyManager {
    private app: any = express();
    private http: any;
    io: any;
    wireUpServer = require('socket.io-fix-close');
    encrypt = require('socket.io-encrypt');
    logger: ILogger;
    masterConfig: IConfig;
    config: IServerConfig;
    version!: Version;
    modLoaderconfig: IModLoaderConfig;
    lobbyVariables: PluginMeta[] = new Array<PluginMeta>();
    currently_processing_lobby = '';
    fakePlayer: FakeNetworkPlayer = new FakeNetworkPlayer();

    constructor(logger: ILogger, config: IConfig) {
      this.logger = logger;
      this.masterConfig = config;
      this.config = config.registerConfigCategory(
        'NetworkEngine.Server'
      ) as IServerConfig;
      config.setData('NetworkEngine.Server', 'port', 8082);
      let temp = global.ModLoader.version.split('.');
      this.version = new Version(temp[0], temp[1], temp[2]);
      this.modLoaderconfig = this.masterConfig.registerConfigCategory(
        'ModLoader64'
      ) as IModLoaderConfig;
      bus.on('setupLobbyVariable', evt => {
        this.lobbyVariables.push(evt);
      });
    }

    getLobbies() {
      return this.io.sockets.adapter.rooms;
    }

    doesLobbyExist(Lobby: string) {
      return this.getLobbies().hasOwnProperty(Lobby);
    }

    createLobbyStorage(ld: LobbyData, owner: string): ILobbyStorage {
      this.getLobbies()[ld.name]['ModLoader64'] = new LobbyStorage(ld, owner);
      return this.getLobbies()[ld.name]['ModLoader64'];
    }

    getLobbyStorage(name: string): ILobbyStorage {
      try {
        return this.getLobbies()[name].ModLoader64;
      } catch (err) {}
      //@ts-ignore
      return null;
    }

    sendToTarget(target: string, internalChannel: string, packet: any) {
      this.io.sockets.to(target).emit(internalChannel, packet);
    }

    setup() {
      this.http = this.app.listen(this.config.port, () => {
        this.io = require('socket.io')(this.http);
        this.io.use(this.encrypt(global.ModLoader.version));
        this.wireUpServer(this.http, this.io);
        internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
          this.logger.info('SHUTDOWN DETECTED.');
          this.http.close();
        });
        this.logger.info(
          'NetworkEngine.Server set up on port ' + this.config.port + '.'
        );
        if (!this.modLoaderconfig.isClient) {
          internal_event_bus.emit('onNetworkConnect', {
            me: this.fakePlayer,
            patch: Buffer.alloc(1),
          });
        }
        (function(inst) {
          NetworkSendBusServer.addListener('msg', (data: IPacketHeader) => {
            if (data.lobby === undefined) {
              data.lobby = inst.currently_processing_lobby;
            }
            if (data.player === undefined) {
              data.player = inst.fakePlayer;
            }
            inst.sendToTarget(data.lobby, 'msg', data);
          });
          NetworkSendBusServer.addListener('toPlayer', (data: any) => {
            inst.sendToTarget(data.player.uuid, 'msg', data.packet);
          });
          inst.io.on('connection', function(socket: SocketIO.Socket) {
            inst.logger.info('Client ' + socket.id + ' connected.');
            inst.sendToTarget(socket.id, 'uuid', { uuid: socket.id });
            socket.on('version', function(data: string) {
              let parse = data.split('.');
              let v = new Version(parse[0], parse[1], parse[2]);
              if (inst.version.match(v)) {
                inst.sendToTarget(socket.id, 'versionGood', {
                  client: v,
                  server: inst.version,
                  uuid: socket.id,
                });
              } else {
                inst.sendToTarget(socket.id, 'versionBad', {
                  client: v,
                  server: inst.version,
                });
                setTimeout(function() {
                  socket.disconnect();
                }, 1000);
              }
            });
            socket.on('LobbyRequest', function(lj: LobbyJoin) {
              if (inst.doesLobbyExist(lj.lobbyData.name)) {
                // Lobby already exists.
                let storage: ILobbyStorage = inst.getLobbyStorage(
                  lj.lobbyData.name
                );
                if (storage.config.key === lj.lobbyData.key) {
                  socket.join(storage.config.name);
                  bus.emit(EventsServer.ON_LOBBY_JOIN, lj.player);
                  //@ts-ignore
                  socket['ModLoader64'] = {
                    lobby: storage.config.name,
                    player: lj.player,
                  };
                  inst.sendToTarget(socket.id, 'LobbyReady', storage.config);
                  inst.sendToTarget(
                    lj.lobbyData.name,
                    'playerJoined',
                    lj.player
                  );
                } else {
                  inst.sendToTarget(socket.id, 'LobbyDenied_BadPassword', lj);
                }
              } else {
                // Lobby does not exist.
                inst.logger.info('Creating lobby ' + lj.lobbyData.name + '.');
                socket.join(lj.lobbyData.name);
                let storage: ILobbyStorage = inst.createLobbyStorage(
                  lj.lobbyData,
                  socket.id
                );
                inst.lobbyVariables.forEach(
                  (value: PluginMeta, index: number, array: PluginMeta[]) => {
                    storage.data[value.objectKey] = {};
                    storage.data[value.objectKey][
                      value.fieldName
                    ] = value.cloneTemplate();
                  }
                );
                bus.emit(EventsServer.ON_LOBBY_CREATE, storage);
                bus.emit(EventsServer.ON_LOBBY_JOIN, lj.player);
                //@ts-ignore
                socket['ModLoader64'] = {
                  lobby: storage.config.name,
                  player: lj.player,
                };
                inst.sendToTarget(socket.id, 'LobbyReady', storage.config);
                inst.sendToTarget(lj.lobbyData.name, 'playerJoined', lj.player);
              }
            });
            socket.on('playerJoined_reply', function(data: any) {
              inst.sendToTarget(
                data.dest.uuid,
                'playerJoined_bounce',
                data.player
              );
            });
            socket.on('msg', function(data: IPacketHeader) {
              inst.currently_processing_lobby = data.lobby;
              inst.lobbyVariables.forEach(
                (value: PluginMeta, index: number, array: PluginMeta[]) => {
                  value.setField(
                    inst.getLobbyStorage(data.lobby).data[value.objectKey][
                      value.fieldName
                    ]
                  );
                }
              );
              NetworkBusServer.emit(data.packet_id, data);
              NetworkChannelBusServer.emit(data.channel, data);
              if (data.forward) {
                socket.to(data.lobby).emit('msg', data);
              }
              inst.currently_processing_lobby = '';
            });
            socket.on('toSpecificPlayer', function(data: any) {
              inst.sendToTarget(data.player.uuid, 'msg', data.packet);
            });
            socket.on('disconnect', () => {
              //@ts-ignore
              let ML = socket.ModLoader64;
              bus.emit(
                EventsServer.ON_LOBBY_LEAVE,
                ML.player as INetworkPlayer
              );
              inst.sendToTarget(ML.lobby, 'left', ML.player as INetworkPlayer);
            });
          });
        })(this);
      });
    }
  }

  export class EndpointServer {
    EndPointApp = express();
    EndPointServer = http.createServer(this.EndPointApp);
    portfinder = require('portfinder');
    logger: ILogger;

    constructor(logger: ILogger) {
      this.logger = logger;
      this.EndPointApp.get('/', function(req, res) {
        res.send('hello world');
      });
      this.portfinder.getPort((err: any, port: number) => {
        this.EndPointServer.listen(port, () => {
          this.logger.info('Local JSON endpoint hosted on port ' + port + '.');
        });
      });
      internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
        this.EndPointServer.close(() => {});
      });
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
    endpoint: EndpointServer;
    encrypt = require('socket.io-encrypt');

    constructor(logger: ILogger, config: IConfig) {
      this.logger = logger;
      this.config = config.registerConfigCategory(
        'NetworkEngine.Client'
      ) as IClientConfig;
      config.setData('NetworkEngine.Client', 'ip', '127.0.0.1');
      config.setData('NetworkEngine.Client', 'port', 8082);
      config.setData(
        'NetworkEngine.Client',
        'lobby',
        require('human-readable-ids').hri.random()
      );
      config.setData('NetworkEngine.Client', 'nickname', 'Player');
      config.setData('NetworkEngine.Client', 'password', '');
      this.masterConfig = config;
      this.modLoaderconfig = this.masterConfig.registerConfigCategory(
        'ModLoader64'
      ) as IModLoaderConfig;
      this.endpoint = new EndpointServer(this.logger);
      EndpointBus.on(EndPointEvents.CREATE_ENDPOINT, (endpoint: Endpoint) => {
        this.endpoint.EndPointApp.get(endpoint.path, function(res, req) {
          endpoint.callback(res, req);
        });
      });
    }

    setup() {
      (function(inst) {
        inst.logger.info('Starting up NetworkEngine.Client...');
        inst.socket = inst.io.connect(
          'http://' + inst.config.ip + ':' + inst.config.port
        );
        inst.encrypt(global.ModLoader.version)(inst.socket);
        NetworkSendBus.addListener('msg', (data: IPacketHeader) => {
          data.player = inst.me;
          data.lobby = inst.config.lobby;
          inst.socket.emit('msg', data);
        });
        NetworkSendBus.addListener('toPlayer', (data: any) => {
          inst.socket.emit('toSpecificPlayer', data);
        });
        inst.socket.on('connect', () => {
          inst.logger.info('Connected.');
        });
        inst.socket.on('uuid', (data: any) => {
          inst.me = new NetworkPlayer(inst.config.nickname, data.uuid);
          inst.socket.emit('version', global.ModLoader.version);
        });
        inst.socket.on('versionGood', (data: any) => {
          inst.logger.info('Version good! ' + JSON.stringify(data.server));
          let ld = new LobbyData(
            inst.config.lobby,
            crypto
              .createHash('md5')
              .update(Buffer.from(inst.config.password))
              .digest('hex')
          );
          bus.emit(EventsClient.CONFIGURE_LOBBY, ld);
          if (inst.modLoaderconfig.patch !== '') {
            ld.data['patch'] = fs
              .readFileSync(inst.modLoaderconfig.patch)
              .toString('base64');
          }
          inst.socket.emit('LobbyRequest', new LobbyJoin(ld, inst.me));
          bus.emit(EventsClient.ON_SERVER_CONNECTION, {});
        });
        inst.socket.on('versionBad', (data: any) => {
          inst.logger.info('Version bad! ' + JSON.stringify(data.server));
        });
        inst.socket.on('LobbyReady', (ld: LobbyData) => {
          inst.logger.info('Joined lobby ' + ld.name + '.');
          let p: Buffer = Buffer.alloc(1);
          if (ld.data.hasOwnProperty('patch')) {
            p = Buffer.from(ld.data.patch, 'base64');
          }
          internal_event_bus.emit('onNetworkConnect', {
            me: inst.me,
            patch: p,
          });
          bus.emit(EventsClient.ON_LOBBY_JOIN, ld);
        });
        inst.socket.on('LobbyDenied_BadPassword', (ld: LobbyData) => {
          inst.logger.error('Failed to join lobby. :(');
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
          NetworkBus.emit(data.packet_id, data);
          NetworkChannelBus.emit(data.channel, data);
        });
      })(this);
    }
  }
}

export default NetworkEngine;
