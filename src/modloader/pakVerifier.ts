import { Pak } from 'modloader64_api/PakFormat';
import { ILogger } from 'modloader64_api/IModLoaderAPI';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export class pakVerifier {
  logger: ILogger;

  constructor(logger: ILogger) {
      this.logger = logger;
  }

  verifyPak(pakFile: Pak, filePath: string): boolean {
      let parse = path.parse(filePath);
      let find_footer: number = pakFile.pak.data.indexOf(
          Buffer.from('MLPublish.......')
      );
      if (find_footer > -1) {
          let d: Buffer = pakFile.pak.data.slice(0x0, find_footer);
          let hash: string = crypto
              .createHash('sha512')
              .update(d)
              .digest('hex');
          if (hash !== pakFile.pak.footer._hash) {
              this.logger.error('Pak file ' + parse.name + ' is corrupt.');
              return false;
          }
      } else {
          if (pakFile.pak.data.readUInt8(0x0f) > 0x02) {
              this.logger.error('Pak file ' + parse.name + ' is corrupt.');
              return false;
          } 
          this.logger.error(
              'Pak file ' +
            parse.name +
            ' is using an outdated version of the pak format. Tell the author it needs updating.'
          );
      
      }
      return true;
  }

  extractPakToTemp(pakFile: Pak, filePath: string): string {
      let parse = path.parse(filePath);
      let ndir: string = fs.mkdtempSync('ModLoader64_temp_');
      pakFile.extractAll(ndir);
      return path.join(ndir, parse.name);
  }

  extractPakFileToTarget(pakFile: Pak, filePath: string, dest: string): string {
      let parse = path.parse(filePath);
      pakFile.extractAll(dest);
      return path.join(dest, parse.name);
  }
}
