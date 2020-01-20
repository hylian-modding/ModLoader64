"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationType;
(function (AnimationType) {
    AnimationType[AnimationType["UNKNOWN"] = 0] = "UNKNOWN";
    AnimationType[AnimationType["BANJO_DUCKING"] = 1] = "BANJO_DUCKING";
    AnimationType[AnimationType["BANJO_WALKING_SLOW"] = 2] = "BANJO_WALKING_SLOW";
    AnimationType[AnimationType["BANJO_WALKING"] = 3] = "BANJO_WALKING";
    // 0x0004 X
    AnimationType[AnimationType["BANJO_PUNCHING"] = 5] = "BANJO_PUNCHING";
    // 0x0006 X
    AnimationType[AnimationType["BANJO_TALON_TROT_END"] = 7] = "BANJO_TALON_TROT_END";
    AnimationType[AnimationType["BANJO_JUMPING"] = 8] = "BANJO_JUMPING";
    AnimationType[AnimationType["BANJO_DYING"] = 9] = "BANJO_DYING";
    AnimationType[AnimationType["BANJO_CLIMBING"] = 10] = "BANJO_CLIMBING";
    // 0x000B
    AnimationType[AnimationType["BANJO_RUNNING"] = 12] = "BANJO_RUNNING";
    // 0x000D
    AnimationType[AnimationType["BANJO_SKIDDING"] = 14] = "BANJO_SKIDDING";
    AnimationType[AnimationType["BANJO_HURT"] = 15] = "BANJO_HURT";
    AnimationType[AnimationType["BIGBUTT_CHARGING"] = 16] = "BIGBUTT_CHARGING";
    AnimationType[AnimationType["BANJO_WONDERWING_RUNNING"] = 17] = "BANJO_WONDERWING_RUNNING";
    // 0x0012 X
    // 0x0013 X
    // 0x0014 X
    AnimationType[AnimationType["BANJO_TALON_TROT_WALKING"] = 21] = "BANJO_TALON_TROT_WALKING";
    AnimationType[AnimationType["BANJO_TALON_TROT_START"] = 22] = "BANJO_TALON_TROT_START";
    AnimationType[AnimationType["BANJO_FLUTTER"] = 23] = "BANJO_FLUTTER";
    AnimationType[AnimationType["BANJO_FEATHERY_FLAP"] = 24] = "BANJO_FEATHERY_FLAP";
    AnimationType[AnimationType["BANJO_RATATAT_RAP"] = 25] = "BANJO_RATATAT_RAP";
    AnimationType[AnimationType["BANJO_RATATAT_RAP_START"] = 26] = "BANJO_RATATAT_RAP_START";
    AnimationType[AnimationType["BANJO_WONDERWING_JUMPING"] = 27] = "BANJO_WONDERWING_JUMPING";
    AnimationType[AnimationType["BANJO_BEAK_BARGE"] = 28] = "BANJO_BEAK_BARGE";
    AnimationType[AnimationType["BANJO_BEAK_BUSTER"] = 29] = "BANJO_BEAK_BUSTER";
    // 0x001E X
    // 0x001F X
    // 0x0020 X
    AnimationType[AnimationType["BIGBUTT_SKIDDING"] = 33] = "BIGBUTT_SKIDDING";
    AnimationType[AnimationType["BANJO_WONDERWING_START"] = 34] = "BANJO_WONDERWING_START";
    AnimationType[AnimationType["BANJO_WONDERWING"] = 35] = "BANJO_WONDERWING";
    AnimationType[AnimationType["YUMYUM_HOPPING"] = 36] = "YUMYUM_HOPPING";
    // 0x0025 X
    AnimationType[AnimationType["BANJO_TALON_TROT"] = 38] = "BANJO_TALON_TROT";
    AnimationType[AnimationType["BANJO_TALON_TROT_JUMPING"] = 39] = "BANJO_TALON_TROT_JUMPING";
    AnimationType[AnimationType["TERMITE_HURT"] = 40] = "TERMITE_HURT";
    AnimationType[AnimationType["TERMITE_DYING"] = 41] = "TERMITE_DYING";
    AnimationType[AnimationType["BANJO_SHOOTING_EGG"] = 42] = "BANJO_SHOOTING_EGG";
    AnimationType[AnimationType["BANJO_POOPING_EGG"] = 43] = "BANJO_POOPING_EGG";
    AnimationType[AnimationType["SNIPPET_WALKING"] = 44] = "SNIPPET_WALKING";
    AnimationType[AnimationType["JINJO_IDLE"] = 45] = "JINJO_IDLE";
    AnimationType[AnimationType["BANJO_JIGGY_JIG"] = 46] = "BANJO_JIGGY_JIG";
    AnimationType[AnimationType["JINJO_HELP"] = 47] = "JINJO_HELP";
    AnimationType[AnimationType["HELD_JIGGY_JIGGY_JIG"] = 48] = "HELD_JIGGY_JIGGY_JIG";
    AnimationType[AnimationType["JINJO_HOPPING"] = 49] = "JINJO_HOPPING";
    AnimationType[AnimationType["BIGBUTT_ATTACKING"] = 50] = "BIGBUTT_ATTACKING";
    AnimationType[AnimationType["BIGBUTT_EATING"] = 51] = "BIGBUTT_EATING";
    AnimationType[AnimationType["BIGBUTT_DYING"] = 52] = "BIGBUTT_DYING";
    AnimationType[AnimationType["BIGBUTT_ALERTED"] = 53] = "BIGBUTT_ALERTED";
    AnimationType[AnimationType["BIGBUTT_WALKING"] = 54] = "BIGBUTT_WALKING";
    // 0037
    AnimationType[AnimationType["BANJO_FLYING"] = 56] = "BANJO_FLYING";
    AnimationType[AnimationType["BANJO_SWIMMING_SURFACE"] = 57] = "BANJO_SWIMMING_SURFACE";
    // 003A X
    // 003B X
    AnimationType[AnimationType["BANJO_DIVING"] = 60] = "BANJO_DIVING";
    AnimationType[AnimationType["BANJO_SHOCK_SPRING_JUMP_1"] = 61] = "BANJO_SHOCK_SPRING_JUMP_1";
    AnimationType[AnimationType["BANJO_FLYING_CRASH"] = 62] = "BANJO_FLYING_CRASH";
    AnimationType[AnimationType["BANJO_SWIMMING_UNDERWATER_B"] = 63] = "BANJO_SWIMMING_UNDERWATER_B";
    AnimationType[AnimationType["BANJO_WADING_BOOTS_START"] = 64] = "BANJO_WADING_BOOTS_START";
    AnimationType[AnimationType["BANJO_WADING_BOOTS"] = 65] = "BANJO_WADING_BOOTS";
    AnimationType[AnimationType["BANJO_WADING_BOOTS_WALKING"] = 66] = "BANJO_WADING_BOOTS_WALKING";
    AnimationType[AnimationType["BANJO_BEAKBOMB_START"] = 67] = "BANJO_BEAKBOMB_START";
    AnimationType[AnimationType["BANJO_TURBO_TALON_TRAINERS"] = 68] = "BANJO_TURBO_TALON_TRAINERS";
    AnimationType[AnimationType["BANJO_FLYING_START"] = 69] = "BANJO_FLYING_START";
    // 0046 X
    AnimationType[AnimationType["BANJO_BEAKBOMB"] = 71] = "BANJO_BEAKBOMB";
    AnimationType[AnimationType["BANJO_SHOCK_SPRING_JUMP_START"] = 72] = "BANJO_SHOCK_SPRING_JUMP_START";
    AnimationType[AnimationType["BANJO_SHOCK_SPRING_JUMP_2"] = 73] = "BANJO_SHOCK_SPRING_JUMP_2";
    // 004A X
    AnimationType[AnimationType["BANJO_FLAP_FLIP"] = 75] = "BANJO_FLAP_FLIP";
    AnimationType[AnimationType["BANJO_FLAP_FLIP_TRANSISTION"] = 76] = "BANJO_FLAP_FLIP_TRANSISTION";
    AnimationType[AnimationType["BANJO_HURT_2"] = 77] = "BANJO_HURT_2";
    AnimationType[AnimationType["MM_MUDHUT_SMASHING"] = 78] = "MM_MUDHUT_SMASHING";
    AnimationType[AnimationType["BANJO_WATER_SPLASH"] = 79] = "BANJO_WATER_SPLASH";
    // 0050 X
    AnimationType[AnimationType["CONGA_IDLE"] = 81] = "CONGA_IDLE";
    AnimationType[AnimationType["CONGA_HURT"] = 82] = "CONGA_HURT";
    AnimationType[AnimationType["CONGA_DEFEATED"] = 83] = "CONGA_DEFEATED";
    AnimationType[AnimationType["CONGA_THROWING"] = 84] = "CONGA_THROWING";
    AnimationType[AnimationType["CONGA_BEATING_CHEST"] = 85] = "CONGA_BEATING_CHEST";
    AnimationType[AnimationType["CONGA_RAISING_ARMS"] = 86] = "CONGA_RAISING_ARMS";
    AnimationType[AnimationType["BANJO_SWIMMING_UNDERWATER"] = 87] = "BANJO_SWIMMING_UNDERWATER";
    AnimationType[AnimationType["BANJO_SWIMMING_UNDERWATER_A"] = 88] = "BANJO_SWIMMING_UNDERWATER_A";
    AnimationType[AnimationType["BANJO_SLIDING_BACK"] = 89] = "BANJO_SLIDING_BACK";
    AnimationType[AnimationType["BANJO_SLIDING_FRONT"] = 90] = "BANJO_SLIDING_FRONT";
    AnimationType[AnimationType["CHIMPY_HOPPING"] = 91] = "CHIMPY_HOPPING";
    AnimationType[AnimationType["CHIMPY_IDLE"] = 92] = "CHIMPY_IDLE";
    AnimationType[AnimationType["CHIMPY_WALKING"] = 93] = "CHIMPY_WALKING";
    AnimationType[AnimationType["TICKER_IDLE"] = 94] = "TICKER_IDLE";
    AnimationType[AnimationType["TICKER_WALKING"] = 95] = "TICKER_WALKING";
    AnimationType[AnimationType["TERMITE_JUMPING"] = 96] = "TERMITE_JUMPING";
    AnimationType[AnimationType["BANJO_FLAP_FLIP_END"] = 97] = "BANJO_FLAP_FLIP_END";
    AnimationType[AnimationType["GRUBLIN_IDLE"] = 98] = "GRUBLIN_IDLE";
    AnimationType[AnimationType["GRUBLIN_WALKING"] = 99] = "GRUBLIN_WALKING";
    AnimationType[AnimationType["GRUBLIN_JUMPING"] = 100] = "GRUBLIN_JUMPING";
    AnimationType[AnimationType["BEEHIVE_DYING"] = 101] = "BEEHIVE_DYING";
    AnimationType[AnimationType["BANJO_TALON_TROT_HURT"] = 102] = "BANJO_TALON_TROT_HURT";
    AnimationType[AnimationType["WADING_BOOTS_IDLE"] = 103] = "WADING_BOOTS_IDLE";
    AnimationType[AnimationType["BANJO_FALLING"] = 104] = "BANJO_FALLING";
    AnimationType[AnimationType["BANJO_ON_TUMBLAR"] = 105] = "BANJO_ON_TUMBLAR";
    AnimationType[AnimationType["MUMBO_SLEEPING"] = 106] = "MUMBO_SLEEPING";
    AnimationType[AnimationType["MUMBO_WALKING"] = 107] = "MUMBO_WALKING";
    AnimationType[AnimationType["MUMBO_IDLE"] = 108] = "MUMBO_IDLE";
    AnimationType[AnimationType["MUMBO_TRANSFORMING"] = 109] = "MUMBO_TRANSFORMING";
    AnimationType[AnimationType["MUMBO_UNKNOWN_6E"] = 110] = "MUMBO_UNKNOWN_6E";
    AnimationType[AnimationType["BANJO_IDLE"] = 111] = "BANJO_IDLE";
    AnimationType[AnimationType["BANJO_SWIMMING_UNDERWATER_2"] = 112] = "BANJO_SWIMMING_UNDERWATER_2";
    AnimationType[AnimationType["BANJO_SWIMMING_SLOW"] = 113] = "BANJO_SWIMMING_SLOW";
    AnimationType[AnimationType["BANJO_CARRYING_ITEM"] = 114] = "BANJO_CARRYING_ITEM";
    AnimationType[AnimationType["BANJO_CARRYING_ITEM_WALKING"] = 115] = "BANJO_CARRYING_ITEM_WALKING";
    // 0074 X
    // 0075 X
    // 0076
    AnimationType[AnimationType["BANJO_LOSING_MINIGAME"] = 119] = "BANJO_LOSING_MINIGAME";
    AnimationType[AnimationType["SNACKER_SWIMMING"] = 120] = "SNACKER_SWIMMING";
    AnimationType[AnimationType["CS_CONCERT_MUMBO_PLAYING"] = 121] = "CS_CONCERT_MUMBO_PLAYING";
    AnimationType[AnimationType["CS_CONCERT_BANJO_ANGRY"] = 122] = "CS_CONCERT_BANJO_ANGRY";
    AnimationType[AnimationType["CS_CONCERT_BANJO_PLAYING"] = 123] = "CS_CONCERT_BANJO_PLAYING";
    AnimationType[AnimationType["CS_CONCERT_BANJO_END"] = 124] = "CS_CONCERT_BANJO_END";
    AnimationType[AnimationType["CS_CONCERT_TOOTY_START"] = 125] = "CS_CONCERT_TOOTY_START";
    AnimationType[AnimationType["CS_CONCERT_BANJO_START"] = 126] = "CS_CONCERT_BANJO_START";
    AnimationType[AnimationType["CS_CONCERT_CUTSCENE"] = 127] = "CS_CONCERT_CUTSCENE";
    AnimationType[AnimationType["CS_CONCERT_TIMER"] = 128] = "CS_CONCERT_TIMER";
    AnimationType[AnimationType["CS_CONCERT_UNKNOWN_0x81"] = 129] = "CS_CONCERT_UNKNOWN_0x81";
    AnimationType[AnimationType["CS_CONCERT_MUMBO_DANCING"] = 130] = "CS_CONCERT_MUMBO_DANCING";
    AnimationType[AnimationType["CS_CONCERT_TOOTY_DANCING"] = 131] = "CS_CONCERT_TOOTY_DANCING";
    AnimationType[AnimationType["TOOTY_HOPPING"] = 132] = "TOOTY_HOPPING";
    // 0085
    // 0086 X
    // 0087 X
    // 0088 X
    // 0089 X
    // 008A X
    // 008B X
    AnimationType[AnimationType["RAREWARE_LOGO_FALLING"] = 140] = "RAREWARE_LOGO_FALLING";
    // 008D X
    // 008E X
    AnimationType[AnimationType["NINTENDO_CUBE_WALKING"] = 143] = "NINTENDO_CUBE_WALKING";
    AnimationType[AnimationType["NINTENDO_CUBE_SHRUGGING"] = 144] = "NINTENDO_CUBE_SHRUGGING";
    AnimationType[AnimationType["CS_CONCERT_FROG_HOPPING"] = 145] = "CS_CONCERT_FROG_HOPPING";
    AnimationType[AnimationType["SHRAPNEL_CHASING"] = 146] = "SHRAPNEL_CHASING";
    AnimationType[AnimationType["TOOTY_RUNNING"] = 147] = "TOOTY_RUNNING";
    AnimationType[AnimationType["GRUBLIN_DYING"] = 148] = "GRUBLIN_DYING";
    AnimationType[AnimationType["BANJO_IDLE_KAZOOIE_TAUNT"] = 149] = "BANJO_IDLE_KAZOOIE_TAUNT";
    AnimationType[AnimationType["SNIPPET_RECOVERING"] = 150] = "SNIPPET_RECOVERING";
    AnimationType[AnimationType["SNIPPET_DYING"] = 151] = "SNIPPET_DYING";
    // 0098
    // 0099
    AnimationType[AnimationType["RIPPER_IDLE"] = 154] = "RIPPER_IDLE";
    AnimationType[AnimationType["RIPPER_CHASING"] = 155] = "RIPPER_CHASING";
    // 009C X
    AnimationType[AnimationType["NIBBLY_CHASING"] = 157] = "NIBBLY_CHASING";
    AnimationType[AnimationType["TEEHEE_IDLE"] = 158] = "TEEHEE_IDLE";
    AnimationType[AnimationType["TEEHEE_ALERTED"] = 159] = "TEEHEE_ALERTED";
    AnimationType[AnimationType["PUMPKIN_WALKING"] = 160] = "PUMPKIN_WALKING";
    AnimationType[AnimationType["PUMPKIN_JUMPING"] = 161] = "PUMPKIN_JUMPING";
    AnimationType[AnimationType["CONGA_THROWING_2"] = 162] = "CONGA_THROWING_2";
    AnimationType[AnimationType["NAPPER_SLEEPING"] = 163] = "NAPPER_SLEEPING";
    AnimationType[AnimationType["NAPPER_LOOKING_AROUND"] = 164] = "NAPPER_LOOKING_AROUND";
    AnimationType[AnimationType["NAPPER_WALKING"] = 165] = "NAPPER_WALKING";
    AnimationType[AnimationType["NAPPER_ALERTED"] = 166] = "NAPPER_ALERTED";
    AnimationType[AnimationType["MOTZHAND_IDLE"] = 167] = "MOTZHAND_IDLE";
    AnimationType[AnimationType["MOTZHAND_PLAYING"] = 168] = "MOTZHAND_PLAYING";
    AnimationType[AnimationType["POT"] = 169] = "POT";
    AnimationType[AnimationType["YUMYUM_IDLE"] = 170] = "YUMYUM_IDLE";
    AnimationType[AnimationType["YUMYUM_EATING"] = 171] = "YUMYUM_EATING";
    AnimationType[AnimationType["TEEHEE_CHASING"] = 172] = "TEEHEE_CHASING";
    AnimationType[AnimationType["NIBBLY_FLYING_START"] = 173] = "NIBBLY_FLYING_START";
    AnimationType[AnimationType["NIBBLY_IDLE"] = 174] = "NIBBLY_IDLE";
    // 00AF X
    AnimationType[AnimationType["BANJO_FALLING_2"] = 176] = "BANJO_FALLING_2";
    AnimationType[AnimationType["BANJO_CLIMBING_2"] = 177] = "BANJO_CLIMBING_2";
    AnimationType[AnimationType["BANJO_CLIMBING_FREEZE"] = 178] = "BANJO_CLIMBING_FREEZE";
    AnimationType[AnimationType["CHOMPA_IDLE"] = 179] = "CHOMPA_IDLE";
    AnimationType[AnimationType["CHOMPA_ATTACKING"] = 180] = "CHOMPA_ATTACKING";
    AnimationType[AnimationType["BLUBBER_WALKING"] = 181] = "BLUBBER_WALKING";
    AnimationType[AnimationType["BLUBBER_CRYING"] = 182] = "BLUBBER_CRYING";
    AnimationType[AnimationType["BLUBBER_DANCING"] = 183] = "BLUBBER_DANCING";
    AnimationType[AnimationType["BLUBBER_RUNNING"] = 184] = "BLUBBER_RUNNING";
    AnimationType[AnimationType["BANJO_DROWNING"] = 185] = "BANJO_DROWNING";
    // 00BA X
    // 00BB X
    AnimationType[AnimationType["LOCKUP_IDLE"] = 188] = "LOCKUP_IDLE";
    AnimationType[AnimationType["NIPPER_VULNERABLE"] = 189] = "NIPPER_VULNERABLE";
    AnimationType[AnimationType["NIPPER_HURT"] = 190] = "NIPPER_HURT";
    AnimationType[AnimationType["NIPPER_ATTACKING"] = 191] = "NIPPER_ATTACKING";
    AnimationType[AnimationType["NIPPER_IDLE"] = 192] = "NIPPER_IDLE";
    // 00C1  Littlebounce
    // 00C2  Wobblybounce
    AnimationType[AnimationType["CLANKER_IDLE"] = 195] = "CLANKER_IDLE";
    AnimationType[AnimationType["CLANKER_MOUTH_OPEN"] = 196] = "CLANKER_MOUTH_OPEN";
    AnimationType[AnimationType["GRABBA_APPEARING"] = 197] = "GRABBA_APPEARING";
    AnimationType[AnimationType["GRABBA_HIDING"] = 198] = "GRABBA_HIDING";
    AnimationType[AnimationType["GRABBA_IDLE"] = 199] = "GRABBA_IDLE";
    AnimationType[AnimationType["GRABBA_DEFEATED"] = 200] = "GRABBA_DEFEATED";
    AnimationType[AnimationType["MAGIC_CARPET"] = 201] = "MAGIC_CARPET";
    AnimationType[AnimationType["GLOOP_SWIMMING"] = 202] = "GLOOP_SWIMMING";
    AnimationType[AnimationType["GLOOP_BLOWING_BUBBLE"] = 203] = "GLOOP_BLOWING_BUBBLE";
    AnimationType[AnimationType["BANJO_BEAKBOMB_END"] = 204] = "BANJO_BEAKBOMB_END";
    // 00CD Green Grate near RBB… (4B1)
    AnimationType[AnimationType["RUBEE_IDLE"] = 206] = "RUBEE_IDLE";
    AnimationType[AnimationType["HISTUP_RAISED"] = 207] = "HISTUP_RAISED";
    AnimationType[AnimationType["HISTUP_RAISING"] = 208] = "HISTUP_RAISING";
    AnimationType[AnimationType["HISTUP_IN_POT"] = 209] = "HISTUP_IN_POT";
    AnimationType[AnimationType["BANJO_GETTING_UP"] = 210] = "BANJO_GETTING_UP";
    AnimationType[AnimationType["BANJO_BEAKBOMB_HURT"] = 211] = "BANJO_BEAKBOMB_HURT";
    AnimationType[AnimationType["SWITCH_DOWN"] = 212] = "SWITCH_DOWN";
    AnimationType[AnimationType["SWITCH_UP"] = 213] = "SWITCH_UP";
    AnimationType[AnimationType["TURBO_TALON_TRAINERS_IDLE"] = 214] = "TURBO_TALON_TRAINERS_IDLE";
    // 00D7
    // 00D8
    AnimationType[AnimationType["GOBI_IDLE"] = 217] = "GOBI_IDLE";
    AnimationType[AnimationType["GOBI_PULLING_ON_CHAIN"] = 218] = "GOBI_PULLING_ON_CHAIN";
    AnimationType[AnimationType["FLIBBIT_HOPPING"] = 219] = "FLIBBIT_HOPPING";
    AnimationType[AnimationType["GOBIS_ROPE_PULLING"] = 220] = "GOBIS_ROPE_PULLING";
    AnimationType[AnimationType["GOBIS_ROPE_IDLE"] = 221] = "GOBIS_ROPE_IDLE";
    // 00DE X
    AnimationType[AnimationType["RUBEE_PETTING_TOOTS"] = 223] = "RUBEE_PETTING_TOOTS";
    AnimationType[AnimationType["CROC_WALKING"] = 224] = "CROC_WALKING";
    AnimationType[AnimationType["CROC_IDLE"] = 225] = "CROC_IDLE";
    AnimationType[AnimationType["HISTUP_PEEKING"] = 226] = "HISTUP_PEEKING";
    AnimationType[AnimationType["RUBEE_IDLE_2"] = 227] = "RUBEE_IDLE_2";
    AnimationType[AnimationType["RUBEE_PLAYING"] = 228] = "RUBEE_PLAYING";
    AnimationType[AnimationType["GRABBA_SHADOW_SPAWNING"] = 229] = "GRABBA_SHADOW_SPAWNING";
    AnimationType[AnimationType["GRABBA_SHADOW_IDLE"] = 230] = "GRABBA_SHADOW_IDLE";
    AnimationType[AnimationType["GRABBA_SHADOW_HIDING"] = 231] = "GRABBA_SHADOW_HIDING";
    AnimationType[AnimationType["GRABBA_SHADOW_DEFEATED"] = 232] = "GRABBA_SHADOW_DEFEATED";
    AnimationType[AnimationType["SLAPPA_APPEARING"] = 233] = "SLAPPA_APPEARING";
    AnimationType[AnimationType["SLAPPA_MOVING"] = 234] = "SLAPPA_MOVING";
    AnimationType[AnimationType["SLAPPA_SLAPPING"] = 235] = "SLAPPA_SLAPPING";
    AnimationType[AnimationType["SLAPPA_GETTING_UP"] = 236] = "SLAPPA_GETTING_UP";
    AnimationType[AnimationType["ANCIENT_ONE_ENTER_EXIT"] = 237] = "ANCIENT_ONE_ENTER_EXIT";
    AnimationType[AnimationType["SLAPPA_DYING"] = 238] = "SLAPPA_DYING";
    AnimationType[AnimationType["SLAPPA_HURT"] = 239] = "SLAPPA_HURT";
    AnimationType[AnimationType["MINIJINXY_EATING"] = 240] = "MINIJINXY_EATING";
    AnimationType[AnimationType["MAGIC_CARPET_2"] = 241] = "MAGIC_CARPET_2";
    // 00F2 X
    // 00F3 X
    AnimationType[AnimationType["GOBI_RELAXING"] = 244] = "GOBI_RELAXING";
    // 00F5
    AnimationType[AnimationType["BANJO_IDLE_PULLING_KAZOOIE"] = 246] = "BANJO_IDLE_PULLING_KAZOOIE";
    AnimationType[AnimationType["GOBI_HAPPY"] = 247] = "GOBI_HAPPY";
    AnimationType[AnimationType["GOBI_RUNNING"] = 248] = "GOBI_RUNNING";
    AnimationType[AnimationType["BUZZBOMB_FLYING"] = 249] = "BUZZBOMB_FLYING";
    AnimationType[AnimationType["FLIBBIT_IDLE"] = 250] = "FLIBBIT_IDLE";
    AnimationType[AnimationType["FLIBBIT_TURNING"] = 251] = "FLIBBIT_TURNING";
    AnimationType[AnimationType["GOBI_GIVING_WATER"] = 252] = "GOBI_GIVING_WATER";
    AnimationType[AnimationType["GOBI_GETTING_UP"] = 253] = "GOBI_GETTING_UP";
    AnimationType[AnimationType["TRUNKER_SHORT"] = 254] = "TRUNKER_SHORT";
    AnimationType[AnimationType["TRUNKER_GROWING"] = 255] = "TRUNKER_GROWING";
    // 0100
    AnimationType[AnimationType["TANKTUP_HEAD_IDLE"] = 257] = "TANKTUP_HEAD_IDLE";
    AnimationType[AnimationType["TANKTUP_HEAD_POUNDED"] = 258] = "TANKTUP_HEAD_POUNDED";
    AnimationType[AnimationType["TANKTUP_LEG_BACK_LEFT_HIT"] = 259] = "TANKTUP_LEG_BACK_LEFT_HIT";
    AnimationType[AnimationType["TANKTUP_LEG_FRONT_LEFT_HIT"] = 260] = "TANKTUP_LEG_FRONT_LEFT_HIT";
    AnimationType[AnimationType["TANKTUP_LEG_FRONT_RIGHT_HIT"] = 261] = "TANKTUP_LEG_FRONT_RIGHT_HIT";
    AnimationType[AnimationType["TANKTUP_LEG_BACK_RIGHT_HIT"] = 262] = "TANKTUP_LEG_BACK_RIGHT_HIT";
    AnimationType[AnimationType["TANKTUP_SPAWNING_JIGGY"] = 263] = "TANKTUP_SPAWNING_JIGGY";
    AnimationType[AnimationType["SIR_SLUSH_IDLE"] = 264] = "SIR_SLUSH_IDLE";
    AnimationType[AnimationType["SIR_SLUSH_ATTACKING"] = 265] = "SIR_SLUSH_ATTACKING";
    // 010A X
    // 010B
    AnimationType[AnimationType["BANJO_DUCKING_TURNING"] = 268] = "BANJO_DUCKING_TURNING";
    AnimationType[AnimationType["BANJO_FLYING_HIT"] = 269] = "BANJO_FLYING_HIT";
    AnimationType[AnimationType["BUZZBOMB_PREPARING_CHARGE"] = 270] = "BUZZBOMB_PREPARING_CHARGE";
    AnimationType[AnimationType["BUZZBOMB_CHARGING"] = 271] = "BUZZBOMB_CHARGING";
    AnimationType[AnimationType["BUZZBOMB_FALLING"] = 272] = "BUZZBOMB_FALLING";
    AnimationType[AnimationType["BUZZBOMB_DYING"] = 273] = "BUZZBOMB_DYING";
    AnimationType[AnimationType["FLIBBIT_DYING_START"] = 274] = "FLIBBIT_DYING_START";
    AnimationType[AnimationType["FLIBBIT_DYING_END"] = 275] = "FLIBBIT_DYING_END";
    // 0114 X
    // 0115 X
    AnimationType[AnimationType["BANJO_DUCKING_LOOKING"] = 278] = "BANJO_DUCKING_LOOKING";
    // 0117 Jellyfish (Unknown) 0x117
    // 0118 X
    // 0119 X
    // 011A X
    AnimationType[AnimationType["BANJO_CARRYING_ITEM_THROWING"] = 283] = "BANJO_CARRYING_ITEM_THROWING";
    AnimationType[AnimationType["CROC_JUMPING"] = 284] = "CROC_JUMPING";
    AnimationType[AnimationType["CROC_HURT"] = 285] = "CROC_HURT";
    AnimationType[AnimationType["CROC_DYING"] = 286] = "CROC_DYING";
    AnimationType[AnimationType["WALRUS_IDLE"] = 287] = "WALRUS_IDLE";
    AnimationType[AnimationType["WALRUS_WALKING"] = 288] = "WALRUS_WALKING";
    AnimationType[AnimationType["WALRUS_JUMPING"] = 289] = "WALRUS_JUMPING";
    AnimationType[AnimationType["CROC_BITING"] = 290] = "CROC_BITING";
    AnimationType[AnimationType["CROC_EAT_WRONG_THING"] = 291] = "CROC_EAT_WRONG_THING";
    AnimationType[AnimationType["MR_VILE_EATING"] = 292] = "MR_VILE_EATING";
    AnimationType[AnimationType["YUMBLIE_APPEARING"] = 293] = "YUMBLIE_APPEARING";
    AnimationType[AnimationType["YUMBLIE_LEAVING"] = 294] = "YUMBLIE_LEAVING";
    AnimationType[AnimationType["YUMBLIE_IDLE"] = 295] = "YUMBLIE_IDLE";
    AnimationType[AnimationType["GRUMBLIE_APPEARING"] = 296] = "GRUMBLIE_APPEARING";
    AnimationType[AnimationType["GRUMBLIE_LEAVING"] = 297] = "GRUMBLIE_LEAVING";
    AnimationType[AnimationType["GRUMBLIE_IDLE"] = 298] = "GRUMBLIE_IDLE";
    AnimationType[AnimationType["TIPTUP_LOOKING_AROUND_SHRUGGING"] = 299] = "TIPTUP_LOOKING_AROUND_SHRUGGING";
    AnimationType[AnimationType["TIPTUP_TAPPING"] = 300] = "TIPTUP_TAPPING";
    AnimationType[AnimationType["TIPTUP_CHOIR_MEMBER_IDLE"] = 301] = "TIPTUP_CHOIR_MEMBER_IDLE";
    AnimationType[AnimationType["TIPTUP_CHOIR_MEMBER_SINGING"] = 302] = "TIPTUP_CHOIR_MEMBER_SINGING";
    AnimationType[AnimationType["TIPTUP_CHOIR_MEMBER_HURT"] = 303] = "TIPTUP_CHOIR_MEMBER_HURT";
    AnimationType[AnimationType["JINJO_CIRCLING_START"] = 304] = "JINJO_CIRCLING_START";
    AnimationType[AnimationType["JINJO_CIRCLING_END"] = 305] = "JINJO_CIRCLING_END";
    AnimationType[AnimationType["FLOATSAM_BOUNCING"] = 306] = "FLOATSAM_BOUNCING";
    AnimationType[AnimationType["NIPPER_DYING"] = 307] = "NIPPER_DYING";
    // 0134
    // 0135
    // 0136
    AnimationType[AnimationType["GRIMLET_ATTACKING"] = 311] = "GRIMLET_ATTACKING";
    AnimationType[AnimationType["TEXT_BACKDROP_APPEARING"] = 312] = "TEXT_BACKDROP_APPEARING";
    AnimationType[AnimationType["BOTTLES_DISAPPEARING"] = 313] = "BOTTLES_DISAPPEARING";
    AnimationType[AnimationType["BOTTLES_APPEARING"] = 314] = "BOTTLES_APPEARING";
    AnimationType[AnimationType["BOTTLES_SCRATCHING"] = 315] = "BOTTLES_SCRATCHING";
    AnimationType[AnimationType["BOTTLES_MOLEHILL_IDLE_1"] = 316] = "BOTTLES_MOLEHILL_IDLE_1";
    AnimationType[AnimationType["BOTTLES_MOLEHILL_IDLE_2"] = 317] = "BOTTLES_MOLEHILL_IDLE_2";
    AnimationType[AnimationType["SNORKEL_SWIMMING"] = 318] = "SNORKEL_SWIMMING";
    AnimationType[AnimationType["SNORKEL_STUCK"] = 319] = "SNORKEL_STUCK";
    // 0140
    // 0141
    AnimationType[AnimationType["RBB_ANCHOR_IDLE"] = 321] = "RBB_ANCHOR_IDLE";
    AnimationType[AnimationType["RBB_ANCHOR_RISING"] = 322] = "RBB_ANCHOR_RISING";
    AnimationType[AnimationType["BUTTON"] = 323] = "BUTTON";
    AnimationType[AnimationType["JINXY_SNIFFING"] = 324] = "JINXY_SNIFFING";
    AnimationType[AnimationType["JINXY_SNEEZING"] = 325] = "JINXY_SNEEZING";
    AnimationType[AnimationType["BOSS_BOOMBOX_APPEARING"] = 326] = "BOSS_BOOMBOX_APPEARING";
    AnimationType[AnimationType["BOOMBOX_HOPPING"] = 327] = "BOOMBOX_HOPPING";
    AnimationType[AnimationType["BOOMBOX_EXPLODING"] = 328] = "BOOMBOX_EXPLODING";
    AnimationType[AnimationType["BANJO_FALL_DAMAGE"] = 329] = "BANJO_FALL_DAMAGE";
    AnimationType[AnimationType["BANJO_LISTENING"] = 330] = "BANJO_LISTENING";
    AnimationType[AnimationType["CROCTUS_IDLE"] = 331] = "CROCTUS_IDLE";
    AnimationType[AnimationType["BOGGY_IDLE"] = 332] = "BOGGY_IDLE";
    AnimationType[AnimationType["BOGGY_HIT"] = 333] = "BOGGY_HIT";
    AnimationType[AnimationType["BOGGY_LAYING_DOWN"] = 334] = "BOGGY_LAYING_DOWN";
    AnimationType[AnimationType["BOGGY_RUNNING"] = 335] = "BOGGY_RUNNING";
    AnimationType[AnimationType["BOGGY_ON_SLED_IDLE"] = 336] = "BOGGY_ON_SLED_IDLE";
    AnimationType[AnimationType["RACE_FLAG_HIT"] = 337] = "RACE_FLAG_HIT";
    AnimationType[AnimationType["RACE_FLAG_IDLE"] = 338] = "RACE_FLAG_IDLE";
    AnimationType[AnimationType["GOLD_CHEST_SPAWNING"] = 339] = "GOLD_CHEST_SPAWNING";
    AnimationType[AnimationType["SNACKER_EATING"] = 340] = "SNACKER_EATING";
    AnimationType[AnimationType["SNIPPET_GET_UP"] = 341] = "SNIPPET_GET_UP";
    AnimationType[AnimationType["MUTIE_SNIPPET_WALKING"] = 342] = "MUTIE_SNIPPET_WALKING";
    AnimationType[AnimationType["MUTIE_SNIPPET_UPSIDEDOWN_START"] = 343] = "MUTIE_SNIPPET_UPSIDEDOWN_START";
    AnimationType[AnimationType["MUTIE_SNIPPET_UPSIDEDOWN"] = 344] = "MUTIE_SNIPPET_UPSIDEDOWN";
    AnimationType[AnimationType["MUTIE_SNIPPET_UPSIDEDOWN_END"] = 345] = "MUTIE_SNIPPET_UPSIDEDOWN_END";
    AnimationType[AnimationType["GRILLE_CHOMPA_ATTACKING"] = 346] = "GRILLE_CHOMPA_ATTACKING";
    AnimationType[AnimationType["GRILLE_CHOMPA_DYING"] = 347] = "GRILLE_CHOMPA_DYING";
    AnimationType[AnimationType["WHIPLASH_IDLE"] = 348] = "WHIPLASH_IDLE";
    AnimationType[AnimationType["WHIPLASH_ATTACKING"] = 349] = "WHIPLASH_ATTACKING";
    // 015E
    AnimationType[AnimationType["CS_CONCERT_BANJO_OFF_SCREEN"] = 351] = "CS_CONCERT_BANJO_OFF_SCREEN";
    AnimationType[AnimationType["CS_CONCERT_BUG_CRAWLING"] = 352] = "CS_CONCERT_BUG_CRAWLING";
    // 0161
    AnimationType[AnimationType["TOOTS_IDLE"] = 354] = "TOOTS_IDLE";
    AnimationType[AnimationType["CS_CONCERT_BUZZBOMB_HITTING_LOGO"] = 355] = "CS_CONCERT_BUZZBOMB_HITTING_LOGO";
    // 0164
    AnimationType[AnimationType["BEEHIVE_IDLE"] = 357] = "BEEHIVE_IDLE";
    AnimationType[AnimationType["GOLD_CHEST_BOUNCING"] = 358] = "GOLD_CHEST_BOUNCING";
    // 0167 Banjo/MoveVeryLittle (used in small cutscenes)
    // 0168
    // 0169
    // 016A
    AnimationType[AnimationType["SNAREBEAR_SNAPPING"] = 363] = "SNAREBEAR_SNAPPING";
    AnimationType[AnimationType["SNAREBEAR_IDLE"] = 364] = "SNAREBEAR_IDLE";
    AnimationType[AnimationType["TWINKLY_BOX_OPENING"] = 365] = "TWINKLY_BOX_OPENING";
    AnimationType[AnimationType["MUMBO_RECLINING"] = 366] = "MUMBO_RECLINING";
    AnimationType[AnimationType["ZUBBA_FLYING"] = 367] = "ZUBBA_FLYING";
    AnimationType[AnimationType["ZUBBA_IDLE"] = 368] = "ZUBBA_IDLE";
    AnimationType[AnimationType["ZUBBA_FALLING"] = 369] = "ZUBBA_FALLING";
    AnimationType[AnimationType["ZUBBA_LANDING"] = 370] = "ZUBBA_LANDING";
    AnimationType[AnimationType["FLOWER_SPRING_GROWING"] = 371] = "FLOWER_SPRING_GROWING";
    AnimationType[AnimationType["FLOWER_SUMMER_GROWING"] = 372] = "FLOWER_SUMMER_GROWING";
    AnimationType[AnimationType["FLOWER_AUTUMN_GROWING"] = 373] = "FLOWER_AUTUMN_GROWING";
    AnimationType[AnimationType["GOBI_YAWNING"] = 374] = "GOBI_YAWNING";
    AnimationType[AnimationType["GOBI_SLEEPING"] = 375] = "GOBI_SLEEPING";
    AnimationType[AnimationType["TWINKLY_APPEARING"] = 376] = "TWINKLY_APPEARING";
    AnimationType[AnimationType["BOGGY_ON_SLED_TAUNTING"] = 377] = "BOGGY_ON_SLED_TAUNTING";
    AnimationType[AnimationType["BOGGY_ON_SLED_LOOKING_BACK"] = 378] = "BOGGY_ON_SLED_LOOKING_BACK";
    // 017B
    AnimationType[AnimationType["TWINKLY_TWINKLING"] = 380] = "TWINKLY_TWINKLING";
    AnimationType[AnimationType["BOOGYS_CHILDREN_HAPPY"] = 381] = "BOOGYS_CHILDREN_HAPPY";
    AnimationType[AnimationType["BOOGYS_CHILDREN_SAD"] = 382] = "BOOGYS_CHILDREN_SAD";
    AnimationType[AnimationType["MUMBO_SWEEPING"] = 383] = "MUMBO_SWEEPING";
    AnimationType[AnimationType["MUMBO_ROTATION"] = 384] = "MUMBO_ROTATION";
    AnimationType[AnimationType["FLOWER_SPRING_IDLE"] = 385] = "FLOWER_SPRING_IDLE";
    AnimationType[AnimationType["FLOWER_SUMMER_IDLE"] = 386] = "FLOWER_SUMMER_IDLE";
    AnimationType[AnimationType["FLOWER_AUTUMN_IDLE"] = 387] = "FLOWER_AUTUMN_IDLE";
    AnimationType[AnimationType["BIG_CLUCKER_ATTACKING_SHORT"] = 388] = "BIG_CLUCKER_ATTACKING_SHORT";
    AnimationType[AnimationType["BIG_CLUCKER_ATTACKING_LONG"] = 389] = "BIG_CLUCKER_ATTACKING_LONG";
    AnimationType[AnimationType["BIG_CLUCKER_DYING"] = 390] = "BIG_CLUCKER_DYING";
    // 0187
    AnimationType[AnimationType["PUMPKIN_DYING"] = 392] = "PUMPKIN_DYING";
    AnimationType[AnimationType["FLOATSAM_DYING"] = 393] = "FLOATSAM_DYING";
    AnimationType[AnimationType["FP_PRESENT_IDLE"] = 394] = "FP_PRESENT_IDLE";
    // 018B X
    // 018C X
    // 018D
    // 018E
    AnimationType[AnimationType["EYRIE_SPRING_FALLING_ASLEEP"] = 399] = "EYRIE_SPRING_FALLING_ASLEEP";
    AnimationType[AnimationType["EYRIE_SPRING_SLEEPING"] = 400] = "EYRIE_SPRING_SLEEPING";
    AnimationType[AnimationType["EYRIE_SUMMER_IDLE"] = 401] = "EYRIE_SUMMER_IDLE";
    AnimationType[AnimationType["EYRIE_SUMMER_GROWING"] = 402] = "EYRIE_SUMMER_GROWING";
    AnimationType[AnimationType["EYRIE_SUMMER_FALLING_ASLEEP"] = 403] = "EYRIE_SUMMER_FALLING_ASLEEP";
    AnimationType[AnimationType["EYRIE_SUMMER_SLEEPING"] = 404] = "EYRIE_SUMMER_SLEEPING";
    AnimationType[AnimationType["EYRIE_AUTUMN_IDLE"] = 405] = "EYRIE_AUTUMN_IDLE";
    AnimationType[AnimationType["EYRIE_AUTUMN_GROWING"] = 406] = "EYRIE_AUTUMN_GROWING";
    AnimationType[AnimationType["EYRIE_AUTUMN_FALLING_ASLEEP"] = 407] = "EYRIE_AUTUMN_FALLING_ASLEEP";
    AnimationType[AnimationType["EYRIE_AUTUMN_SLEEPING"] = 408] = "EYRIE_AUTUMN_SLEEPING";
    AnimationType[AnimationType["EYRIE_WINTER_IDLE"] = 409] = "EYRIE_WINTER_IDLE";
    AnimationType[AnimationType["EYRIE_WINTER_FLYING"] = 410] = "EYRIE_WINTER_FLYING";
    AnimationType[AnimationType["BANJO_TRANSFORMING"] = 411] = "BANJO_TRANSFORMING";
    AnimationType[AnimationType["WALRUS_HURT"] = 412] = "WALRUS_HURT";
    AnimationType[AnimationType["WALRUS_DYING"] = 413] = "WALRUS_DYING";
    AnimationType[AnimationType["WALRUS_ON_SLED"] = 414] = "WALRUS_ON_SLED";
    AnimationType[AnimationType["WALRUS_LOST_RACE_START"] = 415] = "WALRUS_LOST_RACE_START";
    // 01A0 Unknown Dying (0x1A0)
    AnimationType[AnimationType["SLED_IDLE"] = 417] = "SLED_IDLE";
    AnimationType[AnimationType["NABNUT_SLEEPING"] = 418] = "NABNUT_SLEEPING";
    AnimationType[AnimationType["NABNUT_IDLE"] = 419] = "NABNUT_IDLE";
    AnimationType[AnimationType["NABNUT_EATING"] = 420] = "NABNUT_EATING";
    // 01A5 X
    AnimationType[AnimationType["GNAWTY_IDLE"] = 422] = "GNAWTY_IDLE";
    AnimationType[AnimationType["GNAWTY_HAPPY"] = 423] = "GNAWTY_HAPPY";
    AnimationType[AnimationType["GNAWTY_WALKING"] = 424] = "GNAWTY_WALKING";
    AnimationType[AnimationType["WALRUS_LOST_RACE"] = 425] = "WALRUS_LOST_RACE";
    AnimationType[AnimationType["BOGGY_WON_RACE"] = 426] = "BOGGY_WON_RACE";
    AnimationType[AnimationType["BOGGY_LOST_RACE"] = 427] = "BOGGY_LOST_RACE";
    AnimationType[AnimationType["WOZZA_WITH_JIGGY_IDLE"] = 428] = "WOZZA_WITH_JIGGY_IDLE";
    AnimationType[AnimationType["WOZZA_THROWING_JIGGY"] = 429] = "WOZZA_THROWING_JIGGY";
    AnimationType[AnimationType["WOZZA_WALKING"] = 430] = "WOZZA_WALKING";
    AnimationType[AnimationType["TWINKLY_MUNCHER_DYING"] = 431] = "TWINKLY_MUNCHER_DYING";
    AnimationType[AnimationType["TWINKLY_MUNCHER_APPEARING"] = 432] = "TWINKLY_MUNCHER_APPEARING";
    AnimationType[AnimationType["TWINKLY_MUNCHER_IDLE"] = 433] = "TWINKLY_MUNCHER_IDLE";
    AnimationType[AnimationType["TWINKLY_MUNCHER_MUNCHING"] = 434] = "TWINKLY_MUNCHER_MUNCHING";
    AnimationType[AnimationType["WOZZA_BEFORE_STOP"] = 435] = "WOZZA_BEFORE_STOP";
    AnimationType[AnimationType["WOZZA_SCARED"] = 436] = "WOZZA_SCARED";
    AnimationType[AnimationType["WOZZA_GIVING_JIGGY"] = 437] = "WOZZA_GIVING_JIGGY";
    AnimationType[AnimationType["WOZZA_HALF_THROW_FREEZE"] = 438] = "WOZZA_HALF_THROW_FREEZE";
    AnimationType[AnimationType["CS_INTRO_GREEN_MIST_IDLE"] = 439] = "CS_INTRO_GREEN_MIST_IDLE";
    AnimationType[AnimationType["CS_INTRO_DOOR_OPENING"] = 440] = "CS_INTRO_DOOR_OPENING";
    AnimationType[AnimationType["CS_INTRO_GRUNTY_IDLE"] = 441] = "CS_INTRO_GRUNTY_IDLE";
    // 01BA
    AnimationType[AnimationType["CS_INTRO_GRUNTY_PICKING_NOSE"] = 443] = "CS_INTRO_GRUNTY_PICKING_NOSE";
    // 01BC
    AnimationType[AnimationType["CS_INTRO_GRUNTY_ANGRY_AT_DINGPOT"] = 445] = "CS_INTRO_GRUNTY_ANGRY_AT_DINGPOT";
    AnimationType[AnimationType["CS_INTRO_GRUNTY_THROWING_BOOGER"] = 446] = "CS_INTRO_GRUNTY_THROWING_BOOGER";
    AnimationType[AnimationType["CS_INTRO_GRUNTY_SHOCKED_CONFUSED"] = 447] = "CS_INTRO_GRUNTY_SHOCKED_CONFUSED";
    AnimationType[AnimationType["CS_INTRO_GRUNTY_WALKING"] = 448] = "CS_INTRO_GRUNTY_WALKING";
    // 01C1
    AnimationType[AnimationType["CS_INTRO_DOOR_CLOSING"] = 450] = "CS_INTRO_DOOR_CLOSING";
    // 01C3
    AnimationType[AnimationType["CS_INTRO_GRUNTYS_BROOM_FLYING"] = 452] = "CS_INTRO_GRUNTYS_BROOM_FLYING";
    AnimationType[AnimationType["GRUNTY_FLYING"] = 453] = "GRUNTY_FLYING";
    // 01C6
    AnimationType[AnimationType["CS_INTRO_BANJO_SLEEPING"] = 455] = "CS_INTRO_BANJO_SLEEPING";
    AnimationType[AnimationType["CS_INTRO_BANJO_WAKING_UP"] = 456] = "CS_INTRO_BANJO_WAKING_UP";
    AnimationType[AnimationType["CS_INTRO_BEDSHEETS_BANJO_SLEEPING"] = 457] = "CS_INTRO_BEDSHEETS_BANJO_SLEEPING";
    AnimationType[AnimationType["CS_INTRO_BEDSHEETS_BANJO_AWAKE"] = 458] = "CS_INTRO_BEDSHEETS_BANJO_AWAKE";
    AnimationType[AnimationType["CS_INTRO_KAZOOIE_ON_COAT_RACK_APPEARING"] = 459] = "CS_INTRO_KAZOOIE_ON_COAT_RACK_APPEARING";
    // 01CC
    AnimationType[AnimationType["CS_INTRO_KAZOOIE_ON_COAT_RACK_IDLE"] = 461] = "CS_INTRO_KAZOOIE_ON_COAT_RACK_IDLE";
    AnimationType[AnimationType["CS_INTRO_CURTAIN"] = 462] = "CS_INTRO_CURTAIN";
    AnimationType[AnimationType["CS_INTRO_KAZOOIE_ON_COAT_RACK_UNEASY"] = 463] = "CS_INTRO_KAZOOIE_ON_COAT_RACK_UNEASY";
    AnimationType[AnimationType["TOOTY_IDLE"] = 464] = "TOOTY_IDLE";
    // 01D1
    // 01D2
    AnimationType[AnimationType["CS_INTRO_KAZOOIE_ON_COAT_RACK_WAKING_BANJO"] = 467] = "CS_INTRO_KAZOOIE_ON_COAT_RACK_WAKING_BANJO";
    AnimationType[AnimationType["CS_INTRO_KAZOOIE_ON_COAT_RACK_FALLING"] = 468] = "CS_INTRO_KAZOOIE_ON_COAT_RACK_FALLING";
    AnimationType[AnimationType["TOOTY_SCARE"] = 469] = "TOOTY_SCARE";
    AnimationType[AnimationType["GRUBLIN_WALKING_2"] = 470] = "GRUBLIN_WALKING_2";
    AnimationType[AnimationType["GRUBLIN_ALERTED"] = 471] = "GRUBLIN_ALERTED";
    AnimationType[AnimationType["GRUBLIN_CHASING"] = 472] = "GRUBLIN_CHASING";
    AnimationType[AnimationType["GRUBLIN_DYING_2"] = 473] = "GRUBLIN_DYING_2";
    AnimationType[AnimationType["SNIPPET_IDLE"] = 474] = "SNIPPET_IDLE";
    AnimationType[AnimationType["MUTIE_SNIPPET_IDLE"] = 475] = "MUTIE_SNIPPET_IDLE";
    AnimationType[AnimationType["BEE_FLYING"] = 476] = "BEE_FLYING";
    AnimationType[AnimationType["BEE_WALKING"] = 477] = "BEE_WALKING";
    AnimationType[AnimationType["BEE_IDLE"] = 478] = "BEE_IDLE";
    AnimationType[AnimationType["BEE_UNKNOWN_0X1DF"] = 479] = "BEE_UNKNOWN_0X1DF";
    AnimationType[AnimationType["BEE_HURT"] = 480] = "BEE_HURT";
    AnimationType[AnimationType["BEE_DYING"] = 481] = "BEE_DYING";
    AnimationType[AnimationType["BEE_JUMPING"] = 482] = "BEE_JUMPING";
    AnimationType[AnimationType["GV_BRICK_WALL_SMASHING"] = 483] = "GV_BRICK_WALL_SMASHING";
    AnimationType[AnimationType["LIMBO_IDLE"] = 484] = "LIMBO_IDLE";
    AnimationType[AnimationType["LIMBO_ALERTED"] = 485] = "LIMBO_ALERTED";
    AnimationType[AnimationType["LIMBO_CHASING"] = 486] = "LIMBO_CHASING";
    AnimationType[AnimationType["LIMBO_BREAKING"] = 487] = "LIMBO_BREAKING";
    AnimationType[AnimationType["LIMBO_RECOVERING"] = 488] = "LIMBO_RECOVERING";
    AnimationType[AnimationType["MUMMUM_IDLE"] = 489] = "MUMMUM_IDLE";
    AnimationType[AnimationType["MUMMUM_CURLING"] = 490] = "MUMMUM_CURLING";
    AnimationType[AnimationType["MUMMMUM_UNCURLING"] = 491] = "MUMMMUM_UNCURLING";
    // 01EC
    AnimationType[AnimationType["RIPPER_HURT"] = 493] = "RIPPER_HURT";
    AnimationType[AnimationType["RIPPER_DYING"] = 494] = "RIPPER_DYING";
    // 01EF
    // 01F0  Web (Floor)
    // 01F1  Web Dying (Floor)
    // 01F2  Web (Wall)
    // 01F3  Web Dying (Wall)
    AnimationType[AnimationType["SHRAPNEL_IDLE"] = 500] = "SHRAPNEL_IDLE";
    // 01F5
    // Jiggy Transition
    // 01F6
    // 01F7  Kazooie Feathers Poof (End intro)
    // 01F8  Bottles PointAtGrunty
    // 01F9  Tooty Confused
    AnimationType[AnimationType["SEXY_GRUNTY_WALKING"] = 506] = "SEXY_GRUNTY_WALKING";
    AnimationType[AnimationType["SEXY_GRUNTY_CHECKING_SELF_OUT"] = 507] = "SEXY_GRUNTY_CHECKING_SELF_OUT";
    AnimationType[AnimationType["UGLY_TOOTY_WALKING"] = 508] = "UGLY_TOOTY_WALKING";
    AnimationType[AnimationType["UGLY_TOOTY_PUNCHING"] = 509] = "UGLY_TOOTY_PUNCHING";
    // 01FE  Machine Door Opening
    // 01FF  Machine Door Closing
    // 0200  Static Machine Door Up
    AnimationType[AnimationType["KLUNGO_WALKING"] = 513] = "KLUNGO_WALKING";
    AnimationType[AnimationType["KLUNGO_PUSHING_BUTTON"] = 514] = "KLUNGO_PUSHING_BUTTON";
    // 0203 X
    AnimationType[AnimationType["GRUNTY_FALLING"] = 516] = "GRUNTY_FALLING";
    // 0205  Dingpot wap
    // 0206  Dingpot
    // 0207  Grunty Crammed in Machine
    AnimationType[AnimationType["ROYSTEN_IDLE"] = 520] = "ROYSTEN_IDLE";
    AnimationType[AnimationType["CUCKOO_CLOCK_IDLE"] = 521] = "CUCKOO_CLOCK_IDLE";
    AnimationType[AnimationType["CUCKOO_CLOCK_CHIMING"] = 522] = "CUCKOO_CLOCK_CHIMING";
    // 020B  Grunty Falling
    // 020C
    AnimationType[AnimationType["KLUNGO_PULLING_LEVER"] = 525] = "KLUNGO_PULLING_LEVER";
    // 020E Machine Lever down
    AnimationType[AnimationType["KLUNGO_LAUGHING"] = 527] = "KLUNGO_LAUGHING";
    // 0210  Machine
    // 0211
    AnimationType[AnimationType["WARP_CAULDRON_ACTIVATING"] = 530] = "WARP_CAULDRON_ACTIVATING";
    AnimationType[AnimationType["WARP_CAULDRON_SLEEPING"] = 531] = "WARP_CAULDRON_SLEEPING";
    AnimationType[AnimationType["WARP_CAULDRON_IDLE"] = 532] = "WARP_CAULDRON_IDLE";
    AnimationType[AnimationType["WARP_CAULDRON_TELEPORTING"] = 533] = "WARP_CAULDRON_TELEPORTING";
    AnimationType[AnimationType["WARP_CAULDRON_REJECTING"] = 534] = "WARP_CAULDRON_REJECTING";
    // 0217  Transform Pad
    // 0218
    // 0219
    AnimationType[AnimationType["EYRIE_SUMMER_EATING"] = 538] = "EYRIE_SUMMER_EATING";
    AnimationType[AnimationType["EYRIE_AUTUMN_EATING"] = 539] = "EYRIE_AUTUMN_EATING";
    // 021C
    AnimationType[AnimationType["EYRIE_FLYING"] = 541] = "EYRIE_FLYING";
    AnimationType[AnimationType["EYRIE_WINTER_POOPING_JIGGY"] = 542] = "EYRIE_WINTER_POOPING_JIGGY";
    // 021F X
    // 0220  Sir. Slush
    // 0221  Wozza (in cave)
    // 0222  Boggy Sleeping
    AnimationType[AnimationType["TOPPER_IDLE"] = 547] = "TOPPER_IDLE";
    AnimationType[AnimationType["TOPPER_DYING"] = 548] = "TOPPER_DYING";
    // 0225  Colliwobble
    // 0226  Bawl
    // 0227  Bawl Dying
    // 0228
    // 0229  Whipcrack Attacking
    // 022A  Whipcrack
    AnimationType[AnimationType["NABNUT_FAT"] = 555] = "NABNUT_FAT";
    AnimationType[AnimationType["NABNUT_CRYING"] = 556] = "NABNUT_CRYING";
    AnimationType[AnimationType["NABNUT_HAPPY"] = 557] = "NABNUT_HAPPY";
    AnimationType[AnimationType["NABNUT_IDLE_2"] = 558] = "NABNUT_IDLE_2";
    AnimationType[AnimationType["NABNUT_RUNNING"] = 559] = "NABNUT_RUNNING";
    AnimationType[AnimationType["MRS_NABNUT_SLEEPING"] = 560] = "MRS_NABNUT_SLEEPING";
    AnimationType[AnimationType["NABNUTS_BEDSHEETS"] = 561] = "NABNUTS_BEDSHEETS";
    // 0232  X
    // 0233  Chinker
    // 0234  Snare-Bear (Winter)
    // 0235  Sarcophagus (GV Lobby)
    AnimationType[AnimationType["PUMPKIN_HURT"] = 566] = "PUMPKIN_HURT";
    // 0237  Twinkly Present
    AnimationType[AnimationType["LOGGO_IDLE"] = 568] = "LOGGO_IDLE";
    // 0239  Leaky Hop
    // 023A  Gobi Fly
    // 023B  Gobi Fly Prepare Attack
    // 023C  Gobi Fly Charge
    // 023D  Gobi Fly Dying
    // 023E Portrait Chompa (Picture Monster)
    // 023F  Portrait
    AnimationType[AnimationType["LOGGO_FLUSHING"] = 576] = "LOGGO_FLUSHING";
    // 0241
    // 0242  Gobi Relaxing
    AnimationType[AnimationType["GRUBLIN_HOOD_IDLE"] = 579] = "GRUBLIN_HOOD_IDLE";
    AnimationType[AnimationType["GRUBLIN_HOOD_ALERTED"] = 580] = "GRUBLIN_HOOD_ALERTED";
    AnimationType[AnimationType["GRUBLIN_HOOD_CHASING"] = 581] = "GRUBLIN_HOOD_CHASING";
    AnimationType[AnimationType["GRUBLIN_HOOD_DYING"] = 582] = "GRUBLIN_HOOD_DYING";
    // 0247
    // 0248
    // 0249
    AnimationType[AnimationType["FS_BANJO_COOKING_IDLE"] = 586] = "FS_BANJO_COOKING_IDLE";
    AnimationType[AnimationType["FS_BANJO_COOKING_SELECTED"] = 587] = "FS_BANJO_COOKING_SELECTED";
    AnimationType[AnimationType["FS_BANJO_COOKING_SPIN"] = 588] = "FS_BANJO_COOKING_SPIN";
    AnimationType[AnimationType["FS_BANJO_SLEEPING_IDLE"] = 589] = "FS_BANJO_SLEEPING_IDLE";
    AnimationType[AnimationType["FS_BANJO_SLEEPING_SELECTED"] = 590] = "FS_BANJO_SLEEPING_SELECTED";
    AnimationType[AnimationType["FS_BANJO_SLEEPING_SPRING"] = 591] = "FS_BANJO_SLEEPING_SPRING";
    AnimationType[AnimationType["FS_BANJO_PLAYING_GAMEBOY_IDLE"] = 592] = "FS_BANJO_PLAYING_GAMEBOY_IDLE";
    AnimationType[AnimationType["FS_BANJO_PLAYING_GAMEBOY_THUMBSUP"] = 593] = "FS_BANJO_PLAYING_GAMEBOY_THUMBSUP";
    AnimationType[AnimationType["FS_BANJO_PLAYING_GAMEBOY_SPRING"] = 594] = "FS_BANJO_PLAYING_GAMEBOY_SPRING";
    AnimationType[AnimationType["BIGBUTT_HURT"] = 595] = "BIGBUTT_HURT";
    AnimationType[AnimationType["BIGBUTT_DEFEATED_START"] = 596] = "BIGBUTT_DEFEATED_START";
    AnimationType[AnimationType["BIGBUTT_RECOVERING"] = 597] = "BIGBUTT_RECOVERING";
    // 0256
    // 0257  Grunty Green Spell (flying)
    // 0258  Grunty Hurt
    // 0259  Grunty Hurt
    // 025A  Grunty Fireball Spell
    AnimationType[AnimationType["ACORN_IDLE"] = 603] = "ACORN_IDLE";
    // 025C  Grunty Phase 1 Swooping
    // 025D  Grunty Entring Final Phase
    // 025E  Grunty Phase 1 Vulnerable
    // 025F  Grunty
    // 0260  Grunty Fireball Spell
    // 0261  Grunty Green Spell
    AnimationType[AnimationType["JINJO_STATUE_RISING"] = 610] = "JINJO_STATUE_RISING";
    // 0263  Grunty Fall off Broom
    AnimationType[AnimationType["JINJO_STATUE_ACTIVATING"] = 612] = "JINJO_STATUE_ACTIVATING";
    AnimationType[AnimationType["JINJO_STATUE_IDLE"] = 613] = "JINJO_STATUE_IDLE";
    // 0266  Grunty/Falling down tower
    // 0267  Big Blue Egg
    // 0269  Big Red Feather
    // 026A  Big Gold Feather
    AnimationType[AnimationType["BRENTILDA_IDLE"] = 619] = "BRENTILDA_IDLE";
    AnimationType[AnimationType["BRENTILDA_HANDS_ON_HIPS"] = 620] = "BRENTILDA_HANDS_ON_HIPS";
    AnimationType[AnimationType["GRUNTLING_IDLE"] = 621] = "GRUNTLING_IDLE";
    AnimationType[AnimationType["GRUNTLING_ALERTED"] = 622] = "GRUNTLING_ALERTED";
    AnimationType[AnimationType["GRUNTLING_CHASING"] = 623] = "GRUNTLING_CHASING";
    AnimationType[AnimationType["GRUNTLING_DYING"] = 624] = "GRUNTLING_DYING";
    // 0271  Door of Grunty
    AnimationType[AnimationType["CHEATO_IDLE"] = 626] = "CHEATO_IDLE";
    AnimationType[AnimationType["SNACKER_HURT"] = 627] = "SNACKER_HURT";
    AnimationType[AnimationType["SNACKER_DYING"] = 628] = "SNACKER_DYING";
    // 0275  Jinjonator Activating
    // 0276  Jinjonator Charging
    // 0277
    // 0278  Jinjonator Recoil
    // 0279  Grunty JawDrop > Shiver
    // 027A  Grunty Hurt by Jinjonator
    // 027B  Jinjonator? (spin spin spin, stop far way, shake)
    // 027C  Jinjonator Charging
    // 027D  Jinjonator Final Hit
    // 027E  Jinjonator Taking Flight
    // 027F  Jinjonator Circling
    // 0280  Jinjonator Attacking
    // 0281  Wishy-Washy-Banjo 'Doooohh….'
    // 0282  Banjo Unlocking Note Door
    // 0283  Grunty Chattering Teeth
    // 0284  PRESS START Appearing
    // 0285  PRESS START
    // 0286  NO CONTROLLER Appearing
    // 0287  NO CONTROLLER
    AnimationType[AnimationType["FLIBBIT_HURT"] = 648] = "FLIBBIT_HURT";
    AnimationType[AnimationType["GNAWTY_SWIMMING"] = 649] = "GNAWTY_SWIMMING";
    AnimationType[AnimationType["FF_WASHING_MACHINE"] = 650] = "FF_WASHING_MACHINE";
    // 028B Grunty
    AnimationType[AnimationType["GRUNTY_DOLL"] = 652] = "GRUNTY_DOLL";
    // 028D  Grunty Walking
    // 028E  Tooty Looking Around
    // 028F  Dingpot
    // 0290  Dingpot Shooting
    // 0291  Mumbo Flipping Food
    // 0292  Food Flipping
    // 0293  Banjo Drinking
    // 0294  Mumbo Screaming
    // 0295  Banjo's Chair Breaking
    // 0296  Bottles Eating corn
    // 0297  Mumbo Skidding/Giving Flower
    // 0298
    // 0299  Bottles Falling off chair
    // 029A  Banjo Drunk
    // 029B  Kazooie Hits Banjo
    // 029C  Yellow Jinjo Waving & Whistling
    // 029D  Melon Babe Walking
    // 029E  Blubber On Jetski
    // 029F  Blubber Cheering on JetSki
    // 02A0  Curtains (Bottles Bonus)
    // 02A1  Banjo's Hand Dropping Jiggy
    // 02A2  Banjo's Hand
    // 02A3  Banjo's Hand Turning Jiggy (Right)
    // 02A4  Banjo's Hand Turning Jiggy (Left)
    // 02A5  Banjo's Hand Grabbing Jiggy
    // 02A6  Banjo's Hand Thumbs Up
    // 02A7  Banjo's Hand Placing Jiggy
    // 02A8  Banjo's Hand Thumbs Down
    // 02A9  Nibbly Falling
    // 02AA  Nibbly Dying
    // 02AB  Tee-Hee Dying
    // 02AC  Grunty Upset
    // 02AD  Grunty Looking
    // 02AE  Tree Shaking (Mumbo)
    // 02AF  Mumbo Sliding down tree
    // 02B0  Mumbo on tree (waving pictures)
    // 02B1  Mumbo falling from tree
    // 02B2  Bottles Eating watermelon
    // 02B3  Mumbo Hit by Coconuts
    // 02B4  Mumbo shake head sitting down
    // 02B5  Mumbo Jumping > Running
    // 02B6  Klungo Pushing rock
    // 02B7  Klungo Tired
    // 02B8  Tooty Drinking
    // 02B9  Grunty's Rock
    // 02BA  Kazooie Talking
    // 02BB  Mumbo Running After Melon Babe
    // 02BC  Mumbo Talking
    // 02BD
    // 02BE
    // 02BF
    // 02C0  Piranha Dying
    // 02C1
    // 02C2
    // 02C3
    // 02C4
    // 02C5  Grunty Preparing charge
    // 02C6  Mumbo's Hand
    // 02C7  Mumbo's Hand Appearing
    // 02C8  Mumbo's Hand Leaving
})(AnimationType = exports.AnimationType || (exports.AnimationType = {}));
var ActorType;
(function (ActorType) {
    ActorType[ActorType["BIGBUTT"] = 4] = "BIGBUTT";
    ActorType[ActorType["TICKER"] = 5] = "TICKER";
    ActorType[ActorType["GRUBLIN"] = 6] = "GRUBLIN";
    ActorType[ActorType["MUMBO_0X0007"] = 7] = "MUMBO_0X0007";
    ActorType[ActorType["MM_CONGA"] = 8] = "MM_CONGA";
    ActorType[ActorType["MM_HUT"] = 9] = "MM_HUT";
    ActorType[ActorType["FISH"] = 10] = "FISH";
    ActorType[ActorType["SHOCK_SPRING_PAD"] = 11] = "SHOCK_SPRING_PAD";
    ActorType[ActorType["MUD_HUT"] = 12] = "MUD_HUT";
    ActorType[ActorType["WOOD_DEMOLISHED"] = 13] = "WOOD_DEMOLISHED";
    ActorType[ActorType["BULL_2"] = 14] = "BULL_2";
    ActorType[ActorType["MM_CHIMPY"] = 15] = "MM_CHIMPY";
    ActorType[ActorType["MM_JU_JU_HITBOX"] = 17] = "MM_JU_JU_HITBOX";
    ActorType[ActorType["BEEHIVE"] = 18] = "BEEHIVE";
    ActorType[ActorType["MM_CONGA_ORANGE"] = 20] = "MM_CONGA_ORANGE";
    ActorType[ActorType["SHADOW"] = 23] = "SHADOW";
    ActorType[ActorType["LEAKY"] = 30] = "LEAKY";
    ActorType[ActorType["OYSTER"] = 36] = "OYSTER";
    ActorType[ActorType["MMM_CEMETARY_POT"] = 37] = "MMM_CEMETARY_POT";
    ActorType[ActorType["CLIMBABLE_POLE"] = 38] = "CLIMBABLE_POLE";
    ActorType[ActorType["MM_COLLECTABLE_ORANGE"] = 41] = "MM_COLLECTABLE_ORANGE";
    ActorType[ActorType["TTC_GOLD_BULLION"] = 42] = "TTC_GOLD_BULLION";
    ActorType[ActorType["TURBO_TRAINERS"] = 44] = "TURBO_TRAINERS";
    ActorType[ActorType["MUMBO_TOKEN"] = 45] = "MUMBO_TOKEN";
    ActorType[ActorType["PHANTOM"] = 57] = "PHANTOM";
    ActorType[ActorType["MMM_MOTZAND"] = 58] = "MMM_MOTZAND";
    ActorType[ActorType["BIG_KEY"] = 60] = "BIG_KEY";
    ActorType[ActorType["RBB_PROPELLER_1"] = 61] = "RBB_PROPELLER_1";
    ActorType[ActorType["RBB_PROPELLER_2"] = 62] = "RBB_PROPELLER_2";
    ActorType[ActorType["RBB_PROPELLER_3"] = 63] = "RBB_PROPELLER_3";
    ActorType[ActorType["RBB_PROPELLER_4"] = 64] = "RBB_PROPELLER_4";
    ActorType[ActorType["RBB_PROPELLER_5"] = 65] = "RBB_PROPELLER_5";
    ActorType[ActorType["RBB_PROPELLER_6"] = 66] = "RBB_PROPELLER_6";
    ActorType[ActorType["SCREW"] = 67] = "SCREW";
    ActorType[ActorType["ROCK"] = 68] = "ROCK";
    ActorType[ActorType["UNKNOWN_0X0045"] = 69] = "UNKNOWN_0X0045";
    ActorType[ActorType["JIGGY"] = 70] = "JIGGY";
    ActorType[ActorType["EMPTY_HONEYCOMB_PIECE"] = 71] = "EMPTY_HONEYCOMB_PIECE";
    ActorType[ActorType["EXTRA_LIFE"] = 73] = "EXTRA_LIFE";
    ActorType[ActorType["WOOD_EXPLOSION"] = 74] = "WOOD_EXPLOSION";
    ActorType[ActorType["EXPLOSION_2"] = 75] = "EXPLOSION_2";
    ActorType[ActorType["STEAM"] = 76] = "STEAM";
    ActorType[ActorType["STEAM_2"] = 77] = "STEAM_2";
    ActorType[ActorType["SPARKLES"] = 78] = "SPARKLES";
    ActorType[ActorType["SPARKLES_2"] = 79] = "SPARKLES_2";
    ActorType[ActorType["HONEYCOMB"] = 80] = "HONEYCOMB";
    ActorType[ActorType["MUSIC_NOTE"] = 81] = "MUSIC_NOTE";
    ActorType[ActorType["EGG"] = 82] = "EGG";
    ActorType[ActorType["TTC_RED_ARROW"] = 83] = "TTC_RED_ARROW";
    ActorType[ActorType["TTC_RED_QUESTION_MARK"] = 84] = "TTC_RED_QUESTION_MARK";
    ActorType[ActorType["TTC_RED_X"] = 85] = "TTC_RED_X";
    ActorType[ActorType["EXPLOSION"] = 86] = "EXPLOSION";
    ActorType[ActorType["MM_ORANGE_PAD"] = 87] = "MM_ORANGE_PAD";
    ActorType[ActorType["MM_JUJU_TOTEM_POLE"] = 89] = "MM_JUJU_TOTEM_POLE";
    ActorType[ActorType["JIGGY_IN_HAND"] = 90] = "JIGGY_IN_HAND";
    ActorType[ActorType["EGG_1"] = 91] = "EGG_1";
    ActorType[ActorType["COLLECTABLE_JINJO_YELLOW"] = 94] = "COLLECTABLE_JINJO_YELLOW";
    ActorType[ActorType["COLLECTABLE_JINJO_ORANGE"] = 95] = "COLLECTABLE_JINJO_ORANGE";
    ActorType[ActorType["COLLECTABLE_JINJO_BLUE"] = 96] = "COLLECTABLE_JINJO_BLUE";
    ActorType[ActorType["COLLECTABLE_JINJO_PINK"] = 97] = "COLLECTABLE_JINJO_PINK";
    ActorType[ActorType["COLLECTABLE_JINJO_GREEN"] = 98] = "COLLECTABLE_JINJO_GREEN";
    ActorType[ActorType["WATER_LEVEL_SWITCH"] = 100] = "WATER_LEVEL_SWITCH";
    ActorType[ActorType["WADING_BOOTS"] = 101] = "WADING_BOOTS";
    ActorType[ActorType["UNKNOWN_0X0066"] = 102] = "UNKNOWN_0X0066";
    ActorType[ActorType["TTC_SNIPPET"] = 103] = "TTC_SNIPPET";
    ActorType[ActorType["SNACKER"] = 104] = "SNACKER";
    ActorType[ActorType["TTC_YUMYUM"] = 105] = "TTC_YUMYUM";
    ActorType[ActorType["UNKNOWN_0X006C"] = 108] = "UNKNOWN_0X006C";
    ActorType[ActorType["BANJO_DOOR"] = 109] = "BANJO_DOOR";
    ActorType[ActorType["CS_CONCERT_BK"] = 142] = "CS_CONCERT_BK";
    ActorType[ActorType["CS_CONCERT_MUMBO"] = 143] = "CS_CONCERT_MUMBO";
    ActorType[ActorType["YELLOW_JINJO_1"] = 144] = "YELLOW_JINJO_1";
    ActorType[ActorType["YELLOW_JINJO_2"] = 145] = "YELLOW_JINJO_2";
    ActorType[ActorType["CS_CONCERT_TOOIE"] = 146] = "CS_CONCERT_TOOIE";
    ActorType[ActorType["CS_NINTENDO_CUBE"] = 147] = "CS_NINTENDO_CUBE";
    ActorType[ActorType["CS_RAREWARE_LOGO"] = 148] = "CS_RAREWARE_LOGO";
    ActorType[ActorType["YELLOW_JINJO_3"] = 149] = "YELLOW_JINJO_3";
    ActorType[ActorType["YELLOW_JINJO_4"] = 150] = "YELLOW_JINJO_4";
    ActorType[ActorType["YELLOW_JINJO_5"] = 151] = "YELLOW_JINJO_5";
    ActorType[ActorType["YELLOW_JINJO_6"] = 152] = "YELLOW_JINJO_6";
    ActorType[ActorType["UNKNOWN_0X0099"] = 153] = "UNKNOWN_0X0099";
    ActorType[ActorType["UNKNOWN_0X009A"] = 154] = "UNKNOWN_0X009A";
    ActorType[ActorType["CS_CONCERT_BULL"] = 155] = "CS_CONCERT_BULL";
    ActorType[ActorType["CS_CONCERT_FROG"] = 156] = "CS_CONCERT_FROG";
    // 	{id=0x009D, name="Bull"},
    ActorType[ActorType["GRUNTY_1"] = 158] = "GRUNTY_1";
    ActorType[ActorType["YELLOW_JINJO_7"] = 159] = "YELLOW_JINJO_7";
    // 	{id=0x00A0, name="Banjo-Kazooie Sign"},
    ActorType[ActorType["UNKNOWN_0X00A1"] = 161] = "UNKNOWN_0X00A1";
    // 	{id=0x00A2, name="Fire Sparkle"},
    ActorType[ActorType["YELLOW_JINJO_8"] = 163] = "YELLOW_JINJO_8";
    ActorType[ActorType["UNKNOWN_0X00A4"] = 164] = "UNKNOWN_0X00A4";
    ActorType[ActorType["CS_CONCERT_BUZZBOMB"] = 165] = "CS_CONCERT_BUZZBOMB";
    ActorType[ActorType["BGS_YUMBLIE"] = 166] = "BGS_YUMBLIE";
    ActorType[ActorType["CS_BBQ_MUMBO"] = 167] = "CS_BBQ_MUMBO";
    ActorType[ActorType["CS_BBQ_1"] = 168] = "CS_BBQ_1";
    ActorType[ActorType["CS_BBQ_2"] = 169] = "CS_BBQ_2";
    ActorType[ActorType["CS_INTRO_DINGPOT_1"] = 170] = "CS_INTRO_DINGPOT_1";
    ActorType[ActorType["CS_INTRO_GRUNTY_ARMS"] = 171] = "CS_INTRO_GRUNTY_ARMS";
    ActorType[ActorType["GRUNTY_2"] = 172] = "GRUNTY_2";
    ActorType[ActorType["CS_INTRO_NIBBLY"] = 173] = "CS_INTRO_NIBBLY";
    ActorType[ActorType["CS_INTRO_DINGPOT_2"] = 174] = "CS_INTRO_DINGPOT_2";
    ActorType[ActorType["CS_INTRO_GREEN_MIST"] = 175] = "CS_INTRO_GREEN_MIST";
    ActorType[ActorType["CS_INTRO_BOTTLES"] = 176] = "CS_INTRO_BOTTLES";
    ActorType[ActorType["CS_INTRO_BOTTLES_MOLEHILL"] = 177] = "CS_INTRO_BOTTLES_MOLEHILL";
    ActorType[ActorType["CS_INTRO_MACHINE_ROOM_DOOR"] = 178] = "CS_INTRO_MACHINE_ROOM_DOOR";
    ActorType[ActorType["CS_INTRO_TOOTY"] = 180] = "CS_INTRO_TOOTY";
    ActorType[ActorType["CS_INTRO_GRUNTYS_BROOMSTICK"] = 181] = "CS_INTRO_GRUNTYS_BROOMSTICK";
    ActorType[ActorType["CS_INTRO_GRUNTY_ON_BROOMSTICK"] = 182] = "CS_INTRO_GRUNTY_ON_BROOMSTICK";
    ActorType[ActorType["YELLOW_JINJO_9"] = 183] = "YELLOW_JINJO_9";
    ActorType[ActorType["CS_INTRO_BANJO_SLEEPING"] = 184] = "CS_INTRO_BANJO_SLEEPING";
    ActorType[ActorType["CS_INTRO_BED"] = 185] = "CS_INTRO_BED";
    ActorType[ActorType["YELLOW_JINJO_10"] = 186] = "YELLOW_JINJO_10";
    ActorType[ActorType["CS_INTRO_KAZOOIE_ON_COAT_RACK"] = 187] = "CS_INTRO_KAZOOIE_ON_COAT_RACK";
    ActorType[ActorType["CS_INTRO_BANJOS_CURTAINS"] = 188] = "CS_INTRO_BANJOS_CURTAINS";
    ActorType[ActorType["CS_INTRO_CURTAINS_PURPLE_CHECKERED"] = 188] = "CS_INTRO_CURTAINS_PURPLE_CHECKERED";
    ActorType[ActorType["CS_INTRO_BANJOS_DOOR"] = 189] = "CS_INTRO_BANJOS_DOOR";
    // 	{id=0x00BD, name="Door, Yellow 2D"},
    ActorType[ActorType["YELLOW_JINJO_11"] = 190] = "YELLOW_JINJO_11";
    ActorType[ActorType["YELLOW_JINJO_12"] = 191] = "YELLOW_JINJO_12";
    // 	{id=0x00C0, name="Unknown 0x00C0"},
    // 	{id=0x00C1, name="Jiggy Cutout Board"},
    ActorType[ActorType["CS_GAMEOVER_SEXY_GRUNTY"] = 194] = "CS_GAMEOVER_SEXY_GRUNTY";
    ActorType[ActorType["CS_GAMEOVER_UGLY_TOOTY"] = 195] = "CS_GAMEOVER_UGLY_TOOTY";
    // 	{id=0x00C5, name="Chimpy's Tree Stump"},
    ActorType[ActorType["MMM_RIPPER"] = 199] = "MMM_RIPPER";
    // 	{id=0x00C8, name="Boggy on Sled 2"},
    ActorType[ActorType["MMM_TEEHEE"] = 202] = "MMM_TEEHEE";
    // 	{id=0x00CB, name="Barrel Top"},
    // 	{id=0x00E4, name="Flight Pad"},
    // 	{id=0x00E4, name="Fly Pad"},
    ActorType[ActorType["CC_GLOOP"] = 230] = "CC_GLOOP";
    // 	{id=0x00E7, name="Unknown 0x00E7"},
    ActorType[ActorType["BGS_TANKTUP"] = 232] = "BGS_TANKTUP";
    ActorType[ActorType["BGS_TANKTUP_HEAD"] = 233] = "BGS_TANKTUP_HEAD";
    ActorType[ActorType["BGS_TANKTUP_LEG_1"] = 234] = "BGS_TANKTUP_LEG_1";
    ActorType[ActorType["BGS_TANKTUP_LEG_2"] = 235] = "BGS_TANKTUP_LEG_2";
    ActorType[ActorType["BGS_TANKTUP_LEG_3"] = 236] = "BGS_TANKTUP_LEG_3";
    ActorType[ActorType["EGG_2"] = 238] = "EGG_2";
    ActorType[ActorType["EGG_3"] = 239] = "EGG_3";
    ActorType[ActorType["EGG_4"] = 240] = "EGG_4";
    // 	{id=0x00F1, name="Leaf"},
    ActorType[ActorType["TTC_BLACK_SNIPPET"] = 242] = "TTC_BLACK_SNIPPET";
    // 	{id=0x00F3, name="Unknown 0x00F3"},
    ActorType[ActorType["CC_MUTIE_SNIPPET"] = 245] = "CC_MUTIE_SNIPPET";
    // 	{id=0x00F6, name="Big Alligator"},
    // 	{id=0x0101, name="Side of Rock"},
    // 	{id=0x0102, name="Side of Rock"},
    // 	{id=0x0108, name="Shadow 0x0108"},
    // 	{id=0x0109, name="Big Door"},
    // 	{id=0x010A, name="Main Door"},
    ActorType[ActorType["MMM_CELLAR_DOOR"] = 267] = "MMM_CELLAR_DOOR";
    //   {id=0x010C, name="Locked Gade"},
    // 	{id=0x010D, name="Gate"},
    // 	{id=0x010E, name="Hatch"},
    ActorType[ActorType["MMM_CHURCH_DOOR"] = 276] = "MMM_CHURCH_DOOR";
    ActorType[ActorType["TTC_BLUBBER"] = 277] = "TTC_BLUBBER";
    // 	{id=0x0116, name="Bullseye"},
    ActorType[ActorType["TTC_NIPPER_SHELL"] = 279] = "TTC_NIPPER_SHELL";
    // 	{id=0x0118, name="Grey Slappa"},
    ActorType[ActorType["GV_MAGIC_CARPET_1"] = 281] = "GV_MAGIC_CARPET_1";
    // 	{id=0x011A, name="Sarcopphagus"},
    ActorType[ActorType["GV_RUBEE"] = 283] = "GV_RUBEE";
    ActorType[ActorType["GV_HISTUP"] = 284] = "GV_HISTUP";
    // 	{id=0x011D, name="Pot"},
    // 	{id=0x011E, name="Hand Shadows"},
    // 	{id=0x011F, name="Dirt flies up"},
    // 	{id=0x0120, name="Purple Slappe"},
    // 	{id=0x0121, name="Big Jinxy Head"},
    // 	{id=0x0122, name="Square Shadow"},
    ActorType[ActorType["GV_MAGIC_CARPET_2"] = 291] = "GV_MAGIC_CARPET_2";
    // 	{id=0x0124, name="Sir Slush, Snowman"},
    // 	{id=0x0124, name="Snowman"},
    // 	{id=0x0125, name="Snowball"},
    // 	{id=0x0126, name="Snowman's Hat"},
    // 	{id=0x0129, name="Red Feather"},
    // 	{id=0x012C, name="Bottles Mound"},
    // 	{id=0x012C, name="Mole Hill"},
    ActorType[ActorType["GV_GOBI_1"] = 302] = "GV_GOBI_1";
    // 	{id=0x012F, name="Bamboo"},
    // 	{id=0x0130, name="Jinxy's Legs"},
    ActorType[ActorType["GV_GOBI_2"] = 305] = "GV_GOBI_2";
    ActorType[ActorType["GV_TRUNKER"] = 306] = "GV_TRUNKER";
    // 	{id=0x0133, name="Flibbit"},
    // 	{id=0x0134, name="Buzzbomb"},
    // 	{id=0x0134, name="Dragon Fly"},
    ActorType[ActorType["GV_GOBI_3"] = 309] = "GV_GOBI_3";
    ActorType[ActorType["BGS_FLIBBET_YELLOW"] = 311] = "BGS_FLIBBET_YELLOW";
    // 	{id=0x0139, name="Yumblie"},
    ActorType[ActorType["BGS_MR_VILE"] = 314] = "BGS_MR_VILE";
    ActorType[ActorType["RBB_FLOATSAM"] = 315] = "RBB_FLOATSAM";
    // 	{id=0x013E, name="Nothing?"},
    ActorType[ActorType["GV_SUN_SWITCH"] = 319] = "GV_SUN_SWITCH";
    ActorType[ActorType["GV_SUN_DOOR"] = 320] = "GV_SUN_DOOR";
    ActorType[ActorType["GV_STAR_HATCH"] = 322] = "GV_STAR_HATCH";
    ActorType[ActorType["GV_KAZOOIE_DOOR"] = 323] = "GV_KAZOOIE_DOOR";
    ActorType[ActorType["GV_STAR_SWITCH"] = 324] = "GV_STAR_SWITCH";
    ActorType[ActorType["GV_HONEYCOMB_SWITCH"] = 325] = "GV_HONEYCOMB_SWITCH";
    ActorType[ActorType["GV_KAZOOIE_TARGET"] = 326] = "GV_KAZOOIE_TARGET";
    ActorType[ActorType["GV_ANCIENT_ONE"] = 327] = "GV_ANCIENT_ONE";
    ActorType[ActorType["BGS_GREEN_JIGGY_SWITCH"] = 334] = "BGS_GREEN_JIGGY_SWITCH";
    ActorType[ActorType["BGS_DESTROYED_JIGGY"] = 335] = "BGS_DESTROYED_JIGGY";
    // 	{id=0x0151, name="Lockup"},
    // 	{id=0x0152, name="Lockup"},
    // 	{id=0x0153, name="Lockup"},
    ActorType[ActorType["FP_CHRISTMAS_TREE"] = 351] = "FP_CHRISTMAS_TREE";
    // 	{id=0x0160, name="Boggy on Sled"},
    // 	{id=0x0161, name="Unknown 0x0161"},
    // 	{id=0x0162, name="Unknown 0x0162"},
    // 	{id=0x0163, name="Bat"},
    ActorType[ActorType["SM_COLIWOBBLE"] = 356] = "SM_COLIWOBBLE";
    // 	{id=0x0165, name="Bawl"},
    ActorType[ActorType["SM_TOPPER"] = 358] = "SM_TOPPER";
    // 	{id=0x0167, name="Coliwobble (Spawns Extra Honeycomb Piece)"},
    ActorType[ActorType["CCW_WINTER_SWITCH"] = 360] = "CCW_WINTER_SWITCH";
    // 	{id=0x0169, name="Door"},
    ActorType[ActorType["CCW_AUTUMN_SWITCH"] = 362] = "CCW_AUTUMN_SWITCH";
    // 	{id=0x016B, name="Door"},
    ActorType[ActorType["CCW_SUMMER_SWITCH"] = 364] = "CCW_SUMMER_SWITCH";
    // 	{id=0x016D, name="Door"},
    ActorType[ActorType["SM_QUARRY"] = 367] = "SM_QUARRY";
    // 	{id=0x0172, name="Weird Green Ball 1"},
    // 	{id=0x0173, name="Weird Green Ball 2"},
    //   {id=0x0174, name="Weird Green Ball 3"},
    // 	{id=0x0175, name="Ship Propeller"},
    // 	{id=0x0176, name="Green propeller switch"},
    // 	{id=0x0177, name="Shaft"},
    // 	{id=0x0178, name="Spinning Platform 1"},
    // 	{id=0x0179, name="Spinning Platform 2"},
    // 	{id=0x017A, name="Spinning Platform 3"},
    // 	{id=0x017B, name="Grey Cog 1"},
    // 	{id=0x017C, name="Grey Cog 2"},
    // 	{id=0x017D, name="Grey Cog 3"},
    // 	{id=0x017E, name="Shaft 1"},
    // 	{id=0x017F, name="Shaft 2"},
    // 	{id=0x0180, name="Shaft 3"},
    // 	{id=0x0181, name="Sled 1"},
    // 	{id=0x0182, name="Sled 2"},
    // 	{id=0x018F, name="Honeycomb Switch"},
    // 	{id=0x0191, name="Secret X Barrel Top"},
    ActorType[ActorType["FILE_SELECT_BANJO_PLAYING_GAMEBOY"] = 406] = "FILE_SELECT_BANJO_PLAYING_GAMEBOY";
    ActorType[ActorType["FILE_SELECT_BANJO_COOKING"] = 407] = "FILE_SELECT_BANJO_COOKING";
    ActorType[ActorType["FILE_SELECT_BANJOS_BED"] = 408] = "FILE_SELECT_BANJOS_BED";
    ActorType[ActorType["FILE_SELECT_BANJOS_CHAIR"] = 409] = "FILE_SELECT_BANJOS_CHAIR";
    ActorType[ActorType["FILE_SELECT_BANJOS_KITCHEN"] = 410] = "FILE_SELECT_BANJOS_KITCHEN";
    // 	{id=0x019B, name="Another Secret can get in desert"},
    // 	{id=0x019B, name="SNS Conversation Regarding Secrets on Beach"},
    // 	{id=0x019C, name="THE END"},
    // 	{id=0x01BB, name="Propeller 7"},
    // 	{id=0x01BC, name="Propeller 8"},
    // 	{id=0x01BD, name="Propeller 9"},
    // 	{id=0x01BE, name="Boat Propeller Switch"},
    // 	{id=0x01BF, name="1 Switch"},
    // 	{id=0x01C0, name="2 Switch"},
    // 	{id=0x01C1, name="3 Switch"},
    // 	{id=0x01C2, name="Gold Whistle 1"},
    // 	{id=0x01C3, name="Gold Whistle 2"},
    // 	{id=0x01C4, name="Gold Whistle 3"},
    // 	{id=0x01C6, name="Pipe"},
    // 	{id=0x01C7, name="Anchor Switch"},
    ActorType[ActorType["RBB_SNORKEL"] = 456] = "RBB_SNORKEL";
    ActorType[ActorType["RBB_ANCHOR_AND_CHAIN"] = 457] = "RBB_ANCHOR_AND_CHAIN";
    ActorType[ActorType["RBB_RAREWARE_FLAG_POLE"] = 458] = "RBB_RAREWARE_FLAG_POLE";
    // 	{id=0x01CC, name="Grill Chompa"},
    ActorType[ActorType["LAIR_CHEATO_1"] = 469] = "LAIR_CHEATO_1";
    ActorType[ActorType["LAIR_CHEATO_2"] = 470] = "LAIR_CHEATO_2";
    ActorType[ActorType["LAIR_CHEATO_3"] = 471] = "LAIR_CHEATO_3";
    // 	{id=0x01D8, name="Big Blue Egg"},
    // 	{id=0x01D9, name="Big Red Feather"},
    // 	{id=0x01DA, name="Big Gold Feather"},
    // 	{id=0x01DB, name="GAME OVER Logo"},
    // 	{id=0x01DC, name="BANJO-KAZOOIE Logo"},
    // 	{id=0x01DD, name="Copyright Info"},
    // 	{id=0x01DE, name="PRESS START"},
    // 	{id=0x01DF, name="NO CONTROLLER"},
    // 	{id=0x01E0, name="Jiggy Picture"},
    // 	{id=0x01E1, name="Iron Gate"},
    // 	{id=0x01E2, name="Spring Switch"},
    // 	{id=0x01E3, name="Door"},
    // 	{id=0x01E4, name="Toots"},
    // 	{id=0x01E5, name="Dust flies"},
    // 	{id=0x01E5, name="Firecrackers?!"},
    // 	--{id=0x01E7, name="Kitchen (Banjo's House)},
    // 	{id=0x01E9, name="Venus Flytrap"},
    ActorType[ActorType["FP_MOGGY"] = 490] = "FP_MOGGY";
    ActorType[ActorType["FP_SOGGY"] = 491] = "FP_SOGGY";
    ActorType[ActorType["FP_GROGGY"] = 492] = "FP_GROGGY";
    ActorType[ActorType["FP_COLLECTABLE_PRESENT_BLUE"] = 493] = "FP_COLLECTABLE_PRESENT_BLUE";
    ActorType[ActorType["FP_COLLECTABLE_PRESENT_GREEN"] = 495] = "FP_COLLECTABLE_PRESENT_GREEN";
    ActorType[ActorType["FP_COLLECTABLE_PRESENT_RED"] = 497] = "FP_COLLECTABLE_PRESENT_RED";
    ActorType[ActorType["FP_WOZZA_OUTSIDE"] = 499] = "FP_WOZZA_OUTSIDE";
    // 	{id=0x01F5, name="Kazooie Door 2"},
    // 	{id=0x01F7, name="Pyramid"},
    // 	{id=0x01F8, name="Unknown 0x01F8"},
    // 	{id=0x01F9, name="Cactus"},
    ActorType[ActorType["BGS_CROCTUS"] = 506] = "BGS_CROCTUS";
    // 	{id=0x01FB, name="BGS Maze Jiggy Switch"},
    // 	{id=0x01FD, name="Clock Switch"},
    // 	{id=0x01FE, name="Gate"},
    // 	{id=0x01FF, name="Red Feather"},
    // 	{id=0x0200, name="Gold Feather"},
    // 	{id=0x0203, name="Note Door"},
    ActorType[ActorType["MM_WITCH_SWITCH"] = 516] = "MM_WITCH_SWITCH";
    ActorType[ActorType["MMM_WITCH_SWITCH"] = 518] = "MMM_WITCH_SWITCH";
    ActorType[ActorType["TTC_WITCH_SWITCH"] = 520] = "TTC_WITCH_SWITCH";
    ActorType[ActorType["RBB_WITCH_SWITCH"] = 523] = "RBB_WITCH_SWITCH";
    // 	{id=0x020D, name="Brick wall"},
    // 	{id=0x020E, name="Entrance door to MM"},
    // 	{id=0x020F, name="RBB Entrance Door"},
    //   {id=0x0210, name="BGS Entrance Door"},
    // 	{id=0x0211, name="Chest lid"},
    // 	{id=0x0212, name="Big Iron Bars"},
    // 	{id=0x0213, name="Circular Grate"},
    // 	{id=0x0214, name="Grate Switch"},
    // 	{id=0x0215, name="Tall Pipe 1"},
    // 	{id=0x0216, name="Tall Pipe 2"},
    // 	{id=0x0217, name="Pipe Switch"},
    // 	{id=0x0218, name="Pipe"},
    // 	{id=0x0219, name="Pipe Switch 2"},
    // 	{id=0x021A, name="CC Entrance grates"},
    // 	{id=0x021B, name="Grunty's Hat"},
    // 	{id=0x021C, name="Wooden Door"},
    // 	{id=0x021D, name="Steel Door"},
    // 	{id=0x021E, name="Circular Green Grate"},
    // 	{id=0x021F, name="Circular Brown Grate"},
    // 	{id=0x0220, name="RBB Jigsaw grate"},
    // 	{id=0x0221, name="Water Switch 1"},
    // 	{id=0x0222, name="Water Switch 2"},
    // 	{id=0x0223, name="Water Switch 3"},
    // 	{id=0x0224, name="Ice Ball"},
    // 	{id=0x0224, name="Sarcopphagus"},
    // 	{id=0x0225, name="Rareware box"},
    // 	{id=0x0226, name="GV Entrance"},
    // 	{id=0x0227, name="Phantom Glow"},
    // 	{id=0x0228, name="Invisible Wall"},
    // 	{id=0x0229, name="House"},
    // 	{id=0x022B, name="Frozen Mumbo Hut"},
    // 	{id=0x022C, name="Christmas Present Stack"},
    // 	{id=0x022D, name="Snowy Bridge"},
    // 	{id=0x022E, name="Snowy Bridge 2"},
    // 	{id=0x022F, name="Snowy Bridge 3"},
    // 	{id=0x0230, name="Cobweb"},
    // 	{id=0x0231, name="Big yellow cobweb"},
    // 	{id=0x0233, name="Mumbo's Hut"},
    // 	{id=0x0234, name="CCW Entrance Door"},
    // 	{id=0x0235, name="FP Entrance Door"},
    // 	{id=0x0236, name="FP Entrance Door 2"},
    ActorType[ActorType["CCW_WITCH_SWITCH"] = 567] = "CCW_WITCH_SWITCH";
    ActorType[ActorType["FP_WITCH_SWITCH"] = 569] = "FP_WITCH_SWITCH";
    // 	{id=0x023A, name="Wooden snow drift texture"},
    // 	{id=0x023B, name="Cauldron"},
    // 	{id=0x023C, name="CCW Switch"},
    // 	{id=0x023D, name="Mumbo Transformation Pad"},
    // 	{id=0x023E, name="Empty wooden coffin"},
    // 	{id=0x023F, name="Skylights"},
    // 	{id=0x0242, name="Unknown 0x0242"},
    // 	{id=0x0243, name="Wooden Panel"},
    // 	{id=0x0244, name="Sarcopphagus Lid"},
    // 	{id=0x0245, name="Sarcopphagus switch"},
    // 	{id=0x0246, name="Flying pad switch"},
    // 	{id=0x0247, name="Kazooie fly disk"},
    //   {id=0x0248, name="Shock jump switch"},
    // 	{id=0x0249, name="Kazooie Shock Spring disc"},
    // 	{id=0x0253, name="Piece of glass panel"},
    // 	{id=0x0254, name="Piece of glass panel"},
    // 	{id=0x0255, name="Tomb"},
    // 	{id=0x0256, name="Witch Switch (GV)"},
    // 	{id=0x0257, name="Witch Switch (BGS)"},
    // 	{id=0x0258, name="Tomb Top"},
    // 	{id=0x0259, name="Grunty eye switch 1"},
    // 	{id=0x025A, name="Grunty eye switch 2"},
    ActorType[ActorType["CC_WITCH_SWITCH"] = 603] = "CC_WITCH_SWITCH";
    // 	{id=0x025C, name="Sharkfood Island"},
    ActorType[ActorType["SNS_ICE_KEY"] = 605] = "SNS_ICE_KEY";
    ActorType[ActorType["SNS_EGG"] = 606] = "SNS_EGG";
    // 	{id=0x025F, name="Nabnut's Window Spring"},
    // 	{id=0x0260, name="Nabnut's Window Summer"},
    // 	{id=0x0261, name="Nabnut's Window Fall"},
    // 	{id=0x0262, name="Nabnut's Window Winter"},
    // 	{id=0x0263, name="Safety Boat"},
    // 	{id=0x0264, name="Safety Boat"},
    // 	{id=0x0265, name="Door"},
    // 	{id=0x0266, name="Window 1"},
    // 	{id=0x0267, name="Window 2"},
    ActorType[ActorType["BGS_TIPTUP"] = 634] = "BGS_TIPTUP";
    // 	{id=0x027B, name="Choir Member (Yellow)"},
    // 	{id=0x027C, name="Choir Member (Cyan)"},
    // 	{id=0x027D, name="Choir Member (Blue)"},
    // 	{id=0x027E, name="Choir Member (Red)"},
    // 	{id=0x027F, name="Choir Member (Pink)"},
    // 	{id=0x0280, name="Choir Member (Purple)"},
    // 	{id=0x0281, name="Kaboom Part 1"},
    // 	{id=0x0282, name="Kaboom Part 2"},
    // 	{id=0x0283, name="Kaboom Part 3"},
    // 	{id=0x0284, name="Kaboom Part 4"},
    // 	{id=0x0285, name="Big Jinxy Head"},
    // 	{id=0x0286, name="Big Jinxy Head 2"},
    // 	{id=0x0287, name="Big Jinxy Head 3"},
    // 	{id=0x0288, name="Weird Green Ball"},
    //   {id=0x0289, name="Vent"},
    // 	{id=0x028A, name="Underwater Whipcrack"},
    // 	{id=0x028B, name="Waterfall/Cauldron Sound"},
    // 	{id=0x028C, name="Green Drain 1"},
    // 	{id=0x028D, name="Green Drain 2"},
    // 	{id=0x028E, name="Green Drain 3"},
    // 	{id=0x028F, name="Vent"},
    // 	{id=0x0290, name="Propeller 10"},
    // 	{id=0x0291, name="Propeller 11"},
    // 	{id=0x0292, name="Spinning SawBlade (Fast)"},
    // 	{id=0x0293, name="Propeller 13"},
    // 	{id=0x0294, name="Propeller 14"},
    // 	{id=0x0295, name="Propeller 15"},
    // 	{id=0x0296, name="Bell Buoy"},
    // 	{id=0x0297, name="Row Boat"},
    // 	{id=0x0298, name="Flat Board"},
    // 	{id=0x0299, name="Lump of Honey"},
    // 	{id=0x029A, name="Flat Board"},
    // 	{id=0x029B, name="Zubba"},
    // 	{id=0x029C, name="Zubba (Attacker)"},
    // 	{id=0x029D, name="Beakstalk"},
    // 	{id=0x029E, name="Gobi"},
    // 	{id=0x029F, name="Big Clucker"},
    // 	{id=0x02A0, name="Unknown 0x02A0"},
    // 	{id=0x02A1, name="Eyrie"},
    // 	{id=0x02A2, name="Catapiller"},
    // 	{id=0x02A3, name="Big Eyrie"},
    // 	{id=0x02A4, name="TNT Box Part 1"},
    // 	{id=0x02A5, name="Extra Life Spawn Location (RBB)"},
    // 	{id=0x02A6, name="Nabnut 1"},
    // 	{id=0x02A7, name="Nabnut 2"},
    // 	{id=0x02A8, name="Nabnut 3"},
    // 	{id=0x02A9, name="Acorn"},
    // 	{id=0x02AA, name="Gnawty 1"},
    // 	{id=0x02AB, name="Gnawty (Summer)"},
    // 	{id=0x02AC, name="Gnawty's Boulder"},
    // 	{id=0x02AE, name="Leaf Particles (Screen Overlay)"},
    // 	{id=0x02B0, name="Rain"},
    // 	{id=0x02B2, name="Snow"},
    // 	{id=0x02B5, name="Nonsense picture"},
    // 	{id=0x02D8, name="Two Poles"},
    // 	{id=0x02D9, name="X 1 (Crashes?)"},
    // 	{id=0x02DA, name="X 2 (Crashes?)"},
    // 	{id=0x02DB, name="Dingpot 3"},
    // 	{id=0x02DC, name="Gnawty's Shelves"},
    // 	{id=0x02DD, name="Gnawty's Bed"},
    // 	{id=0x02DE, name="Gnawty's House"},
    // 	{id=0x02DF, name="Lighthouse"},
    // 	{id=0x02E0, name="Stairs"},
    // 	{id=0x02E1, name="Underwater Ship Warp?"},
    // 	{id=0x02E2, name="Lighthouse Body"},
    //   {id=0x02E3, name="World Entrance Sign"}, -- MM, RBB
    // 	{id=0x02E4, name="Level Entry/Exit"},
    // 	{id=0x02E5, name="Wooden Door"},
    // 	{id=0x02E6, name="Nabnut's Door"},
    // 	{id=0x02E7, name="Wooden Door"},
    // 	{id=0x02E8, name="Window 3"},
    // 	{id=0x02E9, name="Short Window"},
    // 	{id=0x02EA, name="Tall Window"},
    // 	{id=0x02ED, name="Machine Room Booth"},
    // 	{id=0x02EE, name="Klungo 1"},
    // 	{id=0x02EF, name="Tooty 0x02EF"},
    // 	{id=0x02F0, name="Machine Room Console"},
    // 	{id=0x02F1, name="Tooty's force field"},
    // 	{id=0x02F2, name="Machine Room booth"},
    // 	{id=0x02F3, name="Lightning"},
    // 	{id=0x02F4, name="Roysten's Bowl"},
    // 	{id=0x02F5, name="Cuckoo Clock"},
    // 	{id=0x02F6, name="Yellow Jinjo 0x02F6"},
    // 	{id=0x02F7, name="Yellow Jinjo 0x02F7"},
    // 	{id=0x02F8, name="Yellow Jinjo 0x02F8"},
    // 	{id=0x02F9, name="Yellow Jinjo 0x02F9"},
    // 	{id=0x02FA, name="Klungo 2"},
    // 	{id=0x02FC, name="Mumbo 0x02FC"},
    // 	{id=0x02FD, name="Snacker"},
    // 	{id=0x02FE, name="Yellow Jinjo 0x02FE"},
    // 	{id=0x02FF, name="Unknown 0x02FF"},
    // 	{id=0x0300, name="Unknown 0x0300"},
    // 	{id=0x0301, name="Blubber"},
    // 	{id=0x0302, name="Rock"},
    // 	{id=0x0303, name="Yellow Jinjo 0x0303"},
    // 	{id=0x0304, name="Yellow Jinjo 0x0304"},
    // 	{id=0x0305, name="Yellow Jinjo 0x0305"},
    // 	{id=0x0306, name="Yellow Jinjo 0x0306"},
    // 	{id=0x0307, name="Yellow Jinjo 0x0307"},
    // 	{id=0x0308, name="Yellow Jinjo 0x0308"},
    // 	{id=0x0309, name="Yellow Jinjo 0x0309"},
    // 	{id=0x030A, name="Yellow Jinjo 0x030A"},
    // 	{id=0x030B, name="Dead Beanstalk"},
    // 	{id=0x030C, name="'Z' Logo"},
    // 	{id=0x030D, name="TNT Box Part 2"},
    // 	{id=0x030E, name="Eyrie Big "},
    // 	{id=0x030F, name="Whip Crack"},
    // 	{id=0x0310, name="Acorn mound"},
    // 	{id=0x0311, name="Nabnut's Wife"},
    // 	{id=0x0312, name="Nabnut's Bed Covers"},
    // 	{id=0x0313, name="Nabnut's Duvet"},
    // 	{id=0x0314, name="Nabnut 4"},
    // 	{id=0x0315, name="Nabnut (Top Half)"},
    // 	{id=0x031A, name="Gnawty (Winter)"},
    // 	{id=0x031C, name="Stationary Platform (Engine Room)"},
    // 	{id=0x031D, name="Pyramid 2"},
    // 	{id=0x031E, name="Palm Tree"},
    // 	{id=0x0332, name="Blue Twinkly"},
    // 	{id=0x0333, name="Green Twinkly"},
    // 	{id=0x0334, name="Orange Twinkly"},
    // 	{id=0x0335, name="Red Twinkly"},
    // 	{id=0x0336, name="Twinkly Box"},
    // 	{id=0x0337, name="Twinkly Muncher"},
    // 	{id=0x0338, name="Christmas Tree Switch"},
    // 	{id=0x0339, name="Christmas Tree"},
    //   {id=0x033A, name="Blue Present 0x033A"},
    // 	{id=0x033B, name="Green Pesent 0x033B"},
    // 	{id=0x033C, name="Red Present 0x033C"},
    // 	{id=0x033D, name="Boggy on Sled 3"},
    // 	{id=0x033E, name="Nintendo Cube?"},
    // 	{id=0x033F, name="Wozza (In Cave)"},
    // 	{id=0x0340, name="Ice Tree"},
    // 	{id=0x0341, name="Unknown 0x0341"},
    // 	{id=0x0348, name="Brentilda"},
    // 	{id=0x034D, name="Bee Swarm"},
    // 	{id=0x034E, name="Limbo"},
    // 	{id=0x034F, name="Mummy"},
    // 	{id=0x0350, name="Sea Grublin"},
    // 	{id=0x0352, name="Grunty after first note door"},
    // 	{id=0x0353, name="Weird green ball"},
    // 	{id=0x0354, name="Water Drops"},
    // 	{id=0x0355, name="Purple ice pole"},
    // 	{id=0x0356, name="Green Ice Pole"},
    // 	{id=0x0357, name="Big Ice Pole"},
    // 	{id=0x0358, name="Ice Pole"},
    // 	{id=0x035D, name="Ice pole"},
    // 	{id=0x035E, name="Race rostrum"},
    // 	{id=0x035F, name="Finish banner"},
    // 	{id=0x0360, name="Start banner"},
    // 	--id=0x361, name="Stop n' Swap?"},
    // 	{id=0x0367, name="Gruntling"},
    // 	{id=0x0368, name="Mumbo Token Sign (5)"},
    // 	{id=0x0369, name="Mumbo Token Sign (20)"},
    // 	{id=0x036A, name="Mumbo Token Sign (15)"},
    // 	{id=0x036B, name="Mumbo Token Sign (10)"},
    // 	{id=0x036C, name="Mumbo Token Sign (25)"},
    // 	{id=0x036D, name="Coliwobble"},
    // 	{id=0x036E, name="Bawl"},
    // 	{id=0x036F, name="Topper"},
    // 	{id=0x0370, name="Gold Feather"},
    // 	{id=0x0374, name="Text Trigger (Mumbo's On Vacation)"},
    // 	{id=0x0375, name="Grublin Hood"},
    // 	{id=0x0376, name="Boss Boom Box"},
    // 	--{id=0x037A, name="Assosiated with MoleHill"}, --talk volume?
    // 	{id=0x037C, name="Dust or Steam Cloud"},
    // 	{id=0x037D, name="Ice Cube"},
    // 	{id=0x037E, name="Dead Venus Flytrap"},
    // 	{id=0x037F, name="Loggo"},
    // 	{id=0x0380, name="Beetle"},
    // 	{id=0x0381, name="Portrait Chompa"},
    // 	{id=0x0382, name="Portrait (Grunty)"},
    // 	{id=0x0383, name="Fire"},
    // 	{id=0x0384, name="Steam and sparks"},
    // 	{id=0x0385, name="Portrait (Blackeye)"},
    // 	{id=0x0386, name="Portrait (Tower)"},
    // 	{id=0x0387, name="Portrait (Tree)"},
    //   {id=0x0388, name="Portrait (Ghosts)"},
    // 	{id=0x0389, name="Fireball"},
    // 	{id=0x038A, name="Green Blast"},
    // 	{id=0x038B, name="Grunty"},
    // 	{id=0x03A0, name="Ice Cube"},
    // 	{id=0x03A1, name="Jinjonator Stand"},
    // 	{id=0x03A2, name="Jinjo Stand"},
    // 	{id=0x03A5, name="Orange Jinjo"},
    // 	{id=0x03A6, name="Green Jinjo"},
    // 	{id=0x03A7, name="Purple Jinjo"},
    // 	{id=0x03A8, name="Yellow Jinjo 0x03A8"},
    // 	{id=0x03AA, name="Big Green Blast"},
    // 	{id=0x03AC, name="Jinjonator"},
    // 	{id=0x03AD, name="Rock Smash"},
    // 	{id=0x03AE, name="Boggy's Igloo"},
    // 	{id=0x03AF, name="Shadow"},
    // 	{id=0x03B0, name="House chimney"},
    // 	{id=0x03B7, name="Puzzle Jiggy Podium"},
    // 	{id=0x03BB, name="Fireball"},
    // 	{id=0x03BC, name="Jiggy Podium"},
    // 	{id=0x03BF, name="Gruntling 2"},
    // 	{id=0x03C0, name="Gruntling 3"},
    // 	{id=0x03C1, name="Purple TeeHee"},
    // 	{id=0x03C2, name="Unknown 0x03C2"},
    // 	{id=0x03C4, name="Washing machine Cauldron"},
    // 	{id=0x03C5, name="Gruntilda (Furnace Fun)"},
    // 	{id=0x03C6, name="Furnace Fun Podium"},
    // 	{id=0x03C7, name="Grunty Doll (Furnace Fun)"},
    // 	{id=0x03C8, name="Tooty (Furnace Fun)"},
})(ActorType = exports.ActorType || (exports.ActorType = {}));
var AnimalType;
(function (AnimalType) {
    AnimalType[AnimalType["UNKNOWN"] = 0] = "UNKNOWN";
    AnimalType[AnimalType["BEAR_BIRD"] = 1] = "BEAR_BIRD";
    AnimalType[AnimalType["TERMITE"] = 2] = "TERMITE";
    AnimalType[AnimalType["PUMPKIN"] = 3] = "PUMPKIN";
    AnimalType[AnimalType["WALRUS"] = 4] = "WALRUS";
    AnimalType[AnimalType["CROCODILE"] = 5] = "CROCODILE";
    AnimalType[AnimalType["BEE"] = 6] = "BEE";
    AnimalType[AnimalType["WASHING_MACHINE"] = 7] = "WASHING_MACHINE";
})(AnimalType = exports.AnimalType || (exports.AnimalType = {}));
var ExitType;
(function (ExitType) {
    ExitType[ExitType["UNKNOWN"] = 0] = "UNKNOWN";
    ExitType[ExitType["MM_MAIN_MUMBOS_SKULL"] = 1] = "MM_MAIN_MUMBOS_SKULL";
    ExitType[ExitType["MM_MAIN_TICKERS_TOWER_BOTTOM"] = 2] = "MM_MAIN_TICKERS_TOWER_BOTTOM";
    ExitType[ExitType["MM_MAIN_TICKERS_TOPER_TOP"] = 3] = "MM_MAIN_TICKERS_TOPER_TOP";
    ExitType[ExitType["MM_MAIN_BUTTON_CUTSCENE"] = 4] = "MM_MAIN_BUTTON_CUTSCENE";
    ExitType[ExitType["MM_MAIN_LEVEL_ENTRANCE"] = 5] = "MM_MAIN_LEVEL_ENTRANCE";
    ExitType[ExitType["TTC_MAIN_SANDCASTLE"] = 3] = "TTC_MAIN_SANDCASTLE";
    ExitType[ExitType["TTC_MAIN_LEVEL_ENTRANCE"] = 4] = "TTC_MAIN_LEVEL_ENTRANCE";
    ExitType[ExitType["TTC_BLUBBERS_SHIP_TOP"] = 5] = "TTC_BLUBBERS_SHIP_TOP";
    ExitType[ExitType["TTC_BLUBBERS_SHIP_BOTTOM"] = 6] = "TTC_BLUBBERS_SHIP_BOTTOM";
    ExitType[ExitType["TTC_MAIN_BLUBBERS_SHIP_TOP"] = 6] = "TTC_MAIN_BLUBBERS_SHIP_TOP";
    ExitType[ExitType["TTC_MAIN_BLUBBERS_SHIP_SIDE"] = 7] = "TTC_MAIN_BLUBBERS_SHIP_SIDE";
    ExitType[ExitType["TTC_MAIN_LIGHTHOUSE_TOP"] = 8] = "TTC_MAIN_LIGHTHOUSE_TOP";
    ExitType[ExitType["TTC_MAIN_NIPPER"] = 10] = "TTC_MAIN_NIPPER";
    ExitType[ExitType["TTC_LIGHTHOUSE_BOTTOM"] = 12] = "TTC_LIGHTHOUSE_BOTTOM";
    ExitType[ExitType["TTC_STAIR_ALCOVE_TOP"] = 14] = "TTC_STAIR_ALCOVE_TOP";
    ExitType[ExitType["TTC_STAIR_ALCOVE_BOTTOM"] = 15] = "TTC_STAIR_ALCOVE_BOTTOM";
    ExitType[ExitType["SM_MAIN_BANJOS_HOUSE"] = 18] = "SM_MAIN_BANJOS_HOUSE";
    ExitType[ExitType["SM_MAIN_GRUNTILDAS_LAIR"] = 19] = "SM_MAIN_GRUNTILDAS_LAIR";
})(ExitType = exports.ExitType || (exports.ExitType = {}));
var InventoryType;
(function (InventoryType) {
    InventoryType[InventoryType["TIMER_HOURGLASS1"] = 0] = "TIMER_HOURGLASS1";
    InventoryType[InventoryType["TIMER_SKULL"] = 4] = "TIMER_SKULL";
    InventoryType[InventoryType["TIMER_PROPELLOR"] = 12] = "TIMER_PROPELLOR";
    InventoryType[InventoryType["TIMER_XMAS_TREE"] = 20] = "TIMER_XMAS_TREE";
    InventoryType[InventoryType["TIMER_HOURGLASS2"] = 24] = "TIMER_HOURGLASS2";
    InventoryType[InventoryType["CUR_LVL_NOTES"] = 48] = "CUR_LVL_NOTES";
    InventoryType[InventoryType["EGGS"] = 52] = "EGGS";
    InventoryType[InventoryType["CUR_LVL_JIGGIES"] = 56] = "CUR_LVL_JIGGIES";
    InventoryType[InventoryType["FEATHERS_RED"] = 60] = "FEATHERS_RED";
    InventoryType[InventoryType["FEATHERS_GOLD"] = 64] = "FEATHERS_GOLD";
    InventoryType[InventoryType["CUR_LVL_JINJOS"] = 72] = "CUR_LVL_JINJOS";
    InventoryType[InventoryType["HONEYCOMBS_EMPTY"] = 76] = "HONEYCOMBS_EMPTY";
    InventoryType[InventoryType["HEALTH"] = 80] = "HEALTH";
    InventoryType[InventoryType["HEALTH_CONTAINERS"] = 84] = "HEALTH_CONTAINERS";
    InventoryType[InventoryType["LIVES"] = 88] = "LIVES";
    InventoryType[InventoryType["AIR"] = 92] = "AIR";
    InventoryType[InventoryType["CUR_LVL_GOLD_BULLION"] = 96] = "CUR_LVL_GOLD_BULLION";
    InventoryType[InventoryType["CUR_LVL_ORANGE"] = 100] = "CUR_LVL_ORANGE";
    InventoryType[InventoryType["VILE_SCORE_PLYR"] = 104] = "VILE_SCORE_PLYR";
    InventoryType[InventoryType["VILE_SCORE_VILE"] = 108] = "VILE_SCORE_VILE";
    InventoryType[InventoryType["MUMBO_TOKENS_HELD"] = 112] = "MUMBO_TOKENS_HELD";
    InventoryType[InventoryType["GRUMBLIES"] = 116] = "GRUMBLIES";
    InventoryType[InventoryType["YUMBLIES"] = 120] = "YUMBLIES";
    InventoryType[InventoryType["CUR_LVL_PRESENT_GREEN"] = 124] = "CUR_LVL_PRESENT_GREEN";
    InventoryType[InventoryType["CUR_LVL_PRESENT_BLUE"] = 128] = "CUR_LVL_PRESENT_BLUE";
    InventoryType[InventoryType["CUR_LVL_PRESENT_RED"] = 132] = "CUR_LVL_PRESENT_RED";
    InventoryType[InventoryType["CUR_LVL_CATERPILLARS"] = 136] = "CUR_LVL_CATERPILLARS";
    InventoryType[InventoryType["CUR_LVL_ACORNS"] = 140] = "CUR_LVL_ACORNS";
    InventoryType[InventoryType["TWINKLIES"] = 144] = "TWINKLIES";
    InventoryType[InventoryType["MUMBO_TOKENS"] = 148] = "MUMBO_TOKENS";
    InventoryType[InventoryType["JIGGIES"] = 152] = "JIGGIES";
    InventoryType[InventoryType["JOKER_CARD"] = 156] = "JOKER_CARD";
    InventoryType[InventoryType["TEXT_JIGGIES"] = 172] = "TEXT_JIGGIES";
    InventoryType[InventoryType["NOTE_TOTALS"] = 192] = "NOTE_TOTALS";
})(InventoryType = exports.InventoryType || (exports.InventoryType = {}));
var JinjoType;
(function (JinjoType) {
    JinjoType[JinjoType["BLUE"] = 0] = "BLUE";
    JinjoType[JinjoType["GREEN"] = 1] = "GREEN";
    JinjoType[JinjoType["ORANGE"] = 2] = "ORANGE";
    JinjoType[JinjoType["PINK"] = 3] = "PINK";
    JinjoType[JinjoType["YELLOW"] = 4] = "YELLOW";
})(JinjoType = exports.JinjoType || (exports.JinjoType = {}));
var LevelType;
(function (LevelType) {
    LevelType[LevelType["UNKNOWN"] = 0] = "UNKNOWN";
    LevelType[LevelType["MUMBOS_MOUNTAIN"] = 1] = "MUMBOS_MOUNTAIN";
    LevelType[LevelType["TREASURE_TROVE_COVE"] = 2] = "TREASURE_TROVE_COVE";
    LevelType[LevelType["CLANKERS_CAVERN"] = 3] = "CLANKERS_CAVERN";
    LevelType[LevelType["BUBBLE_GLOOP_SWAMP"] = 4] = "BUBBLE_GLOOP_SWAMP";
    LevelType[LevelType["FREEZEEZY_PEAK"] = 5] = "FREEZEEZY_PEAK";
    LevelType[LevelType["GRUNTILDAS_LAIR"] = 6] = "GRUNTILDAS_LAIR";
    LevelType[LevelType["GOBEYS_VALEY"] = 7] = "GOBEYS_VALEY";
    LevelType[LevelType["CLICK_CLOCK_WOODS"] = 8] = "CLICK_CLOCK_WOODS";
    LevelType[LevelType["RUSTY_BUCKET_BAY"] = 9] = "RUSTY_BUCKET_BAY";
    LevelType[LevelType["MAD_MONSTER_MANSION"] = 10] = "MAD_MONSTER_MANSION";
    LevelType[LevelType["SPIRAL_MOUNTAIN"] = 11] = "SPIRAL_MOUNTAIN";
    LevelType[LevelType["GRUNTILDAS_LAIR_ROOF"] = 12] = "GRUNTILDAS_LAIR_ROOF";
    LevelType[LevelType["TITLE_SCREEN"] = 13] = "TITLE_SCREEN";
})(LevelType = exports.LevelType || (exports.LevelType = {}));
var MoveType;
(function (MoveType) {
    MoveType[MoveType["BEAK_BARGE"] = 0] = "BEAK_BARGE";
    MoveType[MoveType["BEAK_BOMB"] = 1] = "BEAK_BOMB";
    MoveType[MoveType["BEAK_BUSTER"] = 1] = "BEAK_BUSTER";
    MoveType[MoveType["CAMERA_CONTROLS"] = 3] = "CAMERA_CONTROLS";
    MoveType[MoveType["BEAR_PUNCH"] = 4] = "BEAR_PUNCH";
    MoveType[MoveType["CLIMB_POLES"] = 5] = "CLIMB_POLES";
    MoveType[MoveType["EGGS"] = 6] = "EGGS";
    MoveType[MoveType["FEATHERY_FLAP"] = 7] = "FEATHERY_FLAP";
    MoveType[MoveType["FLIP_FLAP"] = 8] = "FLIP_FLAP";
    MoveType[MoveType["FLYING"] = 9] = "FLYING";
    MoveType[MoveType["VARIABLE_JUMP_HEIGHT"] = 10] = "VARIABLE_JUMP_HEIGHT";
    MoveType[MoveType["RAT_A_TAT_RAP"] = 11] = "RAT_A_TAT_RAP";
    MoveType[MoveType["ROLL"] = 12] = "ROLL";
    MoveType[MoveType["SHOCK_SPRING_JUMP"] = 13] = "SHOCK_SPRING_JUMP";
    MoveType[MoveType["WADDING_BOOTS"] = 14] = "WADDING_BOOTS";
    MoveType[MoveType["DIVE"] = 15] = "DIVE";
    MoveType[MoveType["TALON_TROT"] = 16] = "TALON_TROT";
    MoveType[MoveType["TURBO_TALON_TRAINERS"] = 17] = "TURBO_TALON_TRAINERS";
    MoveType[MoveType["WONDERWING"] = 18] = "WONDERWING";
    MoveType[MoveType["NOTE_DOOR_MOLE_HILL"] = 19] = "NOTE_DOOR_MOLE_HILL";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var ProfileType;
(function (ProfileType) {
    ProfileType[ProfileType["Title"] = -1] = "Title";
    ProfileType[ProfileType["A"] = 0] = "A";
    ProfileType[ProfileType["B"] = 2] = "B";
    ProfileType[ProfileType["C"] = 1] = "C";
})(ProfileType = exports.ProfileType || (exports.ProfileType = {}));
var SceneType;
(function (SceneType) {
    SceneType[SceneType["UNKNOWN"] = 0] = "UNKNOWN";
    SceneType[SceneType["SM_MAIN"] = 1] = "SM_MAIN";
    SceneType[SceneType["MM_MAIN"] = 2] = "MM_MAIN";
    SceneType[SceneType["UNKNOWN_0X03"] = 3] = "UNKNOWN_0X03";
    SceneType[SceneType["UNKNOWN_0x04"] = 4] = "UNKNOWN_0x04";
    SceneType[SceneType["TTC_BLUBBERS_SHIP"] = 5] = "TTC_BLUBBERS_SHIP";
    SceneType[SceneType["TTC_NIPPERS_SHELL"] = 6] = "TTC_NIPPERS_SHELL";
    SceneType[SceneType["TTC_MAIN"] = 7] = "TTC_MAIN";
    SceneType[SceneType["UNKNOWN_0X08"] = 8] = "UNKNOWN_0X08";
    SceneType[SceneType["UNKNOWN_0x09"] = 9] = "UNKNOWN_0x09";
    SceneType[SceneType["TTC_SANDCASTLE"] = 10] = "TTC_SANDCASTLE";
    SceneType[SceneType["CC_CLANKERS_CAVERN"] = 11] = "CC_CLANKERS_CAVERN";
    SceneType[SceneType["MM_TICKERS_TOWER"] = 12] = "MM_TICKERS_TOWER";
    SceneType[SceneType["BGS_MAIN"] = 13] = "BGS_MAIN";
    SceneType[SceneType["MM_MUMBOS_SKULL"] = 14] = "MM_MUMBOS_SKULL";
    SceneType[SceneType["UNKNOWN_0X0F"] = 15] = "UNKNOWN_0X0F";
    SceneType[SceneType["BGS_MR_VILE"] = 16] = "BGS_MR_VILE";
    SceneType[SceneType["BGS_TIPTUP"] = 17] = "BGS_TIPTUP";
    SceneType[SceneType["GV_MAIN"] = 18] = "GV_MAIN";
    SceneType[SceneType["GV_MATCHING_GAME"] = 19] = "GV_MATCHING_GAME";
    SceneType[SceneType["GV_MAZE"] = 20] = "GV_MAZE";
    SceneType[SceneType["GV_WATER"] = 21] = "GV_WATER";
    SceneType[SceneType["GV_RUBEES_CHAMBER"] = 22] = "GV_RUBEES_CHAMBER";
    SceneType[SceneType["UNKNOWN_0X17"] = 23] = "UNKNOWN_0X17";
    SceneType[SceneType["UNKNOWN_0X18"] = 24] = "UNKNOWN_0X18";
    SceneType[SceneType["UNKNOWN_0X19"] = 25] = "UNKNOWN_0X19";
    SceneType[SceneType["GV_SPHINX"] = 26] = "GV_SPHINX";
    SceneType[SceneType["MMM_MAIN"] = 27] = "MMM_MAIN";
    SceneType[SceneType["MMM_CHURCH_1"] = 28] = "MMM_CHURCH_1";
    SceneType[SceneType["MMM_CELLAR"] = 29] = "MMM_CELLAR";
    SceneType[SceneType["START_NINTENDO"] = 30] = "START_NINTENDO";
    SceneType[SceneType["START_RAREWARE"] = 31] = "START_RAREWARE";
    SceneType[SceneType["END_SCENE_2_"] = 32] = "END_SCENE_2_";
    SceneType[SceneType["CC_WITCH_SWITCH"] = 33] = "CC_WITCH_SWITCH";
    SceneType[SceneType["CC_INSIDE_CLANKER"] = 34] = "CC_INSIDE_CLANKER";
    SceneType[SceneType["CC_GOLD_FEATHER"] = 35] = "CC_GOLD_FEATHER";
    SceneType[SceneType["MMM_TIMBLAR_SHED"] = 36] = "MMM_TIMBLAR_SHED";
    SceneType[SceneType["MMM_WELL"] = 37] = "MMM_WELL";
    SceneType[SceneType["MMM_DINING_ROOM_NAPPER"] = 38] = "MMM_DINING_ROOM_NAPPER";
    SceneType[SceneType["FP_MAIN"] = 39] = "FP_MAIN";
    SceneType[SceneType["MMM_ROOM_1"] = 40] = "MMM_ROOM_1";
    SceneType[SceneType["MMM_ROOM_2"] = 41] = "MMM_ROOM_2";
    SceneType[SceneType["MMM_FIREPLACE"] = 42] = "MMM_FIREPLACE";
    SceneType[SceneType["MMM_CHURCH_2"] = 43] = "MMM_CHURCH_2";
    SceneType[SceneType["MMM_BATHROOM"] = 44] = "MMM_BATHROOM";
    SceneType[SceneType["MMM_BEDROOM"] = 45] = "MMM_BEDROOM";
    SceneType[SceneType["MMM_FLOORBOARDS"] = 46] = "MMM_FLOORBOARDS";
    SceneType[SceneType["MMM_BARREL"] = 47] = "MMM_BARREL";
    SceneType[SceneType["MMM_MUMBOS_SKULL"] = 48] = "MMM_MUMBOS_SKULL";
    SceneType[SceneType["RBB_MAIN"] = 49] = "RBB_MAIN";
    SceneType[SceneType["UNKNOWN_0X32"] = 50] = "UNKNOWN_0X32";
    SceneType[SceneType["UNKNOWN_0X33"] = 51] = "UNKNOWN_0X33";
    SceneType[SceneType["RBB_ENGINE_ROOM"] = 52] = "RBB_ENGINE_ROOM";
    SceneType[SceneType["RBB_WAREHOUSE_1"] = 53] = "RBB_WAREHOUSE_1";
    SceneType[SceneType["RBB_WAREHOUSE_2"] = 54] = "RBB_WAREHOUSE_2";
    SceneType[SceneType["RBB_CONTAINER_1"] = 55] = "RBB_CONTAINER_1";
    SceneType[SceneType["RBB_CONTAINER_3"] = 56] = "RBB_CONTAINER_3";
    SceneType[SceneType["RBB_CREW_CABIN"] = 57] = "RBB_CREW_CABIN";
    SceneType[SceneType["RBB_BOSS_BOOM_BOX"] = 58] = "RBB_BOSS_BOOM_BOX";
    SceneType[SceneType["RBB_STORE_ROOM"] = 59] = "RBB_STORE_ROOM";
    SceneType[SceneType["RBB_KITCHEN"] = 60] = "RBB_KITCHEN";
    SceneType[SceneType["RBB_NAVIGATION_ROOM"] = 61] = "RBB_NAVIGATION_ROOM";
    SceneType[SceneType["RBB_CONTAINER_2"] = 62] = "RBB_CONTAINER_2";
    SceneType[SceneType["RBB_CAPTAINS_CABIN"] = 63] = "RBB_CAPTAINS_CABIN";
    SceneType[SceneType["CCW_MAIN"] = 64] = "CCW_MAIN";
    SceneType[SceneType["FP_BOGGYS_IGLOO"] = 65] = "FP_BOGGYS_IGLOO";
    SceneType[SceneType["UNKNOWN_0X42"] = 66] = "UNKNOWN_0X42";
    SceneType[SceneType["CCW_SPRING"] = 67] = "CCW_SPRING";
    SceneType[SceneType["CCW_SUMMER"] = 68] = "CCW_SUMMER";
    SceneType[SceneType["CCW_AUTUMN"] = 69] = "CCW_AUTUMN";
    SceneType[SceneType["CCW_WINTER"] = 70] = "CCW_WINTER";
    SceneType[SceneType["BGS_MUMBOS_SKULL"] = 71] = "BGS_MUMBOS_SKULL";
    SceneType[SceneType["FP_MUMBOS_SKULL"] = 72] = "FP_MUMBOS_SKULL";
    SceneType[SceneType["UNKNOWN_0X49"] = 73] = "UNKNOWN_0X49";
    SceneType[SceneType["CCW_SPRING_MUMBOS_SKULL"] = 74] = "CCW_SPRING_MUMBOS_SKULL";
    SceneType[SceneType["CCW_SUMMER_MUMBOS_SKULL"] = 75] = "CCW_SUMMER_MUMBOS_SKULL";
    SceneType[SceneType["CCW_AUTUMN_MUMBOS_SKULL"] = 76] = "CCW_AUTUMN_MUMBOS_SKULL";
    SceneType[SceneType["CCW_WINTER_MUMBOS_SKULL"] = 77] = "CCW_WINTER_MUMBOS_SKULL";
    SceneType[SceneType["UNKNOWN_0X4E"] = 78] = "UNKNOWN_0X4E";
    SceneType[SceneType["UNKNOWN_0X4F"] = 79] = "UNKNOWN_0X4F";
    SceneType[SceneType["UNKNOWN_0X50"] = 80] = "UNKNOWN_0X50";
    SceneType[SceneType["UNKNOWN_0X51"] = 81] = "UNKNOWN_0X51";
    SceneType[SceneType["UNKNOWN_0X52"] = 82] = "UNKNOWN_0X52";
    SceneType[SceneType["FP_INSIDE_XMAS_TREE"] = 83] = "FP_INSIDE_XMAS_TREE";
    SceneType[SceneType["UNKNOWN_0X54"] = 84] = "UNKNOWN_0X54";
    SceneType[SceneType["UNKNOWN_0X55"] = 85] = "UNKNOWN_0X55";
    SceneType[SceneType["UNKNOWN_0X56"] = 86] = "UNKNOWN_0X56";
    SceneType[SceneType["UNKNOWN_0X57"] = 87] = "UNKNOWN_0X57";
    SceneType[SceneType["UNKNOWN_0X58"] = 88] = "UNKNOWN_0X58";
    SceneType[SceneType["UNKNOWN_0X59"] = 89] = "UNKNOWN_0X59";
    SceneType[SceneType["CCW_SUMMER_ZUBBAS_HIVE"] = 90] = "CCW_SUMMER_ZUBBAS_HIVE";
    SceneType[SceneType["CCW_SPRING_ZUBBAS_HIVE"] = 91] = "CCW_SPRING_ZUBBAS_HIVE";
    SceneType[SceneType["CCW_AUTUMN_ZUBBAS_HIVE"] = 92] = "CCW_AUTUMN_ZUBBAS_HIVE";
    SceneType[SceneType["UNKNOWN_0X5D"] = 93] = "UNKNOWN_0X5D";
    SceneType[SceneType["CCW_SPRING_NABNUTS_HOUSE"] = 94] = "CCW_SPRING_NABNUTS_HOUSE";
    SceneType[SceneType["CCW_SUMMER_NABNUTS_HOUSE"] = 95] = "CCW_SUMMER_NABNUTS_HOUSE";
    SceneType[SceneType["CCW_AUTUMN_NABNUTS_HOUSE"] = 96] = "CCW_AUTUMN_NABNUTS_HOUSE";
    SceneType[SceneType["CCW_WINTER_NABNUTS_HOUSE"] = 97] = "CCW_WINTER_NABNUTS_HOUSE";
    SceneType[SceneType["CCW_WINTER_NABNUTS_1"] = 98] = "CCW_WINTER_NABNUTS_1";
    SceneType[SceneType["CCW_AUTUMN_NABNUTS_2"] = 99] = "CCW_AUTUMN_NABNUTS_2";
    SceneType[SceneType["CCW_WINTER_NABNUTS_2"] = 100] = "CCW_WINTER_NABNUTS_2";
    SceneType[SceneType["CCW_SPRING_TOP"] = 101] = "CCW_SPRING_TOP";
    SceneType[SceneType["CCW_SUMMER_TOP"] = 102] = "CCW_SUMMER_TOP";
    SceneType[SceneType["CCW_AUTUMN_TOP"] = 103] = "CCW_AUTUMN_TOP";
    SceneType[SceneType["CCW_WINTER_TOP"] = 104] = "CCW_WINTER_TOP";
    SceneType[SceneType["GL_LOBBY_MM"] = 105] = "GL_LOBBY_MM";
    SceneType[SceneType["GL_PUZZLE_TTC"] = 106] = "GL_PUZZLE_TTC";
    SceneType[SceneType["GL_PUZZLE_CC"] = 106] = "GL_PUZZLE_CC";
    SceneType[SceneType["GL_NOTE_DOOR_180"] = 107] = "GL_NOTE_DOOR_180";
    SceneType[SceneType["GL_PUZZLE_CCW"] = 107] = "GL_PUZZLE_CCW";
    SceneType[SceneType["GL_RED_CAULDRON"] = 108] = "GL_RED_CAULDRON";
    SceneType[SceneType["GL_LOBBY_TTC"] = 109] = "GL_LOBBY_TTC";
    SceneType[SceneType["GL_LOBBY_GV"] = 110] = "GL_LOBBY_GV";
    SceneType[SceneType["GL_LOBBY_FP"] = 111] = "GL_LOBBY_FP";
    SceneType[SceneType["GL_LOBBY_CC"] = 112] = "GL_LOBBY_CC";
    SceneType[SceneType["GL_WITCH_STATUE"] = 113] = "GL_WITCH_STATUE";
    SceneType[SceneType["GL_LOBBY_BGS"] = 114] = "GL_LOBBY_BGS";
    SceneType[SceneType["UNKNOWN_0X73"] = 115] = "UNKNOWN_0X73";
    SceneType[SceneType["GL_PUZZLE_GV"] = 116] = "GL_PUZZLE_GV";
    SceneType[SceneType["GL_LOBBY_MMM"] = 117] = "GL_LOBBY_MMM";
    SceneType[SceneType["GL_NOTE_DOOR_640"] = 118] = "GL_NOTE_DOOR_640";
    SceneType[SceneType["GL_LOBBY_RBB"] = 119] = "GL_LOBBY_RBB";
    SceneType[SceneType["GL_PUZZLE_RBB"] = 120] = "GL_PUZZLE_RBB";
    SceneType[SceneType["GL_LOBBY_CCW"] = 121] = "GL_LOBBY_CCW";
    SceneType[SceneType["GL_FLOOR_2_CRYPT_INSIDE"] = 122] = "GL_FLOOR_2_CRYPT_INSIDE";
    SceneType[SceneType["INTRO_LAIR_1"] = 123] = "INTRO_LAIR_1";
    SceneType[SceneType["INTRO_BANJO_HOUSE_1"] = 124] = "INTRO_BANJO_HOUSE_1";
    SceneType[SceneType["INTRO_SPIRAL_A"] = 125] = "INTRO_SPIRAL_A";
    SceneType[SceneType["INTRO_SPIRAL_B"] = 126] = "INTRO_SPIRAL_B";
    SceneType[SceneType["FP_WOZZAS_CAVE"] = 127] = "FP_WOZZAS_CAVE";
    SceneType[SceneType["GL_FLOOR_3"] = 128] = "GL_FLOOR_3";
    SceneType[SceneType["INTRO_LAIR_2"] = 129] = "INTRO_LAIR_2";
    SceneType[SceneType["INTRO_MACHINE_1"] = 130] = "INTRO_MACHINE_1";
    SceneType[SceneType["INTRO_GAME_OVER"] = 131] = "INTRO_GAME_OVER";
    SceneType[SceneType["INTRO_LAIR_5"] = 132] = "INTRO_LAIR_5";
    SceneType[SceneType["INTRO_SPIRAL_C"] = 133] = "INTRO_SPIRAL_C";
    SceneType[SceneType["INTRO_SPIRAL_D"] = 134] = "INTRO_SPIRAL_D";
    SceneType[SceneType["INTRO_SPIRAL_E"] = 135] = "INTRO_SPIRAL_E";
    SceneType[SceneType["INTRO_SPIRAL_F"] = 136] = "INTRO_SPIRAL_F";
    SceneType[SceneType["INTRO_BANJO_HOUSE_2"] = 137] = "INTRO_BANJO_HOUSE_2";
    SceneType[SceneType["INTRO_BANJO_HOUSE_3"] = 138] = "INTRO_BANJO_HOUSE_3";
    SceneType[SceneType["RBB_ANCHOR"] = 139] = "RBB_ANCHOR";
    SceneType[SceneType["SM_BANJO_HOUSE"] = 140] = "SM_BANJO_HOUSE";
    SceneType[SceneType["MMM_INSIDE_LOGGO"] = 141] = "MMM_INSIDE_LOGGO";
    SceneType[SceneType["GL_FURNACE_FUN"] = 142] = "GL_FURNACE_FUN";
    SceneType[SceneType["TTC_SHARKFOOD_ISLAND"] = 143] = "TTC_SHARKFOOD_ISLAND";
    SceneType[SceneType["GL_BATTLEMENTS"] = 144] = "GL_BATTLEMENTS";
    SceneType[SceneType["FILE_SELECT"] = 145] = "FILE_SELECT";
    SceneType[SceneType["GV_SECRET_CHAMBER"] = 146] = "GV_SECRET_CHAMBER";
    SceneType[SceneType["GL_DINGPOT"] = 147] = "GL_DINGPOT";
    SceneType[SceneType["INTRO_SPIRAL_G"] = 148] = "INTRO_SPIRAL_G";
    SceneType[SceneType["END_SCENE_3"] = 149] = "END_SCENE_3";
    SceneType[SceneType["END_SCENE_1"] = 150] = "END_SCENE_1";
    SceneType[SceneType["END_SCENE_4"] = 151] = "END_SCENE_4";
    SceneType[SceneType["INTRO_GRUNTY_THREAT_1"] = 152] = "INTRO_GRUNTY_THREAT_1";
    SceneType[SceneType["INTRO_GRUNTY_THREAT_2"] = 153] = "INTRO_GRUNTY_THREAT_2";
})(SceneType = exports.SceneType || (exports.SceneType = {}));
//# sourceMappingURL=Enums.js.map