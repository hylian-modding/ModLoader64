import modloader64 from './modloader/modloader64';
import program from 'commander';
import path from 'path';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './monkeypatches/JSON';
import fs from 'fs';
import { fork } from 'child_process';
import { configure, getLogger } from 'log4js';
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
program.option("-z, --devmode", "developer mode");
program.allowUnknownOption(true);
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

if (program.devmode) {
    global.ModLoader["DEVFLAG"] = true;
} else {
    global.ModLoader["DEVFLAG"] = false;
}

if (program.dir) {
    process.chdir(path.resolve(path.join(process.cwd(), program.dir)));
}

if (program.startdir) {
    global.ModLoader["startdir"] = program.startdir;
} else {
    global.ModLoader['startdir'] = process.cwd();
}

if (fs.existsSync('./console.log')) {
    fs.unlinkSync('./console.log');
}

const logger = getLogger("Core");

const logConfig: any = {
    appenders: { ML64Core_stdout: { type: 'stdout' }, ML64Core_file: { type: 'file', filename: 'console.log' } },
    categories: { default: { appenders: ['ML64Core_stdout', 'ML64Core_file'], level: 'all' } }
};

configure(logConfig);

const logger_ovl = getLogger("STOP_USING_CONSOLE_LOG_YOU_PLEBS");

console.log = (message?: any, ...optionalParams: any[]) => {
    logger_ovl.debug(message);
};

class dumb_logger {
    setLevel(level: string) {
    }

    info(...msg: any) {
        console.log(msg);
    }

    error(...msg: any) {
        console.log(msg);
    }
}

if (fs.existsSync('../README.md')) {
    logger.level = ('all' as ILoggerLevels);
}

if (program.logginglevel !== undefined) {
    logger.level = (program.logginglevel);
}

logger.info(projectID);
logger.info('Authors: ', authors.toString());
if (testers.length > 0) {
    logger.info('Testers: ', testers.toString());
}
logger.info('Version: ', version);

logger.info('Setting running directory: ' + process.cwd());

class logwrapper implements ILogger {
    private logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    info(...msg: string[]): void {
        this.logger.info(msg.toString());
    }
    warn(...msg: string[]): void {
        this.logger.warn(msg.toString());
    }
    error(...msg: string[]): void {
        this.logger.error(msg.toString());
    }
    debug(...msg: string[]): void {
        this.logger.debug(msg.toString());
    }
    setLevel(level: ILoggerLevels): void {
        this.logger.level = level;
    }
    getLogger(id: string): ILogger {
        let wrap: logwrapper = new logwrapper(getLogger(id));
        return wrap;
    }
}

// Monkey patches
let stringify = new MonkeyPatch_Stringify();
stringify.patch();
let parse = new MonkeyPatch_Parse();
parse.patch();

setInterval(() => {
    try {
        global.gc();
    } catch (err) { }
}, 60 * 1000);

if (program.update) {
    let updateProcess = fork(__dirname + '/updater/updateModLoader.js');
    updateProcess.on('exit', (code: number, signal: string) => {
        updateProcess = fork(__dirname + '/updater/updatePlugins.js');
        updateProcess.on('exit', (code: number, signal: string) => {
            process.exit();
        });
    });
} else {
    const instance = new modloader64(new logwrapper(logger));
    instance.start();
}
