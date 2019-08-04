import * as apiEnum from './Enums';

export interface IBanjo {}

export interface IRuntime {}

export interface ISaveContext {}

export interface IBTCore {
  banjo: IBanjo;
  runtime: IRuntime;
  save: ISaveContext;
}
