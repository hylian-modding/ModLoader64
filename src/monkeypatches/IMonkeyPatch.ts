export interface IMonkeyPatch {
  patch(): void;
  unpatch(): void;
}
export class MonkeyPatch {
  original!: Function;
  replacement!: Function;
}
