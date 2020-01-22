/*
    This class is intended to provide a safe way to communicate to/from userland plugins to the Electron sandbox.
*/
import { EventEmitter2 } from 'eventemitter2';
import { IDiscordStatus, DiscordStatusEvent, DiscordEvents } from './Discord';
import { bus } from './EventHandler';

export interface IGUITunnel {
  send(evt_id: string, evt: any): void;
}

export class GUITunnelPacket {
  id: string;
  event: string | string[];
  data: any;

  constructor(id: string, event: string | string[], data: any) {
      this.id = id;
      this.event = event;
      this.data = data;
  }
}

const outputemitterTunnel: EventEmitter2 = new EventEmitter2();
process.on('message', (message: string) => {
    let evt: GUITunnelPacket = JSON.parse(message);
    outputemitterTunnel.emit(evt.event, evt.data);
});

export class GUITunnel implements IGUITunnel {
  private id: string;
  private dest: any;
  private emitter: EventEmitter2 = new EventEmitter2();

  constructor(dest: any, id: string, instance: any) {
      this.id = id;
      this.dest = dest;
      this.emitter.onAny((event: string | string[], ...values: any[]) => {
          if (this.dest.send) {
              this.dest.send(
                  JSON.stringify(new GUITunnelPacket(this.id, event, values))
              );
          }
      });
      if (instance !== null && instance !== undefined) {
          this.setupTunnelMessageHandlers(instance);
      }
  }

  send(evt_id: string, evt: any) {
      this.emitter.emit(evt_id, evt);
  }

  setupTunnelMessageHandlers(instance: any) {
      let p = Object.getPrototypeOf(instance);
      if (p.hasOwnProperty('ModLoader')) {
          if (p.ModLoader.hasOwnProperty('TunnelMessageHandler')) {
              if (
                  p.ModLoader.TunnelMessageHandler.hasOwnProperty('MessageHandlers') !==
          null
              ) {
                  p.ModLoader.TunnelMessageHandler.MessageHandlers.forEach(function(
                      value: string,
                      key: string
                  ) {
                      let a = (instance as any)[value].bind(instance);
                      outputemitterTunnel.on(key, a);
                  });
              }
          }
      }
  }
}

export function TunnelMessageHandler(key: string) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.TunnelMessageHandler === undefined) {
            target.ModLoader['TunnelMessageHandler'] = {};
        }
        if (target.ModLoader.TunnelMessageHandler.MessageHandlers === undefined) {
            target.ModLoader.TunnelMessageHandler['MessageHandlers'] = new Map<
        string,
        Function
      >();
        }
        target.ModLoader.TunnelMessageHandler.MessageHandlers.set(key, propertyKey);
    };
}

const APITunnel: GUITunnel = new GUITunnel(process, 'modloader64_api', null);

export interface IGUIAPI {
  openWindow(width: number, height: number, file: string): void;
  setDiscordStatus(status: IDiscordStatus): void;
  tunnel: IGUITunnel;
}

export class GUIAPI implements IGUIAPI {
  tunnel: IGUITunnel;

  constructor(id: string, instance: any) {
      this.tunnel = new GUITunnel(process, id, instance);
  }

  openWindow(width: number, height: number, file: string): void {
      APITunnel.send('openWindow', { width, height, file });
  }

  setDiscordStatus(status: IDiscordStatus) {
      let evt: DiscordStatusEvent = new DiscordStatusEvent(status);
      bus.emit(DiscordEvents.SET_STATUS, evt);
      if (evt.canceled) {
          return;
      }
      APITunnel.send('setDiscordStatus', evt.status);
  }
}
