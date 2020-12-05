import { ICommandBuffer } from './ICommandBuffer';
import { ICore } from '../IModLoaderAPI';
import { IActor } from './IActor';
import { IDungeonItemManager } from './IDungeonItemManager';
import Vector3 from '../math/Vector3';
import { throws } from 'assert';
import { ActorCategory } from './ActorCategory';

export const enum LinkState {
  UNKNOWN,
  STANDING,
  SWIMMING,
  OCARINA,
  BUSY,
  LOADING_ZONE,
  ENTERING_GROTTO,
  FIRST_PERSON,
  JUMPING,
  CLIMBING_OUT_OF_WATER,
  HANGING_FROM_LEDGE,
  CHARGING_SPIN_ATTACK,
  HOLDING_ACTOR,
  GETTING_ITEM,
  SHOOTING_BOW_OR_HOOKSHOT,
  RIDING_EPONA,
  DYING,
  TAKING_DAMAGE,
  FALLING,
  VOIDING_OUT,
  TALKING,
  HOVERING,
  Z_TARGETING,
}

export const enum LinkState2 {
  UNKNOWN,
  IDLE,
  CRAWLSPACE,
  MOVING_FORWARD,
}

export const enum Scene {
  INSIDE_THE_DEKU_TREE,
  DODONGOS_CAVERN,
  INSIDE_JABU_JABUS_BELLY,
  FOREST_TEMPLE,
  FIRE_TEMPLE,
  WATER_TEMPLE,
  SPIRIT_TEMPLE,
  SHADOW_TEMPLE,
  BOTTOM_OF_THE_WELL,
  ICE_CAVERN,
  GANONS_TOWER,
  GERUDO_TRAINING_GROUNDS,
  THIEVES_HIDEOUT,
  INSIDE_GANONS_CASTLE,
  GANONS_TOWER_COLLAPSING,
  INSIDE_GANONS_CASTLE_COLLAPSING,
  TREASURE_BOX_SHOP,
  GOHMAS_LAIR,
  KING_DODONGOS_LAIR,
  BARINADES_LAIR,
  PHANTOM_GANONS_LAIR,
  VOLVAGIAS_LAIR,
  MORPHAS_LAIR,
  TWINROVAS_LAIR,
  BONGO_BONGOS_LAIR,
  GANONDORFS_LAIR,
  TOWER_COLLAPSE_EXTERIOR,
  MARKET_ENTRANCE_CHILD_DAY,
  MARKET_ENTRANCE_CHILD_NIGHT,
  MARKET_ENTRANCE_ADULT,
  BACK_ALLEY_DAY,
  BACK_ALLEY_NIGHT,
  MARKET_CHILD_DAY,
  MARKET_CHILD_NIGHT,
  MARKET_ADULT,
  TEMPLE_OF_TIME_EXTERIOR_CHILD_DAY,
  TEMPLE_OF_TIME_EXTERIOR_CHILD_NIGHT,
  TEMPLE_OF_TIME_EXTERIOR_ADULT,
  KNOW_IT_ALL_BROTHERS_HOUSE,
  HOUSE_OF_TWINS,
  MIDOS_HOUSE,
  SARIAS_HOUSE,
  CARPENTER_BOSS_HOUSE,
  BACK_ALLEY_MAN_IN_GREEN_HOUSE,
  BAZAAR,
  KOKIRI_SHOP,
  GORON_SHOP,
  ZORA_SHOP,
  KAKARIKO_POTION_SHOP,
  MARKET_POTION_SHOP,
  BOMBCHU_SHOP,
  HAPPY_MASK_SHOP,
  LINKS_HOUSE,
  BACK_ALLEY_DOG_LADY_HOUSE,
  STABLE,
  IMPAS_HOUSE,
  LAKESIDE_LABORATORY,
  CARPENTERS_TENT,
  GRAVEKEEPERS_HUT,
  GREAT_FAIRYS_FOUNTAIN_UPGRADES,
  FAIRYS_FOUNTAIN,
  GREAT_FAIRYS_FOUNTAIN_SPELLS,
  GROTTOS,
  GRAVE_REDEAD,
  GRAVE_FAIRYS_FOUNTAIN,
  ROYAL_FAMILY_TOMB,
  SHOOTING_GALLERY,
  TEMPLE_OF_TIME,
  CHAMBER_OF_THE_SAGES,
  CASTLE_HEDGE_MAZE_DAY,
  CASTLE_HEDGE_MAZE_NIGHT,
  CUTSCENE_MAP,
  WINDMILL,
  FISHING_POND,
  CASTLE_COURTYARD,
  BUMBCHU_BOWLING,
  RANCH_HOUSE,
  GUARD_HOUSE,
  GRANNYS_POTION_SHOP,
  GANON_BATTLE_ARENA,
  HOUSE_OF_SKULLTULA,
  HYRULE_FIELD,
  KAKARIKO_VILLAGE,
  GRAVEYARD,
  ZORAS_RIVER,
  KOKIRI_FOREST,
  SACRED_FOREST_MEADOW,
  LAKE_HYLIA,
  ZORAS_DOMAIN,
  ZORAS_FOUNTAIN,
  GERUDO_VALLEY,
  LOST_WOODS,
  DESERT_COLOSSUS,
  GERUDOS_FORTRESS,
  HAUNTED_WASTELAND,
  HYRULE_CASTLE,
  DEATH_MOUNTAIN_TRAIL,
  DEATH_MOUNTAIN_CRATER,
  GORON_CITY,
  LON_LON_RANCH,
  GANONS_CASTLE_EXTERIOR,
}

