import modloader64 from './modloader/modloader64';
import program from 'commander';
import path from 'path';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './monkeypatches/JSON';
import fs from 'fs';
import { fork } from 'child_process';

//require('source-map-support').install();

const projectID = 'ModLoader64';
const authors: string[] = ['denoflions', 'SpiceyWolf'];
const testers: string[] = [];
const version = require('./version');

global.ModLoader = {};
global.ModLoader['version'] = version;

program.option('-d, --dir <dir>', 'set directory');
program.option('-u, --update', 'update mode');
program.option("-m, --mods <dir>", "change mod folder");
program.option("-r, --roms <dir>", "change rom folder");
program.option("-c, --cores <dir>", "change core folder");
program.option("-o, --options <file>, change config file");
program.parse(process.argv);

if (program.mods){
    global.ModLoader["OVERRIDE_MODS_FOLDER"] = program.mods;
}

if (program.roms){
    global.ModLoader["OVERRIDE_ROMS_FOLDER"] = program.roms;
}

if (program.cores){
    global.ModLoader["OVERRIDE_CORES_FOLDER"] = program.cores;
}

if (program.options){
    global.ModLoader["OVERRIDE_CONFIG_FILE"] = program.options;
}

if (program.dir) {
    process.chdir(path.resolve(path.join(process.cwd(), program.dir)));
}

if (fs.existsSync('./console.log')) {
    fs.unlinkSync('./console.log');
}

const logger = require('simple-node-logger').createSimpleLogger('console.log');

console.log = (message?: any, ...optionalParams: any[]) => {
    logger.debug(message);
};

if (fs.existsSync('../README.md')) {
    logger.setLevel('all');
}

logger.info(projectID);
logger.info('Authors: ', authors);
if (testers.length > 0) {
    logger.info('Testers: ', testers);
}
logger.info('Version: ', version);

logger.info('Setting running directory: ' + process.cwd());

// Monkey patches
let stringify = new MonkeyPatch_Stringify();
stringify.patch();
let parse = new MonkeyPatch_Parse();
parse.patch();

if (program.update) {
    let updateProcess = fork(__dirname + '/updater/updateModLoader.js');
    updateProcess.on('exit', (code: number, signal: string) => {
        updateProcess = fork(__dirname + '/updater/updatePlugins.js');
        updateProcess.on('exit', (code: number, signal: string) => {
            process.exit();
        });
    });
} else {
    const instance = new modloader64(logger);
    instance.start();
}
