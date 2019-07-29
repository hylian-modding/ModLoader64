import { EventEmitter } from 'events';

export class EndPointEventBus extends EventEmitter {}

export const EndpointBus: EndPointEventBus = new EndPointEventBus();

export const enum EndPointEvents {
  CREATE_ENDPOINT = 'createEndpoint',
}

export class Endpoint {
  path: string;
  callback: Function;

  constructor(path: string, fn: Function) {
    this.path = path;
    this.callback = fn;
  }
}

export function registerEndpoint(path: string, fn: Function) {
  EndpointBus.emit(EndPointEvents.CREATE_ENDPOINT, new Endpoint(path, fn));
}