export interface ISceneInfo { }

export const enum Tunic {
  KOKIRI,
  GORON,
  ZORA,
}

export const enum Sword {
  NONE,
  KOKIRI,
  MASTER,
  BIGGORON,
}

export const enum Shield {
  NONE,
  DEKU,
  HYLIAN,
  MIRROR,
}

export const enum Boots {
  KOKIRI,
  IRON,
  HOVER,
}

export const enum Mask {
  NONE,
  KEATON,
  SKULL,
  SPOOKY,
  BUNNY,
}

export const enum Magic {
  NONE,
  NORMAL,
  EXTENDED,
}

export const enum MagicQuantities {
  NONE = 0,
  NORMAL = 0x30,
  EXTENDED = 0x60,
}

export const enum InventoryItem {
  DEKU_STICK,
  DEKU_NUT,
  BOMB,
  FAIRY_BOW,
  FIRE_ARROW,
  DINS_FIRE,
  FAIRY_SLINGSHOT,
  FAIRY_OCARINA,
  OCARINA_OF_TIME,
  BOMBCHU,
  HOOKSHOT,
  LONGSHOT,
  ICE_ARROW,
  FARORES_WIND,
  BOOMERANG,
  LENS_OF_TRUTH,
  MAGIC_BEAN,
  MEGATON_HAMMER,
  LIGHT_ARROW,
  NAYRUS_LOVE,
  EMPTY_BOTTLE,
  RED_POTION,
  GREEN_POTION,
  BLUE_POTION,
  BOTTLED_FAIRY,
  BOTTLED_FISH,
  LON_LON_MILK,
  RUTOS_LETTER,
  BLUE_FIRE,
  BOTTLED_BUGS,
  BOTTLED_BIG_POE,
  LON_LON_MILK_HALF,
  BOTTLED_POE,
  WEIRD_EGG,
  CHILD_CUCCO,
  ZELDAS_LETTER,
  KEATON_MASK,
  SKULL_MASK,
  SPOOKY_MASK,
  BUNNY_HOOD,
  GORON_MASK,
  ZORA_MASK,
  GERUDO_MASK,
  MASK_OF_TRUTH,
  SOLD_OUT,
  POCKET_EGG,
  POCKET_CUCCO,
  COJIRO,
  ODD_MUSHROOM,
  ODD_POTION,
  POACHERS_SAW,
  BROKEN_GORON_SWORD,
  PRESCRIPTION,
  EYEBALL_FROG,
  EYE_DROPS,
  CLAIM_CHECK,
  BOW_FIRE_ARROWS,
  BOW_ICE_ARROWS,
  BOW_LIGHT_ARROWS,
  NONE = 0xff,
}

