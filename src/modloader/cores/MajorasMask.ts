import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import {
  IModLoaderAPI,
  ICore,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import * as API from 'modloader64_api/MM/Imports';
import * as CORE from './MM/Imports';
import { GameShark } from 'modloader64_api/GameShark';
import { ICommandBuffer } from 'modloader64_api/MM/ICommandBuffer';
import { CommandBuffer } from './MM/CommandBuffer';

export class MajorasMask implements ICore, API.IMMCore {
  header = "ZELDA MAJORA'S MASK";
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  player!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;
  commandBuffer!: ICommandBuffer;

  isPlaying(): boolean {
    return !(this.save.get_checksum() === 0 || this.isTitleScreen());
  }

  isTitleScreen(): boolean {
    let value = this.runtime.get_current_scene();
    return value === 0x8022 || value === 0x8024;
  }

  preinit(): void {}

  init(): void {}

  postinit(): void {
    this.player = new CORE.Player(this.ModLoader.emulator);
    this.runtime = new CORE.Runtime(this.ModLoader.emulator);
    this.save = new CORE.SaveContext(this.ModLoader.emulator);
    this.commandBuffer = new CommandBuffer(this.ModLoader.emulator);
  }

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }

  @EventHandler(ModLoaderEvents.ON_ROM_HEADER_PARSED)
  onModLoader_RomHeaderParsed(header: Buffer) {}

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) {
    let gameshark = new GameShark(
      this.ModLoader.logger,
      this.ModLoader.emulator
    );
    let file: string = __dirname + 'MajorasMask.payload';
    gameshark.read(file);
  }
}

export default MajorasMask;
