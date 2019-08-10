import * as apiBit from './Bitmaps';
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

export interface ICurrentLevel {
  id: apiEnum.LevelType;
  acorn: number;
  caterpillar: number;
  gold_bullions: number;
  jinjos: number;
  notes: number;
  present_green: number;
  present_blue: number;
  present_red: number;
  orange: number;
}

export interface IInventory {
  health_upgrades: number;
  honeycombs: number;
  jiggies: number;
  mumbo_tokens: number;
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
  movement_state: number;
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
  visible: boolean;
}

export interface IRuntime {
  current_exit: number;
  current_health: number;
  current_level: ICurrentLevel;
  current_scene: apiEnum.SceneType;

  get_current_profile(): apiEnum.ProfileType;
  get_cutscene_state(): number;

  is_loading(): boolean;
  goto_scene(scene: apiEnum.SceneType, exit: apiEnum.ExitType): void;
}

export interface ISaveContext {
  inventory: IInventory;

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
  version: string;
  revision: number;

  isPlaying(): boolean;
}
