import * as apiBit from './Bitmaps';
import * as apiEnum from './Enums';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export interface IBuffered {
  get_all(): Buffer;
  get_bit(flag: number): boolean;
  set_bit(flag: number, value: boolean): any;
  get(offset: number): number;
  set(offset: number, value: number): any;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IMario {
  exists: boolean;
  animation: Buffer;
  anim_frame: number;
  anim_id: number;
  position: Buffer;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rotation: Buffer;
  rot_x: number;
  rot_y: number;
  rot_z: number;
  cap: number;
}

export interface IRuntime {
  get_current_scene(): number;
  get_current_profile(): number;
  star_count: number;
}

export interface ISM64Core {
  mario: IMario;
  runtime: IRuntime;
  save: IBuffered[];
}
