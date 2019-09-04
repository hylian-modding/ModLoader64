import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import {
  IModLoaderAPI,
  ICore,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { VersionHandler } from './DK64/VersionHandler';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/DK64/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export class GameFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_GAME_FLAGS], 0x013b);
  }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Player extends API.BaseObj implements API.IPlayer {}

export class Runtime extends API.BaseObj implements API.IRuntime {
  private cur_profile_addr: number =
    global.ModLoader[API.AddressType.RT_CUR_PROFILE];
  private game_mode_addr: number =
    global.ModLoader[API.AddressType.RT_GAME_MODE];

  get_current_profile(): API.ProfileType {
    return this.emulator.rdramRead8(this.cur_profile_addr) as API.ProfileType;
  }

  get_game_mode(): API.GameModeType {
    return this.emulator.rdramRead8(this.game_mode_addr) as API.GameModeType;
  }
}

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  // Abstraction
  game_flags: API.IBuffered;

  constructor(emu: IMemory) {
    super(emu);

    this.game_flags = new GameFlags(emu);
  }
}

export class DonkeyKong64 implements ICore, API.IDK64Core {
  header = 'DONKEY KONG 64';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  rom_header!: IRomHeader;

  player!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;
  version!: API.GameVersion;

  isPlaying(): boolean {
    return this.runtime.get_game_mode() === API.GameModeType.ADVENTURE;
  }

  preinit(): void {
    switch (this.rom_header.country_code) {
      case 'J':
        this.version = API.GameVersion.JP_1_0;
        VersionHandler.load_jp_1_0();
        break;
      case 'P':
        this.version = API.GameVersion.PAL_1_0;
        VersionHandler.load_pal_1_0();
        break;
      case 'E':
        this.version = API.GameVersion.USA_1_0;
        VersionHandler.load_usa_1_0();
        break;
    }
  }

  init(): void {}

  postinit(): void {
    this.player = new Player(this.ModLoader.emulator);
    this.runtime = new Runtime(this.ModLoader.emulator);
    this.save = new SaveContext(this.ModLoader.emulator);
  }

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }

  @EventHandler(ModLoaderEvents.ON_ROM_HEADER_PARSED)
  onModLoader_RomHeaderParsed(header: Buffer) {}

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) {}
}

export default DonkeyKong64;
