import IMemory from 'modloader64_api/IMemory';
import { IGlobalContext } from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export class GlobalContext extends JSONTemplate implements IGlobalContext {
  private emulator: IMemory;
  private current_scene_addr = 0x0000a4;
  private switch_flags_addr = 0x001d28;
  private temp_switch_flags_addr = 0x001d2c;
  private chest_flags_addr = 0x001d38;
  private room_clear_flags_addr = 0x001d3c;
  private current_room_addr = 0x011cbc;
  private frame_count_addr = 0x011de4;
  private scene_frame_count_addr = 0x9c;
  private collectable_flag_addr = 0x01d44;
  private continue_state_addr = 0x98;
  jsonFields: string[] = ['scene', 'room', 'framecount'];
  constructor(emulator: IMemory) {
    super();
    this.emulator = emulator;
  }
  get scene(): number {
    return this.emulator.rdramReadPtr16(
      global.ModLoader.global_context_pointer,
      this.current_scene_addr
    );
  }
  get room(): number {
    return this.emulator.rdramReadPtr8(
      global.ModLoader.global_context_pointer,
      this.current_room_addr
    );
  }
  get framecount(): number {
    return this.emulator.rdramReadPtr32(
      global.ModLoader.global_context_pointer,
      this.frame_count_addr
    );
  }
  get scene_framecount(): number {
    return this.emulator.rdramReadPtr32(
      global.ModLoader.global_context_pointer,
      this.scene_frame_count_addr
    );
  }
  get liveSceneData_chests(): Buffer {
    return this.emulator.rdramReadPtrBuffer(
      global.ModLoader.global_context_pointer,
      this.chest_flags_addr,
      0x4
    );
  }
  set liveSceneData_chests(buf: Buffer) {
    this.emulator.rdramWritePtrBuffer(
      global.ModLoader.global_context_pointer,
      this.chest_flags_addr,
      buf
    );
  }
  get liveSceneData_clear(): Buffer {
    return this.emulator.rdramReadBuffer(this.room_clear_flags_addr, 0x4);
  }
  set liveSceneData_clear(buf: Buffer) {
    this.emulator.rdramWritePtrBuffer(
      global.ModLoader.global_context_pointer,
      this.room_clear_flags_addr,
      buf
    );
  }
  get liveSceneData_switch(): Buffer {
    return this.emulator.rdramReadPtrBuffer(
      global.ModLoader.global_context_pointer,
      this.switch_flags_addr,
      0x4
    );
  }
  set liveSceneData_switch(buf: Buffer) {
    this.emulator.rdramWritePtrBuffer(
      global.ModLoader.global_context_pointer,
      this.switch_flags_addr,
      buf
    );
  }
  get liveSceneData_temp(): Buffer {
    return this.emulator.rdramReadPtrBuffer(
      global.ModLoader.global_context_pointer,
      this.temp_switch_flags_addr,
      0x4
    );
  }
  set liveSceneData_temp(buf: Buffer) {
    this.emulator.rdramWritePtrBuffer(
      global.ModLoader.global_context_pointer,
      this.temp_switch_flags_addr,
      buf
    );
  }
  get liveSceneData_collectable(): Buffer {
    return this.emulator.rdramReadPtrBuffer(
      global.ModLoader.global_context_pointer,
      this.collectable_flag_addr,
      0x8
    );
  }
  set liveSceneData_collectable(buf: Buffer) {
    this.emulator.rdramWritePtrBuffer(
      global.ModLoader.global_context_pointer,
      this.collectable_flag_addr,
      buf
    );
  }
  get continue_state(): boolean {
    return (
      this.emulator.rdramReadPtr32(
        global.ModLoader.global_context_pointer,
        this.continue_state_addr
      ) === 1
    );
  }
  getSaveDataForCurrentScene(): Buffer {
    return this.emulator.rdramReadPtrBuffer(
      global.ModLoader.global_context_pointer,
      this.scene * 0x1c,
      0x1c
    );
  }
  writeSaveDataForCurrentScene(buf: Buffer): void {
    if (buf.byteLength === 0x1c) {
      this.emulator.rdramWritePtrBuffer(
        global.ModLoader.global_context_pointer,
        this.scene * 0x1c,
        buf
      );
    }
  }
}
