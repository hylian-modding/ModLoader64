import * as API from 'modloader64_api/BK/Imports';

export namespace VersionHandler {
    export function load_usa_1_0() {
        let inv_addr = 0x385F30;

        // Hidden Data
        global.ModLoader['BK:beta_menu'] = 0x383080;

        // Banjo Data
        global.ModLoader[API.AddressType.PLYR_ANIMAL] = 0x37d188;
        global.ModLoader[API.AddressType.PLYR_ANIMATION] = 0x37bf20;
        global.ModLoader[API.AddressType.PLYR_FLIP_FACING] = 0x37c0e7;
        global.ModLoader[API.AddressType.PLYR_MODEL_INDEX] = 0x37c0e4;
        global.ModLoader[API.AddressType.PLYR_MODEL_PTR] = 0x37c0e0;
        global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE] = 0x37c4a0;
        global.ModLoader[API.AddressType.PLYR_OPACITY] = 0x37c0e6;
        global.ModLoader[API.AddressType.PLYR_POS_X] = 0x37c5a0;
        global.ModLoader[API.AddressType.PLYR_POS_Y] = 0x37c5a4;
        global.ModLoader[API.AddressType.PLYR_POS_Z] = 0x37c5a8;
        global.ModLoader[API.AddressType.PLYR_ROT_X] = 0x37c540;
        global.ModLoader[API.AddressType.PLYR_ROT_Y] = 0x37c0f8;
        global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37c680;
        global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
        global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

