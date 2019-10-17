import * as apiBit from './Bitmaps';
import * as apiEnum from './Enums';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

export interface IBuffered {
  get_all(): Buffer;
  get_bit(flag: number): boolean;
  set_bit(flag: number, value: boolean): void;
  get(offset: number): number;
  set(offset: number, value: number): void;
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export interface IPlayer {}

export interface IRuntime {}

export interface ISaveContext {
  entrance_index: number;
  rupee_amount: number;
  player_name: number;
}

export interface IMMCore {
  player: IPlayer;
  runtime: IRuntime;
  save: ISaveContext;
}
