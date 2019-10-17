import * as API from 'modloader64_api/MM/Imports';
import { zeldaString } from 'modloader64_api/MM/ZeldaString';
import { buffer, string } from 'bitwise';

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  private instance = 0x1ef670;
  
  private entrance_index_addr: number = 0x0000; //
  private start_mask_addr: number = 0x1EF674; //Stores the Mask ID Link is wearing (byte)
  private intro_flag_addr: number = 0x1EF675; //Intro Cutscene Flag, set to 1 after leaving clock tower. If 0 on load, starts intro sequence.
  private cutscene_number_addr: number = 0x1EF678; //Cutscene Number, Used to trigger cutscenes. FFF0 - FFFF trigger cutscenes 0-F. (int16)
  private world_time_addr: number = 0x1EF67C; //Sets the current time for the world clock (int16)
  private owl_id_addr: number = 0x1EF67E; //Which owl to load from
  private night_flag_addr: number = 0x1EF6080; //Night Flag. Determines if it is Night (byte)
  private time_speed_addr: number = 0x1EF684; //Time Speed
  private current_day_addr: number = 0x1EF688; //Stores the current day (0-4) (byte)
  private days_elapsed_addr: number = 0x1EF68C; //How many days have passed
  private link_transformation_addr: number = 0x1EF690; //4 = Link, 3 = Deku, 2 = Zora, 1 = Goron, 0 = Fierce Deity (byte)
  private have_tatl_addr: number = 0x1EF692; //Tatl flag
  private player_name_addr: number = 0x1EF69C; //Player name
  private heart_container_addr: number = 0x1EF6A4; //0x10 is equivalent to 1 heart container (int16)
  private start_health_addr: number = 0x1EF6A6; //0x10 is equivalent to 1 full heart (int16)
  private magic_bar_addr: number = 0x1EF6A8; //automatically sets itself to 0,1 or 2 depending on your upgrades (int8)
  private magic_amount_addr: number = 0x1EF6A9; //Current magic amount	0x30 = half bar, 0x60 = full bar (byte)
  private rupee_amount_addr: number = 0x1EF6AA; //Rupees (uint16_t)
  private double_defense_addr: number = 0x1EF6B2; //Double Defense Flag
  private double_magic_meter: number = 0x1EF6B0; //Double Magic Flag

  private human_c_button_item = 0x1ef6bc;
  private c_left_item = 0x1ef6bd;
  private c_down_item = 0x1ef6be;
  private c_right_item = 0x1ef6bf;
  private equipped_item_slots = 0x1ef6cc;
  private sword_and_shield = 0x1ef6dd;
  private inventory_items = 0x1ef6e0;
  private inventory_masks = 0x1ef6f8;
  private inventory_quantities = 0x1ef728;
  private upgrades = 0x1ef72c;
  private quest_item_1 = 0x1ef72c; //bifield, bit 0: Lullaby Intro; bits 4-7: heart pieces
  private quest_item_2 = 0x1ef72d; //bits 0-1: songs; bit 2: Bomber's Notebook; bit 3: unknown
  private quest_item_3 = 0x1ef72e; //bits 0-7: songs
  private quest_item_4 = 0x1ef72f; //bits 0-3: Remains; bits 6-7: songs
  private dungeon_items_woodfall = 0x1ef730; //bit 0: Big Key; bit 1: Compass; bit 2: Map
  private dungeon_items_snowhead = 0x1ef731; //bit 0: Big Key; bit 1: Compass; bit 2: Map
  private dungeon_items_greatbay = 0x1ef732; //bit 0: Big Key; bit 1: Compass; bit 2: Map
  private dungeon_items_stonetower = 0x1ef733; //bit 0: Big Key; bit 1: Compass; bit 2: Map
  private keys_woodfall = 0x1ef73a; //0xFF = hide key display
  private keys_snowhead = 0x1ef73b; //0xFF = hide key display
  private keys_greatbay = 0x1ef73c; //0xFF = hide key display
  private keys_stonetower = 0x1ef73d; //0xFF = hide key display
  private double_hearts = 0x1ef743; //set to 20 by the game
  private faries_woodfall = 0x1ef744;
  private faries_snowhead = 0x1ef745;
  private faries_greatbay = 0x1ef746;
  private faries_stonetower = 0x1ef747;

  private scene_flags_saving = 0x1ef768; //0x1C per scene, as opposed to the 0x14 used ingame
  private pictograph_special = 0x1f04ea; //01 = tingle, 04 = deku king, 0A = pirate
  private skulltula_woodfall = 0x1f0530; //Skulltula Count - Woodfall
  private skulltula_greatbay = 0x1f0532; //Skulltula Count - Woodfall
  private rupees_in_bank = 0x1f054e; //Amount of rupees in the bank
  private map_visited = 0x1f05cc; //Selectable Map dots
  private map_visible = 0x1f05d0; //Visible Map terrain
  private has_scarecrow_song = 0x1f05d4; //Scarecrow song flag
  private scarecrow_song = 0x1f05d6; //Scarecrow's Song
  private bomber_code = 0x1f066b; //Bomber's code
  private stored_epona_scene_id = 0x1f0670;
  private event_flags = 0x1f067c; //idk bruh https://docs.google.com/spreadsheets/d/13j4WJl7-dBYHdus-Tp4ldbS_juvbjOWmFJne_ROx4gY/edit#gid=1676188860

  private magic_status = 0x1f3598; //triggers various effects, like use magic, flash magic, restore magic
  private max_magic = 0x1f359e; //0x30 = normal, 0x60 = double
  private magic = 0x1f35a0; //unknown use?

  private scene_flags_ingame = 0x1f35d8; //read when a scene is loaded, 0x14 per scene
  private perma_scene_flags: number = 0x00f8; //Persists for the lifetime of the save
  private cycle_scene_flags: number = 0x3f68; //Persists until the end of the current 3 day cycle

  //Items

  private ocarina_time_addr: number = 0x1EF6E0;
  private hero_bow_addr: number = 0x1EF6E1;
  private fire_arrow_addr: number = 0x1EF6E2;
  private ice_arrow_addr: number = 0x1EF6E3;
  private light_arrow_addr: number = 0x1EF6E4;
  private bomb_addr: number =	0x1EF6E6;
  private bombchu_addr: number =	0x1EF6E7;
  private deku_stick_addr: number =	0x1EF6E8;
  private deku_nut_addr: number =	0x1EF6E9;
  private magic_beans_addr: number =	0x1EF6EA;
  private powder_keg_addr: number = 0x1EF6EC;
  private pictograph_box_addr: number = 0x1EF6ED;
  private lens_of_truth_addr: number = 0x1EF6EE;
  private hookshot_addr: number = 0x1EF6EF;


  private event_item_1_addr: number = 0x1EF6E5;
  private event_item_2_addr: number = 0x1EF6EB;
  private event_item_3_addr: number = 0x801EF6F;

  private bottle_1_addr: number = 0x1EF6F2;
  private bottle_2_addr: number = 0x1EF6F3;
  private bottle_3_addr: number = 0x1EF6F4;
  private bottle_4_addr: number = 0x1EF6F5;
  private bottle_5_addr: number = 0x1EF6F6;
  private bottle_6_addr: number = 0x1EF6F7;
  
  //Masks

  private mask_postman_addr: number = 0x1EF6F8;
  private mask_all_night_addr: number = 0x1EF6F9;
  private mask_blast_addr: number = 0x1EF6FA;
  private mask_stone_addr: number = 0x1EF6FB;
  private mask_fairy_addr: number = 0x1EF6FC;
  private mask_deku_arrow_addr: number = 0x1EF6FD;
  private mask_keaton_addr: number =	0x1EF6FE;
  private mask_bremen_addr: number =	0x1EF6FF;
  private mask_bunny_addr: number =	0x1EF700;
  private mask_gero_addr: number =	0x1EF701;
  private mask_scents_addr: number =	0x1EF702;
  private mask_goron_addr: number = 0x1EF703;
  private mask_romani_addr: number = 0x1EF704;
  private mask_circus_leader_addr: number = 0x1EF705;
  private mask_kafei_addr: number = 0x1EF706;
  private mask_couples_addr: number = 0x1EF707;
  private mask_truth_addr: number = 0x1EF708;
  private mask_zora_addr: number = 0x1EF709;
  private mask_kamaro_addr: number = 0x1EF70A;
  private mask_gibdo_addr: number = 0x1EF70B;
  private mask_garo_addr: number = 0x1EF70C;
  private mask_captain_addr: number = 0x1EF70D;
  private mask_giant_addr: number = 0x1EF70E;
  private mask_fierce_addr: number = 0x1EF70F;

  //Haven't looked and confirmed length of rdramRead for all
  
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

  get cutscene_number(): number {
    return this.emulator.rdramRead16(this.cutscene_number);
  }

  set cutscene_number(value: number) {
    this.emulator.rdramWrite16(this.cutscene_number_addr, value);
  }

  get world_time(): number {
    return this.emulator.rdramRead32(this.world_time_addr);
  }

  set world_time(value: number) {
    this.emulator.rdramWrite32(this.world_time_addr, value);
  }

  get owl_id(): number {
    return this.emulator.rdramRead32(this.owl_id_addr);
  }

  set owl_id(value: number) {
    this.emulator.rdramWrite32(this.owl_id_addr, value);
  }

  get night_flag(): number {
    return this.emulator.rdramRead32(this.night_flag_addr);
  }

  set night_flag(value: number) {
    this.emulator.rdramWrite32(this.night_flag_addr, value);
  }

  get time_speed(): number {
    return this.emulator.rdramRead32(this.time_speed_addr);
  }

  set time_speed(value: number) {
    this.emulator.rdramWrite32(this.time_speed_addr, value);
  }

  get current_day(): number {
    return this.emulator.rdramRead32(this.current_day_addr);
  }

  set current_day(value: number) {
    this.emulator.rdramWrite32(this.current_day_addr, value);
  }

  get days_elapsed(): number {
    return this.emulator.rdramRead32(this.days_elapsed_addr);
  }

  set days_elapsed(value: number) {
    this.emulator.rdramWrite32(this.days_elapsed_addr, value);
  }

  get link_transformation(): number {
    return this.emulator.rdramRead32(this.link_transformation_addr);
  }

  set link_transformation(value: number) {
    this.emulator.rdramWrite32(this.link_transformation_addr, value);
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

  get heart_container(): number {
    return this.emulator.rdramRead32(this.heart_container_addr);
  }

  set heart_container(value: number) {
    this.emulator.rdramWrite32(this.heart_container_addr, value);
  }

  get start_health(): number {
    return this.emulator.rdramRead32(this.start_health_addr);
  }

  set start_health(value: number) {
    this.emulator.rdramWrite32(this.start_health_addr, value);
  }

  get magic_bar(): number {
    return this.emulator.rdramRead32(this.magic_bar_addr);
  }

  set magic_bar(value: number) {
    this.emulator.rdramWrite32(this.magic_bar_addr, value);
  }
  get magic_amount(): number {
    return this.emulator.rdramRead32(this.magic_amount_addr);
  }

  set magic_amount(value: number) {
    this.emulator.rdramWrite32(this.magic_amount_addr, value);
  }

  get rupee_amount(): number {
    return this.emulator.rdramRead32(this.rupee_amount_addr);
  }

  set rupee_amount(value: number) {
    this.emulator.rdramWrite32(this.rupee_amount_addr, value);
  }

  get double_defense(): number {
    return this.emulator.rdramRead32(this.double_defense_addr);
  }

  set double_defense(value: number) {
    this.emulator.rdramWrite32(this.double_defense_addr, value);
  }
}
