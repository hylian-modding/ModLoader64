import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/MM/Imports';

export class Dungeon extends API.BaseObj implements API.IDungeon {
  private inst: number;

  constructor(emu: IMemory, addr: number) {
      super(emu);

      this.inst = addr;
  }

  get wood_fall(): number {
      return this.emulator.rdramRead8(this.inst + 0x00);
  }
  set wood_fall(val: number) {
      this.emulator.rdramWrite8(this.inst + 0x00, val);
  }

  get snow_head(): number {
      return this.emulator.rdramRead8(this.inst + 0x01);
  }
  set snow_head(val: number) {
      this.emulator.rdramWrite8(this.inst + 0x01, val);
  }

  get great_bay(): number {
      return this.emulator.rdramRead8(this.inst + 0x02);
  }
  set great_bay(val: number) {
      this.emulator.rdramWrite8(this.inst + 0x02, val);
  }

  get stone_tower(): number {
      return this.emulator.rdramRead8(this.inst + 0x03);
  }
  set stone_tower(val: number) {
      this.emulator.rdramWrite8(this.inst + 0x03, val);
  }
}
