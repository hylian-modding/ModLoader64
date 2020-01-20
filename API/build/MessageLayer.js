"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const GUITunnel_1 = require("./GUITunnel");
class MessageLayer {
    constructor(id, emitter, retriever) {
        this.backingEmitter = new eventemitter2_1.EventEmitter2();
        this.id = id;
        this.emitter = emitter;
        this.retriever = retriever;
        this.emitKey = 'send';
    }
    bindChild(child) {
        this.child = child;
    }
    send(key, evt) {
        this.emitter[this.emitKey](key, evt);
        if (this.child !== null && this.child !== undefined) {
            if (this.child.send) {
                this.child.send(JSON.stringify(new GUITunnel_1.GUITunnelPacket(this.id, key, evt)));
            }
        }
    }
    setupMessageProcessor(instance) {
        let p = Object.getPrototypeOf(instance);
        if (p.hasOwnProperty('ModLoader')) {
            if (p.ModLoader.hasOwnProperty('TunnelMessageHandler')) {
                if (p.ModLoader.TunnelMessageHandler.hasOwnProperty('MessageHandlers') !==
                    null) {
                    ((inst) => {
                        p.ModLoader.TunnelMessageHandler.MessageHandlers.forEach(function (value, key) {
                            let a = instance[value].bind(instance);
                            inst.backingEmitter.on(key, a);
                            inst.retriever.on(key, (evtKey, evt) => {
                                inst.backingEmitter.emit(key, evt);
                            });
                        });
                    })(this);
                }
            }
        }
    }
}
exports.MessageLayer = MessageLayer;
//# sourceMappingURL=MessageLayer.js.map