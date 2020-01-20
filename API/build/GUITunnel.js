"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    This class is intended to provide a safe way to communicate to/from userland plugins to the Electron sandbox.
*/
const eventemitter2_1 = require("eventemitter2");
const Discord_1 = require("./Discord");
const EventHandler_1 = require("./EventHandler");
class GUITunnelPacket {
    constructor(id, event, data) {
        this.id = id;
        this.event = event;
        this.data = data;
    }
}
exports.GUITunnelPacket = GUITunnelPacket;
const outputemitterTunnel = new eventemitter2_1.EventEmitter2();
process.on('message', (message) => {
    let evt = JSON.parse(message);
    outputemitterTunnel.emit(evt.event, evt.data);
});
class GUITunnel {
    constructor(dest, id, instance) {
        this.emitter = new eventemitter2_1.EventEmitter2();
        this.id = id;
        this.dest = dest;
        this.emitter.onAny((event, ...values) => {
            if (this.dest.send) {
                this.dest.send(JSON.stringify(new GUITunnelPacket(this.id, event, values)));
            }
        });
        if (instance !== null && instance !== undefined) {
            this.setupTunnelMessageHandlers(instance);
        }
    }
    send(evt_id, evt) {
        this.emitter.emit(evt_id, evt);
    }
    setupTunnelMessageHandlers(instance) {
        let p = Object.getPrototypeOf(instance);
        if (p.hasOwnProperty('ModLoader')) {
            if (p.ModLoader.hasOwnProperty('TunnelMessageHandler')) {
                if (p.ModLoader.TunnelMessageHandler.hasOwnProperty('MessageHandlers') !==
                    null) {
                    p.ModLoader.TunnelMessageHandler.MessageHandlers.forEach(function (value, key) {
                        let a = instance[value].bind(instance);
                        outputemitterTunnel.on(key, a);
                    });
                }
            }
        }
    }
}
exports.GUITunnel = GUITunnel;
function TunnelMessageHandler(key) {
    return function (target, propertyKey, descriptor) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.TunnelMessageHandler === undefined) {
            target.ModLoader['TunnelMessageHandler'] = {};
        }
        if (target.ModLoader.TunnelMessageHandler.MessageHandlers === undefined) {
            target.ModLoader.TunnelMessageHandler['MessageHandlers'] = new Map();
        }
        target.ModLoader.TunnelMessageHandler.MessageHandlers.set(key, propertyKey);
    };
}
exports.TunnelMessageHandler = TunnelMessageHandler;
const APITunnel = new GUITunnel(process, 'modloader64_api', null);
class GUIAPI {
    constructor(id, instance) {
        this.tunnel = new GUITunnel(process, id, instance);
    }
    openWindow(width, height, file) {
        APITunnel.send('openWindow', { width, height, file });
    }
    setDiscordStatus(status) {
        let evt = new Discord_1.DiscordStatusEvent(status);
        EventHandler_1.bus.emit("Discord:SetStatus" /* SET_STATUS */, evt);
        if (evt.canceled) {
            return;
        }
        APITunnel.send('setDiscordStatus', evt.status);
    }
}
exports.GUIAPI = GUIAPI;
//# sourceMappingURL=GUITunnel.js.map