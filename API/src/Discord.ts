export interface IDiscordStatus {
  details: string;
  state: string;
  smallImageKey?: string;
}

export class DiscordStatus implements IDiscordStatus {
  details: string;
  state: string;
  smallImageKey?: string | undefined;

  constructor(details: string, state: string) {
    this.details = details;
    this.state = state;
  }
}
