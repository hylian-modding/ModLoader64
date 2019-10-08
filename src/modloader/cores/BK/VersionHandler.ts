import * as API from 'modloader64_api/BK/Imports';

export namespace VersionHandler {
  export function load_pal_1_0() {
    // // Hidden Data
    // global.ModLoader['BK:beta_menu'] = 0x383080;

    // // Player Data
    // global.ModLoader[API.AddressType.PLYR_ANIMAL] = 0x37d188;
    // global.ModLoader[API.AddressType.PLYR_ANIMATION] = 0x37bf20;
    // global.ModLoader[API.AddressType.PLYR_FLIP_FACING] = 0x37c0e7;
    // global.ModLoader[API.AddressType.PLYR_MODEL_INDEX] = 0x37c0e4;
    // global.ModLoader[API.AddressType.PLYR_MODEL_PTR] = 0x37c0e0;
    // global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE] = 0x37c4a0;
    // global.ModLoader[API.AddressType.PLYR_OPACITY] = 0x37c0e6;
    global.ModLoader[API.AddressType.PLYR_POS_X] = 0x37cf70;
    global.ModLoader[API.AddressType.PLYR_POS_Y] = 0x37cf74;
    global.ModLoader[API.AddressType.PLYR_POS_Z] = 0x37cf78;
    global.ModLoader[API.AddressType.PLYR_ROT_X] = 0x37cf10;
    // global.ModLoader[API.AddressType.PLYR_ROT_Y] = 0x37c0f8;
    global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37d050;
    // global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
    // global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

    // // Runtime Data
    global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36eae0;
    // global.ModLoader[API.AddressType.RT_COLLISION_PTR] = 0x3820B8;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37f2c6;
    // global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383300;
    // global.ModLoader[API.AddressType.RT_CUR_LEVEL_LOOKUP] = 0x36B818;
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_EVENTS] = 0x383301;
    // global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
    // global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37f2c5;
    //global.ModLoader[API.AddressType.RT_CUR_SCENE_EVENTS] = ;
    // global.ModLoader[API.AddressType.RT_IS_CUTSCENE] = 0x367684;
    // global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;
    // global.ModLoader[API.AddressType.RT_TRANSITION_STATE] = 0x382438;
    // global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x381FA0;
    // global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x381FC8;

    // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x383b88;
    global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x383cc0;
    global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x383ca0;
    global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37cd70;
    global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x383cd0;

    // Inventory Data
    global.ModLoader[API.AddressType.INVENTORY] = 0x386910;

