import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Imports';

export class NoteTotalBuffer extends API.BufferObj implements API.IBuffered {
    constructor(emu: IMemory) {
        super(
            emu,
            global.ModLoader[API.AddressType.INVENTORY] +
        API.InventoryType.NOTE_TOTALS,
            0x0f
        );
    }
}
