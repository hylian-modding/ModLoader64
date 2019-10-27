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
    super(emu, global.ModLoader[API.AddressType.SAVE_GAME_FLAGS], 0xaf);
  }
}

export class GlobalFlags extends API.BufferPtrObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_GLOBAL_FLAGS], 0x10);
  }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Player extends API.BaseObj implements API.IPlayer {
  exists(): boolean {
    return false; //!(this.emulator.rdramRead32(this.instance) === 0x0000);
  }
}

export class Runtime extends API.BaseObj implements API.IRuntime {
  private prof_hover_addr: number = global.ModLoader[API.AddressType.RT_PROF_HOVER];
  private prof_select_addr: number = global.ModLoader[API.AddressType.RT_PROF_SELECT];
  private map_addr: number = global.ModLoader[API.AddressType.RT_CURRENT_MAP];
  private map_trigger_addr: number = global.ModLoader[API.AddressType.RT_MAP_TRIGGER];
  private map_trigger_target_addr: number = global.ModLoader[API.AddressType.RT_MAP_TRIGGER_TARGET];
  private map_destination_addr: number = global.ModLoader[API.AddressType.RT_MAP_DESTINATION];
  private dcw_location_addr: number = global.ModLoader[API.AddressType.RT_DCW_LOCATION];

  get_profile_hovering(): API.ProfileType { return this.emulator.rdramReadS8(this.prof_hover_addr); }
  get_profile_selected(): API.ProfileType { return this.emulator.rdramReadS8(this.prof_select_addr); }

  get current_map(): number { return this.emulator.rdramRead16(this.map_addr); }
  set current_map(value: number) { this.emulator.rdramWrite16(this.map_addr, value); }
  get map_destination(): number { return this.emulator.rdramRead16(this.map_destination_addr); }
  set map_destination(value: number) { this.emulator.rdramWrite16(this.map_destination_addr, value); }
  get map_trigger(): number { return this.emulator.rdramRead16(this.map_trigger_addr); }
  set map_trigger(value: number) { this.emulator.rdramWrite16(this.map_trigger_addr, value); }
  get map_trigger_target(): number { return this.emulator.rdramRead16(this.map_trigger_target_addr); }
  set map_trigger_target(value: number) { this.emulator.rdramWrite16(this.map_trigger_target_addr, value); }
  get dcw_location(): number { return this.emulator.rdramRead16(this.dcw_location_addr); }
  set dcw_location(value: number) { this.emulator.rdramWrite16(this.dcw_location_addr, value); }
}

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  // Abstraction
  game_flags: API.IBuffered;
  global_flags: API.IBuffered;

  constructor(emu: IMemory) {
    super(emu);

    this.game_flags = new GameFlags(emu);
    this.global_flags = new GlobalFlags(emu);
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
      default:
        this.version = API.GameVersion.USA_1_0;
        VersionHandler.load_usa_1_0();
        break;
    }
  }

  init(): void { }

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
  onModLoader_RomHeaderParsed(header: Buffer) { }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) { }
}

export default BanjoTooie;
