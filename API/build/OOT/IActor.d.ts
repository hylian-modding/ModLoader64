import { IRotation } from './IRotation';
import { IPosition } from './IPosition';
import IMemory from '../IMemory';
import { ActorCategory } from './ActorCategory';
export interface IActor extends IMemory {
    actorUUID: string;
    actorID: number;
    actorType: ActorCategory;
    room: number;
    renderingFlags: number;
    variable: number;
    objectTableIndex: number;
    soundEffect: number;
    rotation: IRotation;
    position: IPosition;
    health: number;
    redeadFreeze: number;
    destroy(): void;
    exists: boolean;
}
