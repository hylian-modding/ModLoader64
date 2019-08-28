import program from 'commander';
import path from 'path';
import fs from 'fs';
import { Pak } from './PakFormat';

program.option('-i, --input <file>', 'input file');
program.option('-o, --output <file>', 'output file');
program.option('-b, --base <addr>', 'base address');
program.option('-d --dir <dir>', 'base directory');

program.parse(process.argv);

function hexPadding(i: number): string {
  return ('0000' + i.toString(16)).substr(-4).toUpperCase();
}

function hexPadding2(i: number): string {
  return ('00' + i.toString(16)).substr(-2).toUpperCase();
}

if (program.input !== undefined) {
  let input = path.resolve(program.input);
  let output = path.resolve(program.output);
  let base = parseInt(program.base);
  generatePayload(input, output, base);
}

if (program.dir !== undefined) {
  let output = path.resolve(path.join(program.dir, 'output' + '.pak'));
  let pak = new Pak(output);
  fs.readdirSync(path.resolve(program.dir)).forEach((key: string) => {
    let parse = path.parse(key);
    if (parse.ext !== '.pak') {
      let input = path.join(program.dir, key);
      pak.save_file(input);
    }
  });
}

function generatePayload(inputfile: string, outputfile: string, base: number) {
  let data: Buffer = fs.readFileSync(inputfile);
  console.log('Generating payload...');
  let codes: string[] = new Array<string>();
  for (let i = 0; i < data.byteLength; i++) {
    codes.push(
      '80' + (base + i).toString(16).toUpperCase() + ' ' + hexPadding(data[i])
    );
  }
  // TODO: Make this actually smart and mix 80 and 81 codes.
  if (codes.length % 2 === 0) {
    console.log('Optimizing payload...');
    codes.splice(0, codes.length);
    for (let i = 0; i < data.byteLength; i += 2) {
      codes.push(
        '81' +
          (base + i).toString(16).toUpperCase() +
          ' ' +
          hexPadding2(data[i]) +
          hexPadding2(data[i + 1])
      );
    }
  }

  let result = '';
  for (let i = 0; i < codes.length; i++) {
    result += codes[i] + '\n';
  }
  result = result.trim();
  fs.writeFileSync(outputfile, result);
}
