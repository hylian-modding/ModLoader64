import { IRomHeader } from 'modloader64_api/IRomHeader';

export class N64Header implements IRomHeader {
  name: string;
  country_code: string;
  revision: number;
  id: string;

  constructor(raw: Buffer) {
      this.name = raw
          .slice(0x20, 0x20 + 0x14)
          .toString('ascii')
          .trim();
      this.country_code = raw
          .slice(0x3e, 0x3f)
          .toString('ascii')
          .trim();
      this.revision = raw.readUInt8(0x3f);
      this.id = raw.slice(0x3B, 0x3E).toString('ascii').trim();
  }
}
