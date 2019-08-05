import IMemory from 'modloader64_api/IMemory';
import { ITunics } from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from './JSONTemplate';

export const enum TunicBitMap {
  KOKIRI = 7,
  GORON = 6,
  ZORA = 5,
}

export class TunicsEquipment extends JSONTemplate implements ITunics {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c;
  jsonFields: string[] = ['kokiriTunic', 'goronTunic', 'goronTunic'];
  constructor(emulator: IMemory) {
    super();
    this.emulator = emulator;
  }
  get kokiriTunic() {
    return this.emulator.rdramReadBit8(this.equipment_addr, TunicBitMap.KOKIRI);
  }
  set kokiriTunic(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, TunicBitMap.KOKIRI, bool);
  }
  get goronTunic() {
    return this.emulator.rdramReadBit8(this.equipment_addr, TunicBitMap.GORON);
  }
  set goronTunic(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, TunicBitMap.GORON, bool);
  }
  get zoraTunic() {
    return this.emulator.rdramReadBit8(this.equipment_addr, TunicBitMap.ZORA);
  }
  set zoraTunic(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, TunicBitMap.ZORA, bool);
  }
}
