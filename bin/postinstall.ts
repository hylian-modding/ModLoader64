import path from 'path';
import fs from 'fs';

let original_dir: string = process.cwd();
let rom_dir = path.join(original_dir, "roms");
let cfg: any = {
    ModLoader64: {
        SDK: {
            roms_dir: rom_dir
        }
    }
};

if (!fs.existsSync(path.join(original_dir, "SDK-config.json"))){
    fs.writeFileSync(path.join(original_dir, "SDK-config.json"), JSON.stringify(cfg, null, 2));
}