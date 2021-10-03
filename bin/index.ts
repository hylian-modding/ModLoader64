#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import fs, { lstatSync } from 'fs';
import child_process from 'child_process';
import fse from 'fs-extra';
import crypto from 'crypto';
const isElevated = require('is-elevated');
const stripJsonComments = require('strip-json-comments');

let platformkey = '';
if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
    platformkey = process.platform.trim() + 'x64';
} else {
    platformkey = process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
}

program.option('-n, --init', 'init new project');
program.option('-b, --build', 'build mod');
program.option('-r, --run', 'run mod');
program.option('-d, --dist', 'pack mod');
program.option("-2, --runp2", "run p2");
program.option("-u, --update", "update");
program.option("-q, --bumpversion", "bump version number");
program.option("-i, --install <url>", "install dependency");
program.option("-s, --setroms <path>", "set rom directory");
program.option("-c, --clean", "cleans build dirs");
program.option("-z, --rebuildsdk", "rebuild sdk");
program.option("-t, --template <template>", "make project from template");
program.option("-e, --external <tool>");
program.option("-w, --window gui window");
program.option("-f, --sign <dir>", "sign files in a directory");

program.allowUnknownOption(true);
program.parse(process.argv);

interface SDK_Cat {
    roms_dir: string;
}

interface ModLoader64_Cat {
    SDK: SDK_Cat;
}

interface SDKCFG {
    ModLoader64: ModLoader64_Cat;
}

function makeSymlink(src: string, dest: string) {
    try {
        let p = path.parse(dest);
        if (!fs.existsSync(p.dir)) {
            fs.mkdirSync(p.dir);
        }
        fse.symlinkSync(src, dest, 'junction');
    } catch (err) {
        console.log(err);
    }
}

let original_dir: string = process.cwd();
process.chdir(path.join(__dirname, "../"));
if (!fs.existsSync("./SDK-config.json")) {
    console.log("This copy of the ModLoader64 SDK appears to have been improperly installed. Please consult the instructions and reinstall.");
}
let sdk_cfg: SDKCFG = JSON.parse(fs.readFileSync("./SDK-config.json").toString());
process.chdir(original_dir);

let tsconfig_path: string = path.resolve(path.join("./", "tsconfig.json"));
let tsconfig!: any;
if (fs.existsSync(tsconfig_path)) {
    tsconfig = JSON.parse(stripJsonComments(fs.readFileSync(tsconfig_path).toString()));
}

const MOD_REPO_URL: string = "https://nexus.inpureprojects.info/ModLoader64/repo/mods.json";
const CORE_REPO_URL: string = "https://nexus.inpureprojects.info/ModLoader64/repo/cores.json";
const GUI_SDK_URL: string = "https://nexus.inpureprojects.info/ModLoader64/launcher/sdk/win-ia32-unpacked.pak";
const GUI_SDK_URL_UNIX: string = "https://nexus.inpureprojects.info/ModLoader64/launcher/sdk/linux-unpacked.pak";

// I'm legit just wrapping curl right here... its built into win10 these days should be ok.
function getFileContents(url: string) {
    return child_process.execFileSync('curl', ['--silent', '-L', url], { encoding: 'utf8' });
}
function getBinaryContents(url: string) {
    return child_process.execFileSync('curl', ['-O', '--silent', '-L', url], { encoding: 'utf8' });
}

function saveTSConfig() {
    fs.writeFileSync(tsconfig_path, JSON.stringify(tsconfig, null, 2));
}

let WAITING_ON_EXTERNAL: boolean = false;

if (program.external !== undefined) {
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    let p = path.join(".", "tools", program.external);
    if (fs.existsSync(p)) {
        let meta: any = JSON.parse(fs.readFileSync(path.join(p, "package.json")).toString());
        let s = meta.main;
        let f = path.resolve(path.join(p, s));
        process.chdir(original_dir);
        child_process.fork(f, process.argv);
        WAITING_ON_EXTERNAL = true;
    }
    process.chdir(original_dir);
}

