import IMemory from 'modloader64_api/IMemory';
import {
    InventoryItem,
    Ocarina,
    Hookshot,
    AmmoUpgrade,
    IInventory,
    Wallet,
    Strength,
    ZoraScale,
    InventorySlots,
} from 'modloader64_api/OOT/OOTAPI';
import { FlagManager } from 'modloader64_api/FlagManager';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import { ILogger } from 'modloader64_api/IModLoaderAPI';

export class Inventory extends JSONTemplate implements IInventory {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private inventory_addr: number = this.instance + 0x0074;
  private inventory_ammo_addr: number = this.instance + 0x008c;
  private inventory_upgrades_addr: number = this.instance + 0x00a0;
  private log: ILogger;
  jsonFields: string[] = [
      'dekuSticks',
      'dekuNuts',
      'bombs',
      'bombchus',
      'magicBeans',
      'fairySlingshot',
      'fairyBow',
      'fireArrows',
      'iceArrows',
      'lightArrows',
      'dinsFire',
      'faroresWind',
      'nayrusLove',
      'ocarina',
      'hookshot',
      'boomerang',
      'lensOfTruth',
      'megatonHammer',
      'bottle_1',
      'bottle_2',
      'bottle_3',
      'bottle_4',
      'childTradeItem',
      'adultTradeItem',
      'wallet',
      'quiver',
      'bulletBag',
      'bombBag',
      'dekuNutsCapacity',
      'dekuSticksCapacity',
      'swimming',
      'strength',
  ];

  constructor(emu: IMemory, log: ILogger) {
      super();
      this.emulator = emu;
      this.log = log;
  }

  set strength(bb: Strength) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      switch (bb) {
      case Strength.NONE:
          buf[0x0] = 0x00;
          buf[0x1] = 0x00;
          break;
      case Strength.GORON_BRACELET:
          buf[0x0] = 0x00;
          buf[0x1] = 0x01;
          break;
      case Strength.SILVER_GAUNTLETS:
          buf[0x0] = 0x01;
          buf[0x1] = 0x00;
          break;
      case Strength.GOLDEN_GAUNTLETS:
          buf[0x0] = 0x01;
          buf[0x1] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
  }

  get strength(): Strength {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      let str = buf.slice(0, 2).toString('hex');
      switch (str) {
      case '0000':
          return Strength.NONE;
      case '0001':
          return Strength.GORON_BRACELET;
      case '0100':
          return Strength.SILVER_GAUNTLETS;
      case '0101':
          return Strength.GOLDEN_GAUNTLETS;
      }
      return Strength.NONE;
  }

  set swimming(bb: ZoraScale) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      switch (bb) {
      case ZoraScale.NONE:
          buf[0x5] = 0x00;
          buf[0x6] = 0x00;
          break;
      case ZoraScale.SILVER:
          buf[0x5] = 0x00;
          buf[0x6] = 0x01;
          break;
      case ZoraScale.GOLDEN:
          buf[0x5] = 0x01;
          buf[0x6] = 0x00;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
  }

  get swimming(): ZoraScale {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      let str = buf.slice(5, 7).toString('hex');
      switch (str) {
      case '0000':
          return ZoraScale.NONE;
      case '0001':
          return ZoraScale.SILVER;
      case '0100':
          return ZoraScale.GOLDEN;
      }
      return ZoraScale.NONE;
  }

  set dekuSticksCapacity(bb: AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      switch (bb) {
      case AmmoUpgrade.NONE:
          buf[0x5] = 0x00;
          buf[0x6] = 0x00;
          break;
      case AmmoUpgrade.BASE:
          buf[0x5] = 0x00;
          buf[0x6] = 0x01;
          break;
      case AmmoUpgrade.UPGRADED:
          buf[0x5] = 0x01;
          buf[0x6] = 0x00;
          break;
      case AmmoUpgrade.MAX:
          buf[0x5] = 0x01;
          buf[0x6] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x1, buf);
  }

  get dekuSticksCapacity(): AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      let str = buf.slice(5, 7).toString('hex');
      switch (str) {
      case '0000':
          return AmmoUpgrade.NONE;
      case '0001':
          return AmmoUpgrade.BASE;
      case '0100':
          return AmmoUpgrade.UPGRADED;
      case '0101':
          return AmmoUpgrade.MAX;
      }
      return AmmoUpgrade.NONE;
  }

  set dekuNutsCapacity(bb: AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      switch (bb) {
      case AmmoUpgrade.NONE:
          buf[0x2] = 0x00;
          buf[0x3] = 0x00;
          break;
      case AmmoUpgrade.BASE:
          buf[0x2] = 0x00;
          buf[0x3] = 0x01;
          break;
      case AmmoUpgrade.UPGRADED:
          buf[0x2] = 0x01;
          buf[0x3] = 0x00;
          break;
      case AmmoUpgrade.MAX:
          buf[0x2] = 0x01;
          buf[0x3] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x1, buf);
  }

  get dekuNutsCapacity(): AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      let str = buf.slice(2, 4).toString('hex');
      switch (str) {
      case '0000':
          return AmmoUpgrade.NONE;
      case '0001':
          return AmmoUpgrade.BASE;
      case '0100':
          return AmmoUpgrade.UPGRADED;
      case '0101':
          return AmmoUpgrade.MAX;
      }
      return AmmoUpgrade.NONE;
  }

  set bombBag(bb: AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      switch (bb) {
      case AmmoUpgrade.NONE:
          buf[0x3] = 0x00;
          buf[0x4] = 0x00;
          break;
      case AmmoUpgrade.BASE:
          buf[0x3] = 0x00;
          buf[0x4] = 0x01;
          break;
      case AmmoUpgrade.UPGRADED:
          buf[0x3] = 0x01;
          buf[0x4] = 0x00;
          break;
      case AmmoUpgrade.MAX:
          buf[0x3] = 0x01;
          buf[0x4] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
  }

  get bombBag(): AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      let str = buf.slice(3, 5).toString('hex');
      switch (str) {
      case '0000':
          return AmmoUpgrade.NONE;
      case '0001':
          return AmmoUpgrade.BASE;
      case '0100':
          return AmmoUpgrade.UPGRADED;
      case '0101':
          return AmmoUpgrade.MAX;
      }
      return AmmoUpgrade.NONE;
  }

  get bulletBag(): AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      let str = buf.slice(0, 2).toString('hex');
      switch (str) {
      case '0000':
          return AmmoUpgrade.NONE;
      case '0001':
          return AmmoUpgrade.BASE;
      case '0100':
          return AmmoUpgrade.UPGRADED;
      case '0101':
          return AmmoUpgrade.MAX;
      }
      return AmmoUpgrade.NONE;
  }

  set bulletBag(bb: AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      switch (bb) {
      case AmmoUpgrade.NONE:
          buf[0x0] = 0x00;
          buf[0x1] = 0x00;
          break;
      case AmmoUpgrade.BASE:
          buf[0x0] = 0x00;
          buf[0x1] = 0x01;
          break;
      case AmmoUpgrade.UPGRADED:
          buf[0x0] = 0x01;
          buf[0x1] = 0x00;
          break;
      case AmmoUpgrade.MAX:
          buf[0x0] = 0x01;
          buf[0x1] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
  }

  get quiver(): AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      let str = buf.slice(6, 8).toString('hex');
      switch (str) {
      case '0000':
          return AmmoUpgrade.NONE;
      case '0001':
          return AmmoUpgrade.BASE;
      case '0100':
          return AmmoUpgrade.UPGRADED;
      case '0101':
          return AmmoUpgrade.MAX;
      }
      return AmmoUpgrade.NONE;
  }

  set quiver(q: AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      switch (q) {
      case AmmoUpgrade.NONE:
          buf[0x6] = 0x00;
          buf[0x7] = 0x00;
          break;
      case AmmoUpgrade.BASE:
          buf[0x6] = 0x00;
          buf[0x7] = 0x01;
          break;
      case AmmoUpgrade.UPGRADED:
          buf[0x6] = 0x01;
          buf[0x7] = 0x00;
          break;
      case AmmoUpgrade.MAX:
          buf[0x6] = 0x01;
          buf[0x7] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
  }

  get wallet(): Wallet {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      let str = buf.slice(2, 4).toString('hex');
      switch (str) {
      case '0000':
          return Wallet.CHILD;
      case '0001':
          return Wallet.ADULT;
      case '0100':
          return Wallet.GIANT;
      case '0101':
          return Wallet.TYCOON;
      }
      return Wallet.CHILD;
  }

  set wallet(w: Wallet) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      switch (w) {
      case Wallet.CHILD:
          buf[0x2] = 0x00;
          buf[0x3] = 0x00;
          break;
      case Wallet.ADULT:
          buf[0x2] = 0x00;
          buf[0x3] = 0x01;
          break;
      case Wallet.GIANT:
          buf[0x2] = 0x10;
          buf[0x3] = 0x00;
          break;
      case Wallet.TYCOON:
          buf[0x2] = 0x01;
          buf[0x3] = 0x01;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
  }

  getMaxRupeeCount(): number{
      let addr: number = 0x800F8CEC;
      let capacities: Array<number> = [];
      for (let i = 0; i < 8; i+=2){
          capacities.push(this.emulator.rdramRead16(addr + i));
      }
      return capacities[this.wallet];
  }

  get dekuSticks(): boolean {
      let val = this.getItemInSlot(InventorySlots.DEKU_STICKS);
      return !(val === InventoryItem.NONE);
  }
  set dekuSticks(bool: boolean) {
      let value = bool ? InventoryItem.DEKU_STICK : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.DEKU_STICKS);
  }

  get dekuSticksCount(): number {
      return this.getAmmoForSlot(InventorySlots.DEKU_STICKS);
  }
  set dekuSticksCount(count: number) {
      this.setAmmoInSlot(InventorySlots.DEKU_STICKS, count);
  }

  get dekuNuts(): boolean {
      let val = this.getItemInSlot(InventorySlots.DEKU_NUTS);
      return !(val === InventoryItem.NONE);
  }
  set dekuNuts(bool: boolean) {
      let value = bool ? InventoryItem.DEKU_NUT : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.DEKU_NUTS);
  }

  get dekuNutsCount(): number {
      return this.getAmmoForSlot(InventorySlots.DEKU_NUTS);
  }
  set dekuNutsCount(count: number) {
      this.setAmmoInSlot(InventorySlots.DEKU_NUTS, count);
  }

  get bombs(): boolean {
      let val = this.getItemInSlot(InventorySlots.BOMBS);
      return !(val === InventoryItem.NONE);
  }
  set bombs(bool: boolean) {
      let value = bool ? InventoryItem.BOMB : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.BOMBS);
  }

  get bombsCount(): number {
      return this.getAmmoForSlot(InventorySlots.BOMBS);
  }
  set bombsCount(count: number) {
      this.setAmmoInSlot(InventorySlots.BOMBS, count);
  }

  get bombchus(): boolean {
      let val = this.getItemInSlot(InventorySlots.BOMBCHUS);
      return !(val === InventoryItem.NONE);
  }
  set bombchus(bool: boolean) {
      let value = bool ? InventoryItem.BOMBCHU : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.BOMBCHUS);
  }

  get bombchuCount(): number {
      return this.getAmmoForSlot(InventorySlots.BOMBCHUS);
  }
  set bombchuCount(count: number) {
      this.setAmmoInSlot(InventorySlots.BOMBCHUS, count);
  }

  get magicBeans(): boolean {
      let val = this.getItemInSlot(InventorySlots.MAGIC_BEANS);
      return !(val === InventoryItem.NONE);
  }
  set magicBeans(bool: boolean) {
      let value = bool ? InventoryItem.MAGIC_BEAN : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.MAGIC_BEANS);
  }

  get magicBeansCount(): number {
      return this.getAmmoForSlot(InventorySlots.MAGIC_BEANS);
  }
  set magicBeansCount(count: number) {
      this.setAmmoInSlot(InventorySlots.MAGIC_BEANS, count);
  }

  get fairySlingshot(): boolean {
      let val = this.getItemInSlot(InventorySlots.FAIRY_SLINGSHOT);
      return !(val === InventoryItem.NONE);
  }
  set fairySlingshot(bool: boolean) {
      let value = bool ? InventoryItem.FAIRY_SLINGSHOT : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.FAIRY_SLINGSHOT);
  }

  get dekuSeeds(): number {
      return this.getAmmoForSlot(InventorySlots.FAIRY_SLINGSHOT);
  }
  set dekuSeeds(count: number) {
      this.setAmmoInSlot(InventorySlots.FAIRY_SLINGSHOT, count);
  }

  get fairyBow(): boolean {
      let val = this.getItemInSlot(InventorySlots.FAIRY_BOW);
      return !(val === InventoryItem.NONE);
  }
  set fairyBow(bool: boolean) {
      let value = bool ? InventoryItem.FAIRY_BOW : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.FAIRY_BOW);
  }

  get arrows(): number {
      return this.getAmmoForSlot(InventorySlots.FAIRY_BOW);
  }
  set arrows(count: number) {
      this.setAmmoInSlot(InventorySlots.FAIRY_BOW, count);
  }

  get fireArrows(): boolean {
      let val = this.getItemInSlot(InventorySlots.FIRE_ARROWS);
      return !(val === InventoryItem.NONE);
  }
  set fireArrows(bool: boolean) {
      let value = bool ? InventoryItem.FIRE_ARROW : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.FIRE_ARROWS);
  }

  get iceArrows(): boolean {
      let val = this.getItemInSlot(InventorySlots.ICE_ARROWS);
      return !(val === InventoryItem.NONE);
  }
  set iceArrows(bool: boolean) {
      let value = bool ? InventoryItem.ICE_ARROW : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.ICE_ARROWS);
  }

  get lightArrows(): boolean {
      let val = this.getItemInSlot(InventorySlots.LIGHT_ARROWS);
      return !(val === InventoryItem.NONE);
  }
  set lightArrows(bool: boolean) {
      let value = bool ? InventoryItem.LIGHT_ARROW : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.LIGHT_ARROWS);
  }

  get dinsFire(): boolean {
      let val = this.getItemInSlot(InventorySlots.DINS_FIRE);
      return !(val === InventoryItem.NONE);
  }
  set dinsFire(bool: boolean) {
      let value = bool ? InventoryItem.DINS_FIRE : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.DINS_FIRE);
  }

  get faroresWind(): boolean {
      let val = this.getItemInSlot(InventorySlots.FARORES_WIND);
      return !(val === InventoryItem.NONE);
  }
  set faroresWind(bool: boolean) {
      let value = bool ? InventoryItem.FARORES_WIND : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.FARORES_WIND);
  }

  get nayrusLove(): boolean {
      let val = this.getItemInSlot(InventorySlots.NAYRUS_LOVE);
      return !(val === InventoryItem.NONE);
  }
  set nayrusLove(bool: boolean) {
      let value = bool ? InventoryItem.NAYRUS_LOVE : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.NAYRUS_LOVE);
  }
  get ocarina(): Ocarina {
      let val = this.getItemInSlot(InventorySlots.OCARINA);
      switch (val) {
      case InventoryItem.FAIRY_OCARINA:
          return Ocarina.FAIRY_OCARINA;
      case InventoryItem.OCARINA_OF_TIME:
          return Ocarina.OCARINA_OF_TIME;
      default:
          return Ocarina.NONE;
      }
  }
  set ocarina(item: Ocarina) {
      if (item === this.ocarina) return;

      switch (item) {
      case Ocarina.NONE:
          this.setItemInSlot(InventoryItem.NONE, InventorySlots.OCARINA);
          break;
      case Ocarina.FAIRY_OCARINA:
          this.setItemInSlot(InventoryItem.FAIRY_OCARINA, InventorySlots.OCARINA);
          break;
      case Ocarina.OCARINA_OF_TIME:
          this.setItemInSlot(
              InventoryItem.OCARINA_OF_TIME,
              InventorySlots.OCARINA
          );
          break;
      }
  }

  get hookshot(): Hookshot {
      let val = this.getItemInSlot(InventorySlots.HOOKSHOT);
      switch (val) {
      case InventoryItem.HOOKSHOT:
          return Hookshot.HOOKSHOT;
      case InventoryItem.LONGSHOT:
          return Hookshot.LONGSHOT;
      default:
          return Hookshot.NONE;
      }
  }
  set hookshot(item: Hookshot) {
      if (item === this.hookshot) return;

      switch (item) {
      case Hookshot.NONE:
          this.setItemInSlot(InventoryItem.NONE, InventorySlots.HOOKSHOT);
          break;
      case Hookshot.HOOKSHOT:
          this.setItemInSlot(InventoryItem.HOOKSHOT, InventorySlots.HOOKSHOT);
          break;
      case Hookshot.LONGSHOT:
          this.setItemInSlot(InventoryItem.LONGSHOT, InventorySlots.HOOKSHOT);
          break;
      }
  }

  get boomerang(): boolean {
      let val = this.getItemInSlot(InventorySlots.BOOMERANG);
      return !(val === InventoryItem.NONE);
  }
  set boomerang(bool: boolean) {
      let value = bool ? InventoryItem.BOOMERANG : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.BOOMERANG);
  }

  get lensOfTruth(): boolean {
      let val = this.getItemInSlot(InventorySlots.LENS_OF_TRUTH);
      return !(val === InventoryItem.NONE);
  }
  set lensOfTruth(bool: boolean) {
      let value = bool ? InventoryItem.LENS_OF_TRUTH : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.LENS_OF_TRUTH);
  }

  get megatonHammer(): boolean {
      let val = this.getItemInSlot(InventorySlots.MEGATON_HAMMER);
      return !(val === InventoryItem.NONE);
  }
  set megatonHammer(bool: boolean) {
      let value = bool ? InventoryItem.MEGATON_HAMMER : InventoryItem.NONE;
      this.setItemInSlot(value, InventorySlots.MEGATON_HAMMER);
  }

  get bottle_1(): InventoryItem {
      return this.getItemInSlot(InventorySlots.BOTTLE1);
  }
  set bottle_1(content: InventoryItem) {
      if (
          content < InventoryItem.EMPTY_BOTTLE ||
      content > InventoryItem.BOTTLED_POE
      ) {
          return;
      }
      this.setItemInSlot(content, InventorySlots.BOTTLE1);
  }
  get bottle_2(): InventoryItem {
      return this.getItemInSlot(InventorySlots.BOTTLE2);
  }
  set bottle_2(content: InventoryItem) {
      if (
          content < InventoryItem.EMPTY_BOTTLE ||
      content > InventoryItem.BOTTLED_POE
      ) {
          return;
      }
      this.setItemInSlot(content, InventorySlots.BOTTLE2);
  }
  get bottle_3(): InventoryItem {
      return this.getItemInSlot(InventorySlots.BOTTLE3);
  }
  set bottle_3(content: InventoryItem) {
      if (
          content < InventoryItem.EMPTY_BOTTLE ||
      content > InventoryItem.BOTTLED_POE
      ) {
          return;
      }
      this.setItemInSlot(content, InventorySlots.BOTTLE3);
  }
  get bottle_4(): InventoryItem {
      return this.getItemInSlot(InventorySlots.BOTTLE4);
  }
  set bottle_4(content: InventoryItem) {
      if (
          content < InventoryItem.EMPTY_BOTTLE ||
      content > InventoryItem.BOTTLED_POE
      ) {
          return;
      }
      this.setItemInSlot(content, InventorySlots.BOTTLE4);
  }

  hasBottle(): boolean {
      for (let i = InventorySlots.BOTTLE1; i <= InventorySlots.BOTTLE4; i++) {
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
      for (let i = InventorySlots.BOTTLE1; i <= InventorySlots.BOTTLE4; i++) {
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
      for (let i = InventorySlots.BOTTLE1; i <= InventorySlots.BOTTLE4; i++) {
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
      return this.getItemInSlot(InventorySlots.CHILD_TRADE_ITEM);
  }
  set childTradeItem(item: InventoryItem) {
    if (item < InventoryItem.WEIRD_EGG || item > InventoryItem.SOLD_OUT) return;
      this.setItemInSlot(item, InventorySlots.CHILD_TRADE_ITEM);
  }

  get adultTradeItem(): InventoryItem {
      return this.getItemInSlot(InventorySlots.ADULT_TRADE_ITEM);
  }
  set adultTradeItem(item: InventoryItem) {
      this.setItemInSlot(item, InventorySlots.ADULT_TRADE_ITEM);
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
      if (slotId < 0 || slotId > InventorySlots.CHILD_TRADE_ITEM) {
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
      if (!this.hasAmmo(item)) return 0;

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
      if (slotId < 0 || slotId > 0xf) return 0;
      return this.emulator.rdramRead8(this.inventory_ammo_addr + slotId);
  }
  setAmmoInSlot(slot: number, amount: number): void {
      if (slot < 0 || slot >= 0xf) return;
      this.emulator.rdramWrite8(this.inventory_ammo_addr + slot, amount);
  }

  setItemInSlot(item: InventoryItem, slot: number): void {
      if (slot < 0 || slot > InventorySlots.CHILD_TRADE_ITEM) {
          return;
      }
      this.emulator.rdramWrite8(this.inventory_addr + slot, item.valueOf());
  }
  giveItem(item: InventoryItem, desiredSlot: InventorySlots) {
      if (
          this.getItemInSlot(desiredSlot) == InventoryItem.NONE ||
      this.getItemInSlot(desiredSlot) == item
      ) {
          this.setItemInSlot(item, desiredSlot);
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
}
