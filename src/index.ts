import modloader64 from './modloader/modloader64';
import program from 'commander';
import path from 'path';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './monkeypatches/JSON';

require('source-map-support').install();

const projectID = 'ModLoader64';
const authors: string[] = ['denoflions', 'SpiceyWolf'];
const testers: string[] = [];
const version = require('./version');

global.ModLoader = {};
global.ModLoader['version'] = version;

const logger = require('simple-node-logger').createSimpleLogger('console.log');

logger.info(projectID);
logger.info('Authors: ', authors);
if (testers.length > 0) {
  logger.info('Testers: ', testers);
}
logger.info('Version: ', version);

program.option('-d, --dir <dir>', 'set directory');
program.option('-dd, --dirforce <dir>', 'set directory');
program.parse(process.argv);

if (program.dir) {
  process.chdir(path.resolve(path.join(process.cwd(), program.dir)));
  logger.info('Setting running directory: ' + process.cwd());
}

if (program.dirforce) {
  process.chdir(program.dirforce);
  logger.info('Setting running directory: ' + process.cwd());
}

// Monkey patches
let stringify = new MonkeyPatch_Stringify();
stringify.patch();
let parse = new MonkeyPatch_Parse();
parse.patch();

const instance = new modloader64(logger);
instance.start();
