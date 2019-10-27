export const enum GameVersion {
  JP_1_0,
  PAL_1_0,
  USA_1_0,
}

export const enum AddressType {
  SHARED_COLLECTABLES = 'DK64:shared_collectables',
  MENU_FLAGS = 'DK64:menu_flags',

  ER_COPY_BASE = 'DK64:er_copy_base',
  ER_FILE_MAP = 'DK64:er_file_map',

  // Player Data
  CHARACTER = 'DK64:character',
  KONG_BASE = 'DK64:kong_base',
  PLYR_PTR = 'DK64:plyr_ptr',

  // Runtime Data
  RT_ACTOR_ARRAY_PTR = 'DK64:rt_actor_array_ptr',
  RT_ACTOR_COUNT_PTR = 'Dk64:rt_actor_count_ptr',
  RT_VOXEL_ARRAY_PTR = 'DK64:rt_voxel_array_ptr',
  RT_VOXEL_COUNT_PTR = 'DK64:rt_voxel_count_ptr',
  RT_CUR_PROFILE = 'DK64:rt_current_profile',
  RT_GAME_MODE = 'DK64:rt_game_mode',
  RT_CUR_MAP = 'DK64:rt_cur_map',
  RT_CUR_EXIT = 'DK64:rt_cur_exit',
  RT_PARENT_MAP = 'DK64:rt_parent_map',
  RT_PARENT_EXIT = 'DK64:rt_parent_exit',
  RT_DEST_MAP = 'DK64:rt_dest_map',
  RT_DEST_EXIT = 'DK64:rt_dest_exit',
  RT_MAP_STATE = 'DK64:rt_map_state',
  RT_CUR_CUTSCENE = 'DK64:rt_cur_cutscene',
  RT_CUR_CUTSCENE_TYPE = 'DK64:rt_cur_cutscene_type',
  RT_CUR_CUTSCENE_TYPE_MAP = 'DK64:rt_cur_cutscene_type_map',
  RT_CUR_CUTSCENE_TYPE_KONG = 'DK64:rt_cur_cutscene_type_kong',
  RT_NUMBER_OF_CUTSCENES = 'DK64:rt_number_of_cutscenes',
  RT_CUTSCENE_ACTIVE = 'DK64:rt_cutscene_active',
  RT_CUTSCENE_TIMER = 'DK64:rt_cutscene_timer',
  RT_CUTSCENE_TO_PLAY_NEXT_MAP = 'DK64:rt_cutscene_to_play_next_map',
  RT_CUTSCENE_WILL_PLAY_NEXT_MAP = 'DK64:rt_cutscene_will_play_next_map',
}

export enum GameModeType {
  NINTENDO_LOGO = 0,
  OPENING_CUTSCENE = 1,
  DK_RAP = 2,
  DK_TV = 3,
  UNKNOWN_4 = 4,
  MAIN_MENU = 5,
  ADVENTURE = 6,
  QUIT_GAME = 7,
  UNKNOWN_8 = 8,
  GAME_OVER = 9,
  END_SEQUENCE = 10,
  DK_THEATRE = 11,
  MYSTERY_MENU_MINIGAME = 12,
  SNIDES_BONUS_GAME = 13,
  END_SEQUENCE_DK_THEATRE = 14,
}

export enum MapType {
  TEST_MAP = 0,
  FUNKYS_STORE = 1,
  DK_ARCADE = 2,
  CRANKYS_LAB = 5,
  JUNGLE_JAPES = 7,
  HIDEOUT_HELM = 17,
  FRANTIC_FACTORY = 26,
  GLOOMY_GALLEON = 30,
  DK_ISLES = 34,
  ANGRY_AZTEC = 38,
  NINTENDO_LOGO = 40,
  TROFF_N_SCOFF = 42,
  FUNGI_FOREST = 48,
  CRYSTAL_CAVES = 72,
  DK_RAP = 76,
  MAIN_MENU = 80,
  TITLE_SCREEN = 81,
  CREEPY_CASTLE = 87,
}

export enum ActorType {
  DK = 0x0002, // 2
  DIDDY = 0x0003, // 3
  LANKY = 0x0004, // 4
  TINY = 0x0005, // 5
  CHUNKY = 0x0006, // 6
  KRUSHA = 0x0007, // 7
  RAMBI = 0x0008, // 8
  ENGUARDE = 0x0009, // 9
  BONUS_BARREL = 0x001c, // 28
  BOSS_KEY = 0x0048, // 72
  BP_DIDDY = 0x004b, // 75
  BP_CHUNKY = 0x004c, // 76
  BP_LANKY = 0x004d, // 77
  BP_DK = 0x004e, // 78
  BP_TINY = 0x004f, // 79
  BALLOON_DIDDY = 0x005b, // 91
  BALLOON_CHUNKY = 0x006f, // 111
  BALLOON_TINY = 0x0070, // 112
  BALLOON_LANKY = 0x0071, // 113
  BALLOON_DK = 0x0072, // 114
  RAINBOW_COIN_PATCH = 0x008b, // 139
  RAINBOW_COIN = 0x008c, // 140
}

