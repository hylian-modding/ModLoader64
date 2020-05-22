export const PatchTypes: Map<string, RomPatchType> = new Map<string, RomPatchType>();

export interface RomPatchType{
    patch(rom: Buffer, patch: Buffer): Buffer;
}

export function registerPatchType(ext: string, def: RomPatchType){
    PatchTypes.set(ext, def);
}