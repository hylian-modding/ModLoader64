import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import {
    IModLoaderAPI,
    ICore,
    ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import * as API from 'modloader64_api/BK/Imports';
import * as CORE from './BK/Imports';

export class BanjoKazooie implements ICore, API.IBKCore {
  header = 'Banjo-Kazooie';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  rom_header!: IRomHeader;

  camera!: API.ICamera;
  player!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;
  version!: API.GameVersion;

  isPlaying(): boolean {
      return !(
          this.player.movement_state === 0 ||
      this.runtime.get_current_profile() === API.ProfileType.Title
      );
  }

  preinit(): void {
      switch (this.rom_header.country_code) {
      case 'J':
          this.version = API.GameVersion.JP_1_0;
          CORE.VersionHandler.load_jp_1_0();
          break;
      case 'P':
          this.version = API.GameVersion.PAL_1_0;
          CORE.VersionHandler.load_pal_1_0();
          break;
      case 'E':
          if (this.rom_header.revision === 1) {
              this.version = API.GameVersion.USA_1_1;
              CORE.VersionHandler.load_usa_1_1();
          } else {
              this.version = API.GameVersion.USA_1_0;
              CORE.VersionHandler.load_usa_1_0();
          }
          break;
      default:
          this.version = API.GameVersion.USA_1_0;
          CORE.VersionHandler.load_usa_1_0();
          break;
      }
  }

  init(): void {}

  postinit(): void {
      this.camera = new CORE.Camera(this.ModLoader.emulator);
      this.player = new CORE.Player(this.ModLoader.emulator);
      this.runtime = new CORE.Runtime(this.ModLoader.emulator);
      this.save = new CORE.SaveContext(this.ModLoader.emulator);
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

export default BanjoKazooie;
