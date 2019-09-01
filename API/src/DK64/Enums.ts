export const enum GameVersion {
  JP_1_0,
  PAL_1_0,
  USA_1_0,
}

export const enum AddressType {
  RT_CUR_PROFILE = 'DK64:rt_current_profile',
  RT_GAME_MODE = 'DK64:rt_game_mode',

  SAVE_GAME_FLAGS = 'DK64:save_game_flags',
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

export enum ProfileType {
  A = 0,
  B = 1,
  C = 2,
}
