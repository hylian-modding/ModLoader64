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

export class MonkeyPatch_rdramWriteBits8 extends MonkeyPatch
  implements IMonkeyPatch {
  mupen: IMupen;

  constructor(mupen: IMupen) {
    super();
    this.mupen = mupen;
  }

  patch(): void {
    this.replacement = (addr: number, buf: Buffer) => {
      let arr = [];
      for (let i = 0; i < buf.byteLength; i++) {
        arr.push(buf[i]);
      }
      let b = bitwise.byte.write(arr as any);
      this.mupen.rdramWrite8(addr, b);
    };
    this.original = this.mupen.rdramWriteBit8;
    (this.mupen as any)['rdramWriteBits8'] = this.replacement;
  }

  unpatch(): void {
    (this.mupen as any)['rdramWriteBits8'] = this.original;
  }
}

export class MonkeyPatch_rdramReadBits8 extends MonkeyPatch
  implements IMonkeyPatch {
  mupen: IMupen;

  constructor(mupen: IMupen) {
    super();
    this.mupen = mupen;
  }

  patch(): void {
    this.replacement = (addr: number) => {
      let b = bitwise.byte.read(this.mupen.rdramRead8(addr) as any);
      let buf: Buffer = Buffer.alloc(0x8);
      for (let i = 0; i < b.length; i++) {
        buf.writeUInt8(b[i], i);
      }
      return buf;
    };
    this.original = this.mupen.rdramReadBits8;
    (this.mupen as any)['rdramReadBits8'] = this.replacement;
  }

  unpatch(): void {
    (this.mupen as any)['rdramReadBits8'] = this.original;
  }
}