function updateCores() {
    let original_dir: string = process.cwd();
    let deps_dir: string = path.join("./", "external_cores");
    if (!fse.existsSync(deps_dir)) {
        return;
    }
    process.chdir(deps_dir);
    let cores: Array<string> = [];
    fs.readdirSync("./").forEach((file: string) => {
        let f: string = path.join("./", file);
        if (fs.lstatSync(f).isDirectory()) {
            let b2: string = process.cwd();
            process.chdir(path.join("./", f));
            cores.push(path.resolve("./build/cores"));
            child_process.execSync("git reset --hard origin/master");
            child_process.execSync("git pull");
            console.log(process.cwd());
            let meta2: any = JSON.parse(fs.readFileSync("./package.json").toString());
            console.log("Updating " + meta2.name);
            if (meta2.hasOwnProperty("dependencies")) {
                Object.keys(meta2.dependencies).forEach((key: string) => {
                    delete meta2.dependencies[key];
                });
            }
            if (meta2.hasOwnProperty("devDependencies")) {
                Object.keys(meta2.devDependencies).forEach((key: string) => {
                    delete meta2.dependencies[key];
                });
            }
            fse.writeFileSync("./package.json", JSON.stringify(meta2, null, 2));
            fse.removeSync("./node_modules");
            child_process.execSync("npm install");
            child_process.execSync("modloader64 -nbd");
            process.chdir(b2);
        }
    });
    process.chdir(original_dir);
}

function installCores() {
    let m_path: string = "./package.json";
    let meta: any = JSON.parse(fs.readFileSync(m_path).toString());
    if (!meta.hasOwnProperty("modloader64_deps")) {
        meta["modloader64_deps"] = {};
    }
    let mm_path: string = path.resolve(".", "src", meta.name, "package.json");
    if (!fs.existsSync(mm_path)) {
        mm_path = path.resolve(".", "cores", meta.name, "package.json");
    }
    let mod_meta: any = JSON.parse(fs.readFileSync(mm_path).toString());
    if (!mod_meta.hasOwnProperty("modloader64_deps")) {
        mod_meta["modloader64_deps"] = {};
    }
    Object.keys(mod_meta["modloader64_deps"]).forEach((key: string) => {
        install(mod_meta["modloader64_deps"][key]);
    });
}

function install(url: string) {
    console.log("Installing " + url + "...");
    let original_dir: string = process.cwd();
    process.chdir(path.join(__dirname, "../"));
    if (!fs.existsSync("./core_links")){
        fs.mkdirSync("./core_links");
        process.chdir("./core_links");
        child_process.execSync("npm init --yes");
        child_process.execSync("npx tsc --init");
        child_process.execSync("yarn");
        process.chdir("../");
    }
    process.chdir("./cores");
    let dir: string = path.parse(url).name;
    if (fs.existsSync(`./${dir}`)) {
        console.log(`This core is already installed at ${path.resolve(`./${dir}`)}. Linking...`);
        process.chdir(`./${dir}`);
        process.chdir("./build");
        process.chdir("./cores");
        let dir_to_link: string = ".";
        fs.readdirSync(".").forEach((file: string) => {
            let p = path.resolve(".", file);
            if (fs.lstatSync(p)) {
                dir_to_link = p;
            }
        });
        process.chdir(dir_to_link);
        dir = path.parse(dir_to_link).name;
    } else {
        child_process.execSync(`git clone ${url} ${dir}`);
        process.chdir(`./${dir}`);
        child_process.execSync("modloader64 -ncbd");
        child_process.execSync("yarn");
        process.chdir("./build");
        process.chdir("./cores");
        let dir_to_link: string = ".";
        fs.readdirSync(".").forEach((file: string) => {
            let p = path.resolve(".", file);
            if (fs.lstatSync(p)) {
                dir_to_link = p;
            }
        });
        process.chdir(dir_to_link);
        dir = path.parse(dir_to_link).name;
        child_process.execSync("yarn link");
        process.chdir(original_dir);
        process.chdir(path.join(__dirname, "../"));
        process.chdir("./core_links");
        child_process.execSync(`yarn link ${dir}`);
    }
    process.chdir(original_dir);
    child_process.execSync(`yarn link ${dir}`);
}

