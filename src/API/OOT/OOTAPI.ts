export const enum LinkState {
    STANDING,
    SWIMMING,
    OCARINA,
    BUSY,
    UNKNOWN
}

export const enum Tunic {
    KOKIRI,
    GORON,
    ZORA
}

export const enum Shield {
    NONE,
    DEKU,
    HYLIAN,
    MIRROR
}

export const enum Boots {
    KOKIRI,
    IRON,
    HOVER
}

export const enum Mask {
    NONE,
    KEATON,
    SKULL,
    SPOOKY,
    BUNNY
}

export const enum Magic {
    NONE,
    NORMAL,
    EXTENDED
}

export const enum MagicQuantities {
    NONE = 0,
    NORMAL = 0x30,
    EXTENDED = 0x60
}

export interface ISwords {
    kokiriSword: boolean;
    masterSword: boolean;
    giantKnife: boolean;
    biggoronSword: boolean;
}

export interface IShields{
    dekuShield: boolean
    hylianShield: boolean
    mirrorShield: boolean
}

export interface ISaveContext {
    swords: ISwords;
    shields: IShields;
    entrance_index: number;
    cutscene_number: number;
    world_time: number;
    world_night_flag: boolean;
    zeldaz_string: string;
    death_counter: number;
    player_name: string;
    dd_flag: boolean;
    heart_containers: number;
    health: number;
    magic_meter_size: Magic;
    magic_current: number;
    rupee_count: number;
    navi_timer: number;
}

export interface ILink {
    state: LinkState;
    tunic: Tunic;
    shield: Shield;
    boots: Boots;
    mask: Mask;
}

export interface IOOTCore{
    link: ILink
    save: ISaveContext
}