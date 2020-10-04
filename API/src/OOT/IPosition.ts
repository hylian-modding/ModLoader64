import Vector3 from "../math/Vector3";

export interface IPosition {
  x: number;
  y: number;
  z: number;
  getRawPos(): Buffer;
  setRawPos(pos: Buffer): void;
  getVec3(): Vector3;
}
