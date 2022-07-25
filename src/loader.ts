import modloader64 from './modloader/modloader64';
import program from 'commander';
import path from 'path';
import { MonkeyPatch_Stringify, MonkeyPatch_Parse } from './monkeypatches/JSON';
import fs from 'fs';
import { configure, getLogger } from 'log4js';
import { ILogger, ILoggerLevels } from 'modloader64_api/IModLoaderAPI';

require('source-map-support').install();

const projectID = 'ModLoader64';
const authors: string[] = ['denoflions', 'Sylvain'];
const contributors: string[] = [];
let data: Array<any> = JSON.parse(fs.readFileSync(path.resolve(__dirname, "contributors1.json")).toString());
let dontdisplay: Array<string> = ["denoflionsx", "dependabot[bot]"];
for (let i = 0; i < data.length; i++) {
    let p = data[i];
    if (dontdisplay.indexOf(p.login) === -1) {
        contributors.push(p.login);
    }
}
const version = require('./version');

const logger = getLogger("Core");

const logConfig: any = {
    appenders: { ML64Core_stdout: { type: 'stdout' }, ML64Core_file: { type: 'file', filename: 'console.log' } },
    categories: { default: { appenders: ['ML64Core_stdout', 'ML64Core_file'], level: 'all' } }
};

configure(logConfig);

const logger_ovl = getLogger("console.log");

console.log = (message?: any, ...optionalParams: any[]) => {
    logger_ovl.debug(message);
};

global.ModLoader = {};
global.ModLoader['version'] = version;

console.log(process.argv);

program.option('-d, --dir <dir>', 'set directory');
program.option("-m, --mods <dir>", "change mod folder");
program.option("-r, --roms <dir>", "change rom folder");
program.option("-c, --cores <dir>", "change core folder");
program.option("-o, --config <file>, change config file");
program.option("-s, --startdir <dir>", "the start dir for sdk usage");
program.option("-l, --logginglevel <level>", "the logging level");
program.option("-i, --discord <user>", "discord id");
program.option("-w, --ScreenWidth <width>", "screen width");
program.option("-h, --ScreenHeight <height>", "screen height");
program.allowUnknownOption(true);
program.parse(process.argv);

let opts = program.opts();

if (global.hasOwnProperty("MLASARSUPPORT")){
    // The entry point was the SDK executable so ASAR loading is injected.
    global.ModLoader["ASAR_SUPPORT"] = true;
}

if (opts.mods) {
    global.ModLoader["OVERRIDE_MODS_FOLDER"] = opts.mods;
}

if (opts.roms) {
    global.ModLoader["OVERRIDE_ROMS_FOLDER"] = opts.roms;
}

if (opts.cores) {
    global.ModLoader["OVERRIDE_CORES_FOLDER"] = opts.cores;
}

if (opts.config) {
    global.ModLoader["OVERRIDE_CONFIG_FILE"] = opts.config;
}

let discord_id: string = "";
if (program.discord) {
    discord_id = program.discord;
}

if (opts.dir) {
    process.chdir(path.resolve(path.join(process.cwd(), opts.dir)));
}

if (opts.startdir) {
    global.ModLoader["startdir"] = opts.startdir;
} else {
    global.ModLoader['startdir'] = process.cwd();
}

if (opts.ScreenWidth) {
    global.ModLoader["ScreenWidth"] = parseInt(opts.ScreenWidth);
}

if (opts.ScreenHeight) {
    global.ModLoader["ScreenHeight"] = parseInt(opts.ScreenHeight);
}

if (fs.existsSync('./console.log')) {
    fs.unlinkSync('./console.log');
}

if (fs.existsSync('../README.md')) {
    logger.level = ('all' as ILoggerLevels);
}

if (opts.logginglevel !== undefined) {
    logger.level = (opts.logginglevel);
}

logger.info(projectID);
logger.info('Authors: ', authors.toString());
logger.info('Version: ', version);
logger.info(`Github Contributors: ${contributors.toString()}`);

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

global.ModLoader["FIRST_RUN"] = !fs.existsSync("./ModLoader64-config.json");
if (global.ModLoader["OVERRIDE_CONFIG_FILE"]) {
    global.ModLoader["FIRST_RUN"] = !fs.existsSync(global.ModLoader["OVERRIDE_CONFIG_FILE"]);
}

const instance = new modloader64(new logwrapper(logger), discord_id);
instance.start();