import { IPayloadManager, PayloadType } from 'modloader64_api/PayloadType';
import path from 'path';
import fs from 'fs';
import IMemory from 'modloader64_api/IMemory';
import { GameShark } from 'modloader64_api/GameShark';
import { ILogger } from 'modloader64_api/IModLoaderAPI';

export class PayloadManager implements IPayloadManager {
  types: Map<string, PayloadType> = new Map<string, PayloadType>();
  emulator: IMemory;
  logger: ILogger;

  constructor(emulator: IMemory, logger: ILogger) {
      this.emulator = emulator;
      this.registerPayloadType(new PayloadGameshark('.payload'));
      this.logger = logger;
  }

  parseFile(file: string) {
      let f: string = path.resolve(file);
      let p = path.parse(f);
      if (this.types.has(p.ext)) {
          this.logger.info('Parsing payload: ' + path.parse(file).base + '.');
          let buf: Buffer = fs.readFileSync(f);
          let r = this.types.get(p.ext)!.parse(f, buf, this.emulator);
          return r;
      }
      return null;
  }

  registerPayloadType(type: PayloadType): void {
      this.types.set(type.ext, type);
  }
}

class PayloadGameshark extends PayloadType {
    constructor(ext: string) {
        super(ext);
    }

    parse(file: string, buf: Buffer, dest: IMemory) {
        let gameshark = new GameShark();
        gameshark.read(buf, dest);
    }
}
