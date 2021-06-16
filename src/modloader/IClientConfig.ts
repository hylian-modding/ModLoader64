export interface IClientConfig {
    isSinglePlayer: boolean;
    ip: string;
    port: number;
    nickname: string;
    lobby: string;
    password: string;
    forceServerOverride: boolean;
    forceTCPMode: boolean;
}
