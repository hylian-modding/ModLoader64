import * as API from 'modloader64_api/MM/Imports'

export class Runtime extends API.BaseObj implements API.IRuntime {
    //subtract this.instance.global_context from these values
    //global_context = 0x3E6B2

    private instance: number = global.ModLoader.global_context;


    private scene_table_ptr = 0x1C3CA0;
    private current_scene_num = 0x3E6BC4;
    private current_scene_ptr = 0x3E6DA0;
    private scene_flags = 0x3E8978;
    private switch_flags_addr = 0xB5C78; 
    private temp_switch_flags_addr = 0x0; //Not found yet
    private chest_flags_addr = 0xB5CB8; 
    private room_clear_flags_addr = 0xB5CC4; 
    private current_room_num = 0x3FF200;
    private current_room_ptr = 0x3FF20C;
    private frame_count_addr = 0x011de4; //Not found yet
    private scene_frame_count_addr = 0x0;
    private collectable_flag_addr = 0xB5D6C 
    private continue_state_addr = 0x98; //Not found yet
    private epona_ptr = 0x3FFED0;

}