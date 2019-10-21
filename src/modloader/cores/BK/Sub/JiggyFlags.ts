import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Imports';

export class JiggyFlags extends API.BufferObj implements API.IBuffered {
    constructor(emu: IMemory) {
        super(emu, global.ModLoader[API.AddressType.SAVE_JIGGY_FLAGS], 0x0d);
    }
}