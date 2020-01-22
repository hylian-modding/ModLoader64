import program from 'commander';
import path from 'path';
import fs from 'fs';

program.option('-i, --input <file>', 'input file');
program.option('-o, --output <file>', 'output file');

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
    let base = parseInt(path.parse(input).name);
    generatePayload(input, output, base);
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
