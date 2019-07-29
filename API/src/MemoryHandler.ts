import { EventEmitter } from 'events';

export class MemoryEventBus extends EventEmitter {}

export const memoryBus: MemoryEventBus = new MemoryEventBus();
