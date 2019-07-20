import { IModLoaderAPI, ICore } from '../../API/IModLoaderAPI'
import IMemory from '../../API/IMemory';
import { GameShark } from '../GameShark';
import * as bitwise from 'bitwise'
import { UInt8, Bit } from 'bitwise/types';
import { ISwords, ISaveContext, LinkState, Tunic, Shield, Boots, Mask, Magic, MagicQuantities, ILink, IOOTCore } from '../../API/OOT/OOTAPI';
import { bus } from '../../API/EventHandler';


export const enum SwordBitMap {
    KOKIRI = 7,
    MASTER = 6,
    GIANT = 5,
    BIGGORON = 5
}

export const enum ShieldBitMap {
    DEKU = 3,
    HYLIAN = 2,
    MIRROR = 1
}

export const enum TunicBitMap {
    KOKIRI = 7,
    GORON = 6,
    ZORA = 5
}

export const enum BootsBitMap {
    KOKIRI = 3,
    IRON = 2,
    HOVER = 1
}

export class Swords implements ISwords {
    private flags: Bit[]
    private emulator: IMemory
    private instance: number = global.ModLoader.save_context
    private equipment_addr: number = this.instance + 0x009C + 1
    private biggoron_flag_addr: number = this.instance + 0x003E

    constructor(data: number, emulator: IMemory) {
        this.emulator = emulator
        this.flags = bitwise.byte.read(data as UInt8)
    }

    update() {
        this.flags = bitwise.byte.read(this.emulator.rdramRead8(this.equipment_addr) as UInt8)
    }

    get kokiriSword() {
        return this.flags[SwordBitMap.KOKIRI] === 1
    }

    set kokiriSword(bool: boolean) {
        if (bool) {
            this.flags[SwordBitMap.KOKIRI] = 1
        } else {
            this.flags[SwordBitMap.KOKIRI] = 0
        }
        console.log(this.flags)
        this.emulator.rdramWrite8(this.equipment_addr, bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]))
    }

    get masterSword() {
        return this.flags[SwordBitMap.MASTER] === 1
    }

    set masterSword(bool: boolean) {
        if (bool) {
            this.flags[SwordBitMap.MASTER] = 1
        } else {
            this.flags[SwordBitMap.MASTER] = 0
        }
        this.emulator.rdramWrite8(this.equipment_addr, bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]))
    }

    get giantKnife() {
        return this.flags[SwordBitMap.GIANT] === 1
    }

    set giantKnife(bool: boolean) {
        if (bool) {
            this.flags[SwordBitMap.GIANT] = 1
        } else {
            this.flags[SwordBitMap.GIANT] = 0
        }
        this.emulator.rdramWrite8(this.equipment_addr, bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]))
    }

    get biggoronSword() {
        return this.flags[SwordBitMap.BIGGORON] === 1
    }

    set biggoronSword(bool: boolean) {
        if (bool) {
            this.flags[SwordBitMap.BIGGORON] = 1
        } else {
            this.flags[SwordBitMap.BIGGORON] = 0
        }
        this.emulator.rdramWrite8(this.equipment_addr, bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]))
        this.emulator.rdramWrite8(this.biggoron_flag_addr, 1)
    }

    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = Object.assign({}, this);

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this as any)[key];
                        jsonObj[key] = val;
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return jsonObj;
    }
}

export class Link implements ILink {
    private emulator: IMemory
    private instance: number = 0x1DAA30
    private state_addr: number = this.instance + 0x066C
    private tunic_addr: number = this.instance + 0x013C
    private shield_addr: number = this.instance + 0x013E
    private boots_addr: number = this.instance + 0x013F
    private mask_addr: number = this.instance + 0x014F

    constructor(emu: IMemory) {
        this.emulator = emu
    }

    exists(): boolean {
        return this.emulator.rdramRead32(this.instance) === 0x2FF
    }

    get state(): LinkState {
        switch (this.emulator.rdramRead16(this.state_addr)) {
            case 0: return LinkState.STANDING
            case 0x20: return LinkState.BUSY
            case 0x30: return LinkState.OCARINA
        }
        return LinkState.UNKNOWN
    }

