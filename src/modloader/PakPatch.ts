import { RomPatchType, PatchTypes } from "modloader64_api/Patchers/PatchManager";
import { Pak } from "modloader64_api/PakFormat";

export class PakPatch implements RomPatchType{

    patch(rom: Buffer, patch: Buffer): Buffer {
        let p: Pak = new Pak("./temp.pak", patch);
        for (let i = 0; i < p.pak.header.files.length; i++){
            let entry = p.pak.header.files[i];
            if (entry.filename.indexOf(".bps") > -1){
                let bps = p.load(i);
                return PatchTypes.get(".bps")!.patch(rom, bps);
            }
        }
        return rom;
    }

}