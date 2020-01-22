import * as API from 'modloader64_api/MM/Imports';

export class ItemSlots extends API.BaseObj implements API.IItemSlots {
  private inst = 0x1ef6e0;

  get array(): Buffer {
      return this.emulator.rdramReadBuffer(this.inst, 0x18);
  }
  set array(val: Buffer) {
      this.emulator.rdramWriteBuffer(this.inst, val);
  }

  get_slot(slot: API.ItemSlotType): API.ItemType {
      return this.emulator.rdramRead8(this.inst + slot) as API.ItemType;
  }
  set_slot(slot: API.ItemSlotType, item: API.ItemType) {
      this.emulator.rdramWrite8(this.inst + slot, item);
  }
}