// CB = Colored Banana, BC = Banana Coin, WD = Wrinkly Door, SSS = Simian Slam Switch
/// BBP = Baboon Blast Pad, BP = Blue Print, WP = Warp Pad
export enum VoxelType {
  SINGLE_CB_DIDDY = 0x0a, // 10
  SINGLE_CB_DK = 0x0d, // 13
  SINGLE_CB_TINY = 0x16, // 22
  BC_TINY = 0x1c, // 28
  BC_DK = 0x1d, // 29
  SINGLE_CB_LANKY = 0x1e, // 30
  SINGLE_CB_CHUNKY = 0x1f, // 31
  BC_LANKY = 0x23, // 35
  BC_DIDDY = 0x24, // 36
  BC_CHUNKY = 0x27, // 39
  BUNCH_CB_DK = 0x2b, // 43
  WD_TINY = 0x67, // 103
  FACTORY_BREAKABLE_MG = 0x72, // 114
  GOLDEN_BANANA = 0x74, // 116
  JAPES_BREAKABLE_HUT = 0x81, // 129
  GREEN_SSS_CHUNKY = 0x92, // 146
  GREEN_SSS_DIDDY = 0x93, // 147
  GREEN_SSS_DK = 0x94, // 148
  GREEN_SSS_LANKY = 0x95, // 149
  GREEN_SSS_TINY = 0x96, // 150
  BBP = 0x97, // 151
  RAINBOW_COIN = 0xb7, // 183
  BP_TINY = 0xdd, // 221
  BP_DK = 0xde, // 222
  BP_CHUNKY = 0xdf, // 223
  BP_DIDDY = 0xe0, // 224
  BP_LANKY = 0xe1, // 225
  DK_COIN = 0xec, // 236
  WD_LANKY = 0xef, // 239
  WD_DK = 0xf0, // 240
  WD_CHUNKY = 0xf1, // 241
  WD_DIDDY = 0xf2, // 242
  GG_BREAKABLE_GATE = 0x105, // 261
  PINEAPPLE_SWITCH = 0x125, // 293
  PEANUT_SWITCH = 0x126, // 294
  FEATHER_SWITCH = 0x127, // 295
  GRAPE_SWITCH = 0x128, // 296
  COCONUT_SWITCH = 0x129, // 297
  BOSS_KEY = 0x13c, // 316
  RED_SSS_CHUNKY = 0x165, // 357
  RED_SSS_DIDDY = 0x166, // 358
  RED_SSS_DK = 0x167, // 359
  RED_SSS_LANKY = 0x168, // 360
  RED_SSS_TINY = 0x169, // 361
  BLUE_SSS_CHUNKY = 0x16a, // 362
  BLUE_SSS_DIDDY = 0x16b, // 363
  BLUE_SSS_DK = 0x16c, // 364
  BLUE_SSS_LANKY = 0x16d, // 365
  BLUE_SSS_TINY = 0x16e, // 366
  FUNGI_BREAKABLE_DOOR = 0x17d, // 381
  BUNCH_CB_LANKY = 0x205, // 517
  BUNCH_CB_CHUNKY = 0x206, // 518
  BUNCH_CB_TINY = 0x207, // 519
  BUNCH_CB_DIDDY = 0x208, // 520
  WP_5 = 0x210, // 528
  WP_4 = 0x211, // 529
  WP_3 = 0x212, // 530
  WP_2 = 0x213, // 531
  WP_1 = 0x214, // 532
  RAREWARE_GB = 0x288, // 648
}

export enum KongType {
  DK = 0,
  DIDDY = 1,
  LANKY = 2,
  TINY = 3,
  CHUNKY = 4,
  KRUSHA = 5,
}

export enum KongDataType {
  MOVES = 0,
  SIM_SLAM = 1,
  WEAPON = 2,
  AMMO_BELT = 3,
  INSTRUMENT = 4,
  COINS = 6,
  LIVES = 8,
  CB_BASE = 10,
}

export enum ProfileType {
  A = 0,
  B = 1,
  C = 2,
}

export enum InventoryType {
  STANDARD_AMMO = 0,
  HOMING_AMMO = 2,
  ORANGES = 4,
  CRYSTALS = 6,
  FILM = 8,
  HEALTH = 11,
  MELONS = 12,
}
