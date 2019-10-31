export interface IDiscordStatus {
  details: string;
  state: string;
  smallImageKey?: string;
  partyId?: string;
  partySize?: number;
  partyMax?: number;
}

export class DiscordStatus implements IDiscordStatus {
  details: string;
  state: string;
  smallImageKey?: string | undefined;
  partyId?: string | undefined;
  partySize?: number | undefined;
  partyMax?: number | undefined;

  constructor(details: string, state: string) {
    this.details = details;
    this.state = state;
  }
}
