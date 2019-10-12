import IMemory from 'modloader64_api/IMemory';
import {
  ISaveContext,
  Magic,
  MagicQuantities,
  IQuestStatus,
  Age,
} from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import { BootsEquipment } from './BootsEquipment';
import { TunicsEquipment } from './TunicsEquipment';
import { ShieldsEquipment } from './ShieldsEquipment';
import { SwordsEquipment } from './SwordsEquipment';
import { Inventory } from './Inventory';
import { QuestStatus } from './QuestStatus';
import { zeldaString } from 'modloader64_api/OOT/ZeldaString';
import { ILogger } from 'modloader64_api/IModLoaderAPI';

export class SaveContext extends JSONTemplate implements ISaveContext {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private entrance_index_addr: number = this.instance + 0x0000;
  private age_addr = this.instance + 0x0004;
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
  private magic_beans_addr: number = this.instance + 0x009b;
  private scene_data_addr: number = this.instance + 0x00d4;
  private event_data_addr: number = this.instance + 0x0ed4;
  private item_flag_addr: number = this.instance + 0x0ef0;
  private inf_table_addr: number = this.instance + 0x0ef8;
  private skulltula_table_addr: number = this.instance + 0x0e9c;
  //
  private magic_goal = 0;
  private magic_limit_goal = 0;

  // Further abstractions
  swords: SwordsEquipment;
  shields: ShieldsEquipment;
  tunics: TunicsEquipment;
  boots: BootsEquipment;
  inventory: Inventory;
  questStatus: IQuestStatus;
  jsonFields: string[] = [
    'entrance_index',
    'cutscene_number',
    'world_time',
    'world_night_flag',
    'zeldaz_string',
    'death_counter',
    'player_name',
    'dd_flag',
    'heart_containers',
    'health',
    'magic_meter_size',
    'magic_current',
    'rupee_count',
    'navi_timer',
    'checksum',
    'age',
    'swords',
    'shields',
    'tunics',
    'boots',
    'inventory',
    'questStatus',
    'magic_beans_purchased',
  ];
  constructor(emu: IMemory, log: ILogger) {
    super();
    this.emulator = emu;
    this.swords = new SwordsEquipment(emu);
    this.shields = new ShieldsEquipment(emu);
    this.tunics = new TunicsEquipment(emu);
    this.boots = new BootsEquipment(emu);
    this.inventory = new Inventory(emu, log);
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
    return zeldaString.decode(
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
    return this.emulator.rdramRead16(this.health_addr);
  }
  set health(hearts: number) {
    this.emulator.rdramWrite16(this.health_addr, hearts);
  }
  get magic_meter_size(): Magic {
    return this.emulator.rdramRead8(this.magic_meter_size_addr);
  }
  // Several things need to be set in order for magic to function properly.
  set magic_meter_size(size: Magic) {
    this.emulator.rdramWrite8(this.magic_meter_size_addr, size);
    switch (size) {
      case Magic.NONE: {
        this.emulator.rdramWrite8(this.magic_flag_1_addr, 0);
        this.emulator.rdramWrite8(this.magic_flag_2_addr, 0);
        this.magic_limit_goal = MagicQuantities.NONE;
        this.magic_current = MagicQuantities.NONE;
        break;
      }
      case Magic.NORMAL: {
        this.emulator.rdramWrite8(this.magic_flag_1_addr, 1);
        this.emulator.rdramWrite8(this.magic_flag_2_addr, 0);
        this.magic_limit_goal = MagicQuantities.NORMAL;
        break;
      }
      case Magic.EXTENDED: {
        this.emulator.rdramWrite8(this.magic_flag_1_addr, 1);
        this.emulator.rdramWrite8(this.magic_flag_2_addr, 1);
        this.magic_limit_goal = MagicQuantities.EXTENDED;
        break;
      }
    }
  }

  get magic_current(): number {
    return this.emulator.rdramRead8(this.magic_current_addr);
  }

  set magic_current(amount: number) {
    this.magic_goal = amount;
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
  get age(): Age {
    return this.emulator.rdramRead32(this.age_addr);
  }
  get magic_beans_purchased(): number {
    return this.emulator.rdramRead8(this.magic_beans_addr);
  }
  set magic_beans_purchased(amt: number) {
    this.emulator.rdramWrite8(this.magic_beans_addr, amt);
  }
  get permSceneData(): Buffer {
    return this.emulator.rdramReadBuffer(this.scene_data_addr, 0xb0c);
  }
  set permSceneData(buf: Buffer) {
    this.emulator.rdramWriteBuffer(this.scene_data_addr, buf);
  }
  get eventFlags(): Buffer {
    return this.emulator.rdramReadBuffer(this.event_data_addr, 0x1c);
  }
  set eventFlags(buf: Buffer) {
    this.emulator.rdramWriteBuffer(this.event_data_addr, buf);
  }
  get itemFlags(): Buffer {
    return this.emulator.rdramReadBuffer(this.item_flag_addr, 0x8);
  }
  set itemFlags(buf: Buffer) {
    this.emulator.rdramWriteBuffer(this.item_flag_addr, buf);
  }
  get infTable(): Buffer {
    return this.emulator.rdramReadBuffer(this.inf_table_addr, 0x3c);
  }
  set infTable(buf: Buffer) {
    this.emulator.rdramWriteBuffer(this.inf_table_addr, buf);
  }
  get skulltulaFlags(): Buffer {
    return this.emulator.rdramReadBuffer(this.skulltula_table_addr, 0x18);
  }
  set skulltulaFlags(buf: Buffer) {
    this.emulator.rdramWriteBuffer(this.skulltula_table_addr, buf);
  }

  onTick() {
    if (this.magic_limit_goal > 0) {
      if (
        this.emulator.rdramRead8(this.magic_limit_addr) < this.magic_limit_goal
      ) {
        this.emulator.rdramWrite8(
          this.magic_limit_addr,
          this.magic_meter_size + 1
        );
      } else {
        this.magic_limit_goal = 0;
      }
    }
    if (this.magic_goal > 0 && this.magic_limit_goal === 0) {
      if (this.magic_current < this.magic_goal) {
        this.emulator.rdramWrite8(
          this.magic_current_addr,
          this.magic_current + 1
        );
      } else {
        this.magic_goal = 0;
      }
    }
  }
}
