export interface IServerCommand {
    params: Array<string>;
}

export class ServerCommand implements IServerCommand {
    params: string[];

    constructor(params: Array<string>) {
        this.params = params;
    }
}

export const enum ServerCommandEvents{
    RECEIVE_COMMAND = "ML64Core:RECEIVE_COMMAND"
}