if (!WAITING_ON_EXTERNAL) {
    if (program.rebuildsdk) {
        console.log("Rebuilding SDK...");
        let original_dir: string = process.cwd();
        process.chdir(path.join(__dirname, "../"));
        child_process.execSync("yarn");
        process.chdir(original_dir);
    }

    if (program.init) {
        let original_dir: string = process.cwd();
        console.log("Generating mod scaffolding...");
        if (!fs.existsSync("./package.json")){
            child_process.execSync("npm init --yes");
        }
        let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
        if (!fs.existsSync("./src")) {
            fs.mkdirSync("./src");
            fs.mkdirSync("./src/" + meta.name);
            process.chdir("./src/" + meta.name);
            child_process.execSync("npm init --yes");
        }
        try {
            process.chdir("./src/" + meta.name);
            child_process.execSync("yarn");
        } catch (err) { }
        process.chdir(original_dir);
        let mod_pkg: any = JSON.parse(fs.readFileSync(path.join(".", "package.json")).toString());
        if (mod_pkg.hasOwnProperty("dependencies")) {
            Object.keys(mod_pkg.dependencies).forEach((key: string) => {
                delete mod_pkg.dependencies[key];
            });
        }
        if (mod_pkg.hasOwnProperty("devDependencies")) {
            Object.keys(mod_pkg.devDependencies).forEach((key: string) => {
                delete mod_pkg.dependencies[key];
            });
        }
        fs.writeFileSync(path.join(".", "package.json"), JSON.stringify(mod_pkg, null, 2));
        child_process.execSync("yarn");
        if (!fs.existsSync("./node_modules")) {
            fs.mkdirSync("./node_modules");
        }
        console.log("Linking ModLoader64 API to project...");
        console.log("This might take a moment. Please be patient.");
        let our_pkg: any = JSON.parse(fs.readFileSync(path.join(__dirname, "../", "package.json")).toString());
        Object.keys(our_pkg.dependencies).forEach((key: string) => {
            makeSymlink(path.resolve(__dirname, "../", "node_modules", key), path.resolve(original_dir, "node_modules", key));
        });
        Object.keys(our_pkg.devDependencies).forEach((key: string) => {
            makeSymlink(path.resolve(__dirname, "../", "node_modules", key), path.resolve(original_dir, "node_modules", key));
        });
        makeSymlink(path.resolve(__dirname, "../", "node_modules", "modloader64_api"), path.resolve(original_dir, "node_modules", "modloader64_api"));
        console.log("Setting up TypeScript compiler...");
        child_process.execSync("npx tsc --init");
        fs.copyFileSync(path.join(__dirname, "../", "tsconfig.json"), "./tsconfig.json");
        if (fs.existsSync(tsconfig_path)) {
            tsconfig = JSON.parse(stripJsonComments(fs.readFileSync(tsconfig_path).toString()));
        }
        tsconfig["compilerOptions"]["paths"]["@" + meta.name + "/*"] = ["./src/" + meta.name + "/*"];
        saveTSConfig();
        console.log("Installing any required cores...");
        installCores();
    }

    if (program.setroms !== undefined) {
        sdk_cfg.ModLoader64.SDK.roms_dir = path.resolve(program.setroms);
        let original_dir: string = process.cwd();
        process.chdir(path.join(__dirname, "../"));
        fs.writeFileSync("./SDK-config.json", JSON.stringify(sdk_cfg, null, 2));
        process.chdir(original_dir);
    }

    if (program.bumpversion) {
        let original_dir: string = process.cwd();
        child_process.execSync("npm version --no-git-tag-version patch");
        let meta: any = JSON.parse(fs.readFileSync("./package.json").toString());
        let p: string = "./src/" + meta.name;
        process.chdir(p);
        child_process.execSync("npm version --no-git-tag-version patch");
        meta = JSON.parse(fs.readFileSync("./package.json").toString());
        console.log("New version number: " + meta.version);
        process.chdir(original_dir);
    }

    if (program.clean) {
        fse.removeSync("./build");
        fse.removeSync("./build2");
        fse.removeSync("./dist");
    }

    if (program.build) {
        let original_dir: string = process.cwd();
        let meta: string = path.join(process.cwd(), "package.json");
        let m = JSON.parse(fs.readFileSync(meta).toString());
        console.log("Building mod. Please wait...");
        if (!fs.existsSync("./cores")) {
            fs.mkdirSync("./cores");
        }
        if (m.hasOwnProperty("scripts")) {
            if (m.scripts.hasOwnProperty("ML64Prebuild")) {
                console.log("Executing prebuild script...");
                console.log(child_process.execSync("npm run ML64Prebuild").toString());
            }
        }
        if (fs.existsSync("gulpfile.ts") || fs.existsSync("gulpfile.js")) {
            console.log("Using custom gulpfile.");
            child_process.execSync("gulp", {stdio: "inherit"});
        } else {
            try {
                child_process.execSync("npx tsc");
            } catch (err) {
                if (err) {
                    throw Error(err.stdout.toString());
                }
            }
        }
        fse.copySync("./src", "./build/src");
        if (!fs.existsSync("./build/cores")) {
            fs.mkdirSync("./build/cores");
        }
        fse.copySync("./cores", "./build/cores");
        if (m.hasOwnProperty("scripts")) {
            if (m.scripts.hasOwnProperty("ML64Postbuild")) {
                console.log("Executing postbuild script...");
                console.log(child_process.execSync("npm run ML64Postbuild").toString());
            }
        }
        process.chdir(original_dir);
    }

    if (program.sign) {
        var recursive = require("recursive-readdir");
        let original_dir: string = process.cwd();
        recursive(program.sign, function (err: any, files: any) {
            for (let i = 0; i < files.length; i++) {
                let _path = path.resolve(files[i]);
                let _parse = path.parse(files[i]);
                if (_parse.dir.indexOf("node_modules") > -1) continue;
                if (_parse.ext === ".js") {
                    let data = fs.readFileSync(_path);
                    const private_key = fse.readFileSync(path.resolve(__dirname, "..", "privateKey.pem"), 'utf-8')
                    const signer = crypto.createSign('sha256');
                    signer.update(data);
                    signer.end();
                    const signature = signer.sign(private_key)
                    fs.writeFileSync(_path.replace(".js", ".mls"), JSON.stringify({ sig: signature.toString('base64'), code: data.toString('base64') }));
                    fs.unlinkSync(_path);
                } else if (_path.indexOf(".js.map") > -1 || _parse.ext === ".ts") {
                    fs.unlinkSync(_path)
                }
            }
        });
        process.chdir(original_dir);
    }

    if (program.run) {
        console.log("Running mod. Please wait while we load the emulator...");
        let original_dir: string = process.cwd();
        if (program.window) {
            let isWindows: boolean = platformkey.indexOf("win32") > -1;
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
            let file: string = dir + ".pak";
            if (!fs.existsSync(file)) {
                console.log("Downloading GUI files...");
                getBinaryContents(url);
            }
            if (!fs.existsSync(dir)) {
                child_process.execSync("paker -i " + file + " -o ./");
            }
            if (!fs.existsSync(path.resolve(dir, "ModLoader"))) {
                process.chdir(dir);
                console.log(process.cwd());
                child_process.execSync("\"" + exe + "\"");
                process.chdir(original_dir);
                fse.removeSync(path.resolve(dir, "ModLoader/roms"));
                fse.symlinkSync(path.resolve(sdk_cfg.ModLoader64.SDK.roms_dir), path.resolve(dir, "ModLoader/roms"));
                process.exit(1);
            }
            if (fse.existsSync(path.resolve(dir, "ModLoader/ModLoader64-config.json"))) {
                if (!lstatSync(path.resolve(dir, "ModLoader/ModLoader64-config.json")).isSymbolicLink()) {
                    process.chdir(original_dir);
                    fse.removeSync(path.resolve(dir, "ModLoader/ModLoader64-config.json"));
                    fse.symlinkSync(path.resolve("./ModLoader64-config.json"), path.resolve(dir, "ModLoader/ModLoader64-config.json"));
                }
            }
            fse.removeSync(path.resolve(dir, "ModLoader/mods"));
            fse.copySync("./build/src", path.resolve(dir, "ModLoader/mods"));
            process.chdir(dir);
            child_process.execSync("\"" + exe + "\" --devSkip");
            process.chdir(original_dir);
        } else {
            process.chdir(path.join(__dirname, "../"));
            let ml = child_process.exec(`npm run start -- --mods=${path.join(original_dir, "build", "src")} --cores=${path.resolve(".", "core_links", "node_modules")} --roms=${path.resolve(sdk_cfg.ModLoader64.SDK.roms_dir)} --config=${path.join(original_dir, "modloader64-config.json")} --startdir ${original_dir}`);
            //@ts-ignore
            ml.stdout.on('data', function (data) {
                console.log(data);
            });
            //@ts-ignore
            ml.on('error', (err: Error) => {
                console.log(err);
            });
            //@ts-ignore
            ml.stderr.on('data', (data) => {
                console.log(data);
            });
        }
        process.chdir(original_dir);
    }

    if (program.dist) {
        let original_dir: string = process.cwd();
        const fsExtra = require('fs-extra');
        fsExtra.emptyDirSync("./dist");
        if (!fs.existsSync("./dist")) {
            fs.mkdirSync("./dist");
        }
        let f1: string = path.join(__dirname, "../");
        fse.copySync("./build/src", "./dist");
        try{
            fse.copySync("./build/cores", "./dist");
        }catch(err){}
        process.chdir(path.join(".", "dist"));
        fs.readdirSync(".").forEach((file: string) => {
            let p: string = path.join(".", file);
            console.log(p);
            if (fs.lstatSync(p).isDirectory()) {
                let meta: string = path.join(p, "package.json");
                let alg = "";
                let m = JSON.parse(fs.readFileSync(meta).toString());
                if (m.hasOwnProperty("compression")) {
                    alg = "--algo=" + m["compression"];
                }
                child_process.execSync("node \"" + path.join(f1, "/bin/paker.js") + "\" --dir=\"" + "./" + p + "\" --output=\"" + "./" + "\" " + alg);
                console.log("Generated pak for " + file + ".");
            }
        });
        process.chdir(original_dir);
    }

    if (program.runp2) {
        console.log("Running mod. Please wait while we load the emulator...");
        let original_dir: string = process.cwd();
        let cfg: any = JSON.parse(fs.readFileSync(path.join(original_dir, "modloader64-config.json")).toString());
        cfg["ModLoader64"]["isServer"] = false;
        cfg["NetworkEngine.Client"]["isSinglePlayer"] = false;
        fs.writeFileSync(path.join(original_dir, "modloader64-p2-config.json"), JSON.stringify(cfg, null, 2));
        process.chdir(path.join(__dirname, "../"));
        let ml = child_process.exec("npm run start_2 -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path.resolve(".", "core_links", "node_modules") + " --config=" + path.join(original_dir, "modloader64-p2-config.json") + " --startdir " + original_dir);
        console.log("npm run start_2 -- --mods=" + path.join(original_dir, "build", "src") + " --roms=" + path.resolve(sdk_cfg.ModLoader64.SDK.roms_dir) + " --cores=" + path.resolve(".", "core_links", "node_modules") + " --config=" + path.join(original_dir, "modloader64-p2-config.json") + " --startdir " + original_dir);
        //@ts-ignore
        ml.stdout.on('data', function (data) {
            console.log(data);
        });
        //@ts-ignore
        ml.on('error', (err: Error) => {
            console.log(err);
        });
        //@ts-ignore
        ml.stderr.on('data', (data) => {
            console.log(data);
        });
        process.chdir(original_dir);
    }

    if (program.update) {
        let original_dir: string = process.cwd();
        process.chdir(path.join(__dirname, "../"));
        console.log("Updating ModLoader64...");
        child_process.execSync("git reset --hard origin/master");
        child_process.execSync("git pull");
        fse.removeSync("./node_modules");
        fse.removeSync("./Mupen64Plus");
        if (fse.existsSync("./build")) {
            fse.removeSync("./build");
        }
        if (fse.existsSync("./build2")) {
            fse.removeSync("./build2");
        }
        let ml = child_process.exec("yarn");
        //@ts-ignore
        ml.stdout.on('data', function (data) {
            console.log(data);
        });
        ml.on('exit', () => {
            process.chdir(original_dir);
            updateCores();
        });
    }

    if (program.install !== undefined) {
        if (program.install.indexOf("https://") > -1) {
            install(program.install);
        } else {
            console.log("Searching the nexus...");
            let core_repo: any = JSON.parse(getFileContents(CORE_REPO_URL));
            let mod_repo: any = JSON.parse(getFileContents(MOD_REPO_URL));
            if (Object.keys(core_repo).indexOf(program.install) > -1) {
                console.log("Found " + program.install + " in cores repo.");
                install(core_repo[program.install].git);
            } else if (Object.keys(mod_repo).indexOf(program.install) > -1) {
                console.log("Found " + program.install + " in mods repo.");
                console.log("Installing pak file...");
                let update: any = JSON.parse(getFileContents(mod_repo[program.install].url));
                getBinaryContents(update.url);
            }
        }
    }

    if (program.template !== undefined) {
        let original_dir: string = process.cwd();
        process.chdir(path.join(__dirname, "../"));
        if (fse.existsSync("./cores/" + program.template)) {
            let t_path: string = path.join("./", "cores", program.template);
            let meta: any = JSON.parse(fs.readFileSync(path.join(t_path, "package.json")).toString());
            let m_path: string = path.join(t_path, "src", meta.name);
            let meta2: any = JSON.parse(fs.readFileSync(path.join(".", "package.json")).toString());
            fse.copySync(m_path, path.join(original_dir, "src", meta2.name));
            let meta3: any = JSON.parse(fs.readFileSync(path.join(original_dir, "src", meta2.name, "package.json")).toString());
            meta3.name = meta2.name;
            fse.writeFileSync(path.join(original_dir, "src", meta2.name, "package.json"), JSON.stringify(meta3, null, 2));
        } else {
            console.log("Install the template first.");
        }
        process.chdir(original_dir);
    }
}