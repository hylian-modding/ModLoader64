import * as apiEnum from './Enums';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export interface IBuffered {
  get_all(): Buffer;
  set_all(value: Buffer): void;
  get_bit(flag: number): boolean;
  set_bit(flag: number, value: boolean): void;
  get(offset: number): number;
  set(offset: number, value: number): void;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IPlayer {}

export interface IRuntime {
  get_profile_hovering(): apiEnum.ProfileType;
  get_profile_selected(): apiEnum.ProfileType;
}

export interface ISaveContext {
  game_flags: IBuffered;
}

export interface IBTCore {
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;
  version: apiEnum.GameVersion;

  isPlaying(): boolean;
}
