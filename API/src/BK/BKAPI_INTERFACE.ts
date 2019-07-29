import * as apiBit from './BKAPI_BITMAP'
import * as apiEnum from './BKAPI_ENUM'

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export interface IMoveSet {
    get(move: apiBit.MoveBitMap): boolean
    set(move: apiBit.MoveBitMap, value: boolean): any
    moves: number
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IBanjo {
    exists: boolean
    opacity: number
    z_forward: boolean
    visible: boolean
    scale: number
    state: number
    pos_x: number
    pos_y: number
    pos_z: number
    animal: apiEnum.AnimalType
}

export interface IRuntime {
    level: apiEnum.LevelID
    profile: number
}

export interface ISaveContext {
    get_game_flags(): Buffer
    set_game_flag(offset: number, value: number): any
    get_jiggy_flags(): Buffer
    set_jiggy_flag(offset: number, value: number): any
    get_honey_comb_flags(): Buffer
    set_honey_comb_flag(offset: number, value: number): any
    get_mumbo_token_flags(): Buffer
    set_mumbo_token_flag(offset: number, value: number): any

    get_note_totals(): Buffer
    get_note_total(level: apiEnum.LevelID): number
    set_note_total(level: apiEnum.LevelID, value: number): any
    
    moveset: IMoveSet
}

export interface IBKCore{
    banjo: IBanjo
    runtime: IRuntime
    save: ISaveContext

    isPlaying(): boolean
}