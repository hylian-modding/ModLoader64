import * as API from 'modloader64_api/MM/Imports';

export class MaskSlots extends API.BaseObj implements API.IMaskSlots {
    private inst: number = 0x1ef6f8;

    get array(): Buffer { return this.emulator.rdramReadBuffer(this.inst, 0x18); }
    set array(val: Buffer) { this.emulator.rdramWriteBuffer(this.inst, val); }

    get_slot(slot: API.MaskSlotType): API.MaskType {
        return this.emulator.rdramRead8(this.inst + slot) as API.MaskType;
    }
    set_slot(slot: API.MaskSlotType, mask: API.MaskType) {
        this.emulator.rdramWrite8(this.inst + slot, mask);
    }
}