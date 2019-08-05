import IMemory from 'modloader64_api/IMemory';
import { ISwords } from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from './JSONTemplate';

export const enum SwordBitMap {
  KOKIRI = 7,
  MASTER = 6,
  GIANT = 5,
  BIGGORON = 5,
}

export class SwordsEquipment extends JSONTemplate implements ISwords {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c + 1;
  private biggoron_flag_addr: number = this.instance + 0x003e;
  jsonFields: string[] = [
    'kokiriSword',
    'masterSword',
    'giantKnife',
    'biggoronSword',
  ];
  constructor(emulator: IMemory) {
    super();
    this.emulator = emulator;
  }
  get kokiriSword() {
    return this.emulator.rdramReadBit8(this.equipment_addr, SwordBitMap.KOKIRI);
  }
  set kokiriSword(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, SwordBitMap.KOKIRI, bool);
  }
  get masterSword() {
    return this.emulator.rdramReadBit8(this.equipment_addr, SwordBitMap.MASTER);
  }
  set masterSword(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, SwordBitMap.MASTER, bool);
  }
  get giantKnife() {
    return this.emulator.rdramReadBit8(this.equipment_addr, SwordBitMap.GIANT);
  }
  set giantKnife(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, SwordBitMap.GIANT, bool);
  }
  get biggoronSword() {
    return this.emulator.rdramReadBit8(
      this.equipment_addr,
      SwordBitMap.BIGGORON
    );
  }
  set biggoronSword(bool: boolean) {
    this.emulator.rdramWriteBit8(
      this.equipment_addr,
      SwordBitMap.BIGGORON,
      bool
    );
    this.emulator.rdramWrite8(this.biggoron_flag_addr, bool ? 1 : 0);
  }
}
