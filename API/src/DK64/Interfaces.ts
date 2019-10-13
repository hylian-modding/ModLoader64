import * as apiEnum from './Enums';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export interface IBuffered {
  get_all(): Buffer;
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
  get_current_profile(): apiEnum.ProfileType;
  get_game_mode(): apiEnum.GameModeType;
}

export interface IEeprom {
  get_slot_address(profile: number): number;
  get_slot(addr: number): Buffer;
  set_slot(addr: number, value: number): void;
}

export interface ISaveContext {}

export interface IDK64Core {
  player: IPlayer;
  runtime: IRuntime;
  eeprom: IEeprom;
  save: ISaveContext;
  version: apiEnum.GameVersion;

  isPlaying(): boolean;
}
