import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/CBFD/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Conker extends API.BaseObj implements API.IConker {}

export class Runtime extends API.BaseObj implements API.IRuntime {}

export class SaveContext extends API.BaseObj implements API.ISaveContext {}

export class ConkersBadFurDay implements ICore, API.IDK64Core {
  header = 'CONKER BFD';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  conker!: API.IConker;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;

  preinit(): void {}

  init(): void {}

  postinit(): void {
    this.conker = new Conker(this.ModLoader.emulator);
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

export default ConkersBadFurDay;
