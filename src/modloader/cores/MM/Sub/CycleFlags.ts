import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

export class CycleFlags extends API.BufferObj implements API.IBuffered {
  constructor(emu: IMemory) {
    super(emu, 0x1f35da, 0x0960);
  }
}
