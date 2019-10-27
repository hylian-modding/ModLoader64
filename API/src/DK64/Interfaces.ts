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

export interface IBanana {
  array: Buffer;
  jungle_japes: number;
  angry_aztec: number;
  frantic_factory: number;
  gloomy_galleon: number;
  fungi_forest: number;
  crystal_cave: number;
  creepy_castle: number;
  dk_isles: number;
  hideout_helm: number;
  unknown_1: number;
  unknown_2: number;
  unknown_3: number;
  unknown_4: number;
  null: number;
}

export interface IKong {
  bananas: IBanana[];
  colored_bananas: IBanana;
  troff_scoff_bananas: IBanana;
  golden_bananas: IBanana;

  moves: number;
  simian_slam: number;
  weapon: number;
  ammo_belt: number;
  instrument: number;
  coins: number;
  instrument_energy: number;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IPlayer {
  kong: IKong[];
  dk: IKong;
  diddy: IKong;
  lanky: IKong;
  tiny: IKong;
  chunky: IKong;
  krusha: IKong;

  current_kong: number;

  get_max_standard_ammo(): number;

  standard_ammo: number;
  homing_ammo: number;
  oranges: number;
  crystals: number;
  film: number;
  health: number;
  melons: number;
}

export interface IRuntime {
  get_current_profile(): apiEnum.ProfileType;
  get_game_mode(): apiEnum.GameModeType;

  current_map: number;
  current_exit: number;
  parent_map: number;
  parent_exit: number;
  dest_map: number;
  dest_exit: number;
  map_state: number;
  cur_cutscene: number;
  cutscene_active: number;

  get_actor_array_ptr(): number;
  get_actor_count(): number;
  get_voxel_array_ptr(): number;
  get_voxel_array_size(): number;
  get_voxel_count(): number;
  goto_scene(map: number, exit: number): void;
}

export interface ISaveContext {
  get_slot_address(profile: number): number;
  get_slot(addr: number): Buffer;
  set_slot(addr: number, value: number): void;
}

export interface IDK64Core {
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;
  version: apiEnum.GameVersion;

  isPlaying(): boolean;
}
