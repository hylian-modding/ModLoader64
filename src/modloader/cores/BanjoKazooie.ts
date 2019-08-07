import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Api';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export class GameFlags extends API.APIBufferedObject implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader['BK:game_flags'], 0x20);
  }
}

export class HoneyCombFlags extends API.APIBufferedObject
  implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader['BK:honeycomb_flags'], 0x03);
  }
}

export class JiggyFlags extends API.APIBufferedObject implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader['BK:jiggy_flags'], 0x0d);
  }
}

export class MoveFlags extends API.APIBufferedObject implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader['BK:move_flags'], 0x04);
  }
}

export class MumboTokenFlags extends API.APIBufferedObject
  implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader['BK:mumbo_token_flags'], 0x10);
  }
}

export class NoteTotalBuffer extends API.APIBufferedObject
  implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader['BK:note_totals'], 0x0f);
  }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Banjo extends API.APIObject implements API.IBanjo {
  private animal_addr: number = global.ModLoader['BK:banjo_animal'];
  private anim_addr: number = global.ModLoader['BK:banjo_animation'];
  private flip_facing_addr: number = global.ModLoader['BK:banjo_flip_facing'];
  private model_index_addr: number = global.ModLoader['BK:banjo_model_index'];
  private model_ptr_addr: number = global.ModLoader['BK:banjo_model_ptr'];
  private opacity_addr: number = global.ModLoader['BK:banjo_opacity'];
  private pos_x_addr: number = global.ModLoader['BK:banjo_pos_x'];
  private pos_y_addr: number = global.ModLoader['BK:banjo_pos_y'];
  private pos_z_addr: number = global.ModLoader['BK:banjo_pos_z'];
  private rot_x_addr: number = global.ModLoader['BK:banjo_rot_x'];
  private rot_y_addr: number = global.ModLoader['BK:banjo_rot_y'];
  private rot_z_addr: number = global.ModLoader['BK:banjo_rot_z'];
  private scale_addr: number = global.ModLoader['BK:banjo_scale'];
  private state_addr: number = global.ModLoader['BK:banjo_state'];
  private visible_addr: number = global.ModLoader['BK:banjo_visible'];

  get animal(): API.AnimalType {
    let animal: number = this.emulator.rdramRead8(this.animal_addr);
    if (animal < 0x01 || animal > 0x07) {
      return API.AnimalType.UNKNOWN;
    } else {
      return animal as API.AnimalType;
    }
  }
  set animal(val: API.AnimalType) {
    this.emulator.rdramWrite8(this.animal_addr, val);
  }

  get animation(): Buffer {
    let buf: Buffer = Buffer.alloc(8);
    buf.writeUInt32BE(this.emulator.rdramReadPtr32(this.anim_addr, 0x04), 0);
    buf.writeUInt32BE(this.emulator.rdramReadPtr32(this.anim_addr, 0x1c), 4);
    return buf;
  }
  set animation(val: Buffer) {
    let animStructPtr = this.emulator.dereferencePointer(this.anim_addr);
    this.emulator.rdramWritePtrBuffer(this.anim_addr, 0x04, val.slice(0, 4));
    this.emulator.rdramWritePtrBuffer(this.anim_addr, 0x1c, val.slice(4, 8));
  }

  get anim_frame(): number {
    return this.emulator.rdramReadPtr32(this.anim_addr, 0x04);
  }
  set anim_frame(val: number) {
    this.emulator.rdramWritePtr32(this.anim_addr, 0x04, val);
  }

  get anim_id(): number {
    return this.emulator.rdramReadPtr32(this.anim_addr, 0x1c);
  }
  set anim_id(val: number) {
    this.emulator.rdramWritePtr32(this.anim_addr, 0x1c, val);
  }

  get flip_facing(): boolean {
    return this.emulator.rdramRead8(this.flip_facing_addr) === 0x01;
  }
  set flip_facing(val: boolean) {
    if (val) {
      this.emulator.rdramWrite8(this.flip_facing_addr, 0x01);
    } else {
      this.emulator.rdramWrite8(this.flip_facing_addr, 0x00);
    }
  }

  get model_index(): number {
    return this.emulator.rdramRead16(this.model_index_addr);
  }
  set model_index(val: number) {
    this.emulator.rdramWrite16(this.model_index_addr, val);
  }

  get model_ptr(): number {
    return this.emulator.dereferencePointer(this.model_ptr_addr);
  }
  set model_ptr(val: number) {
    this.emulator.rdramWrite32(this.model_ptr_addr, val);
  }

  get opacity(): number {
    return this.emulator.rdramRead8(this.opacity_addr);
  }
  set opacity(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 255) {
      val = 255;
    }
    this.emulator.rdramWrite8(this.opacity_addr, val);
  }

  get position(): Buffer {
    let buf: Buffer = Buffer.alloc(12);
    buf.writeUInt32BE(this.emulator.rdramRead32(this.pos_x_addr), 0);
    buf.writeUInt32BE(this.emulator.rdramRead32(this.pos_y_addr), 4);
    buf.writeUInt32BE(this.emulator.rdramRead32(this.pos_z_addr), 8);
    return buf;
  }
  set position(val: Buffer) {
    this.emulator.rdramWriteBuffer(this.pos_x_addr, val.slice(0, 4));
    this.emulator.rdramWriteBuffer(this.pos_y_addr, val.slice(4, 8));
    this.emulator.rdramWriteBuffer(this.pos_z_addr, val.slice(8, 12));
  }

  get pos_x(): number {
    return this.emulator.rdramRead32(this.pos_x_addr);
  }
  set pos_x(val: number) {
    this.emulator.rdramWrite32(this.pos_x_addr, val);
  }

  get pos_y(): number {
    return this.emulator.rdramRead32(this.pos_y_addr);
  }
  set pos_y(val: number) {
    this.emulator.rdramWrite32(this.pos_y_addr, val);
  }

  get pos_z(): number {
    return this.emulator.rdramRead32(this.pos_z_addr);
  }
  set pos_z(val: number) {
    this.emulator.rdramWrite32(this.pos_z_addr, val);
  }

  get rotation(): Buffer {
    let buf: Buffer = Buffer.alloc(12);
    buf.writeUInt32BE(this.emulator.rdramRead32(this.rot_x_addr), 0);
    buf.writeUInt32BE(this.emulator.rdramRead32(this.rot_y_addr), 4);
    buf.writeUInt32BE(this.emulator.rdramRead32(this.rot_z_addr), 8);
    return buf;
  }
  set rotation(val: Buffer) {
    this.emulator.rdramWriteBuffer(this.rot_x_addr, val.slice(0, 4));
    this.emulator.rdramWriteBuffer(this.rot_y_addr, val.slice(4, 8));
    this.emulator.rdramWriteBuffer(this.rot_z_addr, val.slice(8, 12));
  }

  get rot_x(): number {
    return this.emulator.rdramRead32(this.rot_x_addr);
  }
  set rot_x(val: number) {
    this.emulator.rdramWrite32(this.rot_x_addr, val);
  }

  get rot_y(): number {
    return this.emulator.rdramRead32(this.rot_y_addr);
  }
  set rot_y(val: number) {
    this.emulator.rdramWrite32(this.rot_y_addr, val);
  }

  get rot_z(): number {
    return this.emulator.rdramRead32(this.rot_z_addr);
  }
  set rot_z(val: number) {
    this.emulator.rdramWrite32(this.rot_z_addr, val);
  }

  get scale(): number {
    return this.emulator.rdramRead32(this.scale_addr);
  }
  set scale(val: number) {
    this.emulator.rdramWrite32(this.scale_addr, val);
  }

  get state(): number {
    return this.emulator.rdramRead32(this.state_addr);
  }
  set state(val: number) {
    this.emulator.rdramWrite32(this.state_addr, val);
  }

  get visible(): boolean {
    return this.emulator.rdramRead8(this.visible_addr) === 0x01;
  }
  set visible(val: boolean) {
    if (val) {
      this.emulator.rdramWrite8(this.visible_addr, 0x01);
    } else {
      this.emulator.rdramWrite8(this.visible_addr, 0x00);
    }
  }
}

