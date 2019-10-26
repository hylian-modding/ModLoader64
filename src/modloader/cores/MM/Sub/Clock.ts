import * as API from 'modloader64_api/MM/Imports';

export class Clock extends API.BaseObj implements API.IClock {
  private cur_day_addr = 0x1ef688;
  private elapsed_addr = 0x1ef68c;
  private is_night_addr = 0x1ef680;
  private speed_addr = 0x1ef684;
  private time_addr = 0x1ef67c;

  get current_day(): number {
    return this.emulator.rdramRead32(this.cur_day_addr);
  }
  set current_day(val: number) {
    this.emulator.rdramWrite32(this.cur_day_addr, val);
  }

  get elapsed(): number {
    return this.emulator.rdramRead32(this.elapsed_addr);
  }
  set elapsed(val: number) {
    this.emulator.rdramWrite32(this.elapsed_addr, val);
  }

  get is_night(): boolean {
    return this.emulator.rdramRead32(this.is_night_addr) !== 0;
  }
  set is_night(val: boolean) {
    this.emulator.rdramWrite32(this.is_night_addr, val ? 1 : 0);
  }

  get speed(): number {
    return this.emulator.rdramRead32(this.speed_addr);
  }
  set speed(val: number) {
    this.emulator.rdramWrite32(this.speed_addr, val);
  }

  get time(): number {
    return this.emulator.rdramRead16(this.time_addr);
  }
  set time(val: number) {
    this.emulator.rdramWrite16(this.time_addr, val);
  }
}
