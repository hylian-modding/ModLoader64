import gulp from 'gulp';
import fs from 'fs-extra';
import child_process from 'child_process';
var recursive = require("recursive-readdir");
var findRemoveSync = require('find-remove');
import zip from 'adm-zip';
import fse from 'fs-extra';
import crypto from 'crypto';
var copyNodeModules = require('copy-node-modules');
import path from 'path';

var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

function getAllFiles(dir: string, arr: string[]) {
    fs.readdirSync(dir).forEach((f: string) => {
        let file = path.resolve(dir, f);
        if (fs.existsSync(file) && !fs.lstatSync(file).isDirectory()) {
            arr.push(file);
        }
    });
    return arr;
}

function getAllFolders(dir: string, arr: string[]) {
    fs.readdirSync(dir).forEach((f: string) => {
        let file = path.resolve(dir, f);
        if (fs.existsSync(file) && fs.lstatSync(file).isDirectory()) {
            arr.push(file);
        }
    });
    return arr;
}

gulp.task('clean', function () {
    if (fs.existsSync("./build")) {
        fs.removeSync("./build");
    }
    if (fs.existsSync("./build2")) {
        fs.removeSync("./build2");
    }
    return gulp.src('.');
});

gulp.task('bump', function () {
    let original_dir: string = process.cwd();
    child_process.execSync("npm version --no-git-tag-version patch");
    let u: any = JSON.parse(fs.readFileSync("./update.json").toString());
    let p: any = JSON.parse(fs.readFileSync("./package.json").toString());
    u["version"] = p["version"];
    fs.writeFileSync("./update.json", JSON.stringify(u, null, 2));
    process.chdir("./src");
    child_process.execSync("npm version --no-git-tag-version patch");
    process.chdir(original_dir);
    return gulp.src('.');
});

gulp.task('dummy', function () {
    return gulp.src('.');
});

gulp.task('emulator', function () {
    let platformkey = '';
    if (process.arch === undefined) {
        platformkey = process.platform.trim() + 'x64';
    } else {
        platformkey = process.platform.trim() + process.arch;
    }
    let mupenAlreadyExists: boolean = false;
    if (!fs.existsSync("./Mupen64Plus")) {
        fs.mkdirSync("./Mupen64Plus");
    } else {
        mupenAlreadyExists = true;
    }
    if (!mupenAlreadyExists) {
        console.log(platformkey);
        if (platformkey.indexOf("win32") > -1) {
            if (platformkey.indexOf("64") > -1) {
                console.log("./node_modules/modloader64-platform-deps/Windows64/emulator.pak");
                fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows64/emulator.pak", "./Mupen64Plus/emulator.pak");
            } else {
                console.log("./node_modules/modloader64-platform-deps/Windows/emulator.pak");
                fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows/emulator.pak", "./Mupen64Plus/emulator.pak");
            }
        } else if (platformkey.indexOf("linux") > -1) {
            fs.copyFileSync("./node_modules/modloader64-platform-deps/Linux/emulator.pak", "./Mupen64Plus/emulator.pak");
        }
        child_process.execSync('node ./bin/paker.js -i ./Mupen64Plus/emulator.pak -o ./Mupen64Plus');
    }
    return gulp.src('.');
});