export class Runtime extends API.APIObject implements API.IRuntime {
  private actor_arr_ptr_addr = global.ModLoader['BK:actor_arr_ptr'];
  private cur_health_addr = global.ModLoader['BK:current_health'];
  private cur_profile_addr = global.ModLoader['BK:current_profile'];
  private cur_exit_addr = global.ModLoader['BK:current_exit'];
  private cur_map_addr = global.ModLoader['BK:current_map'];
  private cur_level_addr = global.ModLoader['BK:current_level'];
  private cur_level_notes_addr = global.ModLoader['BK:current_level_notes'];

  private loading_status_addr = global.ModLoader['BK:loading_state'];
  private transition_state_addr = global.ModLoader['BK:transition_state'];

  get_current_profile(): API.ProfileID {
    return this.emulator.rdramReadS32(this.cur_profile_addr) as API.ProfileID;
  }

  get current_exit(): number {
    return this.emulator.rdramRead8(this.cur_exit_addr);
  }
  set current_exit(val: number) {
    this.emulator.rdramWrite8(this.cur_exit_addr, val);
  }

  get current_level(): number {
    return this.emulator.rdramRead16(this.cur_level_addr);
  }
  set current_level(val: number) {
    this.emulator.rdramWrite8(this.cur_level_addr, val);
  }

