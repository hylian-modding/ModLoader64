import * as API from 'modloader64_api/DK64/Imports';

export namespace VersionHandler {
  export function load_jp_1_0() {
    // Player Data
    global.ModLoader[API.AddressType.SHARED_COLLECTABLES] = 0x7fd0d0;
    global.ModLoader[API.AddressType.CHARACTER] = 0x74e05c;
    global.ModLoader[API.AddressType.KONG_BASE] = 0x7fcde0;
    global.ModLoader[API.AddressType.PLYR_PTR] = 0x7fbfbc;

    // Runtime Data
    global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x7fc460;
    global.ModLoader[API.AddressType.RT_ACTOR_COUNT_PTR] = 0x7fc860;
    global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x7f6470;
    global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x7f6474;
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x746088;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x7553d8;
    global.ModLoader[API.AddressType.RT_CUR_MAP] = 0x76a298;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x76a29c;
    global.ModLoader[API.AddressType.RT_PARENT_MAP] = 0x76a362;
    global.ModLoader[API.AddressType.RT_PARENT_EXIT] = 0x76a364;
    global.ModLoader[API.AddressType.RT_DEST_MAP] = 0x743da4;
    global.ModLoader[API.AddressType.RT_DEST_EXIT] = 0x743da8;
    global.ModLoader[API.AddressType.RT_MAP_STATE] = 0x76a2a1;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE] = 0x746fb4;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE] = 0x746fbc;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE_MAP] = 0x7f5f80;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE_KONG] = 0x7f6060;
    global.ModLoader[API.AddressType.RT_NUMBER_OF_CUTSCENES] = 0x7f604c;
    global.ModLoader[API.AddressType.RT_CUTSCENE_ACTIVE] = 0x743dac;
    global.ModLoader[API.AddressType.RT_CUTSCENE_TIMER] = 0x746fb0;
    global.ModLoader[API.AddressType.RT_CUTSCENE_TO_PLAY_NEXT_MAP] = 0x7553fe;
    global.ModLoader[API.AddressType.RT_CUTSCENE_WILL_PLAY_NEXT_MAP] = 0x7553fb;

    // Save Data
    global.ModLoader[API.AddressType.ER_COPY_BASE] = 0x7ed318;
    global.ModLoader[API.AddressType.ER_FILE_MAP] = 0x7ee318;
  }

  export function load_pal_1_0() {
    // Player Data
    global.ModLoader[API.AddressType.SHARED_COLLECTABLES] = 0x7fcb80;
    global.ModLoader[API.AddressType.CHARACTER] = 0x748edc;
    global.ModLoader[API.AddressType.KONG_BASE] = 0x7fc890;
    global.ModLoader[API.AddressType.PLYR_PTR] = 0x7fba6c;

    // Runtime Data
    global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x7fbf10;
    global.ModLoader[API.AddressType.RT_ACTOR_COUNT_PTR] = 0x7fc310;
    global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x7f5f20;
    global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x7f5f24;
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x740f18;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x74fb98;
    global.ModLoader[API.AddressType.RT_CUR_MAP] = 0x764bc8;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x764bcc;
    global.ModLoader[API.AddressType.RT_PARENT_MAP] = 0x764c92;
    global.ModLoader[API.AddressType.RT_PARENT_EXIT] = 0x764c94;
    global.ModLoader[API.AddressType.RT_DEST_MAP] = 0x73ec34;
    global.ModLoader[API.AddressType.RT_DEST_EXIT] = 0x73ec38;
    global.ModLoader[API.AddressType.RT_MAP_STATE] = 0x764bd1;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE] = 0x741e54;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE] = 0x741e5c;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE_MAP] = 0x7f5a30;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE_KONG] = 0x7f5b10;
    global.ModLoader[API.AddressType.RT_NUMBER_OF_CUTSCENES] = 0x7f5afc;
    global.ModLoader[API.AddressType.RT_CUTSCENE_ACTIVE] = 0x73ec3c;
    global.ModLoader[API.AddressType.RT_CUTSCENE_TIMER] = 0x741e50;
    global.ModLoader[API.AddressType.RT_CUTSCENE_TO_PLAY_NEXT_MAP] = 0x74fbbe;
    global.ModLoader[API.AddressType.RT_CUTSCENE_WILL_PLAY_NEXT_MAP] = 0x74fbbb;

    // Save Data
    global.ModLoader[API.AddressType.ER_COPY_BASE] = 0x7ecdc8;
    global.ModLoader[API.AddressType.ER_FILE_MAP] = 0x7eddc8;
  }

  export function load_usa_1_0() {
    // Player Data
    global.ModLoader[API.AddressType.SHARED_COLLECTABLES] = 0x7fcc40;
    global.ModLoader[API.AddressType.CHARACTER] = 0x74e77c;
    global.ModLoader[API.AddressType.KONG_BASE] = 0x7fc950;
    global.ModLoader[API.AddressType.PLYR_PTR] = 0x7fbb4c;

    // Runtime Data
    global.ModLoader[API.AddressType.RT_ACTOR_ARRAY_PTR] = 0x7fbff0;
    global.ModLoader[API.AddressType.RT_ACTOR_COUNT_PTR] = 0x7fc3f0;
    global.ModLoader[API.AddressType.RT_VOXEL_ARRAY_PTR] = 0x7f6000;
    global.ModLoader[API.AddressType.RT_VOXEL_COUNT_PTR] = 0x7f6004;
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x7467c8;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x755318;
    global.ModLoader[API.AddressType.RT_CUR_MAP] = 0x76a0a8;
    global.ModLoader[API.AddressType.RT_CUR_EXIT] = 0x76a0ac;
    global.ModLoader[API.AddressType.RT_PARENT_MAP] = 0x76a172;
    global.ModLoader[API.AddressType.RT_PARENT_EXIT] = 0x76a174;
    global.ModLoader[API.AddressType.RT_DEST_MAP] = 0x7444e4;
    global.ModLoader[API.AddressType.RT_DEST_EXIT] = 0x7444e8;
    global.ModLoader[API.AddressType.RT_MAP_STATE] = 0x76a0b1;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE] = 0x7476f4;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE] = 0x7476fc;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE_MAP] = 0x7f5b10;
    global.ModLoader[API.AddressType.RT_CUR_CUTSCENE_TYPE_KONG] = 0x7f5bf0;
    global.ModLoader[API.AddressType.RT_NUMBER_OF_CUTSCENES] = 0x7f5bdc;
    global.ModLoader[API.AddressType.RT_CUTSCENE_ACTIVE] = 0x7444ec;
    global.ModLoader[API.AddressType.RT_CUTSCENE_TIMER] = 0x7476f0;
    global.ModLoader[API.AddressType.RT_CUTSCENE_TO_PLAY_NEXT_MAP] = 0x75533e;
    global.ModLoader[API.AddressType.RT_CUTSCENE_WILL_PLAY_NEXT_MAP] = 0x75533b;

    // Save Data
    global.ModLoader[API.AddressType.ER_COPY_BASE] = 0x7ecea8;
    global.ModLoader[API.AddressType.ER_FILE_MAP] = 0x7edea8;
  }
}
