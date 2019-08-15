import IMemory from 'modloader64_api/IMemory';
import { ILogger } from 'modloader64_api/IModLoaderAPI';
import { ActorCategory } from 'modloader64_api/OOT/ActorCategory';
import { ActorBase } from './Actor';
import crypto from 'crypto';
import { bus } from 'modloader64_api/EventHandler';
import {
  OotEvents,
  IActorManager,
  IOotHelper,
} from 'modloader64_api/OOT/OOTAPI';
import { IActor } from 'modloader64_api/OOT/IActor';

export class ActorManager implements IActorManager {
  emulator: IMemory;
  logger: ILogger;
  helper: IOotHelper;
  private readonly actor_array_addr: number = 0x001c30;
  private readonly ringbuffer_start_addr: number = 0x600000 + 0x1e0;
  private readonly ringbuffer_index_addr: number = 0x600000 + 0x11e0;
  private readonly ringbuffer_entry_size: number = 0x10;
  private readonly ringbuffer_max: number = 0x100;
  private readonly actor_next_offset: number = 0x124;
  private actors_pointers_this_frame: number[] = new Array<number>();
  private actors_this_frame: Map<ActorCategory, ActorBase[]> = new Map<
    ActorCategory,
    ActorBase[]
  >();
  private actors_without_rom_ids_this_frame: Map<number, number> = new Map<
    number,
    number
  >();

  constructor(emulator: IMemory, logger: ILogger, helper: IOotHelper) {
    this.emulator = emulator;
    this.logger = logger;
    this.helper = helper;
    for (let i = 0; i < 12; i++) {
      this.actors_this_frame.set(i, new Array<ActorBase>());
    }
  }

  createIActorFromPointer(pointer: number): IActor {
    return new ActorBase(this.emulator, pointer);
  }

  onTick() {
    this.actors_pointers_this_frame.length = 0;
    this.actors_without_rom_ids_this_frame.clear();
    if (!this.helper.isLinkEnteringLoadingZone()) {
      for (let i = 0; i < 12 * 8; i += 8) {
        let count = this.emulator.rdramReadPtr32(
          global.ModLoader.global_context_pointer,
          this.actor_array_addr + i
        );
        let ptr = this.emulator.dereferencePointer(
          global.ModLoader.global_context_pointer
        );
        if (count > 0) {
          let pointer = this.emulator.dereferencePointer(
            ptr + this.actor_array_addr + (i + 4)
          );
          this.actors_pointers_this_frame.push(pointer);
          let next = this.emulator.dereferencePointer(
            pointer + this.actor_next_offset
          );
          while (next > 0) {
            this.actors_pointers_this_frame.push(next);
            next = this.emulator.dereferencePointer(
              next + this.actor_next_offset
            );
          }
        }
      }
    }
    for (
      let i = 0;
      i < this.ringbuffer_max * this.ringbuffer_entry_size;
      i += this.ringbuffer_entry_size
    ) {
      // Get all the entry data.
      let category = this.emulator.rdramRead32(this.ringbuffer_start_addr + i);

      // Break asap if we hit a zero. This means there is no further data that needs our attention this frame.
      if (category === 0) {
        break;
      }

      let addr = this.emulator.dereferencePointer(
        this.ringbuffer_start_addr + i + 4
      );
      let rom = this.emulator.rdramRead32(this.ringbuffer_start_addr + i + 8);
      let n = 0;

      if (addr > 0) {
        if (this.actors_pointers_this_frame.indexOf(addr) > -1) {
          let actor = new ActorBase(this.emulator, addr);
          if (!this.actors_without_rom_ids_this_frame.has(actor.actorID)) {
            this.actors_without_rom_ids_this_frame.set(actor.actorID, 0);
          }
          n = this.actors_without_rom_ids_this_frame.get(actor.actorID)!;
          n++;
          this.actors_without_rom_ids_this_frame.set(actor.actorID, n);
          let uuid = crypto
            .createHash('md5')
            .update(
              Buffer.from(
                rom.toString(16) +
                  actor.actorID.toString(16) +
                  actor.room.toString(16) +
                  n.toString(16)
              )
            )
            .digest('hex');
          actor.actorUUID = uuid;
          this.actors_this_frame.get(actor.actorType)!.push(actor);
          bus.emit(OotEvents.ON_ACTOR_SPAWN, actor);
        }
      }

      // Clear the entry when we're done with it.
      this.emulator.rdramWrite32(this.ringbuffer_start_addr + i, 0);
      this.emulator.rdramWrite32(this.ringbuffer_start_addr + i + 4, 0);
      this.emulator.rdramWrite32(this.ringbuffer_start_addr + i + 8, 0);
      this.emulator.rdramWrite32(this.ringbuffer_start_addr + i + 12, 0);
    }
    this.actors_this_frame.forEach((value: ActorBase[], key: ActorCategory) => {
      for (let i = 0; i < value.length; i++) {
        if (this.actors_pointers_this_frame.indexOf(value[i].instance) === -1) {
          value[i].exists = false;
          let removed: ActorBase = value.splice(i, 1)[0];
          bus.emit(OotEvents.ON_ACTOR_DESPAWN, removed);
        }
      }
    });
    // Clear the ring buffer index so it snaps back to the top.
    this.emulator.rdramWrite32(this.ringbuffer_index_addr, 0);
  }
}