  get current_scene(): number {
    return this.emulator.rdramRead16(this.cur_map_addr);
  }
  set current_scene(val: number) {
    this.emulator.rdramWrite8(this.cur_map_addr, val);
  }

  get current_health(): number {
    return this.emulator.rdramRead8(this.cur_health_addr);
  }
  set current_health(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite8(this.cur_health_addr, val);
  }

  get loading_state(): boolean {
    return this.emulator.rdramRead8(this.loading_status_addr) === 1;
  }
  set loading_state(val: boolean) {
    let value = 0;
    if (val) value = 1;
    this.emulator.rdramWrite8(this.loading_status_addr, value);
  }

  get_transition_state(): number {
    return this.emulator.rdramRead8(this.transition_state_addr);
  }
}

export class SaveContext extends API.APIObject implements API.ISaveContext {
  private held_honeycombs_addr = global.ModLoader['BK:held_honeycombs'];
  private held_jiggies_addr = global.ModLoader['BK:held_jiggies'];
  private held_mumbo_tokens_addr = global.ModLoader['BK:held_mumbo_tokens'];
  private health_upgrade_addr = global.ModLoader['BK:health_upgrade'];
  private jiggy_count_addr = global.ModLoader['BK:jiggy_count'];

  // Abstraction
  game_flags: API.IBuffered;
  honeycomb_flags: API.IBuffered;
  jiggy_flags: API.IBuffered;
  move_flags: API.IBuffered;
  mumbo_token_flags: API.IBuffered;
  note_totals: API.IBuffered;

  constructor(emu: IMemory) {
    super(emu);
    this.game_flags = new GameFlags(emu);
    this.honeycomb_flags = new HoneyCombFlags(emu);
    this.jiggy_flags = new JiggyFlags(emu);
    this.move_flags = new MoveFlags(emu);
    this.mumbo_token_flags = new MumboTokenFlags(emu);
    this.note_totals = new NoteTotalBuffer(emu);
  }

  get held_honeycombs(): number {
    return this.emulator.rdramRead8(this.held_honeycombs_addr);
  }
  set held_honeycombs(val: number) {
    if (val > 6) {
      val = 6;
    } else if (val < 0) {
      val = 0;
    }
    this.emulator.rdramWrite8(this.held_honeycombs_addr, val);
  }

