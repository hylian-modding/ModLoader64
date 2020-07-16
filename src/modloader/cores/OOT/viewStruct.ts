import { IViewStruct } from "modloader64_api/OOT/OOTAPI";
import Vector3 from "modloader64_api/math/Vector3";
import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";

export class viewStruct implements IViewStruct {
    ModLoader: IModLoaderAPI;

    constructor(ModLoader: IModLoaderAPI){
        this.ModLoader = ModLoader;
    }
    
    get VIEW(): string {
        return this.ModLoader.emulator.rdramReadPtrBuffer(global.ModLoader.global_context_pointer, 0xB8, 4).toString('ascii');
    }

    get gfx_ctx_pointer(): number {
        return this.ModLoader.emulator.rdramReadPtr32(global.ModLoader.global_context_pointer, 0xB8 + 0x04);
    }

    set gfx_ctx_pointer(pointer: number) {
        this.ModLoader.emulator.rdramWritePtr32(global.ModLoader.global_context_pointer, 0xB8 + 0x04, pointer);
    }

    get fov(): number {
        return this.ModLoader.emulator.rdramReadPtrF32(global.ModLoader.global_context_pointer, 0xB8 + 0x18)
    }

    set fov(rhs: number) {
        this.ModLoader.emulator.rdramWritePtrF32(global.ModLoader.global_context_pointer, 0xB8 + 0x18, rhs)
    }

    get near_clip(): number {
        return this.ModLoader.emulator.rdramReadPtrF32(global.ModLoader.global_context_pointer, 0xB8 + 0x1C)
    }

    set near_clip(rhs: number) {
        this.ModLoader.emulator.rdramWritePtrF32(global.ModLoader.global_context_pointer, 0xB8 + 0x1C, rhs)
    }

    get far_clip(): number {
        return this.ModLoader.emulator.rdramReadPtrF32(global.ModLoader.global_context_pointer, 0xB8 + 0x20)
    }

    set far_clip(rhs: number) {
        this.ModLoader.emulator.rdramWritePtrF32(global.ModLoader.global_context_pointer, 0xB8 + 0x20, rhs)
    }

    get position(): Vector3 {
        return this.ModLoader.math.rdramReadPtrV3(global.ModLoader.global_context_pointer, 0xB8 + 0x28)
    }

    get focus(): Vector3 {
        return this.ModLoader.math.rdramReadPtrV3(global.ModLoader.global_context_pointer, 0xB8 + 0x34)
    }

    get axis(): Vector3 {
        return this.ModLoader.math.rdramReadPtrV3(global.ModLoader.global_context_pointer, 0xB8 + 0x40)
    }
}