const encoding: any = {
  '171': 'A',
  '172': 'B',
  '173': 'C',
  '174': 'D',
  '175': 'E',
  '176': 'F',
  '177': 'G',
  '178': 'H',
  '179': 'I',
  '180': 'J',
  '181': 'K',
  '182': 'L',
  '183': 'M',
  '184': 'N',
  '185': 'O',
  '186': 'P',
  '187': 'Q',
  '188': 'R',
  '189': 'S',
  '190': 'T',
  '191': 'U',
  '192': 'V',
  '193': 'W',
  '194': 'X',
  '195': 'Y',
  '196': 'Z',
  '197': 'a',
  '198': 'b',
  '199': 'c',
  '200': 'd',
  '201': 'e',
  '202': 'f',
  '203': 'g',
  '204': 'h',
  '205': 'i',
  '206': 'j',
  '207': 'k',
  '208': 'l',
  '209': 'm',
  '210': 'n',
  '211': 'o',
  '212': 'p',
  '213': 'q',
  '214': 'r',
  '215': 's',
  '216': 't',
  '217': 'u',
  '218': 'v',
  '219': 'w',
  '220': 'x',
  '221': 'y',
  '222': 'z',
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '228': '-',
  '234': '.',
  '223': ' ',
};

const zeldaStringEncodingMap: Map<number, string> = new Map<number, string>();

Object.keys(encoding).forEach((key: string) => {
  zeldaStringEncodingMap.set(parseInt(key), encoding[key]);
});

export default zeldaStringEncodingMap;

class ZeldaString {
  private reverse: Map<string, number>;

  constructor() {
    this.reverse = new Map<string, number>();
    zeldaStringEncodingMap.forEach(
      (value: string, key: number, map: Map<number, string>) => {
        this.reverse.set(value, key);
      }
    );
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
      name += zeldaStringEncodingMap.get(buf.readUInt8(i));
    }
    return name;
  }
}

export const zeldaString = new ZeldaString();
