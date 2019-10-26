import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';
import * as SUB from './Sub/Imports';

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  private instance = 0x1ef670;

  private bank_addr: number = 0x1f054e;
  private entrance_index_addr: number = this.instance + 0x0000; //
  private start_mask_addr: number = 0x1ef674; //Stores the Mask ID Link is wearing (byte)
  private intro_flag_addr: number = 0x1ef675; //Intro Cutscene Flag, set to 1 after leaving clock tower. If 0 on load, starts intro sequence.
  private cutscene_number_addr: number = 0x1ef678; //Cutscene Number, Used to trigger cutscenes. FFF0 - FFFF trigger cutscenes 0-F. (int16)
  private owl_id_addr: number = 0x1ef67e; //Which owl to load from
  private cur_form_addr: number = 0x1ef690; //4 = Link, 3 = Deku, 2 = Zora, 1 = Goron, 0 = Fierce Deity (byte)
  private have_tatl_addr: number = 0x1ef692; //Tatl flag
  private player_name_addr: number = 0x1ef69c; //Player name
  private rupee_amount_addr: number = 0x1ef6aa; //Rupees (uint16_t)

  private human_c_button_item = 0x1ef6bc;
  private c_left_item = 0x1ef6bd;
  private c_down_item = 0x1ef6be;
  private c_right_item = 0x1ef6bf;
  private equipped_item_slots = 0x1ef6cc;
  private inventory_quantities = 0x1ef728;
  private double_hearts = 0x1ef743; //set to 20 by the game

  private pictograph_special = 0x1f04ea; //01 = tingle, 04 = deku king, 0A = pirate
  private map_visited = 0x1f05cc; //Selectable Map dots
  private map_visible = 0x1f05d0; //Visible Map terrain
  private has_scarecrow_song = 0x1f05d4; //Scarecrow song flag
  private scarecrow_song = 0x1f05d6; //Scarecrow's Song
  private bomber_code = 0x1f066b; //Bomber's code
  private stored_epona_scene_id = 0x1f0670;

  private quest_status_addr = 0x1ef72c;

  private checksum_addr = 0x1f067a;

  // Abstraction
  cycle_flags: API.IBuffered;
  event_flags: API.IBuffered;
  game_flags: API.IBuffered;
  owl_flags: API.IBuffered;

  equip_slots: API.IEquipSlots;
  item_slots: API.IItemSlots;
  mask_slots: API.IMaskSlots;

  clock: API.IClock;

  dungeon_fairies: API.IDungeon;
  dungeon_items: API.IDungeon;
  dungeon_keys: API.IDungeon;
  
  health: API.IHealth;
  magic: API.IMagic;

  skultulla_house: API.ISkultullaHouse;

  constructor(emu: IMemory) {
    super(emu);

    this.cycle_flags = new SUB.CycleFlags(emu);
    this.event_flags = new SUB.EventFlags(emu);
    this.game_flags = new SUB.GameFlags(emu);
    this.owl_flags = new SUB.OwlFlags(emu);

    this.equip_slots = new SUB.EquipSlots(emu);
    this.item_slots = new SUB.ItemSlots(emu);
    this.mask_slots = new SUB.MaskSlots(emu);

    this.clock = new SUB.Clock(emu);
    this.dungeon_fairies = new SUB.Dungeon(emu, 0x1ef744);
    this.dungeon_items = new SUB.Dungeon(emu, 0x1ef73a);
    this.dungeon_keys = new SUB.Dungeon(emu, 0x1ef730);
    this.health = new SUB.Health(emu);
    this.magic = new SUB.Magic(emu);
    this.skultulla_house = new SUB.SkultullaHouse(emu);
  }

  //Haven't looked and confirmed length of rdramRead for all

  get bank(): number {
    return this.emulator.rdramRead16(this.bank_addr);
  }
  set bank(val: number) {
    this.emulator.rdramWrite16(this.bank_addr, val);
  }

  get current_form(): number {
    return this.emulator.rdramRead32(this.cur_form_addr);
  }
  set current_form(value: number) {
    this.emulator.rdramWrite32(this.cur_form_addr, value);
  }
  
  get cutscene_number(): number {
    return this.emulator.rdramRead16(this.cutscene_number);
  }
  set cutscene_number(value: number) {
    this.emulator.rdramWrite16(this.cutscene_number_addr, value);
  }

  get entrance_index(): number {
    return this.emulator.rdramRead32(this.entrance_index_addr);
  }
  set entrance_index(value: number) {
    this.emulator.rdramWrite32(this.entrance_index_addr, value);
  }

  get start_mask(): number {
    return this.emulator.rdramRead32(this.start_mask_addr);
  }
  set start_mask(value: number) {
    this.emulator.rdramWrite32(this.start_mask_addr, value);
  }

  get intro_flag(): number {
    return this.emulator.rdramRead32(this.intro_flag_addr);
  }
  set intro_flag(value: number) {
    this.emulator.rdramWrite32(this.intro_flag_addr, value);
  }

  get owl_id(): number {
    return this.emulator.rdramRead32(this.owl_id_addr);
  }
  set owl_id(value: number) {
    this.emulator.rdramWrite32(this.owl_id_addr, value);
  }

  get have_tatl(): number {
    return this.emulator.rdramRead32(this.have_tatl_addr);
  }
  set have_tatl(value: number) {
    this.emulator.rdramWrite32(this.have_tatl_addr, value);
  }

  get player_name(): number {
    return this.emulator.rdramRead32(this.player_name_addr);
  }
  set player_name(value: number) {
    this.emulator.rdramWrite32(this.player_name_addr, value);
  }

  get rupee_amount(): number {
    return this.emulator.rdramRead32(this.rupee_amount_addr);
  }
  set rupee_amount(value: number) {
    this.emulator.rdramWrite32(this.rupee_amount_addr, value);
  }

  get quest_status(): number {
    let value = this.emulator.rdramRead32(this.quest_status_addr);    
    return value & 0x0fffffff;
  }
  set quest_status(val: number) {
    val &= 0x0fffffff;
    this.emulator.rdramWrite32(this.quest_status_addr, val);
  }

  get_checksum(): number {
    return this.emulator.rdramRead16(this.checksum_addr);
  }
}
