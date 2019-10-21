import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Imports';

export class HoneyCombFlags extends API.BufferObj implements API.IBuffered {
    constructor(emu: IMemory) {
        super(emu, global.ModLoader[API.AddressType.SAVE_HONEYCOMB_FLAGS], 0x03);
    }
}