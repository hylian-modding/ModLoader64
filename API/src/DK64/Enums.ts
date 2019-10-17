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

  CHARACTER = 'DK64:character',
  KONG_BASE = 'DK64:kong_base',

  RT_CUR_PROFILE = 'DK64:rt_current_profile',
  RT_GAME_MODE = 'DK64:rt_game_mode',
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