export const enum Ocarina {
  NONE,
  FAIRY_OCARINA,
  OCARINA_OF_TIME,
}

export const enum Hookshot {
  NONE,
  HOOKSHOT,
  LONGSHOT,
}

export const enum Strength {
  NONE,
  GORON_BRACELET,
  SILVER_GAUNTLETS,
  GOLDEN_GAUNTLETS,
  BLACK_GAUNTLETS,
  GREEN_GAUNTLETS,
  BLUE_GAUNTLETS,
}

export const enum Wallet {
  CHILD,
  ADULT,
  GIANT,
  TYCOON,
}

export const enum ZoraScale {
  NONE,
  SILVER,
  GOLDEN,
}

export const enum AmmoUpgrade {
  NONE,
  BASE,
  UPGRADED,
  MAX,
}

export const enum Age {
  ADULT,
  CHILD,
}

export interface ISwords {
  kokiriSword: boolean;
  masterSword: boolean;
  giantKnife: boolean;
  biggoronSword: boolean;
}

export interface IShields {
  dekuShield: boolean;
  hylianShield: boolean;
  mirrorShield: boolean;
}

export interface ITunics {
  kokiriTunic: boolean;
  goronTunic: boolean;
  zoraTunic: boolean;
}

export interface IBoots {
  kokiriBoots: boolean;
  ironBoots: boolean;
  hoverBoots: boolean;
}

export interface IInventoryCounts {
  dekuSticksCount: number;
  dekuNutsCount: number;
  bombsCount: number;
  bombchuCount: number;
  magicBeansCount: number;
  dekuSeeds: number;
  arrows: number;
}

export interface IInventoryFields {
  wallet: Wallet;
  strength: Strength;
  swimming: ZoraScale;
  dekuSticks: boolean;
  dekuSticksCapacity: AmmoUpgrade;
  dekuNuts: boolean;
  dekuNutsCapacity: AmmoUpgrade;
  bombs: boolean;
  bombBag: AmmoUpgrade;
  bombchus: boolean;
  magicBeans: boolean;
  fairySlingshot: boolean;
  bulletBag: AmmoUpgrade;
  fairyBow: boolean;
  fireArrows: boolean;
  iceArrows: boolean;
  lightArrows: boolean;
  quiver: AmmoUpgrade;
  dinsFire: boolean;
  faroresWind: boolean;
  nayrusLove: boolean;
  ocarina: Ocarina;
  hookshot: Hookshot;
  boomerang: boolean;
  lensOfTruth: boolean;
  megatonHammer: boolean;
  childTradeItem: InventoryItem;
  adultTradeItem: InventoryItem;
  bottle_1: InventoryItem;
  bottle_2: InventoryItem;
  bottle_3: InventoryItem;
  bottle_4: InventoryItem;
}

export interface IInventory extends IInventoryFields, IInventoryCounts {
  hasBottle(): boolean;
  getBottleCount(): number;
  getBottledItems(): InventoryItem[];
  isChildTradeFinished(): boolean;
  isAdultTradeFinished(): boolean;
  getItemInSlot(slotId: number): InventoryItem;
  getSlotForItem(item: InventoryItem): number;
  getSlotsForItem(item: InventoryItem): number[];
  hasItem(item: InventoryItem): boolean;
  hasAmmo(item: InventoryItem): boolean;
  getAmmoForItem(item: InventoryItem): number;
  getAmmoForSlot(slotId: number): number;
  setAmmoInSlot(slot: number, amount: number): void;
  setItemInSlot(item: InventoryItem, slot: number): void;
  giveItem(item: InventoryItem, desiredSlot: number): void;
  removeItem(item: InventoryItem): void;
  getEmptySlots(): number[];
  getMaxRupeeCount(): number;
}

