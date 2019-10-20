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

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IPlayer {}

export interface IRuntime {
  get_current_scene(): number;
}

export interface ISaveContext {
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

  item_slots: Buffer;
  get_item_slot(slot: apiEnum.ItemSlotType): apiEnum.ItemType;
  set_item_slot(slot: apiEnum.ItemSlotType, item: apiEnum.ItemType): void;

  mask_slots: Buffer;
  get_mask_slot(slot: apiEnum.MaskSlotType): apiEnum.MaskType;
  set_mask_slot(slot: apiEnum.MaskSlotType, mask: apiEnum.MaskType): void;
  scene_flags: number; //bruh
  save_flags: number; //bruh
}

export interface IMMCore {
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;

  isPlaying(): boolean;
}
