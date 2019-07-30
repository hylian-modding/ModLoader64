import * as apiBit from './BKAPI_BITMAP';
import * as apiEnum from './BKAPI_ENUM';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export interface IBuffered {
  get_all(): Buffer;
  get_bit(flag: number): boolean;
  set_bit(flag: number, value: boolean): any;
  get(offset: number): number;
  set(offset: number, value: number): any;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IBanjo {
  exists: boolean;
  opacity: number;
  z_forward: boolean;
  visible: boolean;
  scale: number;
  state: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  animal: apiEnum.AnimalType;
}

export interface IRuntime {
  level: apiEnum.LevelID;
  profile: apiEnum.ProfileID;
}

export interface ISaveContext {
  game_flags: IBuffered;
  honeycomb_flags: IBuffered;
  jiggy_flags: IBuffered;
  move_flags: IBuffered;
  mumbo_token_flags: IBuffered;
  note_totals: IBuffered;
}

export interface IBKCore {
  banjo: IBanjo;
  runtime: IRuntime;
  save: ISaveContext;

  isPlaying(): boolean;
}
