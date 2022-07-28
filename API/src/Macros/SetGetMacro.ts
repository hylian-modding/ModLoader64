import IMemory from "modloader64_api/IMemory"

const sPrimitiveTypes: string[] = [
    "u8",
    "u16",
    "u32",
    "u64",
    "s8",
    "s16",
    "s32",
    "s64",
    "f32",
    "f64"
];

const sPrimitiveTypeSizes: number[] = [
    1,
    2,
    4,
    8,
    1,
    2,
    4,
    8,
    4,
    8
];

function processMacros(instance: any) {
    console.log(instance);
    let getFuncTable: any = {};
    let setFuncTable: any = {};
    let basePointer: number = 0;

    if (instance.__base_pointer != null) {
        basePointer = instance.__base_pointer;
    }

    // generate get and set functions for each primitive
    sPrimitiveTypes.forEach((ptype: string) => {
        let truncated = ptype;

        // cut out the `u` for memory functions
        if (truncated.startsWith('u')) {
            truncated = truncated.slice(1);
        }
        truncated = truncated.toUpperCase();

        getFuncTable[`__${ptype}_`] = (key: string, index?: number) => {
            if (instance.memory != null) {
                return (instance.memory as IMemory)[`rdramRead${truncated}`](instance[key] + basePointer);
            }
            else {
                console.error("Instance does not have IMemory!");
                return null;
            }
        }

        // create functions
        getFuncTable[`__a_${ptype}_`] = (key: string, index: number) => {
            if (instance.memory != null) {
                let size = sPrimitiveTypes.indexOf(`${ptype}`);
                size = sPrimitiveTypeSizes[size];
                return (instance.memory as IMemory)[`rdramRead${truncated}`](instance[key] + basePointer + (index * size));
            }
            else {
                console.error("Instance does not have IMemory!");
                return null;
            }
        }

        setFuncTable[`__${ptype}_`] = (key: string, value: any, index?: number) => {
            if (instance.memory != null) {
                (instance.memory as IMemory)[`rdramWrite${truncated}`](instance[key] + basePointer, value);
            }
            else {
                console.error("Instance does not have IMemory!");
            }
        }

        setFuncTable[`__a_${ptype}_`] = (key: string, index: number, value: any) => {
            if (instance.memory != null) {
                let size = sPrimitiveTypes.indexOf(`${ptype}`);
                size = sPrimitiveTypeSizes[size];
                (instance.memory as IMemory)[`rdramWrite${truncated}`](instance[key] + basePointer + (index * size), value);
            }
            else {
                console.error("Instance does not have IMemory!");
            }
        }
    })

    // define properties
    Object.keys(instance).forEach((key: string) => {
        Object.keys(getFuncTable).forEach((startKey: string) => {
            if (key.startsWith(startKey)) {
                // array
                if (key.startsWith('__a_')) {
                    Object.defineProperty(instance, `Get_${key.substring(startKey.length, key.length)}`, {
                        value: (index: number): number => {
                            return getFuncTable[startKey](key, index);
                        },
                        writable: false
                    })
                    Object.defineProperty(instance, `Set_${key.substring(startKey.length, key.length)}`, {
                        value: (index: number, value: number) => {
                            setFuncTable[startKey](key, index, value);
                        },
                        writable: false
                    })
                }
                else {
                    Object.defineProperty(instance, key.substring(startKey.length, key.length), {
                        get: () => {
                            return getFuncTable[startKey](key);
                        },
                        set: (value: any) => {
                            setFuncTable[startKey](key, value);
                        }
                    })
                }
            }
        })
    })
}

export function GetSetFromAddressMacro() {
    return function _GetSetFromAddressMacro<T extends { new(...args: any[]): {} }>(constr: T) {
        return class extends constr {
            constructor(...args: any[]) {
                const p = constr.prototype;
                super(...args)
                Object.setPrototypeOf(this, p);
                processMacros(this);
            }
        }
    }
}