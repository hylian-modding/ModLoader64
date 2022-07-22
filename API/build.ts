import path from 'path';
import fs from 'fs';

function makeSymlink(src: string, dest: string) {
    try {
        let p = path.parse(dest);
        if (!fs.existsSync(p.dir)) {
            fs.mkdirSync(p.dir);
        }
        fs.symlinkSync(src, dest, 'junction');
    } catch (err) {
        console.log(err);
    }
}

makeSymlink(path.resolve("./build"), path.resolve("..", "node_modules", "modloader64_api"));