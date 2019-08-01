import IMemory from '../IMemory';
import { CommandBuffer } from './CommandBuffer';

export declare const enum LinkState {
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
}

export declare const enum scene {
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

export interface ISceneInfo {}

export const enum Tunic {
  KOKIRI,
  GORON,
  ZORA,
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
  kokiri: boolean;
  goron: boolean;
  zora: boolean;
}

export interface IBoots {
  kokiri: boolean;
  iron: boolean;
  hover: boolean;
}

export interface IInventory {
  wallet: Wallet;
  strength: Strength;
  swimming: ZoraScale;

  dekuSticks: boolean;
  dekuSticksCount: number;
  dekuSticksCapacity: AmmoUpgrade;
  dekuNuts: boolean;
  dekuNutsCount: number;
  dekuNutsCapacity: AmmoUpgrade;

  bombs: boolean;
  bombsCount: number;
  bombBag: AmmoUpgrade;
  bombchus: boolean;
  bombchuCount: number;

  magicBeans: boolean;
  magicBeansCount: number;

  fairySlingshot: boolean;
  dekuSeeds: number;
  bulletBag: AmmoUpgrade;
  fairyBow: boolean;
  fireArrows: boolean;
  iceArrows: boolean;
  lightArrows: boolean;
  arrows: number;
  quiver: AmmoUpgrade;

  dinsFire: boolean;
  faroresWind: boolean;
  nayrusLove: boolean;

  ocarina: Ocarina;

  hookshot: Hookshot;
  boomerang: boolean;
  lensOfTruth: boolean;
  megatonHammer: boolean;

  hasBottle(): boolean;
  getBottleCount(): number;
  getBottledItems(): InventoryItem[];

  childTradeItem: InventoryItem;
  isChildTradeFinished(): boolean;
  adultTradeItem: InventoryItem;
  isAdultTradeFinished(): boolean;

  // We should probably have an Item ID enum
  getItemInSlot(slotId: number): InventoryItem;
  getSlotForItem(item: InventoryItem): number;
  getSlotsForItem(item: InventoryItem): number[];
  hasItem(item: InventoryItem): boolean;
  hasAmmo(item: InventoryItem): boolean;
  getAmmoForItem(item: InventoryItem): number;
  getAmmoForSlot(slotId: number): number;
  setItemInSlot(item: InventoryItem, slot: number): void;
  giveItem(item: InventoryItem, desiredSlot: number): void;
  removeItem(item: InventoryItem): void;
  getEmptySlots(): number[];

  bottle_1: InventoryItem;
  bottle_2: InventoryItem;
  bottle_3: InventoryItem;
  bottle_4: InventoryItem;
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
}

export interface ILink extends IMemory {
  state: LinkState;
  tunic: Tunic;
  shield: Shield;
  boots: Boots;
  mask: Mask;
  pos: Buffer;
  rot: Buffer;
  anim_data: Buffer;
  current_sound_id: number;
  exists(): boolean;
}

export interface IGlobalContext {
  scene: number;
  room: number;
  framecount: number;
}

export interface IOotHelper {
  isTitleScreen(): boolean;
}

export interface IOOTCore {
  link: ILink;
  save: ISaveContext;
  helper: IOotHelper;
  global: IGlobalContext;
  commandBuffer: CommandBuffer;
}

export enum OotEvents {
  ON_SAVE_LOADED = 'onSaveLoaded',
  ON_SCENE_CHANGE = 'onSceneChange',
  ON_LOADING_ZONE = 'onLoadingZone',
  ON_VOID_OUT = 'onVoidOut',
}
