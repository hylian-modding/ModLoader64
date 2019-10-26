import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

export class OwlFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, 0x1ef6b6, 0x02);
  }
}
