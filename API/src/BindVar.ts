import IMemory from "./IMemory";

export function BindVar(addr: number, size: BindVar_Sizes, offset?: number) {
    return function (target: any, key: string) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.BindVar === undefined) {
            target.ModLoader['BindVar'] = new Map<string, BindVar_Container>();
        }
        target.ModLoader.BindVar.set(key, new BindVar_Container(addr, size, offset));
    };
}

export function setupBindVar(instance: any, mem: IMemory) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return;
        }
        if (p.ModLoader.hasOwnProperty('BindVar')) {
            // Bind the variables
            let fields = p.ModLoader.BindVar as Map<string, BindVar_Container>;
            fields.forEach((value: BindVar_Container, key: string) => {
                switch (value.size) {
                    case BindVar_Sizes.u8:
                        Object.defineProperty(instance, key, {
                            get: () => { if (value.offset === undefined) { return mem.rdramRead8(value.addr) } else { return mem.rdramReadPtr8(value.addr, value.offset) } },
                            set: (s: number) => { if (value.offset === undefined) { mem.rdramWrite8(value.addr, s) } else { mem.rdramWritePtr8(value.addr, value.offset, s) } }
                        });
                        break;
                    case BindVar_Sizes.u16:
                        Object.defineProperty(instance, key, {
                            get: () => { if (value.offset === undefined) { return mem.rdramRead16(value.addr) } else { return mem.rdramReadPtr16(value.addr, value.offset) } },
                            set: (s: number) => { if (value.offset === undefined) { mem.rdramWrite16(value.addr, s) } else { mem.rdramWritePtr16(value.addr, value.offset, s) } }
                        });
                        break;
                    case BindVar_Sizes.u32:
                        Object.defineProperty(instance, key, {
                            get: () => { if (value.offset === undefined) { return mem.rdramRead32(value.addr) } else { return mem.rdramReadPtr32(value.addr, value.offset) } },
                            set: (s: number) => { if (value.offset === undefined) { mem.rdramWrite32(value.addr, s) } else { mem.rdramWritePtr32(value.addr, value.offset, s) } }
                        });
                        break;
                }
            });
        }
    }
}


export const enum BindVar_Sizes {
    u8,
    u16,
    u32
}

class BindVar_Container {
    addr: number;
    size: BindVar_Sizes;
    offset: number | undefined;

    constructor(addr: number, size: number, offset?: number) {
        this.addr = addr;
        this.size = size;
        if (this.offset !== undefined) {
            this.offset = offset!;
        }
    }
}