export interface IQuestStatus {
  kokiriEmerald: boolean;
  goronRuby: boolean;
  zoraSapphire: boolean;

  lightMedallion: boolean;
  forestMedallion: boolean;
  fireMedallion: boolean;
  waterMedallion: boolean;
  shadowMedallion: boolean;
  spiritMedallion: boolean;

  zeldasLullaby: boolean;
  eponasSong: boolean;
  sariasSong: boolean;
  sunsSong: boolean;
  songOfTime: boolean;
  songOfStorms: boolean;

  preludeOfLight: boolean;
  minuetOfForest: boolean;
  boleroOfFire: boolean;
  serenadeOfWater: boolean;
  nocturneOfShadow: boolean;
  requiemOfSpirit: boolean;

  gerudoMembershipCard: boolean;
  stoneOfAgony: boolean;

  goldSkulltulas: number;
  displayGoldSkulltulas: boolean;

  heartPieces: number;
}

export interface ISaveContext {
  swords: ISwords;
  shields: IShields;
  tunics: ITunics;
  boots: IBoots;
  inventory: IInventory;
  questStatus: IQuestStatus;
  entrance_index: number;
  cutscene_number: number;
  world_time: number;
  world_night_flag: boolean;
  zeldaz_string: string;
  death_counter: number;
  player_name: string;
  dd_flag: boolean;
  heart_containers: number;
  health: number;
  magic_meter_size: Magic;
  magic_current: number;
  rupee_count: number;
  navi_timer: number;
  checksum: number;
  age: Age;
  magic_beans_purchased: number;
  permSceneData: Buffer;
  eventFlags: Buffer;
  itemFlags: Buffer;
  infTable: Buffer;
  skulltulaFlags: Buffer;
  keyManager: IKeyManager;
  dungeonItemManager: IDungeonItemManager;
  double_defense: number;
}

export interface ILink extends IActor {
  state: LinkState;
  state2: LinkState2;
  rawStateValue: number;
  tunic: Tunic;
  shield: Shield;
  boots: Boots;
  mask: Mask;
  anim_data: Buffer;
  current_sound_id: number;
  sword: Sword;
  get_anim_id(): number;
  get_anim_frame(): number;
  projected_position: Vector3;
}

export interface IGlobalContext {
  scene: number;
  room: number;
  framecount: number;
  scene_framecount: number;
  continue_state: boolean;
  liveSceneData_chests: Buffer;
  liveSceneData_clear: Buffer;
  liveSceneData_switch: Buffer;
  liveSceneData_temp: Buffer;
  liveSceneData_collectable: Buffer;
  getSaveDataForCurrentScene(): Buffer;
  writeSaveDataForCurrentScene(buf: Buffer): void;
  viewStruct: IViewStruct;
  fogDistance: number;
  fogColor: number;
  lastOrCurrentEntrance: number;
}

export interface IViewStruct {
  readonly VIEW: string;
  gfx_ctx_pointer: number;
  fov: number;
  near_clip: number;
  far_clip: number;
  position: Vector3;
  focus: Vector3;
  axis: Vector3;
}

export interface IOotHelper {
  isTitleScreen(): boolean;
  isSceneNumberValid(): boolean;
  isLinkEnteringLoadingZone(): boolean;
  isPaused(): boolean;
  isInterfaceShown(): boolean;
}

