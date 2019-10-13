import * as API from 'modloader64_api/DK64/Imports';

export namespace VersionHandler {
  export function load_jp_1_0() {
    // Player Data
    global.ModLoader[API.AddressType.SHARED_COLLECTABLES] = 0x7fd0d0;

    // Eeprom Data
    global.ModLoader[API.AddressType.ER_COPY_BASE] = 0x7ed318;
    global.ModLoader[API.AddressType.ER_FILE_MAP] = 0x7ee318;

    // Runtime Data
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x746088;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x7553d8;

    // Save Data
  }

  export function load_pal_1_0() {
    // Player Data
    global.ModLoader[API.AddressType.SHARED_COLLECTABLES] = 0x7fcb80;

    // Eeprom Data
    global.ModLoader[API.AddressType.ER_COPY_BASE] = 0x7ecdc8;
    global.ModLoader[API.AddressType.ER_FILE_MAP] = 0x7eddc8;

    // Runtime Data
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x740f18;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x74fb98;

    // Save Data
  }

  export function load_usa_1_0() {
    // Player Data
    global.ModLoader[API.AddressType.SHARED_COLLECTABLES] = 0x7fcc40;

    // Eeprom Data
    global.ModLoader[API.AddressType.ER_COPY_BASE] = 0x7ecea8;
    global.ModLoader[API.AddressType.ER_FILE_MAP] = 0x7edea8;

    // Runtime Data
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x7467c8;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x755318;

    // Save Data
  }
}