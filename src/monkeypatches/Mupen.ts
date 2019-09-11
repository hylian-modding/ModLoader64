import { MonkeyPatch, IMonkeyPatch } from './JSON';
import IMupen from '../modloader/consoles/IMupen';
import bitwise from 'bitwise';
import { UInt8 } from 'bitwise/types';

export class MonkeyPatch_rdramWriteBit8 extends MonkeyPatch
  implements IMonkeyPatch {
  mupen: IMupen;

  constructor(mupen: IMupen) {
    super();
    this.mupen = mupen;
  }

  patch(): void {
    this.replacement = (addr: number, bitoffset: number, bit: boolean) => {
      let data = this.mupen.rdramRead8(addr);
      let bits = bitwise.byte.read(data as UInt8);
      bits[bitoffset] = bit ? 1 : 0;
      data = bitwise.byte.write(bits);
      this.mupen.rdramWrite8(addr, data);
    };
    this.original = this.mupen.rdramWriteBit8;
    (this.mupen as any)['rdramWriteBit8'] = this.replacement;
  }

  unpatch(): void {
    (this.mupen as any)['rdramWriteBit8'] = this.original;
  }
}