export interface IOOTCore extends ICore {
  link: ILink;
  save: ISaveContext;
  helper: IOotHelper;
  global: IGlobalContext;
  commandBuffer: ICommandBuffer;
  actorManager: IActorManager;
  toggleMapSelectKeybind(): boolean;
}

// Note: ON_ACTOR_SPAWN/ON_ACTOR_DESPAWN won't detect anything created by ICommandBuffer. This is intentional behavior.

export enum OotEvents {
  ON_SAVE_LOADED = 'onSaveLoaded',
  ON_SCENE_CHANGE = 'onSceneChange',
  ON_LOADING_ZONE = 'onLoadingZone',
  ON_ACTOR_SPAWN = 'onActorSpawn',
  ON_ACTOR_DESPAWN = 'onActorDespawn',
  ON_ROOM_CHANGE = 'onRoomChange',
  ON_ROOM_CHANGE_PRE = 'onPreRoomChange',
  ON_AGE_CHANGE = 'onAgeChange',
  ON_SAVE_FLAG_CHANGE = "onSaveFlagChange",
  ON_LOCAL_FLAG_CHANGE = "onLocalFlagChange"
}

export enum OotFlagTypes {
  SCENE,
  SKULLTULA,
  ITEM,
  INF,
  EVENT
}

export enum OotFlagSubTypes {
  NONE,
  CHEST,
  SWITCH,
  ROOM_CLEAR,
  COLLECT,
  UNUSED,
  VISITED_ROOM,
  VISITED_FLOOR
}

export interface OotFlagEvent {
  type: OotFlagTypes;
  subtype: OotFlagSubTypes;
  scene: Scene;
  flagNumber: number;
  state: boolean;
}

export class OotFlagEventImpl implements OotFlagEvent {
  type: OotFlagTypes;
  subtype: OotFlagSubTypes;
  scene: Scene;
  flagNumber: number;
  state: boolean;

  constructor(type: OotFlagTypes, subtype: OotFlagSubTypes, scene: Scene, flagNumber: number, state: boolean) {
    this.type = type;
    this.subtype = subtype;
    this.scene = scene;
    this.flagNumber = flagNumber;
    this.state = state;
  }

}

export interface IActorManager {
  // Returns IActor if the actor exists or undefined if the pointer doesn't lead to an actor.
  createIActorFromPointer(pointer: number): IActor;
  getActors(category: ActorCategory): IActor[];
}

export const NO_KEYS = 0xff;

export const enum VANILLA_KEY_INDEXES {
  FOREST_TEMPLE = 3,
  FIRE_TEMPLE = 4,
  WATER_TEMPLE = 5,
  SPIRIT_TEMPLE = 6,
  SHADOW_TEMPLE = 7,
  BOTTOM_OF_THE_WELL = 8,
  GERUDO_TRAINING_GROUND = 11,
  GERUDO_FORTRESS = 12,
  GANONS_CASTLE = 13,
  TREASURE_CHEST_SHOP = 16,
}

export const enum VANILLA_DUNGEON_ITEM_INDEXES {
  DEKU_TREE,
  DODONGOS_CAVERN,
  JABJ_JABUS_BELLY,
  FOREST_TEMPLE,
  FIRE_TEMPLE,
  WATER_TEMPLE,
  SPIRIT_TEMPLE,
  SHADOW_TEMPLE,
  BOTTOM_OF_THE_WELL,
  ICE_CAVERN,
  GANONS_CASTLE,
}

export interface IKeyManager {
  getKeyCountForIndex(index: number): number;
  setKeyCountByIndex(index: number, count: number): void;
  getRawKeyBuffer(): Buffer;
}

