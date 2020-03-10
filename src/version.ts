import fse from 'fs-extra';
import path from 'path';

module.exports = JSON.parse(fse.readFileSync(path.join(__dirname, "package.json")).toString())["version"];