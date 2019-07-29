import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI';
import IMemory from 'modloader64_api/IMemory';
import { GameShark } from '../GameShark';
import * as bitwise from 'bitwise';
import { UInt8, Bit } from 'bitwise/types';
import {
  ISwords,
  ISaveContext,
  LinkState,
  Tunic,
  Shield,
  Boots,
  Mask,
  Magic,
  MagicQuantities,
  InventoryItem,
  Ocarina,
  Hookshot,
  AmmoUpgrade,
  ILink,
  IOOTCore,
  IShields,
  ITunics,
  IBoots,
  IInventory,
  IQuestStatus,
  Wallet,
  Strength,
  ZoraScale,
} from 'modloader64_api/OOT/OOTAPI';
import { bus } from 'modloader64_api/EventHandler';
import ZeldaString from 'modloader64_api/OOT/ZeldaString';
import { FlagManager, Flag } from 'modloader64_api/FlagManager';
import { registerEndpoint } from 'modloader64_api/EndpointHandler';

export const enum SwordBitMap {
  KOKIRI = 7,
  MASTER = 6,
  GIANT = 5,
  BIGGORON = 5,
}

export const enum ShieldBitMap {
  DEKU = 3,
  HYLIAN = 2,
  MIRROR = 1,
}

export const enum TunicBitMap {
  KOKIRI = 7,
  GORON = 6,
  ZORA = 5,
}

export const enum BootsBitMap {
  KOKIRI = 3,
  IRON = 2,
  HOVER = 1,
}

export const enum InventorySlots {
  DEKU_STICKS,
  DEKU_NUTS,
  BOMBS,
  FAIRY_BOW,
  FIRE_ARROWS,
  DINS_FIRE,
  FAIRY_SLINGSHOT,
  OCARINA,
  BOMBCHUS,
  HOOKSHOT,
  ICE_ARROWS,
  FARORES_WIND,
  BOOMERANG,
  LENS_OF_TRUTH,
  MAGIC_BEANS,
  MEGATON_HAMMER,
  LIGHT_ARROWS,
  NAYRUS_LOVE,
  BOTTLE1,
  BOTTLE2,
  BOTTLE3,
  BOTTLE4,
  ADULT_TRADE_ITEM,
  CHILD_TRADE_ITEM,
}

export class BootsEquipment implements IBoots {
  private flags: Bit[];
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c;

  constructor(data: number, emulator: IMemory) {
    this.emulator = emulator;
    this.flags = bitwise.byte.read(data as UInt8);
  }

  update() {
    this.flags = bitwise.byte.read(this.emulator.rdramRead8(
      this.equipment_addr
    ) as UInt8);
  }

  get kokiri() {
    this.update();
    return this.flags[BootsBitMap.KOKIRI] === 1;
  }

