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
import { IDungeonItemManager } from 'modloader64_api/OOT/IDungeonItemManager';
import { DungeonItemManager } from './OOT/DungeonItemManager';
import { PayloadType } from 'modloader64_api/PayloadType';
import fs from 'fs';
import path from 'path';

enum ROM_VERSIONS {
  N0 = 0x00,
  DEBUG = 0x0f,
}

export class OcarinaofTime implements ICore, IOOTCore {
  header = 'THE LEGEND OF ZELDA';
  ModLoader!: IModLoaderAPI;
  payloads: string[] = new Array<string>();
  link!: ILink;
  save!: SaveContext;
  global!: IGlobalContext;
  helper!: IOotHelper;
  commandBuffer!: CommandBuffer;
  actorManager!: ActorManager;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  // Client side variables
  isSaveLoaded = false;
  last_known_scene = -1;
  last_known_room = -1;
  doorcheck = false;
  touching_loading_zone = false;
  frame_count_reset_scene = -1;
  rom_header!: IRomHeader;
  inventory_cache: Buffer = Buffer.alloc(0x24, 0xff);
  last_known_age!: number;

  preinit(): void {
      this.ModLoader.logger.info(
          'OOT VERSION: ' + ROM_VERSIONS[this.rom_header.revision] + '.'
      );
      switch (this.rom_header.revision) {
      case ROM_VERSIONS.DEBUG:
          global.ModLoader['save_context'] = 0x15e660;
          global.ModLoader['global_context_pointer'] = 0x157da0;
          global.ModLoader['overlay_table'] = 0x1159b0;
          break;
      default:
          global.ModLoader['save_context'] = 0x11a5d0;
          global.ModLoader['global_context_pointer'] = 0x11f248;
          global.ModLoader['overlay_table'] = 0x0e8530;
          global.ModLoader['link_instance'] = 0x1daa30;
          this.payloads.push(__dirname + '/OOT/OcarinaofTime.payload');
          break;
      }
  }

  init(): void {
      this.eventTicks.set('waitingForAgeChange', () => {
          if (this.save.age !== this.last_known_age) {
              bus.emit(OotEvents.ON_AGE_CHANGE, this.save.age);
              this.last_known_age = this.save.age;
          }
      });
      this.eventTicks.set('waitingForSaveload', () => {
          if (!this.isSaveLoaded && this.helper.isSceneNumberValid()) {
              this.isSaveLoaded = true;
              bus.emit(OotEvents.ON_SAVE_LOADED, {});
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
              let inventory: Buffer = this.ModLoader.emulator.rdramReadBuffer(
                  global.ModLoader.save_context + 0x0074,
                  0x24
              );
              for (let i = 0; i < inventory.byteLength; i++) {
                  if (inventory[i] === 0x004d) {
                      inventory[i] = this.inventory_cache[i];
                  }
              }
              inventory.copy(this.inventory_cache);
              this.ModLoader.emulator.rdramWriteBuffer(
                  global.ModLoader.save_context + 0x0074,
                  inventory
              );
          }
      });
      this.eventTicks.set('waitingForRoomChange', () => {
          let cur = this.global.room;
          if (this.last_known_room !== cur) {
              this.last_known_room = cur;
              bus.emit(OotEvents.ON_ROOM_CHANGE, this.last_known_room);
              this.doorcheck = false;
          }
          let doorState = this.ModLoader.emulator.rdramReadPtr8(
              global.ModLoader.global_context_pointer,
              0x11ced
          );
          if (doorState === 1 && !this.doorcheck) {
              bus.emit(OotEvents.ON_ROOM_CHANGE_PRE, doorState);
              this.doorcheck = true;
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
          this.helper,
          this.global,
          this.ModLoader.utils
      );
      this.eventTicks.set('tickingStuff', () => {
          this.commandBuffer.onTick();
          this.actorManager.onTick();
          this.ModLoader.emulator.rdramWrite8(0x1da5cb, 0x0002);
      });
      this.ModLoader.payloadManager.registerPayloadType(
          new OverlayPayload('.ovl')
      );
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
      for (let i = 0; i < this.payloads.length; i++) {
          this.ModLoader.payloadManager.parseFile(this.payloads[i]);
      }
  }
}

class find_init {
    constructor() {}

    find(buf: Buffer, locate: string): number {
        let loc: Buffer = Buffer.from(locate, 'hex');
        if (buf.indexOf(loc) > -1) {
            return buf.indexOf(loc);
        }
        return -1;
    }
}

interface ovl_meta {
  addr: string;
  init: string;
}

export class OverlayPayload extends PayloadType {
    constructor(ext: string) {
        super(ext);
    }

    parse(file: string, buf: Buffer, dest: Buffer) {
        console.log('Trying to allocate actor...');
        let overlay_start: number = global.ModLoader['overlay_table'];
        let size = 0x01d6;
        let empty_slots: number[] = new Array<number>();
        for (let i = 0; i < size; i++) {
            let entry_start: number = overlay_start + i * 0x20;
            let _i: number = dest.readUInt32BE(entry_start + 0x14);
            let total = 0;
            total += _i;
            if (total === 0) {
                empty_slots.push(i);
            }
        }
        console.log(empty_slots.length + ' empty actor slots found.');
        let finder: find_init = new find_init();
        let meta: ovl_meta = JSON.parse(
            fs
                .readFileSync(
                    path.join(path.parse(file).dir, path.parse(file).name + '.json')
                )
                .toString()
        );
        let offset: number = finder.find(buf, meta.init);
        if (offset === -1) {
            console.log(
                'Failed to find spawn parameters for actor ' +
          path.parse(file).base +
          '.'
            );
            return -1;
        }
        let addr: number = parseInt(meta.addr) + offset;
        let slot: number = empty_slots.shift() as number;
        console.log(
            'Assigning ' + path.parse(file).base + ' to slot ' + slot + '.'
        );
        dest.writeUInt32BE(0x80000000 + addr, slot * 0x20 + overlay_start + 0x14);
        buf.writeUInt8(slot, offset + 0x1);
        buf.copy(dest, parseInt(meta.addr));
        return slot;
    }
}
