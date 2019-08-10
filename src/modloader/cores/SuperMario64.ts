import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/SM64/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export class SaveFile extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory, profile_instance: number) {
    super(emu, profile_instance, 0x70);
  }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Mario extends API.BaseObj implements API.IMario {
  private instance: number = global.ModLoader['SM64:mario'];
  private pos_x_addr = 0x20;
  private pos_y_addr = 0x24;
  private pos_z_addr = 0x28;
  private rot_x_addr = 0x54;
  private rot_y_addr = 0x58;
  private rot_z_addr = 0x5c;

  get exists(): boolean {
    return !(this.emulator.rdramRead32(this.instance) === 0x00000000);
  }

  get animation(): Buffer {
    return Buffer.from([this.anim_frame, this.anim_id]);
  }
  set animation(val: Buffer) {
    this.anim_frame = val[0];
    this.anim_id = val[1];
  }

  get anim_frame(): number {
    return 0;
  }
  set anim_frame(val: number) {
    return;
  }

  get anim_id(): number {
    return 0;
  }
  set anim_id(val: number) {
    return;
  }

  get position(): Buffer {
    return Buffer.from([this.pos_x, this.pos_y, this.pos_z]);
  }
  set position(val: Buffer) {
    this.pos_x = val[0];
    this.pos_y = val[1];
    this.pos_z = val[2];
  }

  get pos_x(): number {
    return this.emulator.rdramReadPtr32(this.instance, this.pos_x_addr);
  }
  set pos_x(val: number) {
    this.emulator.rdramWritePtr32(this.instance, this.pos_x_addr, val);
  }

  get pos_y(): number {
    return this.emulator.rdramReadPtr32(this.instance, this.pos_y_addr);
  }
  set pos_y(val: number) {
    this.emulator.rdramWritePtr32(this.instance, this.pos_y_addr, val);
  }

  get pos_z(): number {
    return this.emulator.rdramReadPtr32(this.instance, this.pos_z_addr);
  }
  set pos_z(val: number) {
    this.emulator.rdramWritePtr32(this.instance, this.pos_z_addr, val);
  }

  get rotation(): Buffer {
    return Buffer.from([this.rot_x, this.rot_y, this.rot_z]);
  }
  set rotation(val: Buffer) {
    this.rot_x = val[0];
    this.rot_y = val[1];
    this.rot_z = val[2];
  }

  get rot_x(): number {
    return this.emulator.rdramReadPtr32(this.instance, this.rot_x_addr);
  }
  set rot_x(val: number) {
    this.emulator.rdramWritePtr32(this.instance, this.rot_x_addr, val);
  }

  get rot_y(): number {
    return this.emulator.rdramReadPtr32(this.instance, this.rot_y_addr);
  }
  set rot_y(val: number) {
    this.emulator.rdramWritePtr32(this.instance, this.rot_y_addr, val);
  }

  get rot_z(): number {
    return this.emulator.rdramReadPtr32(this.instance, this.rot_z_addr);
  }
  set rot_z(val: number) {
    this.emulator.rdramWritePtr32(this.instance, this.rot_z_addr, val);
  }

  get cap(): number {
    return 0;
  }
  set cap(val: number) {
    return;
  }
}

export class Runtime extends API.BaseObj implements API.IRuntime {
  private cur_scene_addr = global.ModLoader['SM64:current_scene'];
  private cur_prof_addr = global.ModLoader['SM64:current_profile'];
  private star_count_addr = global.ModLoader['SM64:star_count'];

  get_current_scene(): number {
    return this.emulator.rdramRead16(this.cur_scene_addr);
  }

  get_current_profile(): number {
    return this.emulator.rdramRead8(this.cur_prof_addr) - 1;
  }

  get star_count(): number {
    return this.emulator.rdramRead16(this.star_count_addr);
  }
  set star_count(val: number) {
    this.emulator.rdramWrite16(this.star_count_addr, val);
  }
}

export class SuperMario64 implements ICore, API.ISM64Core {
  header = 'SUPER MARIO 64';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  mario!: API.IMario;
  runtime!: API.IRuntime;
  save!: API.IBuffered[];

  preinit(): void {
    global.ModLoader['SM64:mario'] = 0x361158;

    // Save Context
    global.ModLoader['SM64:fileA'] = 0x207700;
    global.ModLoader['SM64:fileB'] = 0x207770;
    global.ModLoader['SM64:fileC'] = 0x2077e0;
    global.ModLoader['SM64:fileD'] = 0x207850;

    // Floating Data
    global.ModLoader['SM64:current_scene'] = 0x32ddf8;
    global.ModLoader['SM64:current_profile'] = 0x32ddf5;
    global.ModLoader['SM64:star_count'] = 0x33b21a;
  }

  init(): void {}

  postinit(): void {
    this.mario = new Mario(this.ModLoader.emulator);
    this.runtime = new Runtime(this.ModLoader.emulator);

    // Save Context
    this.save = [
      new SaveFile(this.ModLoader.emulator, global.ModLoader['SM64:fileA']),
      new SaveFile(this.ModLoader.emulator, global.ModLoader['SM64:fileB']),
      new SaveFile(this.ModLoader.emulator, global.ModLoader['SM64:fileC']),
      new SaveFile(this.ModLoader.emulator, global.ModLoader['SM64:fileD']),
    ];
  }

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }
}

export default SuperMario64;
