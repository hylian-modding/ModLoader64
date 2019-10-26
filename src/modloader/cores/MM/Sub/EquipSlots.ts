import * as API from 'modloader64_api/MM/Imports';

export class EquipSlots extends API.BaseObj implements API.IEquipSlots {
  private ss_addr = 0x1ef6dd;
  private bq_addr = 0x1ef72b;

  get sword(): API.SwordBmp {
    let slot = this.emulator.rdramRead8(this.ss_addr);
    return (slot & 0x0f);
  }
  set sword(val: API.SwordBmp) {
    let slot = this.emulator.rdramRead8(this.ss_addr);
    slot = (slot & 0xf0) | val;
    this.emulator.rdramWrite8(this.ss_addr, slot);
  }
  
  get shield(): API.ShieldBmp {
    let slot = this.emulator.rdramRead8(this.ss_addr);
    return (slot & 0xf0) >> 0x04;
  }
  set shield(val: API.ShieldBmp) {
    let slot = this.emulator.rdramRead8(this.ss_addr);
    slot = (slot & 0x0f) | (val << 0x4);
    this.emulator.rdramWrite8(this.ss_addr, slot);
  }
  
  get bomb_bag(): API.BombBagBmp {
    let slot = this.emulator.rdramRead8(this.bq_addr);
    return (slot & 0x0f);
  }
  set bomb_bag(val: API.BombBagBmp) {
    let slot = this.emulator.rdramRead8(this.bq_addr);
    slot = (slot & 0xf0) | val;
    this.emulator.rdramWrite8(this.bq_addr, slot);
  }
  
  get quiver(): API.QuiverBmp {
    let slot = this.emulator.rdramRead8(this.bq_addr);
    return (slot & 0xf0) >> 0x04;
  }
  set quiver(val: API.QuiverBmp) {
    let slot = this.emulator.rdramRead8(this.bq_addr);
    slot = (slot & 0x0f) | (val << 0x4);
    this.emulator.rdramWrite8(this.bq_addr, slot);
  }
}