import { MonkeyPatch, IMonkeyPatch } from './JSON';
import IMupen from '../modloader/consoles/IMupen';

export class MonkeyPatch_rdramWriteBitsBuffer extends MonkeyPatch
  implements IMonkeyPatch {
  mupen: IMupen;

  constructor(mupen: IMupen) {
    super();
    this.mupen = mupen;
  }

  patch(): void {
    this.replacement = (addr: number, bits: Buffer) => {
      for (let i = 0; i < bits.byteLength; i += 8) {
        let _bits = bits.slice(i, i + 8);
        let _offset = i / 8;
        this.mupen.rdramWriteBits8(addr + _offset, _bits);
      }
    };
    this.original = this.mupen.rdramWriteBitsBuffer;
    (this.mupen as any)['rdramWriteBitsBuffer'] = this.replacement;
  }

  unpatch(): void {
    (this.mupen as any)['rdramWriteBitsBuffer'] = this.original;
  }
}