gulp.task('_dist', function () {
    let original_dir: string = process.cwd();
    fs.removeSync("./build/roms");
    const srcDir = '.';
    const dstDir = './build';
    fs.removeSync("./build/cores");
    fs.removeSync("./build/API");
    console.log("Copying node_modules...");
    copyNodeModules(srcDir, dstDir, { devDependencies: false }, (err: any, results: any) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!fs.existsSync("./build/node_modules/modloader64_api")) {
            fs.mkdirSync("./build/node_modules/modloader64_api");
        }
        fs.copySync("./API/build", "./build/node_modules/modloader64_api");
        if (fs.existsSync("./dist")) {
            fs.removeSync("./dist");
        }
        fs.mkdirSync("./dist");
        console.log("Putting together platform specific files...");
        fs.copySync("./build", "./dist/windows");
        fs.copySync("./build", "./dist/windows64");
        fs.copySync("./build", "./dist/linux");
        console.log("Copying emulator files...");

        fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows/emulator.pak", "./dist/windows/emulator_windows.pak");
        process.chdir("./dist/windows");
        child_process.execSync("paker -i ./emulator_windows.pak -o ./");
        process.chdir(original_dir);

        fs.copyFileSync("./node_modules/modloader64-platform-deps/Windows64/emulator.pak", "./dist/windows64/emulator_windows.pak");
        process.chdir("./dist/windows64");
        child_process.execSync("paker -i ./emulator_windows.pak -o ./");
        process.chdir(original_dir);

        fs.copyFileSync("./node_modules/modloader64-platform-deps/Linux/emulator.pak", "./dist/linux/emulator_linux.pak");
        process.chdir("./dist/linux");
        child_process.execSync("paker -i ./emulator_linux.pak -o ./");
        process.chdir(original_dir);

        if (fs.existsSync("./dist/windows/emulator_windows.pak")) {
            fs.unlinkSync("./dist/windows/emulator_windows.pak");
        }
        if (fs.existsSync("./dist/windows64/emulator_windows.pak")) {
            fs.unlinkSync("./dist/windows64/emulator_windows.pak");
        }
        if (fs.existsSync("./dist/windows64/emulator.pak")) {
            fs.unlinkSync("./dist/windows64/emulator.pak");
        }
        if (fs.existsSync("./dist/linux/emulator_linux.pak")) {
            fs.unlinkSync("./dist/linux/emulator_linux.pak");
        }
        console.log("Building paks...");
        process.chdir("./dist");

        fs.renameSync("./windows", "./ModLoader");
        child_process.execSync("paker --dir ./ModLoader --output ./");
        fs.renameSync("./ModLoader.pak", "./Windows.pak");
        let zipFile: zip = new zip();
        zipFile.addLocalFolder("./ModLoader", "./ModLoader");
        zipFile.writeZip("./ModLoader-win32.zip");
        fs.removeSync("./ModLoader");

        fs.renameSync("./windows64", "./ModLoader");
        child_process.execSync("paker --dir ./ModLoader --output ./");
        fs.renameSync("./ModLoader.pak", "./Windows64.pak");
        let zipFile4: zip = new zip();
        zipFile4.addLocalFolder("./ModLoader", "./ModLoader");
        zipFile4.writeZip("./ModLoader-win64.zip");
        fs.removeSync("./ModLoader");

        fs.renameSync("./linux", "./ModLoader");
        child_process.execSync("paker --dir ./ModLoader --output ./");
        fs.renameSync("./ModLoader.pak", "./Linux.pak");
        let zipFile2: zip = new zip();
        zipFile2.addLocalFolder("./ModLoader", "./ModLoader");
        zipFile2.writeZip("./ModLoader-linux64.zip");
        fs.removeSync("./ModLoader");
        process.chdir(original_dir);
        console.log("Building dedi tarball...");
        fs.copySync("./build", "./dist/dedi");
        process.chdir("./dist");
        let zipFile3: zip = new zip();
        zipFile3.addLocalFolder("./dedi", "");
        zipFile3.writeZip("./ModLoader-dedi.zip");
        process.chdir(original_dir);
        fs.removeSync("./dist/dedi");
        fs.copyFileSync("./update.json", "./dist/update.json");
    });
    return gulp.src('.');
});

gulp.task('dist', gulp.series(['_dist']));

gulp.task('prebuild', function () {
    if (!fs.existsSync("./cores")) {
        fs.mkdirSync("./cores");
    }

    if (!fs.existsSync("./mods")) {
        fs.mkdirSync("./mods");
    }

    if (!fs.existsSync("./roms")) {
        fs.mkdirSync("./roms");
    }

    if (!fs.existsSync("./build")) {
        fs.mkdirSync("./build");
    }

    if (!fs.existsSync("./build/src")) {
        fs.mkdirSync("./build/src");
    }

    if (!fs.existsSync("./build/mods")) {
        fs.mkdirSync("./build/mods");
    }

    if (!fs.existsSync("./build/roms")) {
        fs.mkdirSync("./build/roms");
        if (fs.existsSync("./roms")) {
            fs.copySync("./roms", "./build/roms");
        }
    }

    if (!fs.existsSync("./build/emulator")) {
        if (fs.existsSync("./Mupen64Plus/emulator.pak")) {
            fs.unlink("./Mupen64Plus/emulator.pak");
        }
        fs.copySync("./Mupen64Plus", "./build");
    }
    (async () => {
        const fetch = require('node-fetch');
        const response = await fetch('https://api.github.com/repos/hylian-modding/ModLoader64/contributors?anon=1');
        const body = await response.arrayBuffer();
        const buf = Buffer.from(body);
        const j = JSON.parse(buf.toString());
        fs.writeFileSync("./src/contributors1.json", JSON.stringify(j, null, 2));
    })();
    return gulp.src('.');
});

gulp.task('_build', function () {
    fs.copySync("./src", "./build/src");
    child_process.execSync("npx tsc");
    return gulp.src('.');
});

