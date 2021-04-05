import { RomPatchType } from "modloader64_api/Patchers/PatchManager";

export class Cloudmax implements RomPatchType {

    patch(rom: Buffer, patch: Buffer): Buffer {
        let str: string = patch.toString();
        let lines: Array<string> = str.split("\n");
        for (let i = 0; i < lines.length; i++) {
            try {
                if (lines[i].trim() === '') {
                    continue;
                }
                let split: Array<string> = lines[i].split(",");
                let addr: number = parseInt(split[0].trim());
                let data: Buffer = Buffer.from(split[1].trim(), 'hex');
                data.copy(rom, addr);
            } catch (err) {
            }
        }
        return rom;
    }

}