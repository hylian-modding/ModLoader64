import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import { ActorCategory } from 'modloader64_api/OOT/ActorCategory';
import { IRotation } from 'modloader64_api/OOT/IRotation';
import { IPosition } from 'modloader64_api/OOT/IPosition';
import { IActor } from 'modloader64_api/OOT/IActor';
import fs from 'fs';
import path from 'path';
import {
  POSITION_OFFSET,
  POSITION_SIZE,
  ROTATION_OFFSET,
  ROTATION_SIZE,
} from './ActorOffsets';

export class Position extends JSONTemplate implements IPosition {
  private readonly parent: IMemory;
  jsonFields: string[] = ['x', 'y', 'z'];

  constructor(parent: IMemory) {
    super();
    this.parent = parent;
  }

  get x(): number {
    return this.parent.rdramRead32(POSITION_OFFSET + 0);
  }
  set x(x: number) {
    this.parent.rdramWrite32(POSITION_OFFSET + 0, x);
  }

  get y(): number {
    return this.parent.rdramRead32(POSITION_OFFSET + 4);
  }
  set y(y: number) {
    this.parent.rdramWrite32(POSITION_OFFSET + 4, y);
  }

  get z(): number {
    return this.parent.rdramRead32(POSITION_OFFSET + 8);
  }
  set z(z: number) {
    this.parent.rdramWrite32(POSITION_OFFSET + 8, z);
  }

  getRawPos(): Buffer {
    return this.parent.rdramReadBuffer(POSITION_OFFSET, POSITION_SIZE);
  }
}

export class Rotation extends JSONTemplate implements IRotation {
  private readonly parent: IMemory;
  jsonFields: string[] = ['x', 'y', 'z'];

  constructor(parent: IMemory) {
    super();
    this.parent = parent;
  }

  get x(): number {
    return this.parent.rdramRead16(ROTATION_OFFSET + 0);
  }
  set x(x: number) {
    this.parent.rdramWrite16(ROTATION_OFFSET + 0, x);
  }

  get y(): number {
    return this.parent.rdramRead16(ROTATION_OFFSET + 2);
  }
  set y(y: number) {
    this.parent.rdramWrite16(ROTATION_OFFSET + 2, y);
  }

  get z(): number {
    return this.parent.rdramRead16(ROTATION_OFFSET + 4);
  }
  set z(z: number) {
    this.parent.rdramWrite16(ROTATION_OFFSET + 4, z);
  }

  getRawRot(): Buffer {
    return this.parent.rdramReadBuffer(ROTATION_OFFSET, ROTATION_SIZE);
  }
}

export class ActorDeathBehavior {
  offset: number;
  behavior_calc: number;

  constructor(offset: number, behavior_calc: number) {
    this.offset = offset;
    this.behavior_calc = behavior_calc;
  }
}

export interface IActorDeathFile {
  id: number;
  death: ActorDeathBehavior;
}

export const actorDeathBehaviorMap: Map<number, ActorDeathBehavior> = new Map<
  number,
  ActorDeathBehavior
>();

fs.readdirSync(path.join(__dirname, 'actorDeaths')).forEach((file: string) => {
  let parse = path.parse(file);
  if (parse.ext === '.js') {
    let cls = require(path.resolve(path.join(__dirname, 'actorDeaths', file)))[
      parse.name
    ];
    let instance: IActorDeathFile = new cls();
    actorDeathBehaviorMap.set(instance.id, instance.death);
  }
});

export function setActorBehavior(
  emulator: IMemory,
  actor: IActor,
  offset: number,
  behavior: number
) {
  let id: number = actor.actorID;
  let overlay_table: number = global.ModLoader['overlay_table'];
  let overlay_entry = overlay_table + id * 32;
  let behavior_start = overlay_entry + 0x10;
  let pointer = emulator.dereferencePointer(behavior_start);
  let behavior_result = pointer + behavior;
  actor.rdramWrite32(offset, behavior_result + 0x80000000);
}

export function getActorBehavior(
  emulator: IMemory,
  actor: IActor,
  offset: number
): number {
  let id: number = actor.actorID;
  let overlay_table: number = global.ModLoader['overlay_table'];
  let overlay_entry = overlay_table + id * 32;
  let behavior_start = overlay_entry + 0x10;
  let pointer = emulator.dereferencePointer(behavior_start);
  let behavior = actor.dereferencePointer(offset);
  return behavior - pointer;
}

export class ActorBase extends JSONTemplate implements IActor {
  actorUUID = '';
  private readonly emulator: IMemory;
  instance: number;
  exists = true;
  rotation: IRotation;
  position: IPosition;
  jsonFields: string[] = [
    'actorID',
    'actorUUID',
    'health',
    'rotation',
    'position',
  ];

  constructor(emulator: IMemory, pointer: number) {
    super();
    this.emulator = emulator;
    this.instance = pointer;
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

  destroy(): void {
    if (actorDeathBehaviorMap.has(this.actorID)) {
      let b: ActorDeathBehavior = actorDeathBehaviorMap.get(this.actorID)!;
      setActorBehavior(this.emulator, this, b.offset, b.behavior_calc);
    } else {
      this.rdramWrite32(0x130, 0x0);
      this.rdramWrite32(0x134, 0x0);
    }
  }

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
    return this.emulator.rdramReadF32(addr);
  }
  rdramReadPtrF32(addr: number, offset: number): number {
    return this.emulator.rdramReadPtrF32(addr, offset);
  }
  rdramWriteF32(addr: number, value: number): void {
    this.emulator.rdramWriteF32(this.instance + addr, value);
  }
  rdramWritePtrF32(addr: number, offset: number, value: number): void {
    this.emulator.rdramWritePtrF32(this.instance + addr, offset, value);
  }

  memoryDebugLogger(bool: boolean): void {
  }
}
