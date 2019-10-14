import * as API from 'modloader64_api/MM/Imports'

export class SaveContext extends API.BaseObj implements API.ISaveContext {
    //https://docs.google.com/spreadsheets/d/1J-4OwmZzOKEv2hZ7wrygOpMm0YcRnephEo3Q2FooF6E/edit#gid=993685765
    //NOTE: SAVE CONTEXT IS LISTED AS 0x1EF670 ON THIS SITE WHICH IS FALSE.
    //TRUE SAVE CONTEXT START IS 0x1EF672 (CloudModding MM Wiki)
    //ALL OFFSETS ON THIS SITE NEED TO BE SHIFTED BY 0x2
    //I HAVE FIXED THE OFFSETS ALREADY

    private instance: number = global.ModLoader.save_context;
    private entrance_index_addr: number = this.instance + 0x0000; //Stores the Mask ID Link is wearing (int16)
    private start_mask_addr: number = this.instance + 0x0002; //Stores the Mask ID Link is wearing (byte)
    private intro_flag_addr: number = this.instance + 0x0003; //Intro Cutscene Flag, set to 1 after leaving clock tower. If 0 on load, starts intro sequence. 
    private cutscene_number_addr: number = this.instance + 0x0008; //Cutscene Number, Used to trigger cutscenes. FFF0 - FFFF trigger cutscenes 0-F. (int16)
    private world_time_addr: number = this.instance + 0x000A; //Sets the current time for the world clock (int16)
    private owl_id_addr: number = this.instance + 0x000E; //Which owl to load from
    private night_flag_addr: number = this.instance + 0x0011; //Night Flag. Determines if it is Night (byte)
    private time_speed_addr: number = this.instance + 0x0013; //Time Speed
    private current_day_addr: number = this.instance + 0x0019; //Stores the current day (0-4) (byte)
    private days_elapsed_addr: number = this.instance + 0x001C //How many days have passed
    private link_transformation_addr: number = this.instance + 0x0020; //4 = Link, 3 = Deku, 2 = Zora, 1 = Goron, 0 = Fierce Deity (byte)
    private have_tatl_addr: number = this.instance + 0x0022; //Tatl flag
    private player_name_addr: number = this.instance + 0x002C; //Player name
    private heart_container_addr: number = this.instance + 0x0032; //0x10 is equivalent to 1 heart container (int16)
    private start_health_addr: number = this.instance + 0x0034; //0x10 is equivalent to 1 full heart (int16)
    private magic_bar_addr: number = this.instance + 0x0036; //automatically sets itself to 0,1 or 2 depending on your upgrades (int8)
    private magic_amount_addr: number = this.instance + 0x0037; //Current magic amount	0x30 = half bar, 0x60 = full bar (byte)
    private rupee_amount_addr: number = this.instance + 0x0038; //Rupees (uint16_t)
    private double_defense_addr: number = this.instance + 0x0040; //Double Defense Flag
    
    //Do math later I'm too lazy (subtract this.instance)
    private human_c_button_item: number = 0x01EF6BE; 
    private c_left_item: number = 0x1EF6BF;
    private c_down_item: number = 0x1EF6A0;
    private c_right_item: number = 0x1EF6A1;
    /*unused
    private goron_b_button_item: number = 0x801EF6C2;
    private zora_b_button_item: number = 0x801EF6C6;
    private deku_b_button_item: number = 0x801EF6CA;
    */
    private equipped_item_slots: number = 0x1EF6CE;
    private sword_and_shield: number = 0x1EF6DF;
    private inventory_items: number = 0x1EF6EB;
    private inventory_masks: number = 0x1EF6FA;
    private inventory_quantities: number = 0x1EF712;
    private upgrades: number = 0x1EF72A;
    private quest_item_1: number = 0x1EF72E; //bifield, bit 0: Lullaby Intro; bits 4-7: heart pieces
    private quest_item_2: number = 0x1EF72F; //bits 0-1: songs; bit 2: Bomber's Notebook; bit 3: unknown
    private quest_item_3: number = 0x1EF730; //bits 0-7: songs
    private quest_item_4: number = 0x1EF731; //bits 0-3: Remains; bits 6-7: songs
    private dungeon_items_woodfall: number = 0x1EF732; //bit 0: Big Key; bit 1: Compass; bit 2: Map
    private dungeon_items_snowhead: number = 0x1EF733; //bit 0: Big Key; bit 1: Compass; bit 2: Map
    private dungeon_items_greatbay: number = 0x1EF734; //bit 0: Big Key; bit 1: Compass; bit 2: Map
    private dungeon_items_stonetower: number = 0x1EF735; //bit 0: Big Key; bit 1: Compass; bit 2: Map
    private keys_woodfall: number = 0x1EF73C; //0xFF = hide key display
    private keys_snowhead: number = 0x1EF73D; //0xFF = hide key display
    private keys_greatbay: number = 0x1EF73E; //0xFF = hide key display
    private keys_stonetower: number = 0x1EF73F; //0xFF = hide key display
    private double_hearts: number = 0x1EF745; //set to 20 by the game
    private faries_woodfall: number = 0x1EF746;
    private faries_snowhead: number = 0x1EF747;
    private faries_greatbay: number = 0x1EF748;
    private faries_stonetower: number = 0x1EF749;

    private scene_flags_saving: number = 0x1EF768; //0x1C per scene, as opposed to the 0x14 used ingame
    private pictograph_special: number = 0x1F04EC; //01 = tingle, 04 = deku king, 0A = pirate
    private skulltula_woodfall: number = 0x1F0532; //Skulltula Count - Woodfall
    private skulltula_greatbay: number = 0x1F0534; //Skulltula Count - Woodfall
    private ruppees_in_bank: number = 0x1F054E; //Amount of rupees in the bank
    private map_visited: number = 0x1F05CE; //Selectable Map dots
    private map_visible: number = 0x1F05CE; //Visible Map terrain
    private has_scarecrow_song: number = 0x1F05D6; //Scarecrow song flag
    private scarecrow_song: number = 0x1F05D8; //Scarecrow's Song
    private bomber_code: number = 0x1F066D; //Bomber's code
    private stored_epona_scene_id: number = 0x1F0672;
    private event_flags: number = 0x1F067E; //idk bruh https://docs.google.com/spreadsheets/d/13j4WJl7-dBYHdus-Tp4ldbS_juvbjOWmFJne_ROx4gY/edit#gid=1676188860

    private magic_status: number = 0x1F359F; //triggers various effects, like use magic, flash magic, restore magic
    private max_magic: number = 0x1F35A0; //0x30 = normal, 0x60 = double
    private magic: number = 0x1F35A2; //unknown use?

    private scene_flags_ingame: number = 0x1F5DA; //read when a scene is loaded, 0x14 per scene
    private perma_scene_flags: number = this.instance + 0x00F8; //Persists for the lifetime of the save
    private cycle_scene_flags: number = this.instance + 0x3F68; //Persists until the end of the current 3 day cycle

    get entrance_index(): number 
    {
        return this.emulator.rdramRead32(this.entrance_index_addr);
    }
    set entrance_index(value: number) 
    {
        this.emulator.rdramWrite32(this.entrance_index_addr, value);
    }
}