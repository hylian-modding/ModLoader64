import * as API from 'modloader64_api/MM/Imports';

export class Magic extends API.BaseObj implements API.IMagic {
  private magic_status: number = 0x1f3598; //triggers various effects, like use magic, flash magic, restore magic
  private max_magic: number = 0x1f359e; //0x30 = normal, 0x60 = double
  private magic: number = 0x1f35a0; //unknown use?
  private double_magic_meter: number = 0x1ef6b0; //Double Magic Flag
  private magic_bar_addr: number = 0x1ef6a8; //automatically sets itself to 0,1 or 2 depending on your upgrades (int8)
  private magic_amount_addr: number = 0x1ef6a9; //Current magic amount	0x30 = half bar, 0x60 = full bar (byte)
  
  get magic_bar(): number {
    return this.emulator.rdramRead32(this.magic_bar_addr);
  }
  set magic_bar(val: number) {
    this.emulator.rdramWrite32(this.magic_bar_addr, val);
  }

  get magic_amount(): number {
    return this.emulator.rdramRead32(this.magic_amount_addr);
  }
  set magic_amount(val: number) {
    this.emulator.rdramWrite32(this.magic_amount_addr, val);
  }
}