  set kokiri(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[BootsBitMap.KOKIRI] = 1;
    } else {
      this.flags[BootsBitMap.KOKIRI] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get iron() {
    this.update();
    return this.flags[BootsBitMap.IRON] === 1;
  }

  set iron(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[BootsBitMap.IRON] = 1;
    } else {
      this.flags[BootsBitMap.IRON] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get hover() {
    this.update();
    return this.flags[BootsBitMap.HOVER] === 1;
  }

  set hover(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[BootsBitMap.HOVER] = 1;
    } else {
      this.flags[BootsBitMap.HOVER] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class TunicsEquipment implements ITunics {
  private flags: Bit[];
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c;

  constructor(data: number, emulator: IMemory) {
    this.emulator = emulator;
    this.flags = bitwise.byte.read(data as UInt8);
  }

  update() {
    this.flags = bitwise.byte.read(this.emulator.rdramRead8(
      this.equipment_addr
    ) as UInt8);
  }

  get kokiri() {
    this.update();
    return this.flags[TunicBitMap.KOKIRI] === 1;
  }

  set kokiri(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[TunicBitMap.KOKIRI] = 1;
    } else {
      this.flags[TunicBitMap.KOKIRI] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get goron() {
    this.update();
    return this.flags[TunicBitMap.GORON] === 1;
  }

  set goron(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[TunicBitMap.GORON] = 1;
    } else {
      this.flags[TunicBitMap.GORON] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get zora() {
    this.update();
    return this.flags[TunicBitMap.ZORA] === 1;
  }

  set zora(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[TunicBitMap.ZORA] = 1;
    } else {
      this.flags[TunicBitMap.ZORA] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class ShieldsEquipment implements IShields {
  private flags: Bit[];
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c + 1;

  constructor(data: number, emulator: IMemory) {
    this.emulator = emulator;
    this.flags = bitwise.byte.read(data as UInt8);
  }

  update() {
    this.flags = bitwise.byte.read(this.emulator.rdramRead8(
      this.equipment_addr
    ) as UInt8);
  }

  set dekuShield(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[ShieldBitMap.DEKU] = 1;
    } else {
      this.flags[ShieldBitMap.DEKU] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get dekuShield(): boolean {
    return this.flags[ShieldBitMap.DEKU] === 1;
  }

  set hylianShield(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[ShieldBitMap.HYLIAN] = 1;
    } else {
      this.flags[ShieldBitMap.HYLIAN] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get hylianShield(): boolean {
    return this.flags[ShieldBitMap.HYLIAN] === 1;
  }

  set mirrorShield(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[ShieldBitMap.MIRROR] = 1;
    } else {
      this.flags[ShieldBitMap.MIRROR] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get mirrorShield(): boolean {
    this.update();
    return this.flags[ShieldBitMap.MIRROR] === 1;
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class SwordsEquipment implements ISwords {
  private flags: Bit[];
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c + 1;
  private biggoron_flag_addr: number = this.instance + 0x003e;

  constructor(data: number, emulator: IMemory) {
    this.emulator = emulator;
    this.flags = bitwise.byte.read(data as UInt8);
  }

  update() {
    this.flags = bitwise.byte.read(this.emulator.rdramRead8(
      this.equipment_addr
    ) as UInt8);
  }

  get kokiriSword() {
    this.update();
    return this.flags[SwordBitMap.KOKIRI] === 1;
  }

  set kokiriSword(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[SwordBitMap.KOKIRI] = 1;
    } else {
      this.flags[SwordBitMap.KOKIRI] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get masterSword() {
    this.update();
    return this.flags[SwordBitMap.MASTER] === 1;
  }

  set masterSword(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[SwordBitMap.MASTER] = 1;
    } else {
      this.flags[SwordBitMap.MASTER] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get giantKnife() {
    this.update();
    return this.flags[SwordBitMap.GIANT] === 1;
  }

  set giantKnife(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[SwordBitMap.GIANT] = 1;
    } else {
      this.flags[SwordBitMap.GIANT] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
  }

  get biggoronSword() {
    this.update();
    return this.flags[SwordBitMap.BIGGORON] === 1;
  }

  set biggoronSword(bool: boolean) {
    this.update();
    if (bool) {
      this.flags[SwordBitMap.BIGGORON] = 1;
    } else {
      this.flags[SwordBitMap.BIGGORON] = 0;
    }
    this.emulator.rdramWrite8(
      this.equipment_addr,
      bitwise.byte.write(this.flags as [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit])
    );
    this.emulator.rdramWrite8(this.biggoron_flag_addr, 1);
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class Inventory implements IInventory {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private inventory_addr: number = this.instance + 0x0074;
  private inventory_ammo_addr: number = this.instance + 0x008c;
  private obtainedUpgrades: FlagManager;
  wallet!: Wallet;
  strength!: Strength;
  swimming!: ZoraScale;
  dekuSticksCapacity!: AmmoUpgrade;
  dekuNutsCapacity!: AmmoUpgrade;
  bombBag!: AmmoUpgrade;
  bulletBag!: AmmoUpgrade;
  quiver!: AmmoUpgrade;

  constructor(emu: IMemory) {
    this.emulator = emu;
    this.obtainedUpgrades = new FlagManager(emu, this.instance + 0x00a0);
  }

  get dekuSticks(): boolean {
    return this.hasItem(InventoryItem.DEKU_STICK);
  }
  set dekuSticks(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.DEKU_STICK, InventorySlots.DEKU_STICKS);
    } else {
      this.removeItem(InventoryItem.DEKU_STICK);
      this.dekuSticksCapacity = AmmoUpgrade.NONE;
    }
  }
  get dekuSticksCount(): number {
    return this.getAmmoForItem(InventoryItem.DEKU_STICK);
  }
  set dekuSticksCount(count: number) {
    let slot = this.getSlotForItem(InventoryItem.DEKU_STICK);
    this.setAmmoInSlot(slot, count);
  }

  get dekuNuts(): boolean {
    return this.hasItem(InventoryItem.DEKU_STICK);
  }
  set dekuNuts(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.DEKU_STICK, InventorySlots.DEKU_STICKS);
    } else {
      this.removeItem(InventoryItem.DEKU_STICK);
      this.dekuSticksCapacity = AmmoUpgrade.NONE;
    }
  }
  get dekuNutsCount(): number {
    return this.getAmmoForItem(InventoryItem.DEKU_NUT);
  }
  set dekuNutsCount(count: number) {
    let slot = this.getSlotForItem(InventoryItem.DEKU_NUT);
    this.setAmmoInSlot(slot, count);
  }

  get bombs(): boolean {
    return this.hasItem(InventoryItem.BOMB);
  }
  set bombs(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.BOMB, InventorySlots.BOMBS);
    } else {
      this.removeItem(InventoryItem.BOMB);
      this.bombBag = AmmoUpgrade.NONE;
    }
  }
  get bombsCount(): number {
    return this.getAmmoForItem(InventoryItem.BOMB);
  }
  set bombsCount(count: number) {
    let slot = this.getSlotForItem(InventoryItem.BOMB);
    this.setAmmoInSlot(slot, count);
  }

  get bombchus(): boolean {
    return this.hasItem(InventoryItem.BOMBCHU);
  }
  set bombchus(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.BOMBCHU, InventorySlots.BOMBCHUS);
    } else {
      this.removeItem(InventoryItem.BOMBCHU);
    }
  }
  get bombchuCount(): number {
    return this.getAmmoForItem(InventoryItem.BOMBCHU);
  }
  set bombchuCount(count: number) {
    let slot = this.getSlotForItem(InventoryItem.BOMBCHU);
    this.setAmmoInSlot(slot, count);
  }

  get magicBeans(): boolean {
    return this.hasItem(InventoryItem.DEKU_STICK);
  }
  set magicBeans(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.MAGIC_BEAN, InventorySlots.MAGIC_BEANS);
    } else {
      this.removeItem(InventoryItem.MAGIC_BEAN);
    }
  }
  get magicBeansCount(): number {
    return this.getAmmoForItem(InventoryItem.MAGIC_BEAN);
  }
  set magicBeansCount(count: number) {
    let slot = this.getSlotForItem(InventoryItem.MAGIC_BEAN);
    this.setAmmoInSlot(slot, count);
  }

  get fairySlingshot(): boolean {
    return this.hasItem(InventoryItem.FAIRY_SLINGSHOT);
  }
  set fairySlingshot(bool: boolean) {
    if (bool) {
      this.giveItem(
        InventoryItem.FAIRY_SLINGSHOT,
        InventorySlots.FAIRY_SLINGSHOT
      );
    } else {
      this.removeItem(InventoryItem.FAIRY_SLINGSHOT);
      this.bulletBag = AmmoUpgrade.NONE;
    }
  }
  get dekuSeeds(): number {
    return this.getAmmoForItem(InventoryItem.FAIRY_SLINGSHOT);
  }
  set dekuSeeds(count: number) {
    let slot = this.getSlotForItem(InventoryItem.FAIRY_SLINGSHOT);
    this.setAmmoInSlot(slot, count);
  }

  get fairyBow(): boolean {
    return this.hasItem(InventoryItem.FAIRY_BOW);
  }
  set fairyBow(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.FAIRY_BOW, InventorySlots.FAIRY_BOW);
    } else {
      this.removeItem(InventoryItem.FAIRY_BOW);
      this.quiver = AmmoUpgrade.NONE;
    }
  }
  get arrows(): number {
    return this.getAmmoForItem(InventoryItem.FAIRY_BOW);
  }
  set arrows(count: number) {
    let slot = this.getSlotForItem(InventoryItem.FAIRY_BOW);
    this.setAmmoInSlot(slot, count);
  }

  get fireArrows(): boolean {
    return this.hasItem(InventoryItem.FIRE_ARROW);
  }
  set fireArrows(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.FIRE_ARROW, InventorySlots.FIRE_ARROWS);
    } else {
      this.removeItem(InventoryItem.FIRE_ARROW);
    }
  }

  get iceArrows(): boolean {
    return this.hasItem(InventoryItem.ICE_ARROW);
  }
  set iceArrows(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.ICE_ARROW, InventorySlots.ICE_ARROWS);
    } else {
      this.removeItem(InventoryItem.ICE_ARROW);
    }
  }

  get lightArrows(): boolean {
    return this.hasItem(InventoryItem.LIGHT_ARROW);
  }
  set lightArrows(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.LIGHT_ARROW, InventorySlots.LIGHT_ARROWS);
    } else {
      this.removeItem(InventoryItem.LIGHT_ARROW);
    }
  }

  get dinsFire(): boolean {
    return this.hasItem(InventoryItem.DINS_FIRE);
  }
  set dinsFire(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.DINS_FIRE, InventorySlots.DINS_FIRE);
    } else {
      this.removeItem(InventoryItem.DINS_FIRE);
    }
  }

  get faroresWind(): boolean {
    return this.hasItem(InventoryItem.FARORES_WIND);
  }
  set faroresWind(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.FARORES_WIND, InventorySlots.FARORES_WIND);
    } else {
      this.removeItem(InventoryItem.FARORES_WIND);
    }
  }

  get nayrusLove(): boolean {
    return this.hasItem(InventoryItem.NAYRUS_LOVE);
  }
  set nayrusLove(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.NAYRUS_LOVE, InventorySlots.NAYRUS_LOVE);
    } else {
      this.removeItem(InventoryItem.NAYRUS_LOVE);
    }
  }

  get ocarina(): Ocarina {
    if (this.hasItem(InventoryItem.OCARINA_OF_TIME)) {
      return Ocarina.OCARINA_OF_TIME;
    }
    if (this.hasItem(InventoryItem.FAIRY_OCARINA)) {
      return Ocarina.FAIRY_OCARINA;
    }
    return Ocarina.NONE;
  }
  set ocarina(item: Ocarina) {
    if (item == this.ocarina) {
      return;
    }

    if (item == Ocarina.NONE) {
      this.removeItem(InventoryItem.OCARINA_OF_TIME);
      this.removeItem(InventoryItem.FAIRY_OCARINA);
    }

    if (item == Ocarina.OCARINA_OF_TIME) {
      let slot: number = this.getSlotForItem(InventoryItem.FAIRY_OCARINA);
      if (slot > -1) {
        this.setItemInSlot(InventoryItem.OCARINA_OF_TIME, slot);
      } else {
        this.giveItem(InventoryItem.OCARINA_OF_TIME, InventorySlots.OCARINA);
      }
    }

    if (item == Ocarina.FAIRY_OCARINA) {
      let slot: number = this.getSlotForItem(InventoryItem.OCARINA_OF_TIME);
      if (slot > -1) {
        this.setItemInSlot(InventoryItem.FAIRY_OCARINA, slot);
      } else {
        this.giveItem(InventoryItem.FAIRY_OCARINA, InventorySlots.OCARINA);
      }
    }
  }

  get hookshot(): Hookshot {
    if (this.hasItem(InventoryItem.LONGSHOT)) {
      return Hookshot.LONGSHOT;
    }
    if (this.hasItem(InventoryItem.HOOKSHOT)) {
      return Hookshot.LONGSHOT;
    }
    return Hookshot.NONE;
  }
  set hookshot(item: Hookshot) {
    if (item == this.hookshot) {
      return;
    }

    if (item == Hookshot.NONE) {
      this.removeItem(InventoryItem.HOOKSHOT);
      this.removeItem(InventoryItem.LONGSHOT);
    }

    if (item == Hookshot.LONGSHOT) {
      let slot: number = this.getSlotForItem(InventoryItem.HOOKSHOT);
      if (slot > -1) {
        this.setItemInSlot(InventoryItem.LONGSHOT, slot);
      } else {
        this.giveItem(InventoryItem.LONGSHOT, InventorySlots.HOOKSHOT);
      }
    }

    if (item == Hookshot.HOOKSHOT) {
      let slot: number = this.getSlotForItem(InventoryItem.LONGSHOT);
      if (slot > -1) {
        this.setItemInSlot(InventoryItem.HOOKSHOT, slot);
      } else {
        this.giveItem(InventoryItem.HOOKSHOT, InventorySlots.HOOKSHOT);
      }
    }
  }

  get boomerang(): boolean {
    return this.hasItem(InventoryItem.BOOMERANG);
  }
  set boomerang(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.BOOMERANG, InventorySlots.BOOMERANG);
    } else {
      this.removeItem(InventoryItem.BOOMERANG);
    }
  }

  get lensOfTruth(): boolean {
    return this.hasItem(InventoryItem.LENS_OF_TRUTH);
  }
  set lensOfTruth(bool: boolean) {
    if (bool) {
      this.giveItem(InventoryItem.LENS_OF_TRUTH, InventorySlots.LENS_OF_TRUTH);
    } else {
      this.removeItem(InventoryItem.LENS_OF_TRUTH);
    }
  }

  get megatonHammer(): boolean {
    return this.hasItem(InventoryItem.MEGATON_HAMMER);
  }
  set megatonHammer(bool: boolean) {
    if (bool) {
      this.giveItem(
        InventoryItem.MEGATON_HAMMER,
        InventorySlots.MEGATON_HAMMER
      );
    } else {
      this.removeItem(InventoryItem.MEGATON_HAMMER);
    }
  }

  hasBottle(): boolean {
    for (let i = 0; i <= InventorySlots.CHILD_TRADE_ITEM; i++) {
      let item: InventoryItem = this.getItemInSlot(i);
      if (
        item >= InventoryItem.EMPTY_BOTTLE &&
        item <= InventoryItem.BOTTLED_POE
      ) {
        return true;
      }
    }
    return false;
  }
  getBottleCount(): number {
    let bottles = 0;
    for (let i = 0; i <= InventorySlots.CHILD_TRADE_ITEM; i++) {
      let item: InventoryItem = this.getItemInSlot(i);
      if (
        item >= InventoryItem.EMPTY_BOTTLE &&
        item <= InventoryItem.BOTTLED_POE
      ) {
        bottles++;
      }
    }
    return bottles;
  }
  getBottledItems(): InventoryItem[] {
    let bottles: InventoryItem[] = new Array();
    for (let i = 0; i <= InventorySlots.CHILD_TRADE_ITEM; i++) {
      let item: InventoryItem = this.getItemInSlot(i);
      if (
        item >= InventoryItem.EMPTY_BOTTLE &&
        item <= InventoryItem.BOTTLED_POE
      ) {
        bottles.push(item);
      }
    }
    return bottles;
  }

  get childTradeItem(): InventoryItem {
    for (
      let i = InventoryItem.MASK_OF_TRUTH;
      i >= InventoryItem.ZELDAS_LETTER;
      i--
    ) {
      if (this.hasItem(i)) {
        return i;
      }
    }

    if (this.hasItem(InventoryItem.SOLD_OUT)) {
      // More complex logic is required here to grab the last mask the child had
    }

    return InventoryItem.NONE;
  }
  set childTradeItem(item: InventoryItem) {
    // More complex logic is required here because of flags
  }

  get adultTradeItem(): InventoryItem {
    for (
      let i = InventoryItem.CLAIM_CHECK;
      i >= InventoryItem.POCKET_EGG;
      i--
    ) {
      if (i == InventoryItem.SOLD_OUT) {
        continue;
      }

      if (this.hasItem(i)) {
        return i;
      }
    }

    return InventoryItem.NONE;
  }
  set adultTradeItem(item: InventoryItem) {
    // More complex logic is required here because of flags
  }

  isChildTradeFinished(): boolean {
    // This is going to require more complex flag checks
    return true;
  }
  isAdultTradeFinished(): boolean {
    // This should be done with flags also
    return true;
  }

  getItemInSlot(slotId: number): InventoryItem {
    if (slotId < 0 || slotId > 23) {
      return InventoryItem.NONE;
    }

    let itemId: number = this.emulator.rdramRead8(this.inventory_addr + slotId);
    return itemId as InventoryItem;
  }

  getSlotForItem(item: InventoryItem): number {
    for (let i = 0; i <= InventorySlots.CHILD_TRADE_ITEM; i++) {
      if (this.getItemInSlot(i) == item) {
        return i;
      }
    }

    return -1;
  }

  getSlotsForItem(item: InventoryItem): number[] {
    let slots: number[] = new Array();

    for (let i = 0; i <= InventorySlots.CHILD_TRADE_ITEM; i++) {
      if (this.getItemInSlot(i) == item) {
        slots.push(i);
      }
    }

    return slots;
  }

  hasItem(item: InventoryItem): boolean {
    return this.getSlotForItem(item) != -1;
  }

  getAmmoForItem(item: InventoryItem): number {
    if (!this.hasAmmo(item)) {
      return 0;
    }

    let ammo = 0;
    let slots: number[] = this.getSlotsForItem(item);

    for (let i = 0; i < slots.length; i++) {
      ammo += this.getAmmoForSlot(slots[i]);
    }

    return ammo;
  }

  hasAmmo(item: InventoryItem): boolean {
    switch (item) {
      case InventoryItem.DEKU_STICK:
      case InventoryItem.DEKU_NUT:
      case InventoryItem.FAIRY_SLINGSHOT:
      case InventoryItem.FAIRY_BOW:
      case InventoryItem.BOMB:
      case InventoryItem.BOMBCHU:
      case InventoryItem.MAGIC_BEAN:
        return true;
    }

    return false;
  }

  getAmmoForSlot(slotId: number): number {
    if (slotId < 0 || slotId > 0xf) {
      return 0;
    }

    return this.emulator.rdramRead8(this.inventory_ammo_addr + slotId);
  }

  setAmmoInSlot(slot: number, amount: number): void {
    if (slot < 0 || slot >= 0xf) {
      return;
    }

    this.emulator.rdramWrite8(this.inventory_ammo_addr + slot, amount as UInt8);
  }

  setItemInSlot(item: InventoryItem, slot: number): void {
    if (slot < 0 || slot > InventorySlots.CHILD_TRADE_ITEM) {
      return;
    }

    this.emulator.rdramWrite8(this.inventory_addr, item.valueOf());
  }

  giveItem(item: InventoryItem, desiredSlot: InventorySlots) {
    if (
      this.getItemInSlot(desiredSlot) == InventoryItem.NONE ||
      this.getItemInSlot(desiredSlot) == item
    ) {
      this.setItemInSlot(item, desiredSlot);
    } else {
      this.setItemInSlot(item, this.getEmptySlots()[0]);
    }
  }

  removeItem(item: InventoryItem): void {
    let slots = this.getSlotsForItem(item);
    for (let i = 0; i < slots.length; i++) {
      this.setItemInSlot(InventoryItem.NONE, i);
    }
  }

  getEmptySlots(): number[] {
    let slots: number[] = new Array();

    for (let i = 0; i <= InventorySlots.CHILD_TRADE_ITEM; i++) {
      if (this.getItemInSlot(i) == InventoryItem.NONE) {
        slots.push(i);
      }
    }

    return slots;
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class QuestStatus implements IQuestStatus {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private questFlags: FlagManager;

  private skulltulaAddr: number = this.instance + 0x00d0;
  private questFlagsAddr: number = this.instance + 0x00a4;

  constructor(emu: IMemory) {
    this.emulator = emu;
    this.questFlags = new FlagManager(emu, this.questFlagsAddr);
  }

  private gerudoMembershipCardFlag = new Flag(1, 1);
  get gerudoMembershipCard(): boolean {
    return this.questFlags.isFlagSet(this.gerudoMembershipCardFlag);
  }
  set gerudoMembershipCard(bool: boolean) {
    this.questFlags.setFlag(this.gerudoMembershipCardFlag, bool);
  }

  private stoneOfAgonyFlag = new Flag(1, 2);
  get stoneOfAgony(): boolean {
    return this.questFlags.isFlagSet(this.stoneOfAgonyFlag);
  }
  set stoneOfAgony(bool: boolean) {
    this.questFlags.setFlag(this.stoneOfAgonyFlag, bool);
  }

  private displayGoldSkulltulasFlag = new Flag(1, 7);
  get displayGoldSkulltulas(): boolean {
    return this.questFlags.isFlagSet(this.displayGoldSkulltulasFlag);
  }
  set displayGoldSkulltulas(bool: boolean) {
    this.questFlags.setFlag(this.displayGoldSkulltulasFlag, bool);
  }

  get goldSkulltulas(): number {
    return this.emulator.rdramRead16(this.skulltulaAddr);
  }
  set goldSkulltulas(count: number) {
    this.emulator.rdramWrite16(this.skulltulaAddr, count);
  }

  get heartPieces(): number {
    return this.emulator.rdramRead8(this.questFlagsAddr + 3);
  }
  set heartPieces(count: number) {
    let pieces: number = count % 4;
    this.emulator.rdramWrite8(this.questFlagsAddr + 3, pieces);
  }

  private zeldaasLullabyFlag = new Flag(2, 3);
  get zeldasLullaby(): boolean {
    return this.questFlags.isFlagSet(this.zeldaasLullabyFlag);
  }
  set zeldasLullaby(bool: boolean) {
    this.questFlags.setFlag(this.zeldaasLullabyFlag, bool);
  }

  private eponasSongFlag = new Flag(2, 2);
  get eponasSong(): boolean {
    return this.questFlags.isFlagSet(this.eponasSongFlag);
  }
  set eponasSong(bool: boolean) {
    this.questFlags.setFlag(this.eponasSongFlag, bool);
  }

  private sariasSongFlag = new Flag(2, 1);
  get sariasSong(): boolean {
    return this.questFlags.isFlagSet(this.sariasSongFlag);
  }
  set sariasSong(bool: boolean) {
    this.questFlags.setFlag(this.sariasSongFlag, bool);
  }

  private sunsSongFlag = new Flag(2, 0);
  get sunsSong(): boolean {
    return this.questFlags.isFlagSet(this.sunsSongFlag);
  }
  set sunsSong(bool: boolean) {
    this.questFlags.setFlag(this.sunsSongFlag, bool);
  }

  private songOfTimeFlag = new Flag(1, 7);
  get songOfTime(): boolean {
    return this.questFlags.isFlagSet(this.songOfTimeFlag);
  }
  set songOfTime(bool: boolean) {
    this.questFlags.setFlag(this.songOfTimeFlag, bool);
  }

  private songOfStormsFlag = new Flag(1, 6);
  get songOfStorms(): boolean {
    return this.questFlags.isFlagSet(this.songOfStormsFlag);
  }
  set songOfStorms(bool: boolean) {
    this.questFlags.setFlag(this.songOfStormsFlag, bool);
  }

  private preludeOfLightFlag = new Flag(2, 4);
  get preludeOfLight(): boolean {
    return this.questFlags.isFlagSet(this.preludeOfLightFlag);
  }
  set preludeOfLight(bool: boolean) {
    this.questFlags.setFlag(this.preludeOfLightFlag, bool);
  }

  private minuetOfForestFlag = new Flag(3, 1);
  get minuetOfForest(): boolean {
    return this.questFlags.isFlagSet(this.minuetOfForestFlag);
  }
  set minuetOfForest(bool: boolean) {
    this.questFlags.setFlag(this.minuetOfForestFlag, bool);
  }

  private boleroOfFireFlag = new Flag(3, 0);
  get boleroOfFire(): boolean {
    return this.questFlags.isFlagSet(this.boleroOfFireFlag);
  }
  set boleroOfFire(bool: boolean) {
    this.questFlags.setFlag(this.boleroOfFireFlag, bool);
  }

  private serenadeOfWaterFlag = new Flag(2, 7);
  get serenadeOfWater(): boolean {
    return this.questFlags.isFlagSet(this.serenadeOfWaterFlag);
  }
  set serenadeOfWater(bool: boolean) {
    this.questFlags.setFlag(this.serenadeOfWaterFlag, bool);
  }

  private nocturneOfShadowFlag = new Flag(2, 5);
  get nocturneOfShadow(): boolean {
    return this.questFlags.isFlagSet(this.nocturneOfShadowFlag);
  }
  set nocturneOfShadow(bool: boolean) {
    this.questFlags.setFlag(this.nocturneOfShadowFlag, bool);
  }

  private requiemOfSpiritFlag = new Flag(2, 6);
  get requiemOfSpirit(): boolean {
    return this.questFlags.isFlagSet(this.requiemOfSpiritFlag);
  }
  set requiemOfSpirit(bool: boolean) {
    this.questFlags.setFlag(this.requiemOfSpiritFlag, bool);
  }

  private lightMedallionFlag = new Flag(3, 2);
  get lightMedallion(): boolean {
    return this.questFlags.isFlagSet(this.lightMedallionFlag);
  }
  set lightMedallion(bool: boolean) {
    this.questFlags.setFlag(this.lightMedallionFlag, bool);
  }

  private forestMedallionFlag = new Flag(3, 7);
  get forestMedallion(): boolean {
    return this.questFlags.isFlagSet(this.forestMedallionFlag);
  }
  set forestMedallion(bool: boolean) {
    this.questFlags.setFlag(this.forestMedallionFlag, bool);
  }

  private fireMedallionFlag = new Flag(3, 6);
  get fireMedallion(): boolean {
    return this.questFlags.isFlagSet(this.fireMedallionFlag);
  }
  set fireMedallion(bool: boolean) {
    this.questFlags.setFlag(this.fireMedallionFlag, bool);
  }

  private waterMedallionFlag = new Flag(3, 5);
  get waterMedallion(): boolean {
    return this.questFlags.isFlagSet(this.waterMedallionFlag);
  }
  set waterMedallion(bool: boolean) {
    this.questFlags.setFlag(this.waterMedallionFlag, bool);
  }

  private shadowMedallionFlag = new Flag(3, 3);
  get shadowMedallion(): boolean {
    return this.questFlags.isFlagSet(this.shadowMedallionFlag);
  }
  set shadowMedallion(bool: boolean) {
    this.questFlags.setFlag(this.shadowMedallionFlag, bool);
  }

  private spiritMedallionFlag = new Flag(3, 4);
  get spiritMedallion(): boolean {
    return this.questFlags.isFlagSet(this.spiritMedallionFlag);
  }
  set spiritMedallion(bool: boolean) {
    this.questFlags.setFlag(this.spiritMedallionFlag, bool);
  }

  private kokiriEmeraldFlag = new Flag(1, 5);
  get kokiriEmerald(): boolean {
    return this.questFlags.isFlagSet(this.kokiriEmeraldFlag);
  }
  set kokiriEmerald(bool: boolean) {
    this.questFlags.setFlag(this.kokiriEmeraldFlag, bool);
  }

  private goronRubyFlag = new Flag(1, 4);
  get goronRuby(): boolean {
    return this.questFlags.isFlagSet(this.goronRubyFlag);
  }
  set goronRuby(bool: boolean) {
    this.questFlags.setFlag(this.goronRubyFlag, bool);
  }

  private zoraSapphireFlag = new Flag(1, 3);
  get zoraSapphire(): boolean {
    return this.questFlags.isFlagSet(this.zoraSapphireFlag);
  }
  set zoraSapphire(bool: boolean) {
    this.questFlags.setFlag(this.zoraSapphireFlag, bool);
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class Link implements ILink {
  private emulator: IMemory;
  private instance = 0x1daa30;
  private state_addr: number = this.instance + 0x066c;
  private tunic_addr: number = this.instance + 0x013c;
  private shield_addr: number = this.instance + 0x013e;
  private boots_addr: number = this.instance + 0x013f;
  private mask_addr: number = this.instance + 0x014f;

  constructor(emu: IMemory) {
    this.emulator = emu;
  }

  exists(): boolean {
    return this.emulator.rdramRead32(this.instance) === 0x2ff;
  }

  get state(): LinkState {
    switch (this.emulator.rdramRead16(this.state_addr)) {
      case 0:
        return LinkState.STANDING;
      case 0x20:
        return LinkState.BUSY;
      case 0x30:
        return LinkState.OCARINA;
    }
    return LinkState.UNKNOWN;
  }

  get tunic(): Tunic {
    return this.emulator.rdramRead8(this.tunic_addr);
  }

  set tunic(tunic: Tunic) {
    this.emulator.rdramWrite8(this.tunic_addr, tunic);
  }

  get shield(): Shield {
    return this.emulator.rdramRead8(this.shield_addr);
  }

  set shield(shield: Shield) {
    this.emulator.rdramWrite8(this.shield_addr, shield);
  }

  get boots(): Boots {
    return this.emulator.rdramRead8(this.boots_addr);
  }

  set boots(boots: Boots) {
    this.emulator.rdramWrite8(this.boots_addr, boots);
  }

  get mask(): Mask {
    return this.emulator.rdramRead8(this.mask_addr);
  }

  set mask(mask: Mask) {
    this.emulator.rdramWrite8(this.mask_addr, mask);
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class SaveContext implements ISaveContext {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private entrance_index_addr: number = this.instance + 0x0000;
  private cutscene_number_addr: number = this.instance + 0x000a;
  private world_time_addr: number = this.instance + 0x000c;
  private world_night_addr: number = this.instance + 0x0010;
  private zeldaz_addr: number = this.instance + 0x001c;
  private death_addr: number = this.instance + 0x0022;
  private player_name_addr: number = this.instance + 0x0024;
  private dd_flag_addr: number = this.instance + 0x002c;
  private heart_container_addr: number = this.instance + 0x002e;
  private health_addr: number = this.instance + 0x0030;
  private magic_meter_size_addr: number = this.instance + 0x0032;
  private magic_current_addr: number = this.instance + 0x0033;
  private magic_limit_addr: number = this.instance + 0x13f4;
  private magic_flag_1_addr: number = this.instance + 0x003a;
  private magic_flag_2_addr: number = this.instance + 0x003c;
  private rupees_address: number = this.instance + 0x0034;
  private navi_timer_addr: number = this.instance + 0x0038;
  private checksum_addr: number = this.instance + 0x1352;
  private zs: ZeldaString = new ZeldaString();
  // Further abstractions
  swords: SwordsEquipment;
  shields: ShieldsEquipment;
  tunics: TunicsEquipment;
  boots: BootsEquipment;
  inventory: Inventory;
  questStatus: IQuestStatus;

  constructor(emu: IMemory) {
    this.emulator = emu;
    this.swords = new SwordsEquipment(0, emu);
    this.shields = new ShieldsEquipment(0, emu);
    this.tunics = new TunicsEquipment(0, emu);
    this.boots = new BootsEquipment(0, emu);
    this.inventory = new Inventory(emu);
    this.questStatus = new QuestStatus(emu);
  }

  // https://wiki.cloudmodding.com/oot/Entrance_Table
  // https://wiki.cloudmodding.com/oot/Entrance_Table_(Data)
  get entrance_index(): number {
    return this.emulator.rdramRead32(this.entrance_index_addr);
  }

  set entrance_index(index: number) {
    this.emulator.rdramWrite32(this.entrance_index_addr, index);
  }

  get cutscene_number(): number {
    return this.emulator.rdramRead16(this.cutscene_number_addr);
  }

  set cutscene_number(index: number) {
    this.emulator.rdramWrite16(this.cutscene_number_addr, index);
  }

  get world_time(): number {
    return this.emulator.rdramRead16(this.world_time_addr);
  }

  set world_time(time: number) {
    this.emulator.rdramWrite16(this.world_time_addr, time);
  }

  get world_night_flag(): boolean {
    return this.emulator.rdramRead32(this.world_night_addr) === 1;
  }

  set world_night_flag(bool: boolean) {
    this.emulator.rdramWrite32(
      this.world_night_addr,
      (function(bool: boolean) {
        return bool ? 1 : 0;
      })(bool)
    );
  }

  get zeldaz_string(): string {
    return this.emulator.rdramReadBuffer(this.zeldaz_addr, 6).toString('ascii');
  }

  get death_counter(): number {
    return this.emulator.rdramRead16(this.death_addr);
  }

  set death_counter(deaths: number) {
    this.emulator.rdramWrite16(this.death_addr, deaths);
  }

  get player_name(): string {
    return this.zs.decode(
      this.emulator.rdramReadBuffer(this.player_name_addr, 8)
    );
  }

  // Will always be false normally.
  get dd_flag(): boolean {
    return this.emulator.rdramRead16(this.dd_flag_addr) === 1;
  }

  set dd_flag(bool: boolean) {
    this.emulator.rdramWrite16(
      this.dd_flag_addr,
      (function(bool: boolean) {
        return bool ? 1 : 0;
      })(bool)
    );
  }

  get heart_containers(): number {
    return this.emulator.rdramRead16(this.heart_container_addr) / 0x10;
  }

  set heart_containers(num: number) {
    this.emulator.rdramWrite16(this.heart_container_addr, num * 0x10);
  }

  get health(): number {
    return this.emulator.rdramRead16(this.health_addr) / 0x10;
  }

  set health(hearts: number) {
    this.emulator.rdramWrite16(this.health_addr, hearts * 0x10);
  }

  get magic_meter_size(): Magic {
    return this.emulator.rdramRead8(this.magic_meter_size_addr);
  }

  // Several things need to be set in order for magic to function properly.
  set magic_meter_size(size: Magic) {
    this.emulator.rdramWrite8(this.magic_meter_size_addr, size);
    switch (size) {
      case Magic.NONE: {
        this.emulator.rdramWrite8(this.magic_limit_addr, MagicQuantities.NONE);
        this.emulator.rdramWrite8(this.magic_flag_1_addr, 0);
        this.emulator.rdramWrite8(this.magic_flag_2_addr, 0);
        this.magic_current = MagicQuantities.NONE;
        break;
      }
      case Magic.NORMAL: {
        this.emulator.rdramWrite8(
          this.magic_limit_addr,
          MagicQuantities.NORMAL
        );
        this.emulator.rdramWrite8(this.magic_flag_1_addr, 1);
        this.emulator.rdramWrite8(this.magic_flag_2_addr, 0);
        this.magic_current = MagicQuantities.NORMAL;
        break;
      }
      case Magic.EXTENDED: {
        this.emulator.rdramWrite8(
          this.magic_limit_addr,
          MagicQuantities.EXTENDED
        );
        this.emulator.rdramWrite8(this.magic_flag_1_addr, 1);
        this.emulator.rdramWrite8(this.magic_flag_2_addr, 1);
        this.magic_current = MagicQuantities.EXTENDED;
        break;
      }
    }
  }

  get magic_current(): number {
    return this.emulator.rdramRead8(this.magic_current_addr);
  }

  // Failsafe to keep people from setting the magic amount over the cap.
  set magic_current(amount: number) {
    this.emulator.rdramWrite8(
      this.magic_current,
      (function(amt: number) {
        return amt > MagicQuantities.EXTENDED ? MagicQuantities.EXTENDED : amt;
      })(amount)
    );
  }

  get rupee_count(): number {
    return this.emulator.rdramRead16(this.rupees_address);
  }

  set rupee_count(dosh: number) {
    this.emulator.rdramWrite16(this.rupees_address, dosh);
  }

  get navi_timer(): number {
    return this.emulator.rdramRead16(this.navi_timer_addr);
  }

  set navi_timer(time: number) {
    this.emulator.rdramWrite16(this.navi_timer_addr, time);
  }

  get checksum() {
    return this.emulator.rdramRead16(this.checksum_addr);
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class GlobalContext {
  private emulator: IMemory;
  private current_scene_addr = global.ModLoader.global_context + 0x0000a4;
  private switch_flags_addr = global.ModLoader.global_context + 0x001d28;
  private temp_switch_flags_addr = global.ModLoader.global_context + 0x001d2c;
  private chest_flags_addr = global.ModLoader.global_context + 0x001d38;
  private room_clear_flags_addr = global.ModLoader.global_context + 0x001d3c;
  private current_room_addr = global.ModLoader.global_context + 0x011cbc;

  constructor(emulator: IMemory) {
    this.emulator = emulator;
  }

  get scene(): number {
    return this.emulator.rdramRead16(this.current_scene_addr);
  }

  get room(): number {
    return this.emulator.rdramRead8(this.current_room_addr);
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const jsonObj: any = Object.assign({}, this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            jsonObj[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export class OotHelper {
  private save: ISaveContext;

  constructor(save: ISaveContext) {
    this.save = save;
  }

  isTitleScreen() {
    return this.save.checksum === 0;
  }

  toJSON() {
    const jsonObj: any = {};
    jsonObj['isTitleScreen'] = this.isTitleScreen();
    return jsonObj;
  }
}

export class OcarinaofTime implements ICore, IOOTCore {
  header = 'THE LEGEND OF ZELDA';
  ModLoader!: IModLoaderAPI;
  link!: ILink;
  save!: ISaveContext;
  global!: GlobalContext;
  helper!: OotHelper;
  eventTicks: Map<string, Function> = new Map<string, Function>();

  preinit(): void {
    global.ModLoader['save_context'] = 0x11a5d0;
    global.ModLoader['global_context_pointer'] = 0x11f248;
    global.ModLoader['global_context'] = 0;
  }

  init(): void {}

  postinit(): void {
    let gameshark = new GameShark(
      this.ModLoader.logger,
      this.ModLoader.emulator
    );
    gameshark.read(__dirname + '/OcarinaofTime.payload');
    this.ModLoader.logger.info('Checking for core ASM injection...');
    if (this.ModLoader.emulator.rdramRead32(0x089710) === 0x8fa80080) {
      this.ModLoader.logger.info('confirmed.');
    } else {
      this.ModLoader.logger.error('injection failed?');
    }
    global.ModLoader.global_context = this.ModLoader.emulator.dereferencePointer(
      global.ModLoader.global_context_pointer
    );
    this.global = new GlobalContext(this.ModLoader.emulator);
    this.link = new Link(this.ModLoader.emulator);
    this.save = new SaveContext(this.ModLoader.emulator);
    this.helper = new OotHelper(this.save);
    registerEndpoint('/Oot_SaveContext', (req: any, res: any) => {
      res.send(this.save);
    });
    registerEndpoint('/Oot_Link', (req: any, res: any) => {
      res.send(this.link);
    });
    registerEndpoint('/Oot_GlobalContext', (req: any, res: any) => {
      res.send(this.global);
    });
    registerEndpoint('/Oot_Helper', (req: any, res: any) => {
      res.send(this.helper);
    });
  }

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }
}
