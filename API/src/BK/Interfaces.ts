import { IRomHeader } from '../IRomHeader';
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
  eggs: number;
  red_feathers: number;
  gold_feathers: number;
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
  current_level_events: number;
  current_scene: apiEnum.SceneType;

  get_current_profile(): apiEnum.ProfileType;
  get_transition_state(): number;

  is_cutscene(): boolean;
  is_loading(): boolean;
  goto_scene(scene: apiEnum.SceneType, exit: apiEnum.ExitType): void;
}

export interface ISaveContext {
  inventory: IInventory;
  game_flags: IBuffered;
  honeycomb_flags: IBuffered;
  jiggy_flags: IBuffered;
  mumbo_token_flags: IBuffered;
  note_totals: IBuffered;

  moves: number;
}

export interface IBKCore {
  banjo: IBanjo;
  runtime: IRuntime;
  save: ISaveContext;
  version: apiEnum.GameVersion;

  isPlaying(): boolean;
}
