import IMemory from 'modloader64_api/IMemory';
import {
  LinkState,
  Tunic,
  Shield,
  Boots,
  Mask,
  ILink,
  Sword,
  LinkState2,
} from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import { ActorCategory } from 'modloader64_api/OOT/ActorCategory';
import { IRotation } from 'modloader64_api/OOT/IRotation';
import { IPosition } from 'modloader64_api/OOT/IPosition';
import { Position, Rotation } from './Actor';

export class Link extends JSONTemplate implements ILink {
  private emulator: IMemory;
  private instance = 0x1daa30;
  private state_addr: number = this.instance + 0x066c;
  private state2_addr: number = this.instance + 0x0670;
  private tunic_addr: number = this.instance + 0x013c;
  private shield_addr: number = this.instance + 0x013e;
  private boots_addr: number = this.instance + 0x013f;
  private mask_addr: number = this.instance + 0x014f;
  private pos_addr: number = this.instance + 0x24;
  private rot_addr: number = this.instance + 0xb4;
  private sword_addr: number = global.ModLoader.save_context + 0x0070 + 0x1;
  /*This is provided by OotCore's ASM.
    Anim data is safely copied into this space at the end of each rendering cycle.
    This helps prevent jittering.*/
  private sound_addr: number = 0x600000 + 0x88;
  private anim_data_addr = 0x600000;

  rotation: IRotation;
  position: IPosition;
  actorUUID = 'Link';

  jsonFields: string[] = [
    'state',
    'tunic',
    'shield',
    'boots',
    'mask',
    'pos',
    'rot',
    'anim_data',
    'current_sound_id',
  ];

  constructor(emu: IMemory) {
    super();
    this.emulator = emu;
    this.rotation = new Rotation(this);
    this.position = new Position(this);
  }

  get actorID(): number {
    return this.rdramRead16(0x0);
  }

  get actorType(): ActorCategory {
    return this.rdramRead8(0x2);
  }

  get room(): number {
    return this.rdramRead8(0x3);
  }
  set room(r: number) {
    this.rdramWrite8(0x3, r);
  }

  get renderingFlags(): number {
    return this.rdramRead32(0x4);
  }

  set renderingFlags(flags: number) {
    this.rdramWrite32(0x4, flags);
  }

  get variable(): number {
    return this.rdramRead16(0x1c);
  }

  get objectTableIndex(): number {
    return this.rdramRead8(0x1e);
  }

  get soundEffect(): number {
    return this.rdramRead16(0x20);
  }

  set soundEffect(s: number) {
    this.rdramWrite16(0x20, s);
  }

  get health(): number {
    return this.rdramRead8(0xaf);
  }

  set health(h: number) {
    this.rdramWrite8(0xaf, h);
  }

  get redeadFreeze(): number {
    return this.rdramReadS16(0x110);
  }

  set redeadFreeze(f: number) {
    this.rdramWrite16(0x110, f);
  }

  get exists(): boolean {
    return this.emulator.rdramRead32(this.instance) === 0x2ff;
  }

  get rawStateValue(): number {
    return this.emulator.rdramRead32(this.state_addr);
  }

  destroy(): void {}

  get state(): LinkState {
    switch (this.emulator.rdramRead32(this.state_addr)) {
      case 0:
        return LinkState.STANDING;
      case 0x00000008:
        return LinkState.STANDING;
      case 0x20000000:
        return LinkState.BUSY;
      case 0x30000000:
        return LinkState.OCARINA;
      case 0x20000001:
        return LinkState.LOADING_ZONE;
      case 0x80000000:
        return LinkState.ENTERING_GROTTO;
      case 0x00100000:
        return LinkState.FIRST_PERSON;
      case 0x00040000:
        return LinkState.JUMPING;
      case 0x08000000:
        return LinkState.SWIMMING;
      case 0x00004000:
        return LinkState.CLIMBING_OUT_OF_WATER;
      case 0x00002000:
        return LinkState.HANGING_FROM_LEDGE;
      case 0x00800000:
        return LinkState.RIDING_EPONA;
      case 0x00000080:
        return LinkState.DYING;
      case 0x04000000:
        return LinkState.TAKING_DAMAGE;
      case 0x00040000:
        return LinkState.FALLING;
      case 0x00080000:
        return LinkState.FALLING;
      case 0x00068000:
        return LinkState.FALLING;
      case 0xa0040000:
        return LinkState.VOIDING_OUT;
      case 0x20000c00:
        return LinkState.GETTING_ITEM;
      case 0x20010040:
        return LinkState.TALKING;
      case 0x00018000:
        return LinkState.Z_TARGETING;
      case 0x00028000:
        return LinkState.Z_TARGETING;
      case 0x00000800:
        return LinkState.HOLDING_ACTOR;
    }
    return LinkState.UNKNOWN;
  }

