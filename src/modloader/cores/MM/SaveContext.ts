import * as API from 'modloader64_api/MM/Imports';

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  private instance = 0x1ef670;
  private entrance_index_addr: number = this.instance + 0x0000; //Stores the Mask ID Link is wearing (int16)
  private start_mask_addr: number = this.instance + 0x0002; //Stores the Mask ID Link is wearing (byte)
  private intro_flag_addr: number = this.instance + 0x0003; //Intro Cutscene Flag, set to 1 after leaving clock tower. If 0 on load, starts intro sequence.
  private cutscene_number_addr: number = this.instance + 0x0008; //Cutscene Number, Used to trigger cutscenes. FFF0 - FFFF trigger cutscenes 0-F. (int16)
  private world_time_addr: number = this.instance + 0x000a; //Sets the current time for the world clock (int16)
  private owl_id_addr: number = this.instance + 0x000e; //Which owl to load from
  private night_flag_addr: number = this.instance + 0x0011; //Night Flag. Determines if it is Night (byte)
  private time_speed_addr: number = this.instance + 0x0013; //Time Speed
  private current_day_addr: number = this.instance + 0x0019; //Stores the current day (0-4) (byte)
  private days_elapsed_addr: number = this.instance + 0x001c; //How many days have passed
  private link_transformation_addr: number = this.instance + 0x0020; //4 = Link, 3 = Deku, 2 = Zora, 1 = Goron, 0 = Fierce Deity (byte)
  private have_tatl_addr: number = this.instance + 0x0022; //Tatl flag
  private player_name_addr: number = this.instance + 0x002c; //Player name
  private heart_container_addr: number = this.instance + 0x0032; //0x10 is equivalent to 1 heart container (int16)
  private start_health_addr: number = this.instance + 0x0034; //0x10 is equivalent to 1 full heart (int16)
  private magic_bar_addr: number = this.instance + 0x0036; //automatically sets itself to 0,1 or 2 depending on your upgrades (int8)
  private magic_amount_addr: number = this.instance + 0x0037; //Current magic amount	0x30 = half bar, 0x60 = full bar (byte)
  private rupee_amount_addr: number = this.instance + 0x0038; //Rupees (uint16_t)
  private double_defense_addr: number = this.instance + 0x0040; //Double Defense Flag

  //Do math later I'm too lazy (subtract this.instance)
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
  private perma_scene_flags: number = this.instance + 0x00f8; //Persists for the lifetime of the save
  private cycle_scene_flags: number = this.instance + 0x3f68; //Persists until the end of the current 3 day cycle

  get entrance_index(): number {
    return this.emulator.rdramRead32(this.entrance_index_addr);
  }
  set entrance_index(value: number) {
    this.emulator.rdramWrite32(this.entrance_index_addr, value);
  }
}
