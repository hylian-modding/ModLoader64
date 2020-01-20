import { IDiscordStatus } from './Discord';
export interface IGUITunnel {
    send(evt_id: string, evt: any): void;
}
export declare class GUITunnelPacket {
    id: string;
    event: string | string[];
    data: any;
    constructor(id: string, event: string | string[], data: any);
}
export declare class GUITunnel implements IGUITunnel {
    private id;
    private dest;
    private emitter;
    constructor(dest: any, id: string, instance: any);
    send(evt_id: string, evt: any): void;
    setupTunnelMessageHandlers(instance: any): void;
}
export declare function TunnelMessageHandler(key: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export interface IGUIAPI {
    openWindow(width: number, height: number, file: string): void;
    setDiscordStatus(status: IDiscordStatus): void;
    tunnel: IGUITunnel;
}
export declare class GUIAPI implements IGUIAPI {
    tunnel: IGUITunnel;
    constructor(id: string, instance: any);
    openWindow(width: number, height: number, file: string): void;
    setDiscordStatus(status: IDiscordStatus): void;
}
