import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

export class GameFlags extends API.BufferObj implements API.IBuffered {
    constructor(emu: IMemory) {
        super(emu, 0x1ef76a, 0x0d20);
    }
}