        // Runtime Data
        global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36e560;
        global.ModLoader[API.AddressType.RT_CUR_HEALTH] = 0x385f80;
        global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37e8f6;
        global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383301;
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ACORN] = inv_addr + (0x23 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_CATERPILLAR] = inv_addr + (0x22 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_GOLD_BULLION] = inv_addr + (0x18 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_JINJOS] = inv_addr + (0x12 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_NOTES] = inv_addr + (0x0c * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_GREEN] = inv_addr + (0x1f * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_BLUE] = inv_addr + (0x20 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_RED] = inv_addr + (0x21 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ORANGE] = inv_addr + (0x19 * 4);
        global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
        global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37e8f5;
        global.ModLoader[API.AddressType.RT_CUTSCENE_STATE] = 0x382438;
        global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;

        // Save Data
        global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x3831a8;
        global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x3832e0;
        global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x3832c0;
        global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37c3a0;
        global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x3832f0;
        global.ModLoader[API.AddressType.SAVE_NOTE_TOTALS] = inv_addr + (0x30 * 4);

        global.ModLoader[API.AddressType.INV_HONEYCOMBS] = inv_addr + (0x13 * 4);
        global.ModLoader[API.AddressType.INV_HEALTH_UPGRADES] = inv_addr + (0x15 * 4);
        global.ModLoader[API.AddressType.INV_JIGGIES] = inv_addr + (0x26 * 4);
        global.ModLoader[API.AddressType.INV_MUMBO_TOKENS] = inv_addr + (0x1c * 4);
        global.ModLoader[API.AddressType.INV_TEXT_JIGGIES] = inv_addr + (0x2b * 4);
        global.ModLoader[API.AddressType.INV_TEXT_MUMBO_TOKENS] = inv_addr + (0x25 * 4);
        
        global.ModLoader[API.AddressType.INV_EGGS] = inv_addr + (0x0d * 4);
        global.ModLoader[API.AddressType.INV_RED_FEATHER] = inv_addr + (0x0f * 4);
        global.ModLoader[API.AddressType.INV_GOLD_FEATHER] = inv_addr + (0x10 * 4);
        
        global.ModLoader[API.AddressType.INV_SCORE_TWINKLIE] = inv_addr + (0x19 * 4);

        global.ModLoader[API.AddressType.INV_HOURGLASS_2] = inv_addr + (0x06 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_SKULL] = inv_addr + (0x01 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_TIMER] = inv_addr + (0x00 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_XMAS_TREE] = inv_addr + (0x05 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_PROPELLOR] = inv_addr + (0x03 * 4);
    }
    
    export function load_usa_1_1() {
        let inv_addr = 0x385150;

        // // Hidden Data
        // global.ModLoader['BK:beta_menu'] = 0x383080;

        // // Banjo Data
        // global.ModLoader[API.AddressType.PLYR_ANIMAL] = 0x37d188;
        // global.ModLoader[API.AddressType.PLYR_ANIMATION] = 0x37bf20;
        // global.ModLoader[API.AddressType.PLYR_FLIP_FACING] = 0x37c0e7;
        // global.ModLoader[API.AddressType.PLYR_MODEL_INDEX] = 0x37c0e4;
        // global.ModLoader[API.AddressType.PLYR_MODEL_PTR] = 0x37c0e0;
        // global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE] = 0x37c4a0;
        // global.ModLoader[API.AddressType.PLYR_OPACITY] = 0x37c0e6;
        global.ModLoader[API.AddressType.PLYR_POS_X] = 0x37b7a0;
        global.ModLoader[API.AddressType.PLYR_POS_Y] = 0x37b7a4;
        global.ModLoader[API.AddressType.PLYR_POS_Z] = 0x37b7a8;
        global.ModLoader[API.AddressType.PLYR_ROT_X] = 0x37b740;
        //global.ModLoader[API.AddressType.PLYR_ROT_Y] = 0x37c0f8;
        global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37B880;
        // global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
        // global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

        // // Runtime Data
        global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36d760;
        // global.ModLoader[API.AddressType.RT_CUR_HEALTH] = 0x385f80;
        global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37daf6;
        // global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383300;
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ACORN] = inv_addr + (0x23 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_CATERPILLAR] = inv_addr + (0x22 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_GOLD_BULLION] = inv_addr + (0x18 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_JINJOS] = inv_addr + (0x12 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_NOTES] = inv_addr + (0x0c * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_GREEN] = inv_addr + (0x1f * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_BLUE] = inv_addr + (0x20 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_RED] = inv_addr + (0x21 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ORANGE] = inv_addr + (0x19 * 4);
        // global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
        global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37daf5;
        // global.ModLoader[API.AddressType.RT_CUTSCENE_STATE] = 0x382438;
        // global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;

        // // Save Data
        global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x3823F8;
        global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x382500;
        global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x3824E0;
        global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37B5A0;
        global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x382510;
        global.ModLoader[API.AddressType.SAVE_NOTE_TOTALS] = inv_addr + (0x30 * 4);
        
        global.ModLoader[API.AddressType.INV_HONEYCOMBS] = inv_addr + (0x13 * 4);
        global.ModLoader[API.AddressType.INV_HEALTH_UPGRADES] = inv_addr + (0x15 * 4);
        global.ModLoader[API.AddressType.INV_JIGGIES] = inv_addr + (0x26 * 4);
        global.ModLoader[API.AddressType.INV_MUMBO_TOKENS] = inv_addr + (0x1c * 4);
        global.ModLoader[API.AddressType.INV_TEXT_JIGGIES] = inv_addr + (0x2b * 4);
        global.ModLoader[API.AddressType.INV_TEXT_MUMBO_TOKENS] = inv_addr + (0x25 * 4);
        
        global.ModLoader[API.AddressType.INV_EGGS] = inv_addr + (0x0d * 4);
        global.ModLoader[API.AddressType.INV_RED_FEATHER] = inv_addr + (0x0f * 4);
        global.ModLoader[API.AddressType.INV_GOLD_FEATHER] = inv_addr + (0x10 * 4);
        
        global.ModLoader[API.AddressType.INV_SCORE_TWINKLIE] = inv_addr + (0x19 * 4);

        global.ModLoader[API.AddressType.INV_HOURGLASS_2] = inv_addr + (0x06 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_SKULL] = inv_addr + (0x01 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_TIMER] = inv_addr + (0x00 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_XMAS_TREE] = inv_addr + (0x05 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_PROPELLOR] = inv_addr + (0x03 * 4);
    }

    export function load_pal_1_0() {
        let inv_addr = 0x386910;

        // // Hidden Data
        // global.ModLoader['BK:beta_menu'] = 0x383080;

        // // Banjo Data
        // global.ModLoader[API.AddressType.PLYR_ANIMAL] = 0x37d188;
        // global.ModLoader[API.AddressType.PLYR_ANIMATION] = 0x37bf20;
        // global.ModLoader[API.AddressType.PLYR_FLIP_FACING] = 0x37c0e7;
        // global.ModLoader[API.AddressType.PLYR_MODEL_INDEX] = 0x37c0e4;
        // global.ModLoader[API.AddressType.PLYR_MODEL_PTR] = 0x37c0e0;
        // global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE] = 0x37c4a0;
        // global.ModLoader[API.AddressType.PLYR_OPACITY] = 0x37c0e6;
        global.ModLoader[API.AddressType.PLYR_POS_X] = 0x37CF70;
        global.ModLoader[API.AddressType.PLYR_POS_Y] = 0x37CF74;
        global.ModLoader[API.AddressType.PLYR_POS_Z] = 0x37CF78;
        global.ModLoader[API.AddressType.PLYR_ROT_X] = 0x37CF10;
        // global.ModLoader[API.AddressType.PLYR_ROT_Y] = 0x37c0f8;
        global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37D050;
        // global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
        // global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

        // // Runtime Data
        global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36EAE0;
        // global.ModLoader[API.AddressType.RT_CUR_HEALTH] = 0x385f80;
        global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37F2C6;
        // global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383300;
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ACORN] = inv_addr + (0x23 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_CATERPILLAR] = inv_addr + (0x22 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_GOLD_BULLION] = inv_addr + (0x18 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_JINJOS] = inv_addr + (0x12 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_NOTES] = inv_addr + (0x0c * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_GREEN] = inv_addr + (0x1f * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_BLUE] = inv_addr + (0x20 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_RED] = inv_addr + (0x21 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ORANGE] = inv_addr + (0x19 * 4);
        // global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
        global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37F2C5;
        // global.ModLoader[API.AddressType.RT_CUTSCENE_STATE] = 0x382438;
        // global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;

        // // Save Data
        global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x383B88;
        global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x383CC0;
        global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x383CA0;
        global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37CD70;
        global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x383CD0;
        global.ModLoader[API.AddressType.SAVE_NOTE_TOTALS] = inv_addr + (0x30 * 4);

        global.ModLoader[API.AddressType.INV_HONEYCOMBS] = inv_addr + (0x13 * 4);
        global.ModLoader[API.AddressType.INV_HEALTH_UPGRADES] = inv_addr + (0x15 * 4);
        global.ModLoader[API.AddressType.INV_JIGGIES] = inv_addr + (0x26 * 4);
        global.ModLoader[API.AddressType.INV_MUMBO_TOKENS] = inv_addr + (0x1c * 4);
        global.ModLoader[API.AddressType.INV_TEXT_JIGGIES] = inv_addr + (0x2b * 4);
        global.ModLoader[API.AddressType.INV_TEXT_MUMBO_TOKENS] = inv_addr + (0x25 * 4);
        
        global.ModLoader[API.AddressType.INV_EGGS] = inv_addr + (0x0d * 4);
        global.ModLoader[API.AddressType.INV_RED_FEATHER] = inv_addr + (0x0f * 4);
        global.ModLoader[API.AddressType.INV_GOLD_FEATHER] = inv_addr + (0x10 * 4);
        
        global.ModLoader[API.AddressType.INV_SCORE_TWINKLIE] = inv_addr + (0x19 * 4);

        global.ModLoader[API.AddressType.INV_HOURGLASS_2] = inv_addr + (0x06 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_SKULL] = inv_addr + (0x01 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_TIMER] = inv_addr + (0x00 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_XMAS_TREE] = inv_addr + (0x05 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_PROPELLOR] = inv_addr + (0x03 * 4);
    }
    
    export function load_jp_1_0() {
        let inv_addr = 0x386A70;

        // // Hidden Data
        // global.ModLoader['BK:beta_menu'] = 0x383080;

        // // Banjo Data
        // global.ModLoader[API.AddressType.PLYR_ANIMAL] = 0x37d188;
        // global.ModLoader[API.AddressType.PLYR_ANIMATION] = 0x37bf20;
        // global.ModLoader[API.AddressType.PLYR_FLIP_FACING] = 0x37c0e7;
        // global.ModLoader[API.AddressType.PLYR_MODEL_INDEX] = 0x37c0e4;
        // global.ModLoader[API.AddressType.PLYR_MODEL_PTR] = 0x37c0e0;
        // global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE] = 0x37c4a0;
        // global.ModLoader[API.AddressType.PLYR_OPACITY] = 0x37c0e6;
        global.ModLoader[API.AddressType.PLYR_POS_X] = 0x37D0A0;
        global.ModLoader[API.AddressType.PLYR_POS_Y] = 0x37D0A4;
        global.ModLoader[API.AddressType.PLYR_POS_Z] = 0x37D0A8;
        global.ModLoader[API.AddressType.PLYR_ROT_X] = 0x37D040;
        // global.ModLoader[API.AddressType.PLYR_ROT_Y] = 0x37c0f8;
        global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37D180;
        // global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
        // global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

        // // Runtime Data
        global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36F260;
        // global.ModLoader[API.AddressType.RT_CUR_HEALTH] = 0x385f80;
        global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37F406;
        // global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383300;
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ACORN] = inv_addr + (0x23 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_CATERPILLAR] = inv_addr + (0x22 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_GOLD_BULLION] = inv_addr + (0x18 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_JINJOS] = inv_addr + (0x12 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_NOTES] = inv_addr + (0x0c * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_GREEN] = inv_addr + (0x1f * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_BLUE] = inv_addr + (0x20 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_RED] = inv_addr + (0x21 * 4);
        global.ModLoader[API.AddressType.RT_CUR_LEVEL_ORANGE] = inv_addr + (0x19 * 4);
        // global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
        global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37F405;
        // global.ModLoader[API.AddressType.RT_CUTSCENE_STATE] = 0x382438;
        // global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;

        // // Save Data
        global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x383D18;
        global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x383E20;
        global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x383E00;
        global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37CEA0;
        global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x383E30;
        global.ModLoader[API.AddressType.SAVE_NOTE_TOTALS] = inv_addr + (0x30 * 4);

        global.ModLoader[API.AddressType.INV_HONEYCOMBS] = inv_addr + (0x13 * 4);
        global.ModLoader[API.AddressType.INV_HEALTH_UPGRADES] = inv_addr + (0x15 * 4);
        global.ModLoader[API.AddressType.INV_JIGGIES] = inv_addr + (0x26 * 4);
        global.ModLoader[API.AddressType.INV_MUMBO_TOKENS] = inv_addr + (0x1c * 4);
        global.ModLoader[API.AddressType.INV_TEXT_JIGGIES] = inv_addr + (0x2b * 4);
        global.ModLoader[API.AddressType.INV_TEXT_MUMBO_TOKENS] = inv_addr + (0x25 * 4);
        
        global.ModLoader[API.AddressType.INV_EGGS] = inv_addr + (0x0d * 4);
        global.ModLoader[API.AddressType.INV_RED_FEATHER] = inv_addr + (0x0f * 4);
        global.ModLoader[API.AddressType.INV_GOLD_FEATHER] = inv_addr + (0x10 * 4);
        
        global.ModLoader[API.AddressType.INV_SCORE_TWINKLIE] = inv_addr + (0x19 * 4);

        global.ModLoader[API.AddressType.INV_HOURGLASS_2] = inv_addr + (0x06 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_SKULL] = inv_addr + (0x01 * 4);
        global.ModLoader[API.AddressType.INV_HOURGLASS_TIMER] = inv_addr + (0x00 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_XMAS_TREE] = inv_addr + (0x05 * 4);
        global.ModLoader[API.AddressType.INV_TIMER_PROPELLOR] = inv_addr + (0x03 * 4);
    }
}