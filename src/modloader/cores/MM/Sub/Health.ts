import * as API from 'modloader64_api/MM/Imports';

export class Health extends API.BaseObj implements API.IHealth {
  private double_defense_addr: number = 0x1ef6b2;
  private pieces_addr: number = 0x1ef72c;
  private heart_container_addr: number = 0x1ef6a4; //0x10 is equivalent to 1 heart container (int16)
  private start_health_addr: number = 0x1ef6a6; //0x10 is equivalent to 1 full heart (int16)

  get double_defense(): number {
    return this.emulator.rdramRead32(this.double_defense_addr);
  }
  set double_defense(val: number) {
    this.emulator.rdramWrite32(this.double_defense_addr, val);
  }

  get pieces(): number {
    let value = this.emulator.rdramRead8(this.pieces_addr);
    return value >> 0x04;
  }
  set pieces(val: number) {
    let value = this.emulator.rdramRead8(this.pieces_addr);
    value = (value & 0x0f) | (val << 0x04);
  }

  get heart_container(): number {
    return this.emulator.rdramRead16(this.heart_container_addr);
  }
  set heart_container(value: number) {
    this.emulator.rdramWrite16(this.heart_container_addr, value);
  }

  get start_health(): number {
    return this.emulator.rdramRead16(this.start_health_addr);
  }
  set start_health(value: number) {
    this.emulator.rdramWrite16(this.start_health_addr, value);
  }

}