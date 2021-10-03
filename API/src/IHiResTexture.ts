export interface IHiResTexture {
}

// #ifdef IS_MUPEN
export interface IHiResTexture {
    AddHiresTexturePath(path: string): void;
    RemoveHiresTexturePath(path: string): void;
}
// #endif