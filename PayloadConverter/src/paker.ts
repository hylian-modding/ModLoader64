import program from 'commander';
import fs from 'fs';
import { Pak } from './PakFormat';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './JSON';
import { generate } from './sign';

let monkey1 = new MonkeyPatch_Stringify();
monkey1.patch();
let monkey2 = new MonkeyPatch_Parse();
monkey2.patch();

program.option('-d --dir <dir>', 'base directory');
program.option('-o, --output <file>', 'output file');

program.parse(process.argv);

if (program.dir !== undefined) {
  let recursive = require('recursive-readdir');
  require('mkdir-recursive');

  recursive(program.dir, function(err: any, files: string[]) {
    let pak: Pak = new Pak(program.dir + '.pak');
    for (let i = 0; i < files.length; i++) {
      pak.save_file(files[i]);
    }
    if (fs.existsSync('./private_key.pem')) {
      fs.writeFileSync(program.dir + '.sig', generate(pak.fileName));
    }
  });
}