export const enum InventorySlots {
  DEKU_STICKS,
  DEKU_NUTS,
  BOMBS,
  FAIRY_BOW,
  FIRE_ARROWS,
  DINS_FIRE,
  FAIRY_SLINGSHOT,
  OCARINA,
  BOMBCHUS,
  HOOKSHOT,
  ICE_ARROWS,
  FARORES_WIND,
  BOOMERANG,
  LENS_OF_TRUTH,
  MAGIC_BEANS,
  MEGATON_HAMMER,
  LIGHT_ARROWS,
  NAYRUS_LOVE,
  BOTTLE1,
  BOTTLE2,
  BOTTLE3,
  BOTTLE4,
  ADULT_TRADE_ITEM,
  CHILD_TRADE_ITEM,
}

class UpgradeCount {
  item: InventoryItem;
  level: AmmoUpgrade;
  count: number;

  constructor(item: InventoryItem, level: AmmoUpgrade, count: number) {
    this.item = item;
    this.level = level;
    this.count = count;
  }

  isMatch(inst: UpgradeCount) {
    return inst.item === this.item && inst.level === this.level;
  }
}

const UpgradeCountLookupTable: UpgradeCount[] = [
  // Bombs
  new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.NONE, 0),
  new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.BASE, 20),
  new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.UPGRADED, 30),
  new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.MAX, 40),
  // Sticks
  new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.NONE, 0),
  new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.BASE, 10),
  new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.UPGRADED, 20),
  new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.MAX, 30),
  // Nuts
  new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.NONE, 0),
  new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.BASE, 20),
  new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.UPGRADED, 30),
  new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.MAX, 40),
  // Seeds
  new UpgradeCount(InventoryItem.FAIRY_SLINGSHOT, AmmoUpgrade.NONE, 0),
  new UpgradeCount(InventoryItem.FAIRY_SLINGSHOT, AmmoUpgrade.BASE, 30),
  new UpgradeCount(InventoryItem.FAIRY_SLINGSHOT, AmmoUpgrade.UPGRADED, 40),
  new UpgradeCount(InventoryItem.FAIRY_SLINGSHOT, AmmoUpgrade.MAX, 50),
  // Arrows
  new UpgradeCount(InventoryItem.FAIRY_BOW, AmmoUpgrade.NONE, 0),
  new UpgradeCount(InventoryItem.FAIRY_BOW, AmmoUpgrade.BASE, 30),
  new UpgradeCount(InventoryItem.FAIRY_BOW, AmmoUpgrade.UPGRADED, 40),
  new UpgradeCount(InventoryItem.FAIRY_BOW, AmmoUpgrade.MAX, 50),
  // Bombchu
  new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.NONE, 0),
  new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.BASE, 5),
  new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.UPGRADED, 10),
  new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.MAX, 20),
];

export function UpgradeCountLookup(
  item: InventoryItem,
  level: AmmoUpgrade
): number {
  let inst: UpgradeCount = new UpgradeCount(item, level, -1);
  for (let i = 0; i < UpgradeCountLookupTable.length; i++) {
    if (inst.isMatch(UpgradeCountLookupTable[i])) {
      return UpgradeCountLookupTable[i].count;
    }
  }
  return 0;
}

export interface IOvlPayloadResult {
  file: string;
  slot: number;
  addr: number;
  params: number;
  buf: Buffer;
  relocate: number;

  spawn(obj: IOvlPayloadResult, callback?: (success: boolean, result: number) => {}): void;
}

export class SceneStruct {
  buf: Buffer;

  constructor(buf: Buffer) {
    this.buf = buf;
  }

  get chests(): Buffer {
    return this.buf.slice(0x0, 0x4);
  }

  get switches(): Buffer {
    return this.buf.slice(0x4, 0x8);
  }

  get room_clear(): Buffer {
    return this.buf.slice(0x8, 0xC);
  }

  get collectible(): Buffer {
    return this.buf.slice(0xC, 0x10);
  }

  get unused(): Buffer {
    return this.buf.slice(0x10, 0x14);
  }

  get visited_rooms(): Buffer {
    return this.buf.slice(0x14, 0x18);
  }

  get visited_floors(): Buffer {
    return this.buf.slice(0x18, 0x1C);
  }
}