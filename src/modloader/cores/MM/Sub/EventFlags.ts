import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

// https://docs.google.com/spreadsheets/d/13j4WJl7-dBYHdus-Tp4ldbS_juvbjOWmFJne_ROx4gY/edit#gid=1676188860
export class EventFlags extends API.BufferObj implements API.IBuffered {
    constructor(emu: IMemory) {
        super(emu, 0x1f0568, 0x64);
    }
}
