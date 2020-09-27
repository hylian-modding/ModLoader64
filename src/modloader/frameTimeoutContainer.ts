export class frameTimeoutContainer {
  fn: Function;
  frames: number;
  originalFrames: number;

  constructor(fn: Function, frames: number) {
      this.fn = fn;
      this.frames = frames;
      this.originalFrames = frames;
  }
}
