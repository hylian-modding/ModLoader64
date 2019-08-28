import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/DK64/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Kong extends API.BaseObj implements API.IPlayer {}

export class Runtime extends API.BaseObj implements API.IRuntime {}

export class SaveContext extends API.BaseObj implements API.ISaveContext {}

export class DonkeyKong64 implements ICore, API.IDK64Core {
  header = 'DONKEY KONG 64';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  kong!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;

  preinit(): void {}

  init(): void {}

  postinit(): void {
    this.kong = new Kong(this.ModLoader.emulator);
    this.runtime = new Runtime(this.ModLoader.emulator);
    this.save = new SaveContext(this.ModLoader.emulator);
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) {}

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }
}

export default DonkeyKong64;
