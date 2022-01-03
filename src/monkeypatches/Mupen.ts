import { MonkeyPatch, IMonkeyPatch } from './IMonkeyPatch';
import { IMupen } from '../modloader/consoles/mupen/IMupen';

export class MonkeyPatch_rdramReadF32 extends MonkeyPatch
    implements IMonkeyPatch {
    mupen: IMupen;

    constructor(mupen: IMupen) {
        super();
        this.mupen = mupen;
    }

    patch(): void {
        this.replacement = (addr: number) => {
            let data = this.mupen.M64p.Memory.rdramReadBuffer(addr, 4);
            return data.readFloatBE(0);
        };
        this.original = this.mupen.M64p.Memory.rdramReadF32;
        (this.mupen.M64p.Memory as any)['rdramReadF32'] = this.replacement;
    }

    unpatch(): void {
        (this.mupen.M64p.Memory as any)['rdramReadF32'] = this.original;
    }
}

export class MonkeyPatch_rdramReadPtrF32 extends MonkeyPatch
    implements IMonkeyPatch {
    mupen: IMupen;

    constructor(mupen: IMupen) {
        super();
        this.mupen = mupen;
    }

    patch(): void {
        this.replacement = (addr: number, offset: number) => {
            let ptr = this.mupen.M64p.Memory.rdramRead32(addr);
            let data = this.mupen.M64p.Memory.rdramReadBuffer(ptr + offset, 4);
            return data.readFloatBE(0);
        };
        this.original = this.mupen.M64p.Memory.rdramReadPtrF32;
        (this.mupen.M64p.Memory as any)['rdramReadPtrF32'] = this.replacement;
    }

    unpatch(): void {
        (this.mupen.M64p.Memory as any)['rdramReadPtrF32'] = this.original;
    }
}

export class MonkeyPatch_rdramWriteF32 extends MonkeyPatch implements IMonkeyPatch {
    mupen: IMupen;
    buf: Buffer = Buffer.alloc(4);

    constructor(mupen: IMupen) {
        super();
        this.mupen = mupen;
    }

    patch(): void {
        this.replacement = (addr: number, float: number) => {
            this.buf.writeFloatBE(float)
            this.mupen.M64p.Memory.rdramWriteBuffer(addr, this.buf);
        };
        this.original = this.mupen.M64p.Memory.rdramWriteF32;
        (this.mupen.M64p.Memory as any)['rdramWriteF32'] = this.replacement;
    }

    unpatch(): void {
        (this.mupen.M64p.Memory as any)['rdramWriteF32'] = this.original;
    }
}

export class MonkeyPatch_rdramWritePtrF32 extends MonkeyPatch implements IMonkeyPatch {
    mupen: IMupen;
    buf: Buffer = Buffer.alloc(4);

    constructor(mupen: IMupen) {
        super();
        this.mupen = mupen;
    }

    patch(): void {
        this.replacement = (addr: number, offset: number, float: number) => {
            this.buf.writeFloatBE(float)
            let ptr = this.mupen.M64p.Memory.rdramRead32(addr);
            this.mupen.M64p.Memory.rdramWriteBuffer(ptr + offset, this.buf);
        };
        this.original = this.mupen.M64p.Memory.rdramWritePtrF32;
        (this.mupen.M64p.Memory as any)['rdramWritePtrF32'] = this.replacement;
    }

    unpatch(): void {
        (this.mupen.M64p.Memory as any)['rdramWritePtrF32'] = this.original;
    }
}

export class MupenMonkeyPatches{

    static patch(mupen: IMupen){
        new MonkeyPatch_rdramReadF32(mupen).patch();
        new MonkeyPatch_rdramReadPtrF32(mupen).patch();
        new MonkeyPatch_rdramWriteF32(mupen).patch();
        new MonkeyPatch_rdramWritePtrF32(mupen).patch();
    }

}