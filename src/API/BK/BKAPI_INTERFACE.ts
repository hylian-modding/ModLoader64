import * as apiEnum from './BKAPI_ENUMS'

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
    moves: number
    get_note_total(level: apiEnum.LevelID): number
    set_note_total(level: apiEnum.LevelID, value: number): any
}

export interface IBKCore{
    banjo: IBanjo
    runtime: IRuntime
    save: ISaveContext

    isPlaying(): boolean
}