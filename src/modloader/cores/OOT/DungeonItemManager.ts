import IMemory from 'modloader64_api/IMemory';
import { VANILLA_DUNGEON_ITEM_INDEXES } from 'modloader64_api/OOT/OOTAPI';
import { IDungeonItemManager } from 'modloader64_api/OOT/IDungeonItemManager';
import { IDungeonItemContainer } from 'modloader64_api/OOT/IDungeonItemContainer';

export class DungeonItemManager implements IDungeonItemManager {
  emulator: IMemory;
  DEKU_TREE: IDungeonItemContainer;
  DODONGOS_CAVERN: IDungeonItemContainer;
  JABJ_JABUS_BELLY: IDungeonItemContainer;
  FOREST_TEMPLE: IDungeonItemContainer;
  FIRE_TEMPLE: IDungeonItemContainer;
  WATER_TEMPLE: IDungeonItemContainer;
  SPIRIT_TEMPLE: IDungeonItemContainer;
  SHADOW_TEMPLE: IDungeonItemContainer;
  BOTTOM_OF_THE_WELL: IDungeonItemContainer;
  ICE_CAVERN: IDungeonItemContainer;
  GANONS_CASTLE: IDungeonItemContainer;

  constructor(emulator: IMemory) {
    this.emulator = emulator;
    this.DEKU_TREE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.DEKU_TREE
    );
    this.DODONGOS_CAVERN = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.DODONGOS_CAVERN
    );
    this.JABJ_JABUS_BELLY = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.JABJ_JABUS_BELLY
    );
    this.FOREST_TEMPLE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.FOREST_TEMPLE
    );
    this.FIRE_TEMPLE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.FIRE_TEMPLE
    );
    this.WATER_TEMPLE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.WATER_TEMPLE
    );
    this.SPIRIT_TEMPLE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.SPIRIT_TEMPLE
    );
    this.SHADOW_TEMPLE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.SHADOW_TEMPLE
    );
    this.BOTTOM_OF_THE_WELL = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.BOTTOM_OF_THE_WELL
    );
    this.ICE_CAVERN = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.ICE_CAVERN
    );
    this.GANONS_CASTLE = new DungeonItemContainer(
      this.emulator,
      VANILLA_DUNGEON_ITEM_INDEXES.GANONS_CASTLE
    );
  }
}

export class DungeonItemContainer implements IDungeonItemContainer {
  private addr: number = global.ModLoader.save_context + 0xa8;
  private emulator: IMemory;
  private index: number;

  constructor(emulator: IMemory, index: number) {
    this.emulator = emulator;
    this.index = index;
  }

  get bossKey(): boolean {
    return this.emulator.rdramReadBit8(this.addr + this.index, 7);
  }

  set bossKey(bool: boolean) {
    this.emulator.rdramWriteBit8(this.addr + this.index, 7, bool);
  }

  get compass(): boolean {
    return this.emulator.rdramReadBit8(this.addr + this.index, 6);
  }

  set compass(bool: boolean) {
    this.emulator.rdramWriteBit8(this.addr + this.index, 6, bool);
  }

  get map(): boolean {
    return this.emulator.rdramReadBit8(this.addr + this.index, 5);
  }

  set map(bool: boolean) {
    this.emulator.rdramWriteBit8(this.addr + this.index, 5, bool);
  }
}
