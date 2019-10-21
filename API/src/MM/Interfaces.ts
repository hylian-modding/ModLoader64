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

export interface IDungeon {
  wood_fall: number;
  snow_head: number;
  great_bay: number;
  stone_tower: number;
}

export interface IItemSlots {
  array: Buffer;
  get_slot(slot: apiEnum.ItemSlotType): apiEnum.ItemType;
  set_slot(slot: apiEnum.ItemSlotType, item: apiEnum.ItemType): void;
}

export interface IMaskSlots {
  array: Buffer;
  get_slot(slot: apiEnum.MaskSlotType): apiEnum.MaskType;
  set_slot(slot: apiEnum.MaskSlotType, mask: apiEnum.MaskType): void;
}

export interface ISkultullaHouse {
  wood_fall: number;
  great_bay: number;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IPlayer {}

export interface IRuntime {
  get_current_scene(): number;
}

export interface ISaveContext {
  game_flags: IBuffered;
  cycle_flags: IBuffered;
  scene_flags: IBuffered;

  item_slots: IItemSlots;
  mask_slots: IMaskSlots;

  dungeon_fairies: IDungeon;
  dungeon_items: IDungeon;
  dungeon_keys: IDungeon;

  skultulla_house: ISkultullaHouse;

  entrance_index: number;
  start_mask: number;
  intro_flag: number;
  cutscene_number: number;
  world_time: number;
  owl_id: number;
  night_flag: number;
  time_speed: number;
  current_day: number;
  days_elapsed: number;
  link_transformation: number;
  have_tatl: number;
  player_name: number;
  heart_container: number;
  start_health: number;
  magic_bar: number;
  magic_amount: number;
  rupee_amount: number;
  double_defense: number;

  get_checksum(): number;
}

export interface IMMCore {
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;

  isPlaying(): boolean;
}
