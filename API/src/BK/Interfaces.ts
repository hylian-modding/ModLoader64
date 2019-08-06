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
  flip_facing: boolean;
  model_index: number;
  model_ptr: number;
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
}

export interface IRuntime {
  get_current_profile(): apiEnum.ProfileID;

  current_exit: number;
  current_level: number;
  current_scene: number;
  current_health: number;

  loading_state: boolean;
  get_transition_state(): number;
}

export interface ISaveContext {
  game_flags: IBuffered;
  honeycomb_flags: IBuffered;
  jiggy_flags: IBuffered;
  move_flags: IBuffered;
  mumbo_token_flags: IBuffered;
  note_totals: IBuffered;

  held_honeycombs: number;
  held_jiggies: number;
  held_mumbo_tokens: number;

  health_upgrades: number;
}

export interface IBKCore {
  banjo: IBanjo;
  runtime: IRuntime;
  save: ISaveContext;

  isPlaying(): boolean;
}