gulp.task('postbuild', function () {
    findRemoveSync('./src', { extensions: ['.js'] });
    findRemoveSync('./test', { extensions: ['.js'] });
    if (!fs.existsSync("./build2")) {
        fs.mkdirSync("./build2");
    }
    if (!fs.existsSync("./core_links")) {
        console.log("Creating core links folder...");
        let original_dir: string = process.cwd();
        fs.mkdirSync("./core_links");
        process.chdir("./core_links");
        console.log("invoking npm...");
        child_process.execSync("npm init --yes");
        console.log("invoking tsc...");
        child_process.execSync("npx tsc --init");
        console.log("invoking yarn...");
        child_process.execSync("yarn");
        process.chdir(original_dir);
        console.log("done.");
    }
    return gulp.src('.');
});

gulp.task("build", gulp.series(['prebuild', '_build', 'postbuild']));

gulp.task('_api', function () {
    let original_dir: string = process.cwd();
    process.chdir("./API");
    fs.copySync("./package.json", "./build/package.json");
    var uprocess = require("uprocess");
    var defines = {
        HAS_SAVESTATES: true,
        HAS_IMGUI: true,
        HAS_SDL: true,
        HAS_GFX: true,
        HAS_INPUT: true,
        HAS_YAZ0: true,
        IS_MUPEN: true
    };
    getAllFiles("./src", []).forEach((file: string) => {
        console.log(`Preprocess: ${file} -> ${path.resolve("./build", path.parse(file).base)}`);
        fs.writeFileSync(path.resolve("./build", path.parse(file).base), uprocess.processFile(file, defines));
    });
    getAllFolders("./src", []).forEach((folder: string) => {
        getAllFiles(folder, []).forEach((file: string) => {
            let fuck = path.resolve(`./build/${path.parse(folder).name}`, path.parse(file).base);
            console.log(`Preprocess: ${file} -> ${fuck}`);
            fs.copySync(file, path.resolve(`./build/${path.parse(folder).name}`, path.parse(file).base));
            fs.writeFileSync(path.resolve(`./build/${path.parse(folder).name}`, path.parse(file).base), uprocess.processFile(file, defines));
        });
    });
    child_process.execSync("npx tsc");
    process.chdir(original_dir);
    return gulp.src('.');
});

gulp.task("api_link", function () {
    let original_dir: string = process.cwd();
    process.chdir("./API/build");
    child_process.execSync("npm link");
    process.chdir(original_dir);
    child_process.execSync("npm link modloader64_api");
    return gulp.src('.');
});

gulp.task("api", gulp.series(['_api', 'api_link']));

gulp.task('player2', function () {
    if (fs.existsSync("./build2/ModLoader64-config.json")) {
        let config = JSON.parse(fs.readFileSync("./build2/ModLoader64-config.json", 'utf8'));
        config.ModLoader64.isServer = false;
        config["NetworkEngine.Client"].nickname = "Test";
        fs.writeFileSync("./build2/ModLoader64-config.json", JSON.stringify(config));
    }
    fs.copySync("./build", "./build2", {
        filter: (src: string, dest: string) => {
            if (src.indexOf("roms") > -1) {
                return false;
            }
            return true;
        }
    });
    return gulp.src('.');
});

gulp.task('sign', function () {
    recursive("./build", function (err: any, files: any) {
        for (let i = 0; i < files.length; i++) {
            let _path = path.resolve(files[i]);
            let _parse = path.parse(files[i]);
            if (_parse.ext === ".js" && _parse.name !== "index" && _parse.name !== "publicKey" && _parse.name !== "version") {
                let data = fs.readFileSync(_path);
                const private_key = fse.readFileSync('./privateKey.pem', 'utf-8');
                const signer = crypto.createSign('sha256');
                signer.update(data);
                signer.end();
                const signature = signer.sign(private_key);
                fs.writeFileSync(_path.replace(".js", ".mls"), JSON.stringify({ sig: signature.toString('base64'), code: data.toString('base64') }));
                fs.unlinkSync(_path);
            } else if (_path.indexOf(".js.map") > -1 || _parse.ext === ".ts") {
                fs.unlinkSync(_path);
            }
        }
    });
    return gulp.src('.');
});

gulp.task('build_bin', function () {
    return gulp.src('./bin/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('./bin'));
});

gulp.task('postinstall', function () {
    let original_dir: string = process.cwd();
    let rom_dir = path.join(original_dir, "roms");
    let cfg: any = {
        ModLoader64: {
            SDK: {
                roms_dir: rom_dir
            }
        }
    };

    if (!fs.existsSync(path.join(original_dir, "SDK-config.json"))) {
        fs.writeFileSync(path.join(original_dir, "SDK-config.json"), JSON.stringify(cfg, null, 2));
    }
    return gulp.src('.');
});

gulp.task("install", gulp.series(['api', 'emulator', 'build_bin', 'build', 'postinstall']));

gulp.task("default", gulp.series(['install']));