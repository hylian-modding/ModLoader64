import { ILogger, IConfig } from 'modloader64_api/IModLoaderAPI';
import {
  bus,
  EventsServer,
  EventsClient,
  EventServerJoined,
  EventServerLeft,
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
import uuid from 'uuid';
import { internal_event_bus } from './modloader64';
import { PluginMeta } from 'modloader64_api/LobbyVariable';
import zlib from 'zlib';
import dgram, { Socket, RemoteInfo } from 'dgram';
import { AddressInfo } from 'net';
import path from 'path';
let natUpnp = require('nat-upnp');
let natUpnp_client = natUpnp.createClient();
let portfinder = require('portfinder');

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

  isSamePlayer(compare: INetworkPlayer): boolean {
    return compare.nickname === this.nickname && compare.uuid === this.uuid;
  }
}

namespace NetworkEngine {
  export class Server implements ILobbyManager {
    io: any;
    encrypt = require('socket.io-encrypt');
    logger: ILogger;
    masterConfig: IConfig;
    config: IServerConfig;
    version!: Version;
    modLoaderconfig: IModLoaderConfig;
    lobbyVariables: PluginMeta[] = new Array<PluginMeta>();
    currently_processing_lobby = '';
    fakePlayer: FakeNetworkPlayer = new FakeNetworkPlayer();
    udpServer: Socket = dgram.createSocket('udp4');
    udpPort = -1;
    plugins: any = {};

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
      internal_event_bus.on('PLUGIN_LOADED', (args: any[]) => {
        let p: any = args[0];
        this.plugins[p.name] = p.version;
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
      this.io.to(target).emit(internalChannel, packet);
    }

    setup() {
      const server = require('http').createServer();

      this.io = require('socket.io')(server);

      server.listen(this.config.port);
      this.io.use(this.encrypt('MELONSUCKS'));

      internal_event_bus.on('SHUTDOWN_EVERYTHING', () => {
        this.logger.info('SHUTDOWN DETECTED.');
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
        natUpnp_client.portMapping(
          {
            public: inst.config.port,
            private: inst.config.port,
            ttl: 10,
          },
          function(err: any) {
            if (err) {
              inst.logger.error("Didn't open port for TCP server.");
            } else {
              inst.logger.info('Opened port for TCP server.');
            }
          }
        );
        portfinder.getPort((err: any, port: number) => {
          natUpnp_client.portMapping(
            {
              public: port,
              private: port,
              ttl: 10,
            },
            function(err: any) {
              if (err) {
                inst.logger.error("Didn't open port for UDP server.");
              } else {
                inst.logger.info('Opened port for UDP server.');
              }
            }
          );
          inst.udpPort = port;
          inst.udpServer.bind(port);
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
            socket.on('version', function(packet: VersionPacket) {
              let data = packet.ml;
              let parse = data.split('.');
              let v = new Version(parse[0], parse[1], parse[2]);
              let mismatch = false;
              Object.keys(inst.plugins).forEach((name: string) => {
                if (packet.plugins.hasOwnProperty(name)) {
                  if (inst.plugins[name] !== packet.plugins[name]) {
                    mismatch = true;
                  } else {
                    inst.logger.info(
                      'Plugin ' + name + ' version check passed.'
                    );
                  }
                }
              });
              if (inst.version.match(v) && mismatch === false) {
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
                  let d = inst.getLobbyStorage(data.lobby);
                  if (d !== null) {
                    value.setField(d.data[value.objectKey][value.fieldName]);
                  } else {
                    return;
                  }
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
              if (ML === undefined) return;
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
          inst.udpServer.on('message', (msg: string, rinfo: RemoteInfo) => {
            let data: IPacketHeader = JSON.parse(msg);
            if (data.packet_id === 'UDPTestPacket') {
              let reply: IPacketHeader = JSON.parse(JSON.stringify(data));
              reply.player = inst.fakePlayer;
              inst.sendToTarget(data.player.uuid, 'udpTest', reply);
              return;
            }
            inst.currently_processing_lobby = data.lobby;
            inst.lobbyVariables.forEach(
              (value: PluginMeta, index: number, array: PluginMeta[]) => {
                if (inst.getLobbyStorage(data.lobby) === null) {
                  return;
                }
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
              Object.keys(
                inst.io.sockets.adapter.rooms[data.lobby].sockets
              ).forEach((key: string) => {
                if (key !== data.player.uuid) {
                  inst.sendToTarget(key, 'msg', data);
                }
              });
            }
            inst.currently_processing_lobby = '';
          });
          inst.udpServer.on('listening', () => {
            const address = inst.udpServer.address() as AddressInfo;
            inst.logger.info(
              `UDP socket listening ${address.address}:${address.port}`
            );
          });
        });
      })(this);
    }
  }

  class UDPTestPacket extends UDPPacket {
    constructor() {
      super('UDPTestPacket', 'ModLoader64', false);
    }
  }

  class VersionPacket {
    ml: string;
    plugins: any;

    constructor(ml: string, plugins: any) {
      this.ml = ml;
      this.plugins = plugins;
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
    encrypt = require('socket.io-encrypt');
    udpClient = dgram.createSocket('udp4');
    serverUDPPort = -1;
    isUDPEnabled = false;
    udpTestHandle!: any;
    packetBuffer: IPacketHeader[] = new Array<IPacketHeader>();
    plugins: any = {};

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
      internal_event_bus.on('PLUGIN_LOADED', (args: any[]) => {
        let p: any = args[0];
        this.plugins[p.name] = p.version;
      });
    }

    onTick() {
      while (this.packetBuffer.length > 0) {
        let data: IPacketHeader = this.packetBuffer.shift() as IPacketHeader;
        NetworkBus.emit(data.packet_id, data);
        NetworkChannelBus.emit(data.channel, data);
      }
    }

    setup() {
      (function(inst) {
        inst.logger.info('Starting up NetworkEngine.Client...');
        inst.socket = inst.io.connect(
          'http://' + inst.config.ip + ':' + inst.config.port
        );
        inst.encrypt('MELONSUCKS')(inst.socket);
        NetworkSendBus.addListener('msg', (data: IPacketHeader) => {
          data.player = inst.me;
          data.lobby = inst.config.lobby;
          if (data.socketType === SocketType.UDP && inst.isUDPEnabled) {
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
        });
        inst.socket.on('uuid', (data: any) => {
          inst.me = new NetworkPlayer(inst.config.nickname, data.uuid);
          inst.socket.emit(
            'version',
            new VersionPacket(global.ModLoader.version, inst.plugins)
          );
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
            ld.data['patch'] = zlib.gzipSync(
              fs.readFileSync(
                path.resolve(path.join('./mods', inst.modLoaderconfig.patch))
              )
            );
          }
          inst.socket.emit('LobbyRequest', new LobbyJoin(ld, inst.me));
          bus.emit(EventsClient.ON_SERVER_CONNECTION, {});
        });
        inst.socket.on('versionBad', (data: any) => {
          inst.logger.info('Version bad! ' + JSON.stringify(data.server));
        });
        inst.socket.on('LobbyReady', (data: any) => {
          let ld: LobbyData = data.storage as LobbyData;
          let udpPort: number = data.udp as number;
          inst.logger.info('Joined lobby ' + ld.name + '.');
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
          });
          bus.emit(EventsClient.ON_LOBBY_JOIN, ld);
        });
        inst.socket.on('LobbyDenied_BadPassword', (ld: LobbyData) => {
          inst.logger.error('Failed to join lobby. :(');
          process.exit(1);
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