  get state2(): LinkState2 {
    let s2: number = this.emulator.rdramRead32(this.state2_addr);
    let digits = s2.toString().split('');
    let realDigits = digits.map(Number);
    let idle: number = realDigits[0];
    let crawlspace: number = realDigits[3];
    let moving: number = realDigits[6];
    if (idle === 0x1) {
      return LinkState2.IDLE;
    }
    if (crawlspace === 0x4) {
      return LinkState2.CRAWLSPACE;
    }
    if (moving === 0x2) {
      return LinkState2.MOVING_FORWARD;
    }
    return LinkState2.UNKNOWN;
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
  get sword(): Sword {
    return this.emulator.rdramRead8(this.sword_addr);
  }
  set sword(sword: Sword) {
    this.emulator.rdramWrite8(this.sword_addr, sword);
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
  get pos(): Buffer {
    return this.emulator.rdramReadBuffer(this.pos_addr, 0xc);
  }
  set pos(pos: Buffer) {
    this.emulator.rdramWriteBuffer(this.pos_addr, pos);
  }
  get rot(): Buffer {
    return this.emulator.rdramReadBuffer(this.rot_addr, 0x8);
  }
  set rot(rot: Buffer) {
    this.emulator.rdramWriteBuffer(this.rot_addr, rot);
  }
  get anim_data(): Buffer {
    return this.emulator.rdramReadBuffer(this.anim_data_addr, 0x86);
  }
  get current_sound_id(): number {
    return this.emulator.rdramRead16(this.sound_addr);
  }
  set current_sound_id(s: number) {
    this.emulator.rdramWrite16(this.sound_addr, s);
  }
  get anim_id(): number {
    return this.emulator.rdramRead16(this.instance + 0x1ae);
  }
  get anim_frame(): number {
    return this.emulator.rdramRead16(this.instance + 0x1f4);
  }
  // Give ILink a complete IMemory implementation for shortcuts.
  rdramRead8(addr: number): number {
    return this.emulator.rdramRead8(this.instance + addr);
  }
  rdramWrite8(addr: number, value: number): void {
    this.emulator.rdramWrite8(this.instance + addr, value);
  }
  rdramRead16(addr: number): number {
    return this.emulator.rdramRead16(this.instance + addr);
  }
  rdramWrite16(addr: number, value: number): void {
    this.emulator.rdramWrite16(this.instance + addr, value);
  }
  rdramWrite32(addr: number, value: number): void {
    this.emulator.rdramWrite32(this.instance + addr, value);
  }
  rdramRead32(addr: number): number {
    return this.emulator.rdramRead32(this.instance + addr);
  }
  rdramReadBuffer(addr: number, size: number): Buffer {
    return this.emulator.rdramReadBuffer(this.instance + addr, size);
  }
  rdramWriteBuffer(addr: number, buf: Buffer): void {
    this.emulator.rdramWriteBuffer(this.instance + addr, buf);
  }
  dereferencePointer(addr: number): number {
    return this.emulator.dereferencePointer(this.instance + addr);
  }
  rdramReadS8(addr: number): number {
    return this.emulator.rdramReadS8(this.instance + addr);
  }
  rdramReadS16(addr: number): number {
    return this.emulator.rdramReadS16(this.instance + addr);
  }
  rdramReadS32(addr: number): number {
    return this.emulator.rdramReadS32(this.instance + addr);
  }
  rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
    return this.emulator.rdramReadBitsBuffer(this.instance + addr, bytes);
  }
  rdramReadBits8(addr: number): Buffer {
    return this.emulator.rdramReadBits8(this.instance + addr);
  }
  rdramReadBit8(addr: number, bitoffset: number): boolean {
    return this.emulator.rdramReadBit8(this.instance + addr, bitoffset);
  }
  rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
    this.emulator.rdramWriteBitsBuffer(this.instance + addr, buf);
  }
  rdramWriteBits8(addr: number, buf: Buffer): void {
    this.emulator.rdramWriteBits8(this.instance + addr, buf);
  }
  rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
    this.emulator.rdramWriteBit8(this.instance + addr, bitoffset, bit);
  }
  rdramReadPtr8(addr: number, offset: number): number {
    return this.emulator.rdramReadPtr8(this.instance + addr, offset);
  }
  rdramWritePtr8(addr: number, offset: number, value: number): void {
    this.emulator.rdramWritePtr8(this.instance + addr, offset, value);
  }
  rdramReadPtr16(addr: number, offset: number): number {
    return this.emulator.rdramReadPtr16(this.instance + addr, offset);
  }
  rdramWritePtr16(addr: number, offset: number, value: number): void {
    this.emulator.rdramWritePtr16(this.instance + addr, offset, value);
  }
  rdramWritePtr32(addr: number, offset: number, value: number): void {
    this.emulator.rdramWritePtr32(this.instance + addr, offset, value);
  }
  rdramReadPtr32(addr: number, offset: number): number {
    return this.emulator.rdramReadPtr32(this.instance + addr, offset);
  }
  rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
    return this.emulator.rdramReadPtrBuffer(this.instance + addr, offset, size);
  }
  rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
    this.emulator.rdramWritePtrBuffer(this.instance + addr, offset, buf);
  }
  rdramReadPtrS8(addr: number, offset: number): number {
    return this.emulator.rdramReadPtrS8(this.instance + addr, offset);
  }
  rdramReadPtrS16(addr: number, offset: number): number {
    return this.emulator.rdramReadPtrS16(this.instance + addr, offset);
  }
  rdramReadPtrS32(addr: number, offset: number): number {
    return this.emulator.rdramReadPtrS32(this.instance + addr, offset);
  }
  rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
    return this.emulator.rdramReadPtrBitsBuffer(
      this.instance + addr,
      offset,
      bytes
    );
  }
  rdramReadPtrBits8(addr: number, offset: number): Buffer {
    return this.emulator.rdramReadPtrBits8(this.instance + addr, offset);
  }
  rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
    return this.emulator.rdramReadPtrBit8(
      this.instance + addr,
      offset,
      bitoffset
    );
  }
  rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
    this.emulator.rdramWritePtrBitsBuffer(this.instance + addr, offset, buf);
  }
  rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
    this.emulator.rdramWritePtrBits8(this.instance + addr, offset, buf);
  }
  rdramWritePtrBit8(
    addr: number,
    offset: number,
    bitoffset: number,
    bit: boolean
  ): void {
    this.emulator.rdramWritePtrBit8(
      this.instance + addr,
      offset,
      bitoffset,
      bit
    );
  }
  rdramReadF32(addr: number): number {
    return this.emulator.rdramReadF32(this.instance + addr);
  }
  rdramReadPtrF32(addr: number, offset: number): number {
    return this.emulator.rdramReadPtrF32(this.instance + addr, offset);
  }
  rdramWriteF32(addr: number, value: number): void {
    this.emulator.rdramWriteF32(this.instance + addr, value);
  }
  rdramWritePtrF32(addr: number, offset: number, value: number): void {
    this.emulator.rdramWritePtrF32(this.instance + addr, offset, value);
  }
  memoryDebugLogger(bool: boolean): void {}
}
