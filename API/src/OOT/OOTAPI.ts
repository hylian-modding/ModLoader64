export const enum LinkState {
  STANDING,
  SWIMMING,
  OCARINA,
  BUSY,
  UNKNOWN,
}

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
}

export interface ILink {
  state: LinkState;
  tunic: Tunic;
  shield: Shield;
  boots: Boots;
  mask: Mask;
}

export interface IOOTCore {
  link: ILink;
  save: ISaveContext;
}
