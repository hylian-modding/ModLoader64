import modloader64 from './modloader/modloader64';
import program from 'commander';
import path from 'path';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './monkeypatches/JSON';
import fs from 'fs';
import { fork } from 'child_process';
import { ILogger, ILoggerLevels } from 'modloader64_api/IModLoaderAPI';

require('source-map-support').install();

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
program.option("-o, --config <file>, change config file");
program.option("-s, --startdir <dir>", "the start dir for sdk usage");
program.option("-l, --logginglevel <level>", "the logging level");
program.parse(process.argv);

if (program.mods) {
    global.ModLoader["OVERRIDE_MODS_FOLDER"] = program.mods;
}

if (program.roms) {
    global.ModLoader["OVERRIDE_ROMS_FOLDER"] = program.roms;
}

if (program.cores) {
    global.ModLoader["OVERRIDE_CORES_FOLDER"] = program.cores;
}

if (program.config) {
    global.ModLoader["OVERRIDE_CONFIG_FILE"] = program.config;
}

if (program.dir) {
    process.chdir(path.resolve(path.join(process.cwd(), program.dir)));
}

if (program.startdir) {
    global.ModLoader["startdir"] = program.startdir;
}

if (fs.existsSync('./console.log')) {
    fs.unlinkSync('./console.log');
}

/* const logger = require('simple-node-logger').createSimpleLogger('console.log');

console.log = (message?: any, ...optionalParams: any[]) => {
    logger.debug(message);
}; */

class dumb_logger{
    setLevel(level: string){
    }

    info(...msg: any){
        console.log(msg);
    }

    error(...msg: any){
        console.log(msg);
    }
}

const logger = new dumb_logger();

if (fs.existsSync('../README.md')) {
    logger.setLevel('all' as ILoggerLevels);
}

if (program.logginglevel !== undefined){
    logger.setLevel(program.logginglevel);
}

logger.info(projectID);
logger.info('Authors: ', authors.toString());
if (testers.length > 0) {
    logger.info('Testers: ', testers.toString());
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
