import * as API from 'modloader64_api/BK/Imports';

export class Runtime extends API.BaseObj implements API.IRuntime {
    private cur_events_level_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL_EVENTS];
    private cur_events_scene_addr = global.ModLoader[API.AddressType.RT_CUR_SCENE_EVENTS];
    private cur_exit_addr = global.ModLoader[API.AddressType.RT_CUR_EXIT];
    private cur_health_addr = global.ModLoader[API.AddressType.INVENTORY] + API.InventoryType.HEALTH;
    private cur_level_addr = global.ModLoader[API.AddressType.RT_CUR_LEVEL];
    private cur_profile_addr = global.ModLoader[API.AddressType.RT_CUR_PROFILE];
    private cur_scene_addr = global.ModLoader[API.AddressType.RT_CUR_SCENE];
    private is_cutscene_addr = global.ModLoader[API.AddressType.RT_IS_CUTSCENE];
    private is_loading_addr = global.ModLoader[API.AddressType.RT_IS_LOADING];
    private transition_state_addr = global.ModLoader[API.AddressType.RT_TRANSITION_STATE];

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
    set current_exit(val: API.ExitType) { this.emulator.rdramWrite8(this.cur_exit_addr, val); }

    get current_health(): number { return this.emulator.rdramRead32(this.cur_health_addr); }
    set current_health(val: number) {
        if (val < 0) val = 0;
        this.emulator.rdramWrite32(this.cur_health_addr, val);
    }

    get current_level(): API.LevelType {
        let level: number = this.emulator.rdramRead8(this.cur_level_addr);
        if (
            level < API.LevelType.MUMBOS_MOUNTAIN ||
            level > API.LevelType.TITLE_SCREEN
        ) {
            return API.LevelType.UNKNOWN;
        } else {
            return level as API.LevelType;
        }
    }
    set current_level(val: API.LevelType) { this.emulator.rdramWrite8(this.cur_level_addr, val); }

    get current_level_events(): number { return this.emulator.rdramRead32(this.cur_events_level_addr); }
    set current_level_events(val: number) { this.emulator.rdramWrite32(this.cur_events_level_addr, val); }

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
    set current_scene(val: API.SceneType) { this.emulator.rdramWrite8(this.cur_scene_addr, val); }

    get current_scene_events(): number { return this.emulator.rdramRead32(this.cur_events_scene_addr); }
    set current_scene_events(val: number) { this.emulator.rdramWrite32(this.cur_events_scene_addr, val); }

    get_current_profile(): API.ProfileType { return this.emulator.rdramReadS32(this.cur_profile_addr) as API.ProfileType; }

    is_cutscene(): boolean { return this.emulator.rdramRead32(this.is_cutscene_addr) !== 0; }

    is_loading(): boolean { return this.emulator.rdramRead8(this.is_loading_addr) !== 0; }

    get_transition_state(): number { return this.emulator.rdramRead8(this.transition_state_addr); }

    goto_scene(scene: API.SceneType, exit: API.ExitType) {
        this.emulator.rdramWrite8(this.cur_scene_addr, scene);
        this.emulator.rdramWrite8(this.cur_exit_addr, exit);
        this.emulator.rdramWrite8(this.is_loading_addr, 1);
    }
}