/// <reference types="node" />
export interface Code {
    type: string;
    addr: number;
    payload: number;
}
export declare class GameShark {
    private read_gs;
    read(data: Buffer, dest: Buffer): void;
}