  get held_jiggies(): number {
    return this.emulator.rdramRead8(this.held_jiggies_addr);
  }
  set held_jiggies(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite8(this.held_jiggies_addr, val);
    this.emulator.rdramWrite8(this.jiggy_count_addr, val);
  }

  get held_mumbo_tokens(): number {
    return this.emulator.rdramRead8(this.held_mumbo_tokens_addr);
  }
  set held_mumbo_tokens(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite8(this.held_mumbo_tokens_addr, val);
  }

  get health_upgrades(): number {
    return this.emulator.rdramRead8(this.health_upgrade_addr) - 5;
  }
  set health_upgrades(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite8(this.health_upgrade_addr, val + 5);
  }
}

export class BanjoKazooie implements ICore, API.IBKCore {
  header = 'Banjo-Kazooie';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  banjo!: API.IBanjo;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;

  isPlaying(): boolean {
    return !(
      this.banjo.state === 0 ||
      this.runtime.get_current_profile() === API.ProfileID.Title
    );
  }

  preinit(): void {
    // Hidden Data
    global.ModLoader['BK:beta_menu'] = 0x383080;

    // Banjo Data
    global.ModLoader['BK:banjo_animal'] = 0x37d188;
    global.ModLoader['BK:banjo_animation'] = 0x37bf20;
    global.ModLoader['BK:banjo_flip_facing'] = 0x37c0e7;
    global.ModLoader['BK:banjo_model_index'] = 0x37c0e4;
    global.ModLoader['BK:banjo_model_ptr'] = 0x37c0e0;
    global.ModLoader['BK:banjo_opacity'] = 0x37c0e6;
    global.ModLoader['BK:banjo_pos_x'] = 0x37c5a0;
    global.ModLoader['BK:banjo_pos_y'] = 0x37c5a4;
    global.ModLoader['BK:banjo_pos_z'] = 0x37c5a8;
    global.ModLoader['BK:banjo_rot_x'] = 0x37c540;
    global.ModLoader['BK:banjo_rot_y'] = 0x37c0f8;
    global.ModLoader['BK:banjo_rot_z'] = 0x37c680;
    global.ModLoader['BK:banjo_scale'] = 0x37c0ec;
    global.ModLoader['BK:banjo_state'] = 0x37c4a0;
    global.ModLoader['BK:banjo_visible'] = 0x37c0e8;

    // Runtime Data
    global.ModLoader['BK:actor_arr_ptr'] = 0x36e560;
    global.ModLoader['BK:current_health'] = 0x385f83;
    global.ModLoader['BK:current_profile'] = 0x365e00;
    global.ModLoader['BK:current_exit'] = 0x37e8f6;
    global.ModLoader['BK:current_map'] = 0x37e8f5;
    global.ModLoader['BK:current_level'] = 0x383301;
    global.ModLoader['BK:current_level_notes'] = 0x385f63;
    global.ModLoader['BK:loading_state'] = 0x37e8f4;
    global.ModLoader['BK:transition_state'] = 0x382438;

    // Save Data
    global.ModLoader['BK:game_flags'] = 0x3831a8;
    global.ModLoader['BK:honeycomb_flags'] = 0x3832e0;
    global.ModLoader['BK:jiggy_flags'] = 0x3832c0;
    global.ModLoader['BK:move_flags'] = 0x37c3a0;
    global.ModLoader['BK:mumbo_token_flags'] = 0x3832f0;
    global.ModLoader['BK:note_totals'] = 0x385ff0;

    global.ModLoader['BK:held_honeycombs'] = 0x385f7f;
    global.ModLoader['BK:held_jiggies'] = 0x385fcb;
    global.ModLoader['BK:held_mumbo_tokens'] = 0x0;

    global.ModLoader['BK:health_upgrade'] = 0x385f87;
    global.ModLoader['BK:jiggy_count'] = 0x385fdf;
  }

  init(): void {}

  postinit(): void {
    this.banjo = new Banjo(this.ModLoader.emulator);
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

export default BanjoKazooie;