    get tunic(): Tunic {
        return this.emulator.rdramRead8(this.tunic_addr)
    }

    set tunic(tunic: Tunic) {
        this.emulator.rdramWrite8(this.tunic_addr, tunic)
    }

    get shield(): Shield {
        return this.emulator.rdramRead8(this.shield_addr)
    }

    set shield(shield: Shield) {
        this.emulator.rdramWrite8(this.shield_addr, shield)
    }

    get boots(): Boots {
        return this.emulator.rdramRead8(this.boots_addr)
    }

    set boots(boots: Boots) {
        this.emulator.rdramWrite8(this.boots_addr, boots)
    }

    get mask(): Mask {
        return this.emulator.rdramRead8(this.mask_addr)
    }

    set mask(mask: Mask) {
        this.emulator.rdramWrite8(this.mask_addr, mask)
    }

    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = Object.assign({}, this);

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this as any)[key];
                        jsonObj[key] = val;
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return jsonObj;
    }
}

export class SaveContext implements ISaveContext {
    private emulator: IMemory
    private instance: number = global.ModLoader.save_context
    private entrance_index_addr: number = this.instance + 0x0000
    private cutscene_number_addr: number = this.instance + 0x000A
    private world_time_addr: number = this.instance + 0x000C
    private world_night_addr: number = this.instance + 0x0010
    private zeldaz_addr: number = this.instance + 0x001C
    private death_addr: number = this.instance + 0x0022
    private player_name_addr: number = this.instance + 0x0024
    private dd_flag_addr: number = this.instance + 0x002C
    private heart_container_addr: number = this.instance + 0x002E
    private health_addr: number = this.instance + 0x0030
    private magic_meter_size_addr: number = this.instance + 0x0032
    private magic_current_addr: number = this.instance + 0x0033
    private magic_limit_addr: number = this.instance + 0x13F4
    private magic_flag_1_addr: number = this.instance + 0x003A
    private magic_flag_2_addr: number = this.instance + 0x003C
    private rupees_address: number = this.instance + 0x0034
    private navi_timer_addr: number = this.instance + 0x0038
    // Further abstractions
    swords: Swords
    // C#

    constructor(emu: IMemory) {
        this.emulator = emu
        this.swords = new Swords(0, emu)
    }

    // https://wiki.cloudmodding.com/oot/Entrance_Table
    // https://wiki.cloudmodding.com/oot/Entrance_Table_(Data)
    get entrance_index(): number {
        return this.emulator.rdramRead32(this.entrance_index_addr)
    }

    set entrance_index(index: number) {
        this.emulator.rdramWrite32(this.entrance_index_addr, index)
    }

    get cutscene_number(): number {
        return this.emulator.rdramRead16(this.cutscene_number_addr)
    }

    set cutscene_number(index: number) {
        this.emulator.rdramWrite16(this.cutscene_number_addr, index)
    }

    get world_time(): number {
        return this.emulator.rdramRead16(this.world_time_addr)
    }

    set world_time(time: number) {
        this.emulator.rdramWrite16(this.world_time_addr, time)
    }

    get world_night_flag(): boolean {
        return this.emulator.rdramRead32(this.world_night_addr) === 1
    }

    set world_night_flag(bool: boolean) {
        this.emulator.rdramWrite32(this.world_night_addr, (function (bool: boolean) { return (bool) ? 1 : 0 })(bool))
    }

    get zeldaz_string(): string {
        return this.emulator.rdramReadBuffer(this.zeldaz_addr, 6).toString('ascii')
    }

    get death_counter(): number {
        return this.emulator.rdramRead16(this.death_addr)
    }

    set death_counter(deaths: number) {
        this.emulator.rdramWrite16(this.death_addr, deaths)
    }

    get player_name(): string {
        let b = Buffer.from(this.emulator.rdramReadBuffer(this.player_name_addr, 8))
        return ""
    }

    // Will always be false normally.
    get dd_flag(): boolean {
        return this.emulator.rdramRead16(this.dd_flag_addr) === 1
    }

