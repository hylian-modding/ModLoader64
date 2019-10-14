import * as API from 'modloader64_api/MM/Imports'

export class Runtime extends API.BaseObj implements API.IRuntime {
    //subtract this.instance.global_context from these values
    //global_context = 0x3E6B2

    private instance: number = global.ModLoader.global_context;

    private current_scene_num = 0x3E6BC4;
    private switch_flags_addr = 0x001d28; //Not found yet
    private temp_switch_flags_addr = 0x001d2c; //Not found yet
    private chest_flags_addr = 0x001d38; //Not found yet
    private room_clear_flags_addr = 0x001d3c; //Not found yet
    private current_room_num = 0x3FF200;
    private current_room_ptr = 0x3FF20C;
    private frame_count_addr = 0x011de4; //Not found yet
    private scene_frame_count_addr = 0x3FF360;
    private collectable_flag_addr = 0x01d44; //Not found yet
    private continue_state_addr = 0x98; //Not found yet
    private epona_ptr = 0x3FFED0

}