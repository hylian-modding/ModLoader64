import IMemory from 'modloader64_api/IMemory';
import { IShields } from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export const enum ShieldBitMap {
  DEKU = 3,
  HYLIAN = 2,
  MIRROR = 1,
}

export class ShieldsEquipment extends JSONTemplate implements IShields {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c + 1;
  jsonFields: string[] = ['dekuShield', 'hylianShield', 'mirrorShield'];
  constructor(emulator: IMemory) {
    super();
    this.emulator = emulator;
  }
  set dekuShield(bool: boolean) {
    this.emulator.rdramWriteBit8(this.equipment_addr, ShieldBitMap.DEKU, bool);
  }
  get dekuShield(): boolean {
    return this.emulator.rdramReadBit8(this.equipment_addr, ShieldBitMap.DEKU);
  }
  set hylianShield(bool: boolean) {
    this.emulator.rdramWriteBit8(
      this.equipment_addr,
      ShieldBitMap.HYLIAN,
      bool
    );
  }
  get hylianShield(): boolean {
    return this.emulator.rdramReadBit8(
      this.equipment_addr,
      ShieldBitMap.HYLIAN
    );
  }
  set mirrorShield(bool: boolean) {
    this.emulator.rdramWriteBit8(
      this.equipment_addr,
      ShieldBitMap.MIRROR,
      bool
    );
  }
  get mirrorShield(): boolean {
    return this.emulator.rdramReadBit8(
      this.equipment_addr,
      ShieldBitMap.MIRROR
    );
  }
}
