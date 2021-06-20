#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const crypto_1 = __importDefault(require("crypto"));
const isElevated = require('is-elevated');
const stripJsonComments = require('strip-json-comments');
let platformkey = '';
if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
    platformkey = process.platform.trim() + 'x64';
}
else {
    platformkey = process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
}
commander_1.default.option('-n, --init', 'init new project');
commander_1.default.option('-b, --build', 'build mod');
commander_1.default.option('-r, --run', 'run mod');
commander_1.default.option('-d, --dist', 'pack mod');
commander_1.default.option("-2, --runp2", "run p2");
commander_1.default.option("-u, --update", "update");
commander_1.default.option("-q, --bumpversion", "bump version number");
commander_1.default.option("-i, --install <url>", "install dependency");
commander_1.default.option("-s, --setroms <path>", "set rom directory");
commander_1.default.option("-c, --clean", "cleans build dirs");
commander_1.default.option("-z, --rebuildsdk", "rebuild sdk");
commander_1.default.option("-t, --template <template>", "make project from template");
commander_1.default.option("-e, --external <tool>");
commander_1.default.option("-w, --window gui window");
commander_1.default.option("-f, --sign <dir>", "sign files in a directory");
commander_1.default.allowUnknownOption(true);
commander_1.default.parse(process.argv);
function makeSymlink(src, dest) {
    try {
        let p = path_1.default.parse(dest);
        if (!fs_1.default.existsSync(p.dir)) {
            fs_1.default.mkdirSync(p.dir);
        }
        fs_extra_1.default.symlinkSync(src, dest, 'junction');
    }
    catch (err) {
        console.log(err);
    }
}
let original_dir = process.cwd();
process.chdir(path_1.default.join(__dirname, "../"));
if (!fs_1.default.existsSync("./SDK-config.json")) {
    console.log("This copy of the ModLoader64 SDK appears to have been improperly installed. Please consult the instructions and reinstall.");
}
let sdk_cfg = JSON.parse(fs_1.default.readFileSync("./SDK-config.json").toString());
process.chdir(original_dir);
let tsconfig_path = path_1.default.resolve(path_1.default.join("./", "tsconfig.json"));
let tsconfig;
if (fs_1.default.existsSync(tsconfig_path)) {
    tsconfig = JSON.parse(stripJsonComments(fs_1.default.readFileSync(tsconfig_path).toString()));
}
const MOD_REPO_URL = "https://nexus.inpureprojects.info/ModLoader64/repo/mods.json";
const CORE_REPO_URL = "https://nexus.inpureprojects.info/ModLoader64/repo/cores.json";
const GUI_SDK_URL = "https://nexus.inpureprojects.info/ModLoader64/launcher/sdk/win-ia32-unpacked.pak";
const GUI_SDK_URL_UNIX = "https://nexus.inpureprojects.info/ModLoader64/launcher/sdk/linux-unpacked.pak";
// I'm legit just wrapping curl right here... its built into win10 these days should be ok.
function getFileContents(url) {
    return child_process_1.default.execFileSync('curl', ['--silent', '-L', url], { encoding: 'utf8' });
}
function getBinaryContents(url) {
    return child_process_1.default.execFileSync('curl', ['-O', '--silent', '-L', url], { encoding: 'utf8' });
}
function saveTSConfig() {
    fs_1.default.writeFileSync(tsconfig_path, JSON.stringify(tsconfig, null, 2));
}
let WAITING_ON_EXTERNAL = false;
if (commander_1.default.external !== undefined) {
    let original_dir = process.cwd();
    process.chdir(path_1.default.join(__dirname, "../"));
    let p = path_1.default.join(".", "tools", commander_1.default.external);
    if (fs_1.default.existsSync(p)) {
        let meta = JSON.parse(fs_1.default.readFileSync(path_1.default.join(p, "package.json")).toString());
        let s = meta.main;
        let f = path_1.default.resolve(path_1.default.join(p, s));
        process.chdir(original_dir);
        child_process_1.default.fork(f, process.argv);
        WAITING_ON_EXTERNAL = true;
    }
    process.chdir(original_dir);
}
function updateCores() {
    let original_dir = process.cwd();
    let deps_dir = path_1.default.join("./", "external_cores");
    if (!fs_extra_1.default.existsSync(deps_dir)) {
        return;
    }
    process.chdir(deps_dir);
    let cores = [];
    fs_1.default.readdirSync("./").forEach((file) => {
        let f = path_1.default.join("./", file);
        if (fs_1.default.lstatSync(f).isDirectory()) {
            let b2 = process.cwd();
            process.chdir(path_1.default.join("./", f));
            cores.push(path_1.default.resolve("./build/cores"));
            child_process_1.default.execSync("git reset --hard origin/master");
            child_process_1.default.execSync("git pull");
            console.log(process.cwd());
            let meta2 = JSON.parse(fs_1.default.readFileSync("./package.json").toString());
            console.log("Updating " + meta2.name);
            if (meta2.hasOwnProperty("dependencies")) {
                Object.keys(meta2.dependencies).forEach((key) => {
                    delete meta2.dependencies[key];
                });
            }
            if (meta2.hasOwnProperty("devDependencies")) {
                Object.keys(meta2.devDependencies).forEach((key) => {
                    delete meta2.dependencies[key];
                });
            }
            fs_extra_1.default.writeFileSync("./package.json", JSON.stringify(meta2, null, 2));
            fs_extra_1.default.removeSync("./node_modules");
            child_process_1.default.execSync("npm install");
            child_process_1.default.execSync("modloader64 -nbd");
            process.chdir(b2);
        }
    });
    process.chdir(original_dir);
}
function installCores() {
    let m_path = "./package.json";
    let meta = JSON.parse(fs_1.default.readFileSync(m_path).toString());
    if (!meta.hasOwnProperty("modloader64_deps")) {
        meta["modloader64_deps"] = {};
    }
    let mm_path = path_1.default.join(".", "src", meta.name, "package.json");
    if (!fs_1.default.existsSync(mm_path)) {
        mm_path = path_1.default.join(".", "cores", meta.name, "package.json");
    }
    let mod_meta = JSON.parse(fs_1.default.readFileSync(mm_path).toString());
    if (!mod_meta.hasOwnProperty("modloader64_deps")) {
        mod_meta["modloader64_deps"] = {};
    }
    Object.keys(mod_meta["modloader64_deps"]).forEach((key) => {
        install(mod_meta["modloader64_deps"][key]);
    });
}
function install(url) {
    console.log("Installing " + url + "...");
    let original_dir = process.cwd();
    process.chdir(path_1.default.join(__dirname, "../"));
    if (!fs_1.default.existsSync("./core_links")) {
        fs_1.default.mkdirSync("./core_links");
        process.chdir("./core_links");
        child_process_1.default.execSync("npm init --yes");
        child_process_1.default.execSync("npx tsc --init");
        child_process_1.default.execSync("yarn");
        process.chdir("../");
    }
    process.chdir("./cores");
    let dir = path_1.default.parse(url).name;
    if (fs_1.default.existsSync(`./${dir}`)) {
        console.log(`This core is already installed at ${path_1.default.resolve(`./${dir}`)}. Linking...`);
        process.chdir(`./${dir}`);
        process.chdir("./build");
        process.chdir("./cores");
        let dir_to_link = ".";
        fs_1.default.readdirSync(".").forEach((file) => {
            let p = path_1.default.resolve(".", file);
            if (fs_1.default.lstatSync(p)) {
                dir_to_link = p;
            }
        });
        process.chdir(dir_to_link);
        dir = path_1.default.parse(dir_to_link).name;
    }
    else {
        child_process_1.default.execSync(`git clone ${url} ${dir}`);
        process.chdir(`./${dir}`);
        child_process_1.default.execSync("modloader64 -ncbd");
        child_process_1.default.execSync("yarn");
        process.chdir("./build");
        process.chdir("./cores");
        let dir_to_link = ".";
        fs_1.default.readdirSync(".").forEach((file) => {
            let p = path_1.default.resolve(".", file);
            if (fs_1.default.lstatSync(p)) {
                dir_to_link = p;
            }
        });
        process.chdir(dir_to_link);
        dir = path_1.default.parse(dir_to_link).name;
        child_process_1.default.execSync("yarn link");
        process.chdir(original_dir);
        process.chdir(path_1.default.join(__dirname, "../"));
        process.chdir("./core_links");
        child_process_1.default.execSync(`yarn link ${dir}`);
    }
    process.chdir(original_dir);
    child_process_1.default.execSync(`yarn link ${dir}`);
}
if (!WAITING_ON_EXTERNAL) {
    if (commander_1.default.rebuildsdk) {
        console.log("Rebuilding SDK...");
        let original_dir = process.cwd();
        process.chdir(path_1.default.join(__dirname, "../"));
        child_process_1.default.execSync("yarn");
        process.chdir(original_dir);
    }
    if (commander_1.default.init) {
        let original_dir = process.cwd();
        console.log("Generating mod scaffolding...");
        child_process_1.default.execSync("npm init --yes");
        let meta = JSON.parse(fs_1.default.readFileSync("./package.json").toString());
        if (!fs_1.default.existsSync("./src")) {
            fs_1.default.mkdirSync("./src");
            fs_1.default.mkdirSync("./src/" + meta.name);
            process.chdir("./src/" + meta.name);
            child_process_1.default.execSync("npm init --yes");
        }
        try {
            process.chdir("./src/" + meta.name);
            child_process_1.default.execSync("yarn");
        }
        catch (err) { }
        process.chdir(original_dir);
        let mod_pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(".", "package.json")).toString());
        if (mod_pkg.hasOwnProperty("dependencies")) {
            Object.keys(mod_pkg.dependencies).forEach((key) => {
                delete mod_pkg.dependencies[key];
            });
        }
        if (mod_pkg.hasOwnProperty("devDependencies")) {
            Object.keys(mod_pkg.devDependencies).forEach((key) => {
                delete mod_pkg.dependencies[key];
            });
        }
        fs_1.default.writeFileSync(path_1.default.join(".", "package.json"), JSON.stringify(mod_pkg, null, 2));
        child_process_1.default.execSync("yarn");
        if (!fs_1.default.existsSync("./node_modules")) {
            fs_1.default.mkdirSync("./node_modules");
        }
        console.log("Linking ModLoader64 API to project...");
        console.log("This might take a moment. Please be patient.");
        let our_pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../", "package.json")).toString());
        Object.keys(our_pkg.dependencies).forEach((key) => {
            makeSymlink(path_1.default.resolve(__dirname, "../", "node_modules", key), path_1.default.resolve(original_dir, "node_modules", key));
        });
        Object.keys(our_pkg.devDependencies).forEach((key) => {
            makeSymlink(path_1.default.resolve(__dirname, "../", "node_modules", key), path_1.default.resolve(original_dir, "node_modules", key));
        });
        makeSymlink(path_1.default.resolve(__dirname, "../", "node_modules", "modloader64_api"), path_1.default.resolve(original_dir, "node_modules", "modloader64_api"));
        console.log("Setting up TypeScript compiler...");
        child_process_1.default.execSync("npx tsc --init");
        fs_1.default.copyFileSync(path_1.default.join(__dirname, "../", "tsconfig.json"), "./tsconfig.json");
        if (fs_1.default.existsSync(tsconfig_path)) {
            tsconfig = JSON.parse(stripJsonComments(fs_1.default.readFileSync(tsconfig_path).toString()));
        }
        tsconfig["compilerOptions"]["paths"]["@" + meta.name + "/*"] = ["./src/" + meta.name + "/*"];
        saveTSConfig();
        console.log("Installing any required cores...");
        installCores();
    }
    if (commander_1.default.setroms !== undefined) {
        sdk_cfg.ModLoader64.SDK.roms_dir = path_1.default.resolve(commander_1.default.setroms);
        let original_dir = process.cwd();
        process.chdir(path_1.default.join(__dirname, "../"));
        fs_1.default.writeFileSync("./SDK-config.json", JSON.stringify(sdk_cfg, null, 2));
        process.chdir(original_dir);
    }
    if (commander_1.default.bumpversion) {
        let original_dir = process.cwd();
        child_process_1.default.execSync("npm version --no-git-tag-version patch");
        let meta = JSON.parse(fs_1.default.readFileSync("./package.json").toString());
        let p = "./src/" + meta.name;
        process.chdir(p);
        child_process_1.default.execSync("npm version --no-git-tag-version patch");
        meta = JSON.parse(fs_1.default.readFileSync("./package.json").toString());
        console.log("New version number: " + meta.version);
        process.chdir(original_dir);
    }
    if (commander_1.default.clean) {
        fs_extra_1.default.removeSync("./build");
        fs_extra_1.default.removeSync("./build2");
        fs_extra_1.default.removeSync("./dist");
    }
    if (commander_1.default.build) {
        let original_dir = process.cwd();
        let meta = path_1.default.join(process.cwd(), "package.json");
        let m = JSON.parse(fs_1.default.readFileSync(meta).toString());
        console.log("Building mod. Please wait...");
        if (!fs_1.default.existsSync("./cores")) {
            fs_1.default.mkdirSync("./cores");
        }
        if (m.hasOwnProperty("scripts")) {
            if (m.scripts.hasOwnProperty("ML64Prebuild")) {
                console.log("Executing prebuild script...");
                console.log(child_process_1.default.execSync("npm run ML64Prebuild").toString());
            }
        }
        if (fs_1.default.existsSync("gulpfile.ts") || fs_1.default.existsSync("gulpfile.js")) {
            console.log("Using custom gulpfile.");
            child_process_1.default.execSync("gulp");
        }
        else {
            try {
                child_process_1.default.execSync("npx tsc");
            }
            catch (err) {
                if (err) {
                    throw Error(err.stdout.toString());
                }
            }
        }
        fs_extra_1.default.copySync("./src", "./build/src");
        if (!fs_1.default.existsSync("./build/cores")) {
            fs_1.default.mkdirSync("./build/cores");
        }
        fs_extra_1.default.copySync("./cores", "./build/cores");
        if (m.hasOwnProperty("scripts")) {
            if (m.scripts.hasOwnProperty("ML64Postbuild")) {
                console.log("Executing postbuild script...");
                console.log(child_process_1.default.execSync("npm run ML64Postbuild").toString());
            }
        }
        process.chdir(original_dir);
    }
    if (commander_1.default.sign) {
        var recursive = require("recursive-readdir");
        let original_dir = process.cwd();
        recursive(commander_1.default.sign, function (err, files) {
            for (let i = 0; i < files.length; i++) {
                let _path = path_1.default.resolve(files[i]);
                let _parse = path_1.default.parse(files[i]);
                if (_parse.dir.indexOf("node_modules") > -1)
                    continue;
                if (_parse.ext === ".js") {
                    let data = fs_1.default.readFileSync(_path);
                    const private_key = fs_extra_1.default.readFileSync(path_1.default.resolve(__dirname, "..", "privateKey.pem"), 'utf-8');
                    const signer = crypto_1.default.createSign('sha256');
                    signer.update(data);
                    signer.end();
                    const signature = signer.sign(private_key);
                    fs_1.default.writeFileSync(_path.replace(".js", ".mls"), JSON.stringify({ sig: signature.toString('base64'), code: data.toString('base64') }));
                    fs_1.default.unlinkSync(_path);
                }
                else if (_path.indexOf(".js.map") > -1 || _parse.ext === ".ts") {
                    fs_1.default.unlinkSync(_path);
                }
            }
        });
        process.chdir(original_dir);
    }
    if (commander_1.default.run) {
        console.log("Running mod. Please wait while we load the emulator...");
        let original_dir = process.cwd();
        if (commander_1.default.window) {
            let isWindows = platformkey.indexOf("win32") > -1;
            let url = GUI_SDK_URL;
            if (!isWindows) {
                url = GUI_SDK_URL_UNIX;
            }
            let dir = "./win-ia32-unpacked";
            if (!isWindows) {
                dir = "./linux-unpacked";
            }
            let exe = "modloader64 gui.exe";
            if (!isWindows) {
                exe = "modloader64 gui";
            }
            process.chdir(original_dir);
            let file = dir + ".pak";
            if (!fs_1.default.existsSync(file)) {
                console.log("Downloading GUI files...");
                getBinaryContents(url);
            }
            if (!fs_1.default.existsSync(dir)) {
                child_process_1.default.execSync("paker -i " + file + " -o ./");
            }
            if (!fs_1.default.existsSync(path_1.default.resolve(dir, "ModLoader"))) {
                process.chdir(dir);
                console.log(process.cwd());
                child_process_1.default.execSync("\"" + exe + "\"");
                process.chdir(original_dir);
                fs_extra_1.default.removeSync(path_1.default.resolve(dir, "ModLoader/roms"));
                fs_extra_1.default.symlinkSync(path_1.default.resolve(sdk_cfg.ModLoader64.SDK.roms_dir), path_1.default.resolve(dir, "ModLoader/roms"));
                process.exit(1);
            }
            if (fs_extra_1.default.existsSync(path_1.default.resolve(dir, "ModLoader/ModLoader64-config.json"))) {
                if (!fs_1.lstatSync(path_1.default.resolve(dir, "ModLoader/ModLoader64-config.json")).isSymbolicLink()) {
                    process.chdir(original_dir);
                    fs_extra_1.default.removeSync(path_1.default.resolve(dir, "ModLoader/ModLoader64-config.json"));
                    fs_extra_1.default.symlinkSync(path_1.default.resolve("./ModLoader64-config.json"), path_1.default.resolve(dir, "ModLoader/ModLoader64-config.json"));
                }
            }
            fs_extra_1.default.removeSync(path_1.default.resolve(dir, "ModLoader/mods"));
            fs_extra_1.default.copySync("./build/src", path_1.default.resolve(dir, "ModLoader/mods"));
            process.chdir(dir);
            child_process_1.default.execSync("\"" + exe + "\" --devSkip");
            process.chdir(original_dir);
        }
        else {
            process.chdir(path_1.default.join(__dirname, "../"));
            let ml = child_process_1.default.exec(`npm run start -- --mods=${path_1.default.join(original_dir, "build", "src")} --cores=${path_1.default.resolve(".", "core_links", "node_modules")} --roms=${path_1.default.resolve(sdk_cfg.ModLoader64.SDK.roms_dir)} --config=${path_1.default.join(original_dir, "modloader64-config.json")} --startdir ${original_dir}`);
            //@ts-ignore
            ml.stdout.on('data', function (data) {
                console.log(data);
            });
            //@ts-ignore
            ml.on('error', (err) => {
                console.log(err);
            });
            //@ts-ignore
            ml.stderr.on('data', (data) => {
                console.log(data);
            });
        }
        process.chdir(original_dir);
    }
    if (commander_1.default.dist) {
        let original_dir = process.cwd();
        const fsExtra = require('fs-extra');
        fsExtra.emptyDirSync("./dist");
        if (!fs_1.default.existsSync("./dist")) {
            fs_1.default.mkdirSync("./dist");
        }
        let f1 = path_1.default.join(__dirname, "../");
        fs_extra_1.default.copySync("./build/src", "./dist");
        try {
            fs_extra_1.default.copySync("./build/cores", "./dist");
        }
        catch (err) { }
        process.chdir(path_1.default.join(".", "dist"));
        fs_1.default.readdirSync(".").forEach((file) => {
            let p = path_1.default.join(".", file);
            console.log(p);
            if (fs_1.default.lstatSync(p).isDirectory()) {
                let meta = path_1.default.join(p, "package.json");
                let alg = "";
                let m = JSON.parse(fs_1.default.readFileSync(meta).toString());
                if (m.hasOwnProperty("compression")) {
                    alg = "--algo=" + m["compression"];
                }
                child_process_1.default.execSync("node \"" + path_1.default.join(f1, "/bin/paker.js") + "\" --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\" " + alg);
                console.log("Generated pak for " + file + ".");
            }
        });
        process.chdir(original_dir);
    }
    if (commander_1.default.runp2) {
        console.log("Running mod. Please wait while we load the emulator...");
        let original_dir = process.cwd();
        let cfg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(original_dir, "modloader64-config.json")).toString());
        cfg["ModLoader64"]["isServer"] = false;
        cfg["NetworkEngine.Client"]["isSinglePlayer"] = false;
        fs_1.default.writeFileSync(path_1.default.join(original_dir, "modloader64-p2-config.json"), JSON.stringify(cfg, null, 2));
        process.chdir(path_1.default.join(__dirname, "../"));
        let ml = child_process_1.default.exec("npm run start_2 -- --mods=" + path_1.default.join(original_dir, "build", "src") + " --roms=" + path_1.default.resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path_1.default.resolve(".", "core_links", "node_modules") + " --config=" + path_1.default.join(original_dir, "modloader64-p2-config.json") + " --startdir " + original_dir);
        console.log("npm run start_2 -- --mods=" + path_1.default.join(original_dir, "build", "src") + " --roms=" + path_1.default.resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path_1.default.resolve(".", "core_links", "node_modules") + " --config=" + path_1.default.join(original_dir, "modloader64-p2-config.json") + " --startdir " + original_dir);
        //@ts-ignore
        ml.stdout.on('data', function (data) {
            console.log(data);
        });
        //@ts-ignore
        ml.on('error', (err) => {
            console.log(err);
        });
        //@ts-ignore
        ml.stderr.on('data', (data) => {
            console.log(data);
        });
        process.chdir(original_dir);
    }
    if (commander_1.default.update) {
        let original_dir = process.cwd();
        process.chdir(path_1.default.join(__dirname, "../"));
        console.log("Updating ModLoader64...");
        child_process_1.default.execSync("git reset --hard origin/master");
        child_process_1.default.execSync("git pull");
        fs_extra_1.default.removeSync("./node_modules");
        fs_extra_1.default.removeSync("./Mupen64Plus");
        if (fs_extra_1.default.existsSync("./build")) {
            fs_extra_1.default.removeSync("./build");
        }
        if (fs_extra_1.default.existsSync("./build2")) {
            fs_extra_1.default.removeSync("./build2");
        }
        let ml = child_process_1.default.exec("yarn");
        //@ts-ignore
        ml.stdout.on('data', function (data) {
            console.log(data);
        });
        ml.on('exit', () => {
            process.chdir(original_dir);
            updateCores();
        });
    }
    if (commander_1.default.install !== undefined) {
        if (commander_1.default.install.indexOf("https://") > -1) {
            install(commander_1.default.install);
        }
        else {
            console.log("Searching the nexus...");
            let core_repo = JSON.parse(getFileContents(CORE_REPO_URL));
            let mod_repo = JSON.parse(getFileContents(MOD_REPO_URL));
            if (Object.keys(core_repo).indexOf(commander_1.default.install) > -1) {
                console.log("Found " + commander_1.default.install + " in cores repo.");
                install(core_repo[commander_1.default.install].git);
            }
            else if (Object.keys(mod_repo).indexOf(commander_1.default.install) > -1) {
                console.log("Found " + commander_1.default.install + " in mods repo.");
                console.log("Installing pak file...");
                let update = JSON.parse(getFileContents(mod_repo[commander_1.default.install].url));
                getBinaryContents(update.url);
            }
        }
    }
    if (commander_1.default.template !== undefined) {
        let original_dir = process.cwd();
        process.chdir(path_1.default.join(__dirname, "../"));
        if (fs_extra_1.default.existsSync("./cores/" + commander_1.default.template)) {
            let t_path = path_1.default.join("./", "cores", commander_1.default.template);
            let meta = JSON.parse(fs_1.default.readFileSync(path_1.default.join(t_path, "package.json")).toString());
            let m_path = path_1.default.join(t_path, "src", meta.name);
            let meta2 = JSON.parse(fs_1.default.readFileSync(path_1.default.join(".", "package.json")).toString());
            fs_extra_1.default.copySync(m_path, path_1.default.join(original_dir, "src", meta2.name));
            let meta3 = JSON.parse(fs_1.default.readFileSync(path_1.default.join(original_dir, "src", meta2.name, "package.json")).toString());
            meta3.name = meta2.name;
            fs_extra_1.default.writeFileSync(path_1.default.join(original_dir, "src", meta2.name, "package.json"), JSON.stringify(meta3, null, 2));
        }
        else {
            console.log("Install the template first.");
        }
        process.chdir(original_dir);
    }
}
