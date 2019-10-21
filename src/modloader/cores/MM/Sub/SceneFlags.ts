import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

export class SceneFlags extends API.BufferObj{
    constructor(emu: IMemory) {
        super(emu, 0x1ef768, 0x0d20);
    }
}