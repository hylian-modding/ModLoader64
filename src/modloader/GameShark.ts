import IMemory from 'modloader64_api/IMemory';
import * as fs from 'fs';
import * as path from 'path';

export interface Code {
  type: string;
  addr: number;
  payload: number;
}

export class GameShark {
  logger: any;
  emulator: IMemory;

  constructor(logger: any, emulator: IMemory) {
    this.logger = logger;
    this.emulator = emulator;
  }

  read(data: string): void {
    let original = '';
    let file = path.parse(data);
    switch (file.ext) {
      case '.payload': {
        this.logger.info('Parsing payload ' + file.base + '.');
        original = fs.readFileSync(data, 'utf8');
        break;
      }
    }

    let lines = original.split(/\r?\n/);
    let commands = {
      codes: [] as Code[],
    };
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].substr(0, 2) === '--') {
        continue;
      }
      let a = lines[i].substr(0, 2);
      let b = lines[i].substr(2, lines[i].length);
      let c = parseInt('0x' + b.split(' ')[0], 16);
      let d = parseInt('0x' + b.split(' ')[1], 16);
      commands.codes.push({ type: a, addr: c, payload: d });
    }
    for (let i = 0; i < commands.codes.length; i++) {
      if (commands.codes[i].type === '80') {
        this.emulator.rdramWrite8(
          commands.codes[i].addr,
          commands.codes[i].payload
        );
      } else if (commands.codes[i].type === '81') {
        this.emulator.rdramWrite16(
          commands.codes[i].addr,
          commands.codes[i].payload
        );
      }
    }
  }
}
