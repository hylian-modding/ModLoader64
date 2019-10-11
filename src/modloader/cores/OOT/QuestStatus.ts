import IMemory from 'modloader64_api/IMemory';
import { IQuestStatus } from 'modloader64_api/OOT/OOTAPI';
import { FlagManager, Flag } from 'modloader64_api/FlagManager';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export class QuestStatus extends JSONTemplate implements IQuestStatus {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private questFlags: FlagManager;
  private skulltulaAddr: number = this.instance + 0x00d0;
  private questFlagsAddr: number = this.instance + 0x00a4;
  jsonFields: string[] = [
    'gerudoMembershipCard',
    'stoneOfAgony',
    'displayGoldSkulltulas',
    'goldSkulltulas',
    'heartPieces',
    'zeldasLullaby',
    'eponasSong',
    'sariasSong',
    'sunsSong',
    'songOfTime',
    'songOfStorms',
    'preludeOfLight',
    'minuetOfForest',
    'boleroOfFire',
    'serenadeOfWater',
    'nocturneOfShadow',
    'requiemOfSpirit',
    'lightMedallion',
    'forestMedallion',
    'waterMedallion',
    'fireMedallion',
    'spiritMedallion',
    'shadowMedallion',
    'kokiriEmerald',
    'goronRuby',
    'zoraSapphire',
  ];
  constructor(emu: IMemory) {
    super();
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
  private displayGoldSkulltulasFlag = new Flag(1, 0);
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
    return this.emulator.rdramRead8(this.questFlagsAddr) / 0x10;
  }
  set heartPieces(count: number) {
    let pieces: number = count * 0x10;
    this.emulator.rdramWrite8(this.questFlagsAddr, pieces);
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
}
