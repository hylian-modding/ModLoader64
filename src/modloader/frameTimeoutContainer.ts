export class frameTimeoutContainer {
  fn: Function;
  frames: number;

  constructor(fn: Function, frames: number) {
    this.fn = fn;
    this.frames = frames;
  }
}
