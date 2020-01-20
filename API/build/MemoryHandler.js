"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MemoryEventBus extends events_1.EventEmitter {
}
exports.MemoryEventBus = MemoryEventBus;
exports.memoryBus = new MemoryEventBus();
//# sourceMappingURL=MemoryHandler.js.map