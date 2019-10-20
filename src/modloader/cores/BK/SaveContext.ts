import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Imports';
import * as SUB from './Sub/Imports';

export class SaveContext extends API.BaseObj implements API.ISaveContext {
    private eeprom_addr: number = global.ModLoader[API.AddressType.SAVE_EEPROM];
    private moves_addr: number = global.ModLoader[API.AddressType.SAVE_MOVE_FLAGS];

    // Abstraction
    inventory: API.IInventory;
    game_flags: API.IBuffered;
    honeycomb_flags: API.IBuffered;
    jiggy_flags: API.IBuffered;
    mumbo_token_flags: API.IBuffered;
    note_totals: API.IBuffered;

    constructor(emu: IMemory) {
        super(emu);

        this.inventory = new SUB.Inventory(emu);
        this.game_flags = new SUB.GameFlags(emu);
        this.honeycomb_flags = new SUB.HoneyCombFlags(emu);
        this.jiggy_flags = new SUB.JiggyFlags(emu);
        this.mumbo_token_flags = new SUB.MumboTokenFlags(emu);
        this.note_totals = new SUB.NoteTotalBuffer(emu);
    }

    get_save(file: API.ProfileType): Buffer {
        let offset = (file as number);
        if (offset === -1) offset = 3;
        offset *= 0x78;
        return this.emulator.rdramReadBuffer(this.eeprom_addr + offset, 0x78);
    }
    set_save(file: API.ProfileType, val: Buffer) {
        let offset = (file as number);
        if (offset === -1) offset = 3;
        offset *= 0x78;
        this.emulator.rdramWriteBuffer(this.eeprom_addr + offset, val);
    }

    get moves(): number { return this.emulator.rdramRead32(this.moves_addr); }
    set moves(val: number) { this.emulator.rdramWrite32(this.moves_addr, val); }
}