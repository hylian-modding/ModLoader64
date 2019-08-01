import modloader64 from './modloader/modloader64';
import winston from 'winston';
import program from 'commander';
import path from 'path';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './monkeypatches/JSON';
require('source-map-support').install();

const projectID = 'ModLoader64';
const authors: string[] = ['denoflions', 'SpiceyWolf'];
const testers: string[] = [];
const version = '1.0.0';

global.ModLoader = {};
global.ModLoader['version'] = version;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({ label: 'index' }),
        winston.format.cli({ colors: { info: 'green' } }),
        winston.format.splat()
      ),
    }),
  ],
});

logger.info(projectID);
logger.info('Authors: %s', authors);
if (testers.length > 0) {
  logger.info('Testers: %s', testers);
}
logger.info('Version: %s', version);

program.option('-m, --mode <type>', 'launch mode');
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

if (program.mode === 'cli') {
  logger.info('Starting in CLI Mode...');
  let instance = new modloader64(logger.child({}));
  instance.start();
} else if (program.mode === 'gui') {
  logger.info('Starting in GUI mode...');
}
