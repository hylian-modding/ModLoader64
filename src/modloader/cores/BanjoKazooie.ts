import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI'
import { FlagManager } from 'modloader64_api/FlagManager'
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/BKAPI'

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export class MoveSet extends API.APIObject implements API.IMoveSet {
    private instance: number = 0x37C3A0 // global.ModLoader["offset_moves"]
    private manager: FlagManager

    constructor(emu: IMemory) {
        super(emu)
        this.manager = new FlagManager(emu, this.instance);
    }

    get(move: API.MoveBitMap): boolean {
        return this.manager.isBitSet(move);
    }
    set(move: API.MoveBitMap, value: boolean) {
        this.manager.setBit(move, value)
    }

    get moves(): number {
        return this.emulator.rdramRead32(this.instance)
    }
    set moves(value: number) {
        this.emulator.rdramWrite32(this.instance, value)
    }
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Banjo extends API.APIObject implements API.IBanjo {
    private instance: number = global.ModLoader["banjo"]
    
    private animal_addr: number = this.instance + 0x10A8
    private opacity_addr: number = this.instance + 0x06
    private pos_x_addr: number = this.instance + 0x04C0
    private pos_y_addr: number = this.instance + 0x04C4
    private pos_z_addr: number = this.instance + 0x04C8
    private rot_x_addr: number = this.instance + 0x0460
    private rot_y_addr: number = this.instance + 0x05B0
    private rot_z_addr: number = this.instance + 0x05A0
    private scale_addr: number = this.instance + 0x0C
    private state_addr: number = this.instance + 0x03C0
    private visible_addr: number = this.instance + 0x08
    private z_forward_addr: number = this.instance + 0x07
    
    get exists(): boolean {
        return !(this.emulator.rdramRead32(this.instance) === 0x0000)
    }
    
    get animal(): API.AnimalType {
        switch (this.emulator.rdramRead8(this.animal_addr)) {
            case 0x01: return API.AnimalType.BEAR_BIRD
            case 0x02: return API.AnimalType.TERMITE
            case 0x03: return API.AnimalType.PUMPKIN
            case 0x04: return API.AnimalType.WALRUS
            case 0x05: return API.AnimalType.CROCODILE
            case 0x06: return API.AnimalType.BEE
            case 0x07: return API.AnimalType.WASHING_MACHINE
        }
        return API.AnimalType.UNKNOWN
    }
    set animal(val: API.AnimalType) {
        this.emulator.rdramWrite8(this.animal_addr, val)
    }

    get opacity(): number {
        return this.emulator.rdramRead8(this.opacity_addr)
    }
    set opacity(val: number) {
        if (val < 0) {
            val = 0
        } else if (val > 255) {
            val = 255
        }
        this.emulator.rdramWrite8(this.opacity_addr, val)
    }

    get pos_x(): number {
        return this.emulator.rdramRead32(this.pos_x_addr)
    }
    set pos_x(val: number) {
        this.emulator.rdramWrite32(this.pos_x_addr, val)
    }

    get pos_y(): number {
        return this.emulator.rdramRead32(this.pos_y_addr)
    }
    set pos_y(val: number) {
        this.emulator.rdramWrite32(this.pos_y_addr, val)
    }

    get pos_z(): number {
        return this.emulator.rdramRead32(this.pos_z_addr)
    }
    set pos_z(val: number) {
        this.emulator.rdramWrite32(this.pos_z_addr, val)
    }

    get rot_x(): number {
        return this.emulator.rdramRead32(this.rot_x_addr)
    }
    set rot_x(val: number) {
        this.emulator.rdramWrite32(this.rot_x_addr, val)
    }

    get rot_y(): number {
        return this.emulator.rdramRead32(this.rot_y_addr)
    }
    set rot_y(val: number) {
        this.emulator.rdramWrite32(this.rot_y_addr, val)
    }

    get rot_z(): number {
        return this.emulator.rdramRead32(this.rot_z_addr)
    }
    set rot_z(val: number) {
        this.emulator.rdramWrite32(this.rot_z_addr, val)
    }
    
    get scale(): number {
        return this.emulator.rdramRead32(this.scale_addr)
    }
    set scale(val: number) {
        this.emulator.rdramWrite32(this.scale_addr, val)
    }

    get state(): number {
        return this.emulator.rdramRead32(this.state_addr)
    }
    set state(val: number) {
        this.emulator.rdramWrite32(this.state_addr, val)
    }
    
    get visible(): boolean {
        return this.emulator.rdramRead8(this.visible_addr) === 0x01
    }
    set visible(val: boolean) {
        if (val) {
            this.emulator.rdramWrite8(this.visible_addr, 0x01)
        } else {
            this.emulator.rdramWrite8(this.visible_addr, 0x00)
        }
    }

    get z_forward() : boolean {
        return this.emulator.rdramRead8(this.z_forward_addr) === 0x01
    }
    set z_forward(val: boolean) {
        if (val) {
            this.emulator.rdramWrite8(this.z_forward_addr, 0x01)
        } else {
            this.emulator.rdramWrite8(this.z_forward_addr, 0x00)
        }
    }
}

export class Runtime extends API.APIObject implements API.IRuntime {
    private instance: number = global.ModLoader["runtime"]

    private ptr_actor_arr_addr: number = 0x36E560
    private note_door_addr: number = 0x3831AF
    private lvl_addr: number = 0x383301
    private lvl_notes_addr: number = 0x385F63
    private jiggies_available_addr: number = 0x385FCB
    private jiggies_label_addr: number = 0x385FDF
    private profile_addr: number = 0x365E00 // Title = -1, 0 = A, 1 = C, 2 = B -- Int32

    get level(): API.LevelID {
        switch (this.emulator.rdramRead16(this.lvl_addr)) {
            case 0x01: return API.LevelID.MUMBOS_MOUNTAIN
            case 0x02: return API.LevelID.TREASURE_TROVE_COVE
            case 0x03: return API.LevelID.CLANKERS_CAVERN
            case 0x04: return API.LevelID.BUBBLE_GLOOP_SWAMP
            case 0x05: return API.LevelID.FREEZEEZY_PEAK
            case 0x06: return API.LevelID.GRUNTILDAS_LAIR
            case 0x07: return API.LevelID.GOBEYS_VALEY
            case 0x08: return API.LevelID.CLICK_CLOCK_WOODS
            case 0x09: return API.LevelID.RUSTY_BUCKET_BAY
            case 0x0A: return API.LevelID.MAD_MONSTER_MANSION
            case 0x0B: return API.LevelID.SPIRAL_MOUNTAIN
        }
        return API.LevelID.UNKNOWN
    }

    get profile(): number {
        return this.emulator.rdramReadS32(this.profile_addr)
    }
}

export class SaveContext extends API.APIObject implements API.ISaveContext {
    private instance: number = global.ModLoader["save_context"] // 383080
    
    // Progress Flags
    private game_flags_addr: number =0x3831A8 //this.instance + 0x0128 // 0x3831A8
    private honey_comb_flags_addr: number =0x3832E0 //this.instance + 0x0260 // 0x3832E0
    private jiggy_flags_addr: number =0x3832C0 //this.instance + 0x0240 // 0x3832C0
    private mumbo_token_flags_addr: number =0x3832F0 //this.instance + 0x0270 // 0x3832F0
    private note_total_addr: number =0x385FF0 //this.instance + 0x2F70 // 0x385FF0
    
    private honey_combs_addr: number =0x385F7F //this.instance + 0x2EFF // 0x385F7F

    // Bit Manipulators
    moveset: API.IMoveSet

    constructor(emu: IMemory) {
        super(emu)
        this.moveset = new MoveSet(emu)
    }   
    
    get_game_flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.game_flags_addr, 0x20)
    }
    set_game_flag(offset: number, value: number) {
        this.emulator.rdramWrite8(this.game_flags_addr + offset, value)
    }

    get_honey_comb_flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.honey_comb_flags_addr, 0x03)
    }
    set_honey_comb_flag(offset: number, value: number) {
        this.emulator.rdramWrite8(this.honey_comb_flags_addr + offset, value)
    }

    get_jiggy_flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.jiggy_flags_addr, 0x0D)
    }
    set_jiggy_flag(offset: number, value: number) {
        this.emulator.rdramWrite8(this.jiggy_flags_addr + offset, value)
    }
    
    get_mumbo_token_flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.mumbo_token_flags_addr, 0x10)
    }
    set_mumbo_token_flag(offset: number, value: number) {
        this.emulator.rdramWrite8(this.mumbo_token_flags_addr + offset, value)
    }

    get_note_totals(): Buffer {
        return this.emulator.rdramReadBuffer(this.note_total_addr, 0x0F)
    }
    get_note_total(level: API.LevelID): number {
        return this.emulator.rdramRead8(this.note_total_addr + level)
    }
    set_note_total(level: API.LevelID, value: number) {
        this.emulator.rdramWrite8(this.note_total_addr + level, value)
    }

}

export class BanjoKazooie implements ICore, API.IBKCore {
    header: string = "Banjo-Kazooie"
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI
    eventTicks: Map<string, Function> = new Map<string, Function>()

    banjo!: API.IBanjo
    runtime!: API.IRuntime
    save!: SaveContext

    isPlaying(): boolean {
        return !(this.banjo.state === 0 || this.runtime.profile === -1)
    }

    preinit(): void {
        global.ModLoader["banjo"] = 0x37C0E0
        global.ModLoader["runtime"] = 0x0 // PLACEHOLDER
        global.ModLoader["save_context"] = 0x383080

        // Scattered Offsets
        global.ModLoader["offset_moves"] = 0x37C3A0
    }

    init(): void { 

    }

    postinit(): void {
        this.banjo = new Banjo(this.ModLoader.emulator)
        this.runtime = new Runtime(this.ModLoader.emulator)
        this.save = new SaveContext(this.ModLoader.emulator)
    }

    onTick(): void { 
        this.eventTicks.forEach((value: Function, key: string) => {
            value()
        })
    }    
}

export default BanjoKazooie