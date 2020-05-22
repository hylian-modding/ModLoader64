import { IncomingMessage } from "http";

export const enum RPCEvents{
    ON_RECEIVE = "RPC:ON_RECEIVE"
}

export class RPC_Receieve_Event{
    req: IncomingMessage;
    response: any = {};

    constructor(req: IncomingMessage){
        this.req = req;
    }
}