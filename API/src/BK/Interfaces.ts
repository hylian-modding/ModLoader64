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

export interface IInventory {
  acorn: number;
  caterpillar: number;
  eggs: number;
  gold_bullions: number;
  gold_feathers: number;
  health_upgrades: number;
  honeycombs: number;
  jiggies: number;
  jinjos: number;
  mumbo_tokens: number;
  notes: number;
  present_green: number;
  present_blue: number;
  present_red: number;
  orange: number;
  red_feathers: number;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface ICamera {
  position: Buffer;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rotation: Buffer;
  rot_x: number;
  rot_y: number;
  rot_z: number;
}

export interface IPlayer {
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
  current_level: number;
  current_level_events: number;
  current_scene: apiEnum.SceneType;
  current_scene_events: number;

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

  get_save(file: apiEnum.ProfileType): Buffer;
  set_save(file: apiEnum.ProfileType, val: Buffer): void;

  moves: number;
}

export interface IBKCore {
  camera: ICamera;
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;
  version: apiEnum.GameVersion;

  isPlaying(): boolean;
}
