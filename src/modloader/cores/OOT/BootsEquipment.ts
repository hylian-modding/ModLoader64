import IMemory from 'modloader64_api/IMemory';
import { IBoots } from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export const enum BootsBitMap {
  KOKIRI = 3,
  IRON = 2,
  HOVER = 1,
}

export class BootsEquipment extends JSONTemplate implements IBoots {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c;
  jsonFields: string[] = ['kokiriBoots', 'ironBoots', 'hoverBoots'];
  constructor(emulator: IMemory) {
    super();
    this.emulator = emulator;
  }
  get kokiriBoots() {
    return this.emulator.rdramReadBit8(this.equipment_addr, BootsBitMap.KOKIRI);
  }
  set kokiriBoots(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, BootsBitMap.KOKIRI, bool);
  }
  get ironBoots() {
    return this.emulator.rdramReadBit8(this.equipment_addr, BootsBitMap.IRON);
  }
  set ironBoots(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, BootsBitMap.IRON, bool);
  }
  get hoverBoots() {
    return this.emulator.rdramReadBit8(this.equipment_addr, BootsBitMap.HOVER);
  }
  set hoverBoots(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, BootsBitMap.HOVER, bool);
  }
}
