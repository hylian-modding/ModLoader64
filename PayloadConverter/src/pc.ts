import program from 'commander';
import path from 'path';
import fs from 'fs';

program.option('-i, --input <file>', 'input file');
program.option('-o, --output <file>', 'output file');
program.option('-b, --base <addr>', 'base address');
program.parse(process.argv);

function hexPadding(i: number): string {
  return ('0000' + i.toString(16)).substr(-4).toUpperCase();
}

function hexPadding2(i: number): string {
  return ('00' + i.toString(16)).substr(-2).toUpperCase();
}

let input: string = path.resolve(program.input);
let output: string = path.resolve(program.output);
let base: number = parseInt(program.base);

let data: Buffer = fs.readFileSync(input);
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
fs.writeFileSync(output, result);
