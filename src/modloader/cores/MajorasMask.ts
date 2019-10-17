import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import * as API from 'modloader64_api/MM/Imports';
import { zeldaString } from 'modloader64_api/MM/ZeldaString';
import * as CORE from './MM/Imports';
import { eventNames } from 'cluster';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class MajorasMask implements ICore, API.IMMCore {
  header = "ZELDA MAJORA'S MASK";
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  player!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;

  preinit(): void {}

  init(): void {}

  postinit(): void {
    this.player = new CORE.Player(this.ModLoader.emulator);
    this.runtime = new CORE.Runtime(this.ModLoader.emulator);
    this.save = new CORE.SaveContext(this.ModLoader.emulator);
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) {}

  onTick(): void {  
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }
}

export default MajorasMask;
