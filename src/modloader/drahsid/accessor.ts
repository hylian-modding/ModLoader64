import IMemory from "modloader64_api/IMemory";
import { IRomMemory } from "modloader64_api/IRomMemory";

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

const sPrimitiveTypesRom: string[] = [
    "u8",
    "u16",
    "u32"
];

function GenerateAccessorFunctions() {
    let fn = {}

    for (let index = 0; index < sPrimitiveTypes.length; index++) {
        let ptype = sPrimitiveTypes[index]
        let truncated = ptype

        if (truncated.startsWith('u')) {
            truncated = truncated.slice(1)
        }
        truncated = truncated.toUpperCase()

        let object = {
            get: function (instance: IMemory, address: string) {
                let addr: number = 0
                addr = parseInt(address)
                return instance[`rdramRead${truncated}`](addr)
            },
            set: function (instance: IMemory, address: string, value: number) {
                let addr: number = 0
                addr = parseInt(address)
                instance[`rdramWrite${truncated}`](addr, value)

                return true
            }
        }

        fn[ptype] = object
    }

    return fn
}

function GenerateAccessorFunctionsRom() {
    let fn = {}

    for (let index = 0; index < sPrimitiveTypesRom.length; index++) {
        let ptype = sPrimitiveTypesRom[index]
        let truncated = ptype

        if (truncated.startsWith('u')) {
            truncated = truncated.slice(1)
        }
        truncated = truncated.toUpperCase()

        let object = {
            get: function (instance: IMemory, address: string) {
                let addr: number = 0
                addr = parseInt(address)
                return instance[`romRead${truncated}`](addr)
            },
            set: function (instance: IMemory, address: string, value: number) {
                let addr: number = 0
                addr = parseInt(address)
                instance[`romWrite${truncated}`](addr, value)

                return true
            }
        }

        fn[ptype] = object
    }

    return fn
}

const AccessorFunctions = GenerateAccessorFunctions();
const AccessorFunctionsRom = GenerateAccessorFunctionsRom();

export function SetupMemoryAccessors(memory: IMemory) {
    for (let index = 0; index < sPrimitiveTypes.length; index++) {
        let ptype = sPrimitiveTypes[index]
        memory[ptype] = new Proxy(memory, AccessorFunctions[ptype])
    }
}

export function SetupRomAccessors(rom: IRomMemory) {
    for (let index = 0; index < sPrimitiveTypesRom.length; index++) {
        let ptype = sPrimitiveTypesRom[index]
        rom[ptype] = new Proxy(rom, AccessorFunctionsRom[ptype])
    }
}