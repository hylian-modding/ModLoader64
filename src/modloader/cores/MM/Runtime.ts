import * as API from 'modloader64_api/MM/Imports';

export class Runtime extends API.BaseObj implements API.IRuntime {
  //subtract this.instance.global_context from these values
  //global_context = 0x3E6B2

  private instance: number = global.ModLoader.global_context;

  private scene_table_ptr = 0x1c3ca0;
  private current_scene_num = 0x3e6bc4;
  private current_scene_ptr = 0x3e6da0;
  private scene_flags = 0x3e8978;
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
}
