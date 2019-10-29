import * as apiBit from './Bitmaps';
import * as apiEnum from './Enums';
import { ICommandBuffer } from './ICommandBuffer';

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

export interface IClock {
  current_day: number;
  elapsed: number;
  is_night: boolean;
  speed: number;
  time: number;
}

export interface IDungeon {
  wood_fall: number;
  snow_head: number;
  great_bay: number;
  stone_tower: number;
}

export interface IEquipSlots {
  sword: apiBit.SwordBmp;
  shield: apiBit.ShieldBmp;
  bomb_bag: apiBit.BombBagBmp;
  quiver: apiBit.QuiverBmp;
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

export interface IHealth {
  double_defense: number;
  pieces: number;
  heart_container: number;
  start_health: number;
}

export interface IMagic {
  magic_bar: number;
  magic_amount: number;
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
  goto_scene(scene: number): void;

  cutscene_ptr: number;
  scene_flags: IBuffered;
}

export interface ISaveContext {
  cycle_flags: IBuffered;
  event_flags: IBuffered;
  game_flags: IBuffered;
  owl_flags: IBuffered;

  equip_slots: IEquipSlots;
  item_slots: IItemSlots;
  mask_slots: IMaskSlots;

  clock: IClock;
  dungeon_fairies: IDungeon;
  dungeon_items: IDungeon;
  dungeon_keys: IDungeon;
  health: IHealth;
  magic: IMagic;
  skultulla_house: ISkultullaHouse;

  bank: number;
  current_form: number;
  cutscene_number: number;
  entrance_index: number;
  start_mask: number;
  intro_flag: number;
  owl_id: number;
  have_tatl: number;
  player_name: number;
  rupee_amount: number;
  quest_status: number;

  get_checksum(): number;
}

export interface IMMCore {
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;
  commandBuffer: ICommandBuffer;

  isPlaying(): boolean;
  isTitleScreen(): boolean;
}
