import IMemory from "./IMemory";

export interface Code {
  type: string;
  addr: number;
  payload: number;
}

export class GameShark {
    private read_gs(data: Buffer, dest: IMemory) {
        let original: string = data.toString();
        let lines = original.split(/\r?\n/);
        let commands = {
            codes: [] as Code[],
        };
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].substr(0, 2) === '--') {
                continue;
            }
            let a = lines[i].substr(0, 2);
            let b = lines[i].substr(2, lines[i].length);
            let c = parseInt('0x' + b.split(' ')[0], 16);
            let d = parseInt('0x' + b.split(' ')[1], 16);
            commands.codes.push({ type: a, addr: c, payload: d });
        }
        for (let i = 0; i < commands.codes.length; i++) {
            if (commands.codes[i].type === '80') {
                dest.rdramWrite8(commands.codes[i].addr, commands.codes[i].payload);
            } else if (commands.codes[i].type === '81') {
                dest.rdramWrite16(commands.codes[i].addr, commands.codes[i].payload);
            }
        }
    }

    read(data: Buffer, dest: IMemory): void {
        this.read_gs(data, dest);
    }
}
