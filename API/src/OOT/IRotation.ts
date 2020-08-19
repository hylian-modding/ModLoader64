export interface IRotation {
  x: number;
  y: number;
  z: number;
  getRawRot(): Buffer;
  setRawRot(rot: Buffer): void;
}