    set dd_flag(bool: boolean) {
        this.emulator.rdramWrite16(this.dd_flag_addr, (function (bool: boolean) { return (bool) ? 1 : 0 })(bool))
    }

    get heart_containers(): number {
        return this.emulator.rdramRead16(this.heart_container_addr) / 0x10
    }

    set heart_containers(num: number) {
        this.emulator.rdramWrite16(this.heart_container_addr, num * 0x10)
    }

    get health(): number {
        return this.emulator.rdramRead16(this.health_addr) / 0x10
    }

    set health(hearts: number) {
        this.emulator.rdramWrite16(this.health_addr, hearts * 0x10)
    }

    get magic_meter_size(): Magic {
        return this.emulator.rdramRead8(this.magic_meter_size_addr)
    }

    // Several things need to be set in order for magic to function properly.
    set magic_meter_size(size: Magic) {
        this.emulator.rdramWrite8(this.magic_meter_size_addr, size)
        switch (size) {
            case Magic.NONE: {
                this.emulator.rdramWrite8(this.magic_limit_addr, MagicQuantities.NONE)
                this.emulator.rdramWrite8(this.magic_flag_1_addr, 0)
                this.emulator.rdramWrite8(this.magic_flag_2_addr, 0)
                this.magic_current = MagicQuantities.NONE
                break
            }
            case Magic.NORMAL: {
                this.emulator.rdramWrite8(this.magic_limit_addr, MagicQuantities.NORMAL)
                this.emulator.rdramWrite8(this.magic_flag_1_addr, 1)
                this.emulator.rdramWrite8(this.magic_flag_2_addr, 0)
                this.magic_current = MagicQuantities.NORMAL
                break
            }
            case Magic.EXTENDED: {
                this.emulator.rdramWrite8(this.magic_limit_addr, MagicQuantities.EXTENDED)
                this.emulator.rdramWrite8(this.magic_flag_1_addr, 1)
                this.emulator.rdramWrite8(this.magic_flag_2_addr, 1)
                this.magic_current = MagicQuantities.EXTENDED
                break
            }
        }
    }

    get magic_current(): number {
        return this.emulator.rdramRead8(this.magic_current_addr)
    }

    // Failsafe to keep people from setting the magic amount over the cap.
    set magic_current(amount: number) {
        this.emulator.rdramWrite8(this.magic_current, (function (amt: number) { return (amt > MagicQuantities.EXTENDED) ? MagicQuantities.EXTENDED : amt }(amount)))
    }

    get rupee_count(): number {
        return this.emulator.rdramRead16(this.rupees_address)
    }

    set rupee_count(dosh: number) {
        this.emulator.rdramWrite16(this.rupees_address, dosh)
    }

    get navi_timer(): number {
        return this.emulator.rdramRead16(this.navi_timer_addr)
    }

    set navi_timer(time: number) {
        this.emulator.rdramWrite16(this.navi_timer_addr, time)
    }

    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = Object.assign({}, this);

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this as any)[key];
                        jsonObj[key] = val;
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return jsonObj;
    }
}

export class OcarinaofTime implements ICore, IOOTCore {
    header: string = "THE LEGEND OF ZELDA"
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI
    link!: ILink
    save!: SaveContext
    eventTicks: Map<string, Function> = new Map<string, Function>()

    preinit(): void {
        global.ModLoader["save_context"] = 0x11A5D0
    }

    init(): void {
    }

    postinit(): void {
        let gameshark = new GameShark(this.ModLoader.logger, this.ModLoader.emulator)
        gameshark.read(__dirname + "/OcarinaofTime.payload")
        this.ModLoader.logger.info("Checking for core ASM injection...")
        if (this.ModLoader.emulator.rdramRead64(0x089710) === 0x8FA8008008182400) {
            this.ModLoader.logger.info("confirmed.")
        } else {
            this.ModLoader.logger.error("injection failed?")
        }
        this.link = new Link(this.ModLoader.emulator)
        this.save = new SaveContext(this.ModLoader.emulator)
    }

    onTick(): void {
        this.save.swords.update()
        this.eventTicks.forEach((value: Function, key: string) => {
            value();
        });
    }
}