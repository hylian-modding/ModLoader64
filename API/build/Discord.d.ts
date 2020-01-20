export interface IDiscordStatus {
    details: string;
    state: string;
    smallImageKey?: string;
    partyId?: string;
    partySize?: number;
    partyMax?: number;
}
export declare class DiscordStatus implements IDiscordStatus {
    details: string;
    state: string;
    smallImageKey?: string | undefined;
    partyId?: string | undefined;
    partySize?: number | undefined;
    partyMax?: number | undefined;
    constructor(details: string, state: string);
}
export declare class DiscordStatusEvent {
    status: IDiscordStatus;
    canceled: boolean;
    constructor(status: IDiscordStatus);
}
export declare const enum DiscordEvents {
    SET_STATUS = "Discord:SetStatus"
}
