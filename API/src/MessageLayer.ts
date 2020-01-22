import { EventEmitter2 } from 'eventemitter2';
import { GUITunnelPacket } from './GUITunnel';

export class MessageLayer {
  private id: string;
  private emitter: any;
  private retriever: any;
  private emitKey: string;
  private backingEmitter: EventEmitter2 = new EventEmitter2();
  private child!: any;

  constructor(id: string, emitter: any, retriever: any) {
      this.id = id;
      this.emitter = emitter;
      this.retriever = retriever;
      this.emitKey = 'send';
  }

  bindChild(child: any) {
      this.child = child;
  }

  send(key: string, evt: any) {
      this.emitter[this.emitKey](key, evt);
      if (this.child !== null && this.child !== undefined) {
          if (this.child.send) {
              this.child.send(JSON.stringify(new GUITunnelPacket(this.id, key, evt)));
          }
      }
  }

  setupMessageProcessor(instance: any) {
      let p = Object.getPrototypeOf(instance);
      if (p.hasOwnProperty('ModLoader')) {
          if (p.ModLoader.hasOwnProperty('TunnelMessageHandler')) {
              if (
                  p.ModLoader.TunnelMessageHandler.hasOwnProperty('MessageHandlers') !==
          null
              ) {
                  ((inst: MessageLayer) => {
                      p.ModLoader.TunnelMessageHandler.MessageHandlers.forEach(function(
                          value: string,
                          key: string
                      ) {
                          let a = (instance as any)[value].bind(instance);
                          inst.backingEmitter.on(key, a);
                          inst.retriever.on(key, (evtKey: string, evt: any) => {
                              inst.backingEmitter.emit(key, evt);
                          });
                      });
                  })(this);
              }
          }
      }
  }
}
