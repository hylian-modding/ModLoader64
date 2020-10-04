export type vec2 = { x: number; y: number; };
export type vec3 = { x: number, y: number, z: number};
export type vec4 = { x: number; y: number; z: number; w: number; };

export function xy(x: number, y: number): vec2 {
    return { x: x, y: y };
}

export function xywh(x: number, y: number, w: number, h: number): vec4 {
    return { x: x, y: y, z: w, w: h };
}

export function rgb(r: number, g: number, b: number): vec4 {
    let v = 1 / 255;
    return { x: r * v, y: g * v, z: b * v, w: 1 };
}

export function rgba(r: number, g: number, b: number, a: number): vec4 {
    let v = 1 / 255;
    return { x: r * v, y: g * v, z: b * v, w: a * v };
}

export function rgbf(r: number, g: number, b: number): vec4 {
    return { x: r, y: g, z: b , w: 1 };
}

export function rgbaf(r: number, g: number, b: number, a: number): vec4 {
    return { x: r, y: g, z: b, w: a };
}
