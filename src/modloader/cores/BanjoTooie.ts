import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import {
  IModLoaderAPI,
  ICore,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { VersionHandler } from './BT/VersionHandler';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BT/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export class GameFlags extends API.BufferPtrObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_GAME_FLAGS], 0xAF);
  }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Player extends API.BaseObj implements API.IPlayer {
  exists(): boolean {
    return false;//!(this.emulator.rdramRead32(this.instance) === 0x0000);
  }
}

export class Runtime extends API.BaseObj implements API.IRuntime {
  private prof_hover_addr: number = global.ModLoader[API.AddressType.RT_PROF_HOVER];
  private prof_select_addr: number = global.ModLoader[API.AddressType.RT_PROF_SELECT];

  get_profile_hovering(): API.ProfileType {
    return this.emulator.rdramReadS8(this.prof_hover_addr);
  }

  get_profile_selected(): API.ProfileType {
    return this.emulator.rdramReadS8(this.prof_select_addr);
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

export class BanjoTooie implements ICore, API.IBTCore {
  header = 'BANJO TOOIE';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  rom_header!: IRomHeader;

  player!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;
  version!: API.GameVersion;

  isPlaying(): boolean {
    return (
      this.runtime.get_profile_hovering() === API.ProfileType.Title &&
      this.runtime.get_profile_selected() !== API.ProfileType.Title
    );
  }

  preinit(): void {
    switch (this.rom_header.country_code) {
      case 'U':
        this.version = API.GameVersion.AUS_1_0;
        VersionHandler.load_aus_1_0();
        break;
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

export default BanjoTooie;
