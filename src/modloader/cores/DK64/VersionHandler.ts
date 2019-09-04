import * as API from 'modloader64_api/DK64/Imports';

export namespace VersionHandler {
  export function load_jp_1_0() {
    // Player Data

    // Runtime Data
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x746088;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x7553d8;

    // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x755af0;
  }

  export function load_pal_1_0() {
    // Player Data

    // Runtime Data
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x740f18;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x74fb98;

    // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x7502b0;
  }

  export function load_usa_1_0() {
    // Player Data

    // Runtime Data
    global.ModLoader[API.AddressType.RT_CUR_PROFILE] = 0x7467c8;
    global.ModLoader[API.AddressType.RT_GAME_MODE] = 0x755318;

    // Save Data
    global.ModLoader[API.AddressType.SAVE_GAME_FLAGS] = 0x755a20;
  }
}