    // global.ModLoader[API.AddressType.TEXT_MUMBO_TOKENS] = 0x385fa3;
  }

  export function load_jp_1_0() {
    // // Hidden Data
    // global.ModLoader['BK:beta_menu'] = 0x383080;

    // // Player Data
    // global.ModLoader[API.AddressType.PLYR_ANIMAL] = 0x37d188;
    // global.ModLoader[API.AddressType.PLYR_ANIMATION] = 0x37bf20;
    // global.ModLoader[API.AddressType.PLYR_FLIP_FACING] = 0x37c0e7;
    // global.ModLoader[API.AddressType.PLYR_MODEL_INDEX] = 0x37c0e4;
    // global.ModLoader[API.AddressType.PLYR_MODEL_PTR] = 0x37c0e0;
    // global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE] = 0x37c4a0;
    // global.ModLoader[API.AddressType.PLYR_OPACITY] = 0x37c0e6;
    global.ModLoader[API.AddressType.PLYR_POS_X] = 0x37d0a0;
    global.ModLoader[API.AddressType.PLYR_POS_Y] = 0x37d0a4;
    global.ModLoader[API.AddressType.PLYR_POS_Z] = 0x37d0a8;
    global.ModLoader[API.AddressType.PLYR_ROT_X] = 0x37d040;
    global.ModLoader[API.AddressType.PLYR_ROT_Y] = 0x37D190;
    global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37d180;
    // global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
    // global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

    // // Runtime Data
    global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36f260;
    // global.ModLoader[API.AddressType.RT_COLLISION_PTR] = 0x3820B8;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37f406;
    // global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383300;
    // global.ModLoader[API.AddressType.RT_CUR_LEVEL_LOOKUP] = 0x36B818;
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_EVENTS] = 0x383301;
    // global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
    global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37f405;
    //global.ModLoader[API.AddressType.RT_CUR_SCENE_EVENTS] = ;
    // global.ModLoader[API.AddressType.RT_IS_CUTSCENE] = 0x367684;
    // global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;
    // global.ModLoader[API.AddressType.RT_TRANSITION_STATE] = 0x382438;
    // global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x381FA0;
    // global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x381FC8;

    // // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x383d18;
    global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x383e20;
    global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x383e00;
    global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37cea0;
    global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x383e30;

    // Inventory Data
    global.ModLoader[API.AddressType.INVENTORY] = 0x386a70;

    // global.ModLoader[API.AddressType.TEXT_MUMBO_TOKENS] = 0x385fa3;
  }

  export function load_usa_1_0() {
    // Hidden Data
    global.ModLoader['BK:beta_menu'] = 0x383080;

    // Player Data
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
    global.ModLoader[API.AddressType.RT_COLLISION_PTR] = 0x3820b8;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37e8f6;
    global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383301;
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_LOOKUP] = 0x36b818;
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_EVENTS] = 0x383328;
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
    global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37e8f5;
    global.ModLoader[API.AddressType.RT_CUR_SCENE_EVENTS] = 0x367000;
    global.ModLoader[API.AddressType.RT_IS_CUTSCENE] = 0x367684;
    global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;
    global.ModLoader[API.AddressType.RT_TRANSITION_STATE] = 0x382438;
    global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x381fa0;
    global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x381fc8;

    // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x3831a8;
    global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x3832e0;
    global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x3832c0;
    global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37c3a0;
    global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x3832f0;

    // Inventory Data
    global.ModLoader[API.AddressType.INVENTORY] = 0x385f30;

    global.ModLoader[API.AddressType.TEXT_MUMBO_TOKENS] = 0x385fa3;
  }

  export function load_usa_1_1() {
    // // Hidden Data
    // global.ModLoader['BK:beta_menu'] = 0x383080;

    // // Player Data
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
    global.ModLoader[API.AddressType.PLYR_ROT_Z] = 0x37b880;
    // global.ModLoader[API.AddressType.PLYR_SCALE] = 0x37c0ec;
    // global.ModLoader[API.AddressType.PLYR_VISIBLE] = 0x37c0e8;

    // // Runtime Data
    global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x36d760;
    // global.ModLoader[API.AddressType.RT_COLLISION_PTR] = 0x3820B8;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x37daf6;
    // global.ModLoader[API.AddressType.RT_CUR_LEVEL] = 0x383300;
    // global.ModLoader[API.AddressType.RT_CUR_LEVEL_LOOKUP] = 0x36B818;
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_EVENTS] = 0x383301;
    // global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x365e00;
    global.ModLoader[API.AddressType.RT_CUR_SCENE] = 0x37daf5;
    //global.ModLoader[API.AddressType.RT_CUR_SCENE_EVENTS] = ;
    // global.ModLoader[API.AddressType.RT_IS_CUTSCENE] = 0x367684;
    // global.ModLoader[API.AddressType.RT_IS_LOADING] = 0x37e8f4;
    // global.ModLoader[API.AddressType.RT_TRANSITION_STATE] = 0x382438;
    // global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x381FA0;
    // global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x381FC8;

    // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x3823f8;
    global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS] = 0x382500;
    global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS] = 0x3824e0;
    global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS] = 0x37b5a0;
    global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS] = 0x382510;
    
    // Inventory Data
    global.ModLoader[API.AddressType.INVENTORY] = 0x385150;

    // global.ModLoader[API.AddressType.TEXT_MUMBO_TOKENS] = 0x385fa3;
  }
}
