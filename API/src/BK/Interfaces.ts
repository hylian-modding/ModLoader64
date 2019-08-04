import * as apiBit from './Bitmaps';
import * as apiEnum from './Enums';

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
  animal: apiEnum.AnimalType;
  animation: Buffer;
  anim_frame: number;
  anim_id: number;
  exists: boolean;
  opacity: number;
  position: Buffer;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rotation: Buffer;
  rot_x: number;
  rot_y: number;
  rot_z: number;
  scale: number;
  state: number;
  visible: boolean;
  z_forward: boolean;
}

export interface IRuntime {
  get_current_scene(): number;
  get_current_profile(): apiEnum.ProfileID;
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
