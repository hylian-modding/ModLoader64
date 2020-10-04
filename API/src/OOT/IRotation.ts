import Vector3 from "../math/Vector3";

export interface IRotation {
  x: number;
  y: number;
  z: number;
  getRawRot(): Buffer;
  setRawRot(rot: Buffer): void;
  getVec3(): Vector3;
}
