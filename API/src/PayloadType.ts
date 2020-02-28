import IMemory from "./IMemory";

export abstract class PayloadType {
  ext: string;

  constructor(ext: string) {
      this.ext = ext;
  }

  abstract parse(file: string, buf: Buffer, dest: IMemory): any;
}

export interface IPayloadManager {
  parseFile(file: string): any;
  registerPayloadType(type: PayloadType): void;
}
