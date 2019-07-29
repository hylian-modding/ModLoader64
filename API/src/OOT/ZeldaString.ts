import map from './ZeldaStringMap';

class ZeldaString {
  private reverse: Map<string, number>;

  constructor() {
    this.reverse = new Map<string, number>();
    map.forEach((value: string, key: number, map: Map<number, string>) => {
      this.reverse.set(value, key);
    });
  }

  encode(str: string): Buffer {
    const b: Buffer = Buffer.alloc(8);
    for (let i = 0; i < b.byteLength; i++) {
      b.writeUInt8(this.reverse.get(str[i]) as number, i);
    }
    return b;
  }

  decode(buf: Buffer): string {
    let name = '';
    for (let i = 0; i < buf.byteLength; i++) {
      name += map.get(buf.readUInt8(i));
    }
    return name;
  }
}

export default ZeldaString;
