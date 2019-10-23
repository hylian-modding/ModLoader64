import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';
import * as SUB from './Sub/Imports';

export class Runtime extends API.BaseObj implements API.IRuntime {
    private instance: number = 0x3E6B20;

    private scene_table_ptr = 0x1c3ca0;
    private cur_scene_addr: number = 0x3e6bc4;
    private cur_scene_ptr_addr = 0x3e6da0;
    private cutscene_ptr_addr = 0x3e8a48;
    private switch_flags_addr = 0xb5c78;
    private temp_switch_flags_addr = 0x0; //Not found yet
    private chest_flags_addr = 0xb5cb8;
    private room_clear_flags_addr = 0xb5cc4;
    private current_room_num = 0x3ff200;
    private current_room_ptr = 0x3ff20c;
    private frame_count_addr = 0x011de4; //Not found yet
    private scene_frame_count_addr = 0x0;
    private collectable_flag_addr = 0xb5d6c;
    private continue_state_addr = 0x98; //Not found yet
    private epona_ptr = 0x3ffed0;
        
    // Abstraction
    scene_flags: API.IBuffered;

    constructor(emu: IMemory) {
        super(emu);
        this.scene_flags = new SUB.SceneFlags(emu);
    }

    get_current_scene(): number {
        return this.emulator.rdramRead16(this.cur_scene_addr);
    }

    get cutscene_ptr(): number {
        return this.emulator.rdramRead32(this.cutscene_ptr_addr);
    }

    set cutscene_ptr(val: number) {
        this.emulator.rdramWrite32(this.cutscene_ptr_addr, val);
    }

    goto_scene(scene: number) {
        this.emulator.rdramWrite32(0x3ff398, scene);
        this.emulator.rdramWrite8(0x3ff66a, 1);
    }
}