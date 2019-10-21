import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

export class TempFlags extends API.BufferObj{
    constructor(emu: IMemory) {
        super(emu, 0x3E8988, 0x14);
    }
}