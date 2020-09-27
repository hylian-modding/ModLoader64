import { IRotation } from './IRotation';
import { IPosition } from './IPosition';
import IMemory from '../IMemory';
import { ActorCategory } from './ActorCategory';

export interface IActor extends IMemory {
  actorUUID: string;
  actorID: number; // 0x00 uInt16 Should probably replace with enum later.
  actorType: ActorCategory; // 0x02 UInt8
  isTransitionActor: boolean;
  room: number; // 0x03 UInt8 If 0xFF this actor is global.
  renderingFlags: number; // 0x04 s32. This is a bitfield.
  variable: number; // 0x1C uInt16 Actor's spawn variable.
  objectTableIndex: number; // 0x1E s8 index to table at Global Context + 0x117A4
  soundEffect: number; // 0x20 u16 Plays sound effect relative to actor's location (if within range of camera?)
  rotation: IRotation; // 0xB4 0x6 bytes.
  position: IPosition; // 0x24 0xC bytes
  health: number; // 0xAF uInt8
  redeadFreeze: number; // 0x110 s16 frames to freeze.
  destroy(): void;
  exists: boolean;
}
