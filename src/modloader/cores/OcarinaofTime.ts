import {
  IModLoaderAPI,
  ICore,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import { GameShark } from 'modloader64_api/GameShark';
import {
  ISaveContext,
  LinkState,
  ILink,
  IOOTCore,
  OotEvents,
  IOotHelper,
  IGlobalContext,
} from 'modloader64_api/OOT/OOTAPI';
import { bus, EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { registerEndpoint } from 'modloader64_api/EndpointHandler';
import { OotHelper } from './OOT/OotHelper';
import { GlobalContext } from './OOT/GlobalContext';
import { Link } from './OOT/Link';
import { SaveContext } from './OOT/SaveContext';
import { CommandBuffer } from './OOT/CommandBuffer';
import { ActorManager } from './OOT/ActorManager';
import { IRomHeader } from 'modloader64_api/IRomHeader';

enum ROM_VERSIONS {
  N0 = 0x00,
  DEBUG = 0x0f,
}

export class OcarinaofTime implements ICore, IOOTCore {
  header = 'THE LEGEND OF ZELDA';
  ModLoader!: IModLoaderAPI;
  payloads: string[] = new Array<string>();
  link!: ILink;
  save!: ISaveContext;
  global!: IGlobalContext;
  helper!: IOotHelper;
  commandBuffer!: CommandBuffer;
  actorManager!: ActorManager;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  // Client side variables
  isSaveLoaded = false;
  last_known_scene = -1;
  touching_loading_zone = false;
  frame_count_reset_scene = -1;

  preinit(): void {}

  init(): void {
    this.eventTicks.set('waitingForSaveload', () => {
      if (!this.isSaveLoaded && this.helper.isSceneNumberValid()) {
        bus.emit(OotEvents.ON_SAVE_LOADED, {});
        this.isSaveLoaded = true;
        this.eventTicks.delete('waitingForSaveload');
      }
    });
    this.eventTicks.set('waitingForLoadingZoneTrigger', () => {
      if (
        this.link.state === LinkState.LOADING_ZONE &&
        !this.touching_loading_zone
      ) {
        bus.emit(OotEvents.ON_LOADING_ZONE, {});
        this.touching_loading_zone = true;
      }
    });
    this.eventTicks.set('waitingForFrameCount', () => {
      if (
        this.global.scene_framecount === 1 &&
        !this.helper.isTitleScreen() &&
        this.helper.isSceneNumberValid()
      ) {
        let cur = this.global.scene;
        this.last_known_scene = cur;
        bus.emit(OotEvents.ON_SCENE_CHANGE, this.last_known_scene);
        this.touching_loading_zone = false;
      }
    });
  }

  postinit(): void {
    this.global = new GlobalContext(this.ModLoader.emulator);
    this.link = new Link(this.ModLoader.emulator);
    this.save = new SaveContext(this.ModLoader.emulator);
    this.helper = new OotHelper(this.save, this.global);
    this.commandBuffer = new CommandBuffer(this.ModLoader.emulator);
    this.actorManager = new ActorManager(
      this.ModLoader.emulator,
      this.ModLoader.logger
    );
    this.eventTicks.set('tickingStuff', () => {
      this.commandBuffer.onTick();
      this.actorManager.onTick();
    });
    registerEndpoint('/Oot_SaveContext', (req: any, res: any) => {
      res.send(this.save);
    });
    registerEndpoint('/Oot_Link', (req: any, res: any) => {
      res.send(this.link);
    });
    registerEndpoint('/Oot_GlobalContext', (req: any, res: any) => {
      res.send(this.global);
    });
    registerEndpoint('/Oot_Helper', (req: any, res: any) => {
      res.send(this.helper);
    });
  }

  onTick(): void {
    if (!this.helper.isTitleScreen()) {
      this.eventTicks.forEach((value: Function, key: string) => {
        value();
      });
    }
  }

  @EventHandler(ModLoaderEvents.ON_ROM_HEADER_PARSED)
  onHeader(header: IRomHeader) {
    this.ModLoader.logger.info(
      'OOT VERSION: ' + ROM_VERSIONS[header.revision] + '.'
    );
    switch (header.revision) {
      case ROM_VERSIONS.N0: {
        global.ModLoader['save_context'] = 0x11a5d0;
        global.ModLoader['global_context_pointer'] = 0x11f248;
        global.ModLoader['overlay_table'] = 0x0e8530;
        this.payloads.push(__dirname + '/OcarinaofTime.payload');
        break;
      }
      case ROM_VERSIONS.DEBUG: {
        global.ModLoader['save_context'] = 0x15e660;
        global.ModLoader['global_context_pointer'] = 0x157da0;
        global.ModLoader['overlay_table'] = 0x1159b0;
      }
    }
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onInject(evt: any) {
    let gameshark = new GameShark(
      this.ModLoader.logger,
      this.ModLoader.emulator
    );
    for (let i = 0; i < this.payloads.length; i++) {
      gameshark.read(this.payloads[i]);
    }
  }
}
