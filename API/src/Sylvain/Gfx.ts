import { DrawListRef } from "./ImGui";
import { vec4, vec2 } from "./vec";

export const enum TextureFilter {
    Linear,
    Nearest
}

export interface Texture {
    id: number;
    width: number;
    height: number;

    loadFromFile(path: string, filter?: TextureFilter /* Nearest */): void;
    loadFromMemoryRGBA32(width: number, height: number, data: Buffer, filter?: TextureFilter /* Nearest */): void;
    isValid(): boolean;
}

export interface Font {
    loadFromFile(path: string, ptsize: number, outline: number): void;
    loadFromMemory(data: Buffer, ptsize: number, outline: number): void;
    isValid(): boolean;
    cacheGlyphRange(min: number, max: number): void;
    renderText(str: string, fgcol: vec4, bgcol: vec4, filter?: TextureFilter /* Nearest */): Texture;
}

export const enum FlipFlags {
    None,
    Horizontal,
    Vertical
}

export interface Gfx {
    createTexture(): Texture;
    createFont(): Font;
    addSprite(dl: DrawListRef, texture: Texture, src: vec4, dst: vec4, tint: vec4, flip: FlipFlags): void;
    addSpriteRotated(dl: DrawListRef, texture: Texture, src: vec4, dst: vec4, tint: vec4, flip: FlipFlags, angle: number): void;
    calcSpriteRotatedBounds(dst: vec4, angle: number): vec4;
    addText(dl: DrawListRef, font: Font, str: string, pos: vec2, fgcol: vec4, bgcol: vec4, scale: vec2): void;
    calcTextSize(font: Font, str: string, scale: vec2): vec2;
}