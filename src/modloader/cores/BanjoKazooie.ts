import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/BKAPI';

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
  private instance: number = global.ModLoader['BK:banjo'];

  private animal_addr: number = this.instance + 0x10a8;
  private opacity_addr: number = this.instance + 0x06;
  private pos_x_addr: number = this.instance + 0x04c0;
  private pos_y_addr: number = this.instance + 0x04c4;
  private pos_z_addr: number = this.instance + 0x04c8;
  private rot_x_addr: number = this.instance + 0x0460;
  private rot_y_addr: number = this.instance + 0x05b0;
  private rot_z_addr: number = this.instance + 0x05a0;
  private scale_addr: number = this.instance + 0x0c;
  private state_addr: number = this.instance + 0x03c0;
  private visible_addr: number = this.instance + 0x08;
  private z_forward_addr: number = this.instance + 0x07;

  get exists(): boolean {
    return !(this.emulator.rdramRead32(this.instance) === 0x0000);
  }

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

  get z_forward(): boolean {
    return this.emulator.rdramRead8(this.z_forward_addr) === 0x01;
  }
  set z_forward(val: boolean) {
    if (val) {
      this.emulator.rdramWrite8(this.z_forward_addr, 0x01);
    } else {
      this.emulator.rdramWrite8(this.z_forward_addr, 0x00);
    }
  }
}

export class Runtime extends API.APIObject implements API.IRuntime {
  private ptr_actor_arr_addr = 0x36e560;
  private lvl_addr = 0x383301;
  private lvl_notes_addr = 0x385f63;
  private jiggies_available_addr = 0x385fcb;
  private jiggies_label_addr = 0x385fdf;
  private profile_addr = 0x365e00;

  get level(): API.LevelID {
    let level: number = this.emulator.rdramRead16(this.lvl_addr);
    if (level < 0x01 || level > 0x0d) {
      return API.LevelID.UNKNOWN;
    } else {
      return level as API.LevelID;
    }
  }

  get profile(): API.ProfileID {
    return this.emulator.rdramReadS32(this.profile_addr) as API.ProfileID;
  }
}

export class SaveContext extends API.APIObject implements API.ISaveContext {
  // Misc
  private honey_combs_addr = 0x385f7f;

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
}

export class BanjoKazooie implements ICore, API.IBKCore {
  header = 'Banjo-Kazooie';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  banjo!: API.IBanjo;
  runtime!: API.IRuntime;
  save!: SaveContext;

  isPlaying(): boolean {
    return !(
      this.banjo.state === 0 || this.runtime.profile === API.ProfileID.Title
    );
  }

  preinit(): void {
    global.ModLoader['BK:banjo'] = 0x37c0e0;

    // Save Data
    global.ModLoader['BK:game_flags'] = 0x3831a8;
    global.ModLoader['BK:honeycomb_flags'] = 0x3832e0;
    global.ModLoader['BK:jiggy_flags'] = 0x3832c0;
    global.ModLoader['BK:move_flags'] = 0x37c3a0;
    global.ModLoader['BK:mumbo_token_flags'] = 0x3832f0;
    global.ModLoader['BK:note_totals'] = 0x385ff0;
  }

  init(): void {}

  postinit(): void {
    this.banjo = new Banjo(this.ModLoader.emulator);
    this.runtime = new Runtime(this.ModLoader.emulator);
    this.save = new SaveContext(this.ModLoader.emulator);
  }

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }
}

export default BanjoKazooie;
