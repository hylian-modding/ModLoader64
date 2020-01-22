import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/BK/Imports';

export class MumboTokenFlags extends API.BufferObj implements API.IBuffered {
    constructor(emu: IMemory) {
        super(emu, global.ModLoader[API.AddressType.SAVE_MUMBO_TOKEN_FLAGS], 0x10);
    }
}
