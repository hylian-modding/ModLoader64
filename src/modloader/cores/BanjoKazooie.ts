import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import {
  IModLoaderAPI,
  ICore,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { VersionHandler } from './BK/VersionHandler';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export class GameFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_GAME_FLAGS], 0x20);
  }
}

export class HoneyCombFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS], 0x03);
  }
}

export class JiggyFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS], 0x0d);
  }
}

export class MumboTokenFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS], 0x10);
  }
}

export class NoteTotalBuffer extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, global.ModLoader[API.AddressType.SAVE_NOTE_TOTALS], 0x0f);
  }
}

export class CurrentLevel extends API.BaseObj implements API.ICurrentLevel {
  private id_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL];
  private acorn_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL_ACORN];
  private caterpillar_addr =
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_CATERPILLAR];
  private gold_bullions_addr =
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_GOLD_BULLION];
  private jinjos_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL_JINJOS];
  private notes_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL_NOTES];
  private present_green_addr =
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_GREEN];
  private present_blue_addr =
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_BLUE];
  private present_red_addr =
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_PRESENT_RED];
  private orange_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL_ORANGE];

  get id(): API.LevelType {
    let level: number = this.emulator.rdramRead8(this.id_addr);
    if (
      level < API.LevelType.MUMBOS_MOUNTAIN ||
      level > API.LevelType.TITLE_SCREEN
    ) {
      return API.LevelType.UNKNOWN;
    } else {
      return level as API.LevelType;
    }
  }
  set id(val: API.LevelType) {
    this.emulator.rdramWrite8(this.id_addr, val);
  }

  get acorn(): number {
    return this.emulator.rdramRead32(this.acorn_addr);
  }
  set acorn(val: number) {
    this.emulator.rdramWrite32(this.acorn_addr, val);
  }

  get caterpillar(): number {
    return this.emulator.rdramRead32(this.caterpillar_addr);
  }
  set caterpillar(val: number) {
    this.emulator.rdramWrite32(this.caterpillar_addr, val);
  }

  get gold_bullions(): number {
    return this.emulator.rdramRead32(this.gold_bullions_addr);
  }
  set gold_bullions(val: number) {
    this.emulator.rdramWrite32(this.gold_bullions_addr, val);
  }

  get jinjos(): number {
    return this.emulator.rdramRead32(this.jinjos_addr);
  }
  set jinjos(val: number) {
    this.emulator.rdramWrite32(this.jinjos_addr, val);
  }

  get notes(): number {
    return this.emulator.rdramRead32(this.notes_addr);
  }
  set notes(val: number) {
    this.emulator.rdramWrite32(this.notes_addr, val);
  }

  get present_green(): number {
    return this.emulator.rdramRead32(this.present_green_addr);
  }
  set present_green(val: number) {
    this.emulator.rdramWrite32(this.present_green_addr, val);
  }

  get present_blue(): number {
    return this.emulator.rdramRead32(this.present_blue_addr);
  }
  set present_blue(val: number) {
    this.emulator.rdramWrite32(this.present_blue_addr, val);
  }

  get present_red(): number {
    return this.emulator.rdramRead32(this.present_red_addr);
  }
  set present_red(val: number) {
    this.emulator.rdramWrite32(this.present_red_addr, val);
  }

  get orange(): number {
    return this.emulator.rdramRead32(this.orange_addr);
  }
  set orange(val: number) {
    this.emulator.rdramWrite32(this.orange_addr, val);
  }
}

export class Inventory extends API.BaseObj implements API.IInventory {
  private eggs_addr = global.ModLoader[API.AddressType.INV_EGGS];
  private feathers_red_addr =
    global.ModLoader[API.AddressType.INV_RED_FEATHERS];
  private feathers_gold_addr =
    global.ModLoader[API.AddressType.INV_GOLD_FEATHERS];
  private health_upgrade_addr =
    global.ModLoader[API.AddressType.INV_HEALTH_UPGRADES];
  private honeycombs_addr = global.ModLoader[API.AddressType.INV_HONEYCOMBS];
  private jiggies_addr = global.ModLoader[API.AddressType.INV_JIGGIES];
  private mumbo_tokens_addr =
    global.ModLoader[API.AddressType.INV_MUMBO_TOKENS];

  private text_jiggies_addr =
    global.ModLoader[API.AddressType.INV_TEXT_JIGGIES];
  private text_mumbo_tokens_addr =
    global.ModLoader[API.AddressType.INV_TEXT_MUMBO_TOKENS];

  get eggs(): number {
    return this.emulator.rdramRead32(this.eggs_addr);
  }
  set eggs(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 200) {
      val = 200;
    }
    this.emulator.rdramWrite32(this.eggs_addr, val);
  }

  get red_feathers(): number {
    return this.emulator.rdramRead32(this.feathers_red_addr);
  }
  set red_feathers(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 100) {
      val = 100;
    }
    this.emulator.rdramWrite32(this.feathers_red_addr, val);
  }

  get gold_feathers(): number {
    return this.emulator.rdramRead32(this.feathers_gold_addr);
  }
  set gold_feathers(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 20) {
      val = 20;
    }
    this.emulator.rdramWrite32(this.feathers_gold_addr, val);
  }

  get health_upgrades(): number {
    return this.emulator.rdramRead32(this.health_upgrade_addr) - 5;
  }
  set health_upgrades(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite32(this.health_upgrade_addr, val + 5);
  }

  get honeycombs(): number {
    return this.emulator.rdramRead32(this.honeycombs_addr);
  }
  set honeycombs(val: number) {
    if (val > 6) {
      val = 6;
    } else if (val < 0) {
      val = 0;
    }
    this.emulator.rdramWrite32(this.honeycombs_addr, val);
  }

  get jiggies(): number {
    return this.emulator.rdramRead32(this.jiggies_addr);
  }
  set jiggies(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite32(this.jiggies_addr, val);
    this.emulator.rdramWrite32(this.text_jiggies_addr, val);
  }

  get mumbo_tokens(): number {
    return this.emulator.rdramRead32(this.mumbo_tokens_addr);
  }
  set mumbo_tokens(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite32(this.mumbo_tokens_addr, val);
    this.emulator.rdramWrite32(this.text_mumbo_tokens_addr, val);
  }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Banjo extends API.BaseObj implements API.IBanjo {
  private animal_addr: number = global.ModLoader[API.AddressType.PLYR_ANIMAL];
  private anim_addr: number = global.ModLoader[API.AddressType.PLYR_ANIMATION];
  private flip_facing_addr: number =
    global.ModLoader[API.AddressType.PLYR_FLIP_FACING];
  private model_index_addr: number =
    global.ModLoader[API.AddressType.PLYR_MODEL_INDEX];
  private model_ptr_addr: number =
    global.ModLoader[API.AddressType.PLYR_MODEL_PTR];
  private movement_state_addr: number =
    global.ModLoader[API.AddressType.PLYR_MOVEMENT_STATE];
  private opacity_addr: number = global.ModLoader[API.AddressType.PLYR_OPACITY];
  private pos_x_addr: number = global.ModLoader[API.AddressType.PLYR_POS_X];
  private pos_y_addr: number = global.ModLoader[API.AddressType.PLYR_POS_Y];
  private pos_z_addr: number = global.ModLoader[API.AddressType.PLYR_POS_Z];
  private rot_x_addr: number = global.ModLoader[API.AddressType.PLYR_ROT_X];
  private rot_y_addr: number = global.ModLoader[API.AddressType.PLYR_ROT_Y];
  private rot_z_addr: number = global.ModLoader[API.AddressType.PLYR_ROT_Z];
  private scale_addr: number = global.ModLoader[API.AddressType.PLYR_SCALE];
  private visible_addr: number = global.ModLoader[API.AddressType.PLYR_VISIBLE];

  get animal(): API.AnimalType {
    let animal: number = this.emulator.rdramRead8(this.animal_addr);
    if (animal < 0x01 || animal > 0x07) return API.AnimalType.UNKNOWN;
    return animal as API.AnimalType;
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

  get movement_state(): number {
    return this.emulator.rdramRead32(this.movement_state_addr);
  }
  set movement_state(val: number) {
    this.emulator.rdramWrite32(this.movement_state_addr, val);
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

export class Runtime extends API.BaseObj implements API.IRuntime {
  private cur_events_level_addr =
    global.ModLoader[API.AddressType.RT_CUR_LEVEL_EVENTS];
  private cur_exit_addr = global.ModLoader[API.AddressType.RT_CUR_EXIT];
  private cur_health_addr = global.ModLoader[API.AddressType.RT_CUR_HEALTH];
  private cur_profile_addr = global.ModLoader[API.AddressType.RT_CUR_PROFILE];
  private cur_scene_addr = global.ModLoader[API.AddressType.RT_CUR_SCENE];
  private is_cutscene_addr = global.ModLoader[API.AddressType.RT_IS_CUTSCENE];
  private is_loading_addr = global.ModLoader[API.AddressType.RT_IS_LOADING];
  private transition_state_addr =
    global.ModLoader[API.AddressType.RT_TRANSITION_STATE];

  // Abstraction
  current_level: API.ICurrentLevel;

  constructor(emu: IMemory) {
    super(emu);

    this.current_level = new CurrentLevel(emu);
  }

  get current_exit(): API.ExitType {
    let exit: number = this.emulator.rdramRead8(this.cur_exit_addr);
    if (
      exit < API.LevelType.MUMBOS_MOUNTAIN ||
      exit > API.LevelType.TITLE_SCREEN
    ) {
      return API.ExitType.UNKNOWN;
    } else {
      return exit as API.ExitType;
    }
  }
  set current_exit(val: API.ExitType) {
    this.emulator.rdramWrite8(this.cur_exit_addr, val);
  }

  get current_health(): number {
    return this.emulator.rdramRead32(this.cur_health_addr);
  }
  set current_health(val: number) {
    if (val < 0) val = 0;
    this.emulator.rdramWrite32(this.cur_health_addr, val);
  }

  get current_level_events(): number {
    return this.emulator.rdramRead32(this.cur_events_level_addr);
  }
  set current_level_events(val: number) {
    this.emulator.rdramWrite32(this.cur_events_level_addr, val);
  }

  get current_scene(): API.SceneType {
    let scene: number = this.emulator.rdramRead8(this.cur_scene_addr);
    if (
      scene < API.SceneType.SM_MAIN ||
      scene > API.SceneType.INTRO_GRUNTY_THREAT_2
    ) {
      return API.SceneType.UNKNOWN;
    } else {
      return scene as API.SceneType;
    }
  }
  set current_scene(val: API.SceneType) {
    this.emulator.rdramWrite8(this.cur_scene_addr, val);
  }

  get_current_profile(): API.ProfileType {
    return this.emulator.rdramReadS32(this.cur_profile_addr) as API.ProfileType;
  }

  is_cutscene(): boolean {
    return this.emulator.rdramRead32(this.is_cutscene_addr) !== 0;
  }

  is_loading(): boolean {
    return this.emulator.rdramRead8(this.is_loading_addr) !== 0;
  }

  get_transition_state(): number {
    return this.emulator.rdramRead8(this.transition_state_addr);
  }

  goto_scene(scene: API.SceneType, exit: API.ExitType) {
    this.emulator.rdramWrite8(this.cur_scene_addr, scene);
    this.emulator.rdramWrite8(this.cur_exit_addr, exit);
    this.emulator.rdramWrite8(this.is_loading_addr, 1);
  }
}

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  private move_addr: number = global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS];

  // Abstraction
  inventory: API.IInventory;
  game_flags: API.IBuffered;
  honeycomb_flags: API.IBuffered;
  jiggy_flags: API.IBuffered;
  mumbo_token_flags: API.IBuffered;
  note_totals: API.IBuffered;

  constructor(emu: IMemory) {
    super(emu);

    this.inventory = new Inventory(emu);
    this.game_flags = new GameFlags(emu);
    this.honeycomb_flags = new HoneyCombFlags(emu);
    this.jiggy_flags = new JiggyFlags(emu);
    this.mumbo_token_flags = new MumboTokenFlags(emu);
    this.note_totals = new NoteTotalBuffer(emu);
  }

  get moves(): number {
    return this.emulator.rdramRead32(this.move_addr);
  }

  set moves(val: number) {
    this.emulator.rdramWrite32(this.move_addr, val);
  }
}

export class BanjoKazooie implements ICore, API.IBKCore {
  header = 'Banjo-Kazooie';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  rom_header!: IRomHeader;

  banjo!: API.IBanjo;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;
  version!: API.GameVersion;

  isPlaying(): boolean {
    return !(
      this.banjo.movement_state === 0 ||
      this.runtime.get_current_profile() === API.ProfileType.Title
    );
  }

  preinit(): void {
    switch (this.rom_header.country_code) {
      case 'J':
        this.version = API.GameVersion.JP_1_0;
        VersionHandler.load_jp_1_0();
        break;
      case 'P':
        this.version = API.GameVersion.PAL_1_0;
        VersionHandler.load_pal_1_0();
        break;
      case 'E':
        if (this.rom_header.revision === 1) {
          this.version = API.GameVersion.USA_1_1;
          VersionHandler.load_usa_1_1();
        } else {
          this.version = API.GameVersion.USA_1_0;
          VersionHandler.load_usa_1_0();
        }
        break;
    }
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

  @EventHandler(ModLoaderEvents.ON_ROM_HEADER_PARSED)
  onModLoader_RomHeaderParsed(header: Buffer) {}

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) {}
}

export default BanjoKazooie;
