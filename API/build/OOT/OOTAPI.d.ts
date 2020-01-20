/// <reference types="node" />
import { ICommandBuffer } from './ICommandBuffer';
import { ICore } from '../IModLoaderAPI';
import { IActor } from './IActor';
import { IDungeonItemManager } from './IDungeonItemManager';
export declare const enum LinkState {
    UNKNOWN = 0,
    STANDING = 1,
    SWIMMING = 2,
    OCARINA = 3,
    BUSY = 4,
    LOADING_ZONE = 5,
    ENTERING_GROTTO = 6,
    FIRST_PERSON = 7,
    JUMPING = 8,
    CLIMBING_OUT_OF_WATER = 9,
    HANGING_FROM_LEDGE = 10,
    CHARGING_SPIN_ATTACK = 11,
    HOLDING_ACTOR = 12,
    GETTING_ITEM = 13,
    SHOOTING_BOW_OR_HOOKSHOT = 14,
    RIDING_EPONA = 15,
    DYING = 16,
    TAKING_DAMAGE = 17,
    FALLING = 18,
    VOIDING_OUT = 19,
    TALKING = 20,
    HOVERING = 21,
    Z_TARGETING = 22
}
export declare const enum LinkState2 {
    UNKNOWN = 0,
    IDLE = 1,
    CRAWLSPACE = 2,
    MOVING_FORWARD = 3
}
export declare const enum Scene {
    INSIDE_THE_DEKU_TREE = 0,
    DODONGOS_CAVERN = 1,
    INSIDE_JABU_JABUS_BELLY = 2,
    FOREST_TEMPLE = 3,
    FIRE_TEMPLE = 4,
    WATER_TEMPLE = 5,
    SPIRIT_TEMPLE = 6,
    SHADOW_TEMPLE = 7,
    BOTTOM_OF_THE_WELL = 8,
    ICE_CAVERN = 9,
    GANONS_TOWER = 10,
    GERUDO_TRAINING_GROUNDS = 11,
    THIEVES_HIDEOUT = 12,
    INSIDE_GANONS_CASTLE = 13,
    GANONS_TOWER_COLLAPSING = 14,
    INSIDE_GANONS_CASTLE_COLLAPSING = 15,
    TREASURE_BOX_SHOP = 16,
    GOHMAS_LAIR = 17,
    KING_DODONGOS_LAIR = 18,
    BARINADES_LAIR = 19,
    PHANTOM_GANONS_LAIR = 20,
    VOLVAGIAS_LAIR = 21,
    MORPHAS_LAIR = 22,
    TWINROVAS_LAIR = 23,
    BONGO_BONGOS_LAIR = 24,
    GANONDORFS_LAIR = 25,
    TOWER_COLLAPSE_EXTERIOR = 26,
    MARKET_ENTRANCE_CHILD_DAY = 27,
    MARKET_ENTRANCE_CHILD_NIGHT = 28,
    MARKET_ENTRANCE_ADULT = 29,
    BACK_ALLEY_DAY = 30,
    BACK_ALLEY_NIGHT = 31,
    MARKET_CHILD_DAY = 32,
    MARKET_CHILD_NIGHT = 33,
    MARKET_ADULT = 34,
    TEMPLE_OF_TIME_EXTERIOR_CHILD_DAY = 35,
    TEMPLE_OF_TIME_EXTERIOR_CHILD_NIGHT = 36,
    TEMPLE_OF_TIME_EXTERIOR_ADULT = 37,
    KNOW_IT_ALL_BROTHERS_HOUSE = 38,
    HOUSE_OF_TWINS = 39,
    MIDOS_HOUSE = 40,
    SARIAS_HOUSE = 41,
    CARPENTER_BOSS_HOUSE = 42,
    BACK_ALLEY_MAN_IN_GREEN_HOUSE = 43,
    BAZAAR = 44,
    KOKIRI_SHOP = 45,
    GORON_SHOP = 46,
    ZORA_SHOP = 47,
    KAKARIKO_POTION_SHOP = 48,
    MARKET_POTION_SHOP = 49,
    BOMBCHU_SHOP = 50,
    HAPPY_MASK_SHOP = 51,
    LINKS_HOUSE = 52,
    BACK_ALLEY_DOG_LADY_HOUSE = 53,
    STABLE = 54,
    IMPAS_HOUSE = 55,
    LAKESIDE_LABORATORY = 56,
    CARPENTERS_TENT = 57,
    GRAVEKEEPERS_HUT = 58,
    GREAT_FAIRYS_FOUNTAIN_UPGRADES = 59,
    FAIRYS_FOUNTAIN = 60,
    GREAT_FAIRYS_FOUNTAIN_SPELLS = 61,
    GROTTOS = 62,
    GRAVE_REDEAD = 63,
    GRAVE_FAIRYS_FOUNTAIN = 64,
    ROYAL_FAMILY_TOMB = 65,
    SHOOTING_GALLERY = 66,
    TEMPLE_OF_TIME = 67,
    CHAMBER_OF_THE_SAGES = 68,
    CASTLE_HEDGE_MAZE_DAY = 69,
    CASTLE_HEDGE_MAZE_NIGHT = 70,
    CUTSCENE_MAP = 71,
    WINDMILL = 72,
    FISHING_POND = 73,
    CASTLE_COURTYARD = 74,
    BUMBCHU_BOWLING = 75,
    RANCH_HOUSE = 76,
    GUARD_HOUSE = 77,
    GRANNYS_POTION_SHOP = 78,
    GANON_BATTLE_ARENA = 79,
    HOUSE_OF_SKULLTULA = 80,
    HYRULE_FIELD = 81,
    KAKARIKO_VILLAGE = 82,
    GRAVEYARD = 83,
    ZORAS_RIVER = 84,
    KOKIRI_FOREST = 85,
    SACRED_FOREST_MEADOW = 86,
    LAKE_HYLIA = 87,
    ZORAS_DOMAIN = 88,
    ZORAS_FOUNTAIN = 89,
    GERUDO_VALLEY = 90,
    LOST_WOODS = 91,
    DESERT_COLOSSUS = 92,
    GERUDOS_FORTRESS = 93,
    HAUNTED_WASTELAND = 94,
    HYRULE_CASTLE = 95,
    DEATH_MOUNTAIN_TRAIL = 96,
    DEATH_MOUNTAIN_CRATER = 97,
    GORON_CITY = 98,
    LON_LON_RANCH = 99,
    GANONS_CASTLE_EXTERIOR = 100
}
export interface ISceneInfo {
}
export declare const enum Tunic {
    KOKIRI = 0,
    GORON = 1,
    ZORA = 2
}
export declare const enum Sword {
    NONE = 0,
    KOKIRI = 1,
    MASTER = 2,
    BIGGORON = 3
}
export declare const enum Shield {
    NONE = 0,
    DEKU = 1,
    HYLIAN = 2,
    MIRROR = 3
}
export declare const enum Boots {
    KOKIRI = 0,
    IRON = 1,
    HOVER = 2
}
export declare const enum Mask {
    NONE = 0,
    KEATON = 1,
    SKULL = 2,
    SPOOKY = 3,
    BUNNY = 4
}
export declare const enum Magic {
    NONE = 0,
    NORMAL = 1,
    EXTENDED = 2
}
export declare const enum MagicQuantities {
    NONE = 0,
    NORMAL = 48,
    EXTENDED = 96
}
export declare const enum InventoryItem {
    DEKU_STICK = 0,
    DEKU_NUT = 1,
    BOMB = 2,
    FAIRY_BOW = 3,
    FIRE_ARROW = 4,
    DINS_FIRE = 5,
    FAIRY_SLINGSHOT = 6,
    FAIRY_OCARINA = 7,
    OCARINA_OF_TIME = 8,
    BOMBCHU = 9,
    HOOKSHOT = 10,
    LONGSHOT = 11,
    ICE_ARROW = 12,
    FARORES_WIND = 13,
    BOOMERANG = 14,
    LENS_OF_TRUTH = 15,
    MAGIC_BEAN = 16,
    MEGATON_HAMMER = 17,
    LIGHT_ARROW = 18,
    NAYRUS_LOVE = 19,
    EMPTY_BOTTLE = 20,
    RED_POTION = 21,
    GREEN_POTION = 22,
    BLUE_POTION = 23,
    BOTTLED_FAIRY = 24,
    BOTTLED_FISH = 25,
    LON_LON_MILK = 26,
    RUTOS_LETTER = 27,
    BLUE_FIRE = 28,
    BOTTLED_BUGS = 29,
    BOTTLED_BIG_POE = 30,
    LON_LON_MILK_HALF = 31,
    BOTTLED_POE = 32,
    WEIRD_EGG = 33,
    CHILD_CUCCO = 34,
    ZELDAS_LETTER = 35,
    KEATON_MASK = 36,
    SKULL_MASK = 37,
    SPOOKY_MASK = 38,
    BUNNY_HOOD = 39,
    GORON_MASK = 40,
    ZORA_MASK = 41,
    GERUDO_MASK = 42,
    MASK_OF_TRUTH = 43,
    SOLD_OUT = 44,
    POCKET_EGG = 45,
    POCKET_CUCCO = 46,
    COJIRO = 47,
    ODD_MUSHROOM = 48,
    ODD_POTION = 49,
    POACHERS_SAW = 50,
    BROKEN_GORON_SWORD = 51,
    PRESCRIPTION = 52,
    EYEBALL_FROG = 53,
    EYE_DROPS = 54,
    CLAIM_CHECK = 55,
    BOW_FIRE_ARROWS = 56,
    BOW_ICE_ARROWS = 57,
    BOW_LIGHT_ARROWS = 58,
    NONE = 255
}
export declare const enum Ocarina {
    NONE = 0,
    FAIRY_OCARINA = 1,
    OCARINA_OF_TIME = 2
}
export declare const enum Hookshot {
    NONE = 0,
    HOOKSHOT = 1,
    LONGSHOT = 2
}
export declare const enum Strength {
    NONE = 0,
    GORON_BRACELET = 1,
    SILVER_GAUNTLETS = 2,
    GOLDEN_GAUNTLETS = 3,
    BLACK_GAUNTLETS = 4,
    GREEN_GAUNTLETS = 5,
    BLUE_GAUNTLETS = 6
}
export declare const enum Wallet {
    CHILD = 0,
    ADULT = 1,
    GIANT = 2,
    TYCOON = 3
}
export declare const enum ZoraScale {
    NONE = 0,
    SILVER = 1,
    GOLDEN = 2
}
export declare const enum AmmoUpgrade {
    NONE = 0,
    BASE = 1,
    UPGRADED = 2,
    MAX = 3
}
export declare const enum Age {
    ADULT = 0,
    CHILD = 1
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
}
export declare enum OotEvents {
    ON_SAVE_LOADED = "onSaveLoaded",
    ON_SCENE_CHANGE = "onSceneChange",
    ON_LOADING_ZONE = "onLoadingZone",
    ON_ACTOR_SPAWN = "onActorSpawn",
    ON_ACTOR_DESPAWN = "onActorDespawn",
    ON_ROOM_CHANGE = "onRoomChange",
    ON_ROOM_CHANGE_PRE = "onPreRoomChange",
    ON_AGE_CHANGE = "onAgeChange"
}
export interface IActorManager {
    createIActorFromPointer(pointer: number): IActor;
}
export declare const NO_KEYS = 255;
export declare const enum VANILLA_KEY_INDEXES {
    FOREST_TEMPLE = 3,
    FIRE_TEMPLE = 4,
    WATER_TEMPLE = 5,
    SPIRIT_TEMPLE = 6,
    SHADOW_TEMPLE = 7,
    BOTTOM_OF_THE_WELL = 8,
    GERUDO_TRAINING_GROUND = 11,
    GERUDO_FORTRESS = 12,
    GANONS_CASTLE = 13,
    TREASURE_CHEST_SHOP = 16
}
export declare const enum VANILLA_DUNGEON_ITEM_INDEXES {
    DEKU_TREE = 0,
    DODONGOS_CAVERN = 1,
    JABJ_JABUS_BELLY = 2,
    FOREST_TEMPLE = 3,
    FIRE_TEMPLE = 4,
    WATER_TEMPLE = 5,
    SPIRIT_TEMPLE = 6,
    SHADOW_TEMPLE = 7,
    BOTTOM_OF_THE_WELL = 8,
    ICE_CAVERN = 9,
    GANONS_CASTLE = 10
}
export interface IKeyManager {
    getKeyCountForIndex(index: number): number;
    setKeyCountByIndex(index: number, count: number): void;
    getRawKeyBuffer(): Buffer;
}
export declare const enum InventorySlots {
    DEKU_STICKS = 0,
    DEKU_NUTS = 1,
    BOMBS = 2,
    FAIRY_BOW = 3,
    FIRE_ARROWS = 4,
    DINS_FIRE = 5,
    FAIRY_SLINGSHOT = 6,
    OCARINA = 7,
    BOMBCHUS = 8,
    HOOKSHOT = 9,
    ICE_ARROWS = 10,
    FARORES_WIND = 11,
    BOOMERANG = 12,
    LENS_OF_TRUTH = 13,
    MAGIC_BEANS = 14,
    MEGATON_HAMMER = 15,
    LIGHT_ARROWS = 16,
    NAYRUS_LOVE = 17,
    BOTTLE1 = 18,
    BOTTLE2 = 19,
    BOTTLE3 = 20,
    BOTTLE4 = 21,
    ADULT_TRADE_ITEM = 22,
    CHILD_TRADE_ITEM = 23
}
export declare function UpgradeCountLookup(item: InventoryItem, level: AmmoUpgrade): number;
