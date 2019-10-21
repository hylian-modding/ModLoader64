import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';
import * as SUB from './Sub/Imports';

export class SaveContext extends API.BaseObj implements API.ISaveContext {
    private instance = 0x1ef670;

    private entrance_index_addr: number = this.instance + 0x0000; //
    private start_mask_addr = 0x1ef674; //Stores the Mask ID Link is wearing (byte)
    private intro_flag_addr = 0x1ef675; //Intro Cutscene Flag, set to 1 after leaving clock tower. If 0 on load, starts intro sequence.
    private cutscene_number_addr = 0x1ef678; //Cutscene Number, Used to trigger cutscenes. FFF0 - FFFF trigger cutscenes 0-F. (int16)
    private world_time_addr = 0x1ef67c; //Sets the current time for the world clock (int16)
    private owl_id_addr = 0x1ef67e; //Which owl to load from
    private night_flag_addr = 0x1ef6080; //Night Flag. Determines if it is Night (byte)
    private time_speed_addr = 0x1ef684; //Time Speed
    private current_day_addr = 0x1ef688; //Stores the current day (0-4) (byte)
    private days_elapsed_addr = 0x1ef68c; //How many days have passed
    private link_transformation_addr = 0x1ef690; //4 = Link, 3 = Deku, 2 = Zora, 1 = Goron, 0 = Fierce Deity (byte)
    private have_tatl_addr = 0x1ef692; //Tatl flag
    private player_name_addr = 0x1ef69c; //Player name
    private heart_container_addr = 0x1ef6a4; //0x10 is equivalent to 1 heart container (int16)
    private start_health_addr = 0x1ef6a6; //0x10 is equivalent to 1 full heart (int16)
    private magic_bar_addr = 0x1ef6a8; //automatically sets itself to 0,1 or 2 depending on your upgrades (int8)
    private magic_amount_addr = 0x1ef6a9; //Current magic amount	0x30 = half bar, 0x60 = full bar (byte)
    private rupee_amount_addr = 0x1ef6aa; //Rupees (uint16_t)
    private double_defense_addr = 0x1ef6b2; //Double Defense Flag
    private double_magic_meter = 0x1ef6b0; //Double Magic Flag

    private human_c_button_item = 0x1ef6bc;
    private c_left_item = 0x1ef6bd;
    private c_down_item = 0x1ef6be;
    private c_right_item = 0x1ef6bf;
    private equipped_item_slots = 0x1ef6cc;
    private sword_and_shield = 0x1ef6dd;
    private inventory_quantities = 0x1ef728;
    private upgrades = 0x1ef72c;
    private quest_item_1 = 0x1ef72c; //bifield, bit 0: Lullaby Intro; bits 4-7: heart pieces
    private quest_item_2 = 0x1ef72d; //bits 0-1: songs; bit 2: Bomber's Notebook; bit 3: unknown
    private quest_item_3 = 0x1ef72e; //bits 0-7: songs
    private quest_item_4 = 0x1ef72f; //bits 0-3: Remains; bits 6-7: songs
    private double_hearts = 0x1ef743; //set to 20 by the game

    private scene_flags_saving = 0x1ef768; //0x1C per scene, as opposed to the 0x14 used ingame
    private pictograph_special = 0x1f04ea; //01 = tingle, 04 = deku king, 0A = pirate
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

    private checksum_addr = 0x1f067a;

    // Abstraction
    game_flags: API.IBuffered;
    cycle_flags: API.IBuffered;
    scene_flags: API.IBuffered;

    item_slots: API.IItemSlots;
    mask_slots: API.IMaskSlots;

    dungeon_fairies: API.IDungeon;
    dungeon_items: API.IDungeon;
    dungeon_keys: API.IDungeon;

    skultulla_house: API.ISkultullaHouse;

    constructor(emu: IMemory) {
        super(emu);

        this.game_flags = new SUB.GameFlags(emu);
        this.cycle_flags = new SUB.CycleFlags(emu);
        this.scene_flags = new SUB.SceneFlags(emu);

        this.item_slots = new SUB.ItemSlots(emu);
        this.mask_slots = new SUB.MaskSlots(emu);

        this.dungeon_fairies = new SUB.Dungeon(emu, 0x1ef744);
        this.dungeon_items = new SUB.Dungeon(emu, 0x1ef73a);
        this.dungeon_keys = new SUB.Dungeon(emu, 0x1ef730);

        this.skultulla_house = new SUB.SkultullaHouse(emu);
    }

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
        return this.emulator.rdramRead16(this.world_time_addr);
    }
    set world_time(value: number) {
        this.emulator.rdramWrite16(this.world_time_addr, value);
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

    get_checksum(): number {
        return this.emulator.rdramRead16(this.checksum_addr);
    }
}