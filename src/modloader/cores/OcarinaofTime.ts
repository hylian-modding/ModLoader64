import { bus, EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { GameShark } from 'modloader64_api/GameShark';
import { ICore, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import {
  IGlobalContext,
  ILink,
  IOOTCore,
  IOotHelper,
  ISaveContext,
  OotEvents,
  IKeyManager,
} from 'modloader64_api/OOT/OOTAPI';
import { ActorManager } from './OOT/ActorManager';
import { CommandBuffer } from './OOT/CommandBuffer';
import { GlobalContext } from './OOT/GlobalContext';
import { Link } from './OOT/Link';
import { OotHelper } from './OOT/OotHelper';
import { SaveContext } from './OOT/SaveContext';
import { KeyManager } from './OOT/KeyManager';

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
  keyManager!: IKeyManager;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  // Client side variables
  isSaveLoaded = false;
  last_known_scene = -1;
  touching_loading_zone = false;
  frame_count_reset_scene = -1;
  rom_header!: IRomHeader;

  preinit(): void {
    this.ModLoader.logger.info(
      'OOT VERSION: ' + ROM_VERSIONS[this.rom_header.revision] + '.'
    );
    switch (this.rom_header.revision) {
      case ROM_VERSIONS.N0: {
        global.ModLoader['save_context'] = 0x11a5d0;
        global.ModLoader['global_context_pointer'] = 0x11f248;
        global.ModLoader['overlay_table'] = 0x0e8530;
        this.payloads.push(__dirname + '/OOT/OcarinaofTime.payload');
        break;
      }
      case ROM_VERSIONS.DEBUG: {
        global.ModLoader['save_context'] = 0x15e660;
        global.ModLoader['global_context_pointer'] = 0x157da0;
        global.ModLoader['overlay_table'] = 0x1159b0;
      }
    }
  }

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
        this.helper.isLinkEnteringLoadingZone() &&
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
    this.save = new SaveContext(this.ModLoader.emulator, this.ModLoader.logger);
    this.helper = new OotHelper(
      this.save,
      this.global,
      this.link,
      this.ModLoader.emulator
    );
    this.commandBuffer = new CommandBuffer(this.ModLoader.emulator);
    this.actorManager = new ActorManager(
      this.ModLoader.emulator,
      this.ModLoader.logger,
      this.helper
    );
    this.keyManager = new KeyManager(this.ModLoader.emulator);
    this.eventTicks.set('tickingStuff', () => {
      this.commandBuffer.onTick();
      this.actorManager.onTick();
    });
  }

  onTick(): void {
    if (!this.helper.isTitleScreen()) {
      this.eventTicks.forEach((value: Function, key: string) => {
        value();
      });
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
