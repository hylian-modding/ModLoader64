import { Pak } from 'modloader64_api/PakFormat';
import fs from 'fs';
import path from 'path';
import request from 'request';
const download = require('download-file');
import fse from 'fs-extra';
import { ncp } from 'ncp';

request(
  'https://nexus.inpureprojects.info/ModLoader64/update/update.json',
  (error, response, body) => {
    if (!error && response.statusCode === 200) {
      if (fs.existsSync('./ModLoader.pak')) {
        fse.removeSync('./ModLoader/src');
        let pak: Pak = new Pak('./ModLoader.pak');
        pak.extractAll('./');
        fs.unlinkSync('./ModLoader.pak');
        process.exit(1852400485);
      }
      const fbResponse = JSON.parse(body);
      console.log('Got a response: ', fbResponse);
      let version = 'Nothing';
      console.log(path.resolve('./update.json'));
      let data: any = {};
      if (fs.existsSync('./update.json')) {
        data = JSON.parse(fs.readFileSync('./update.json').toString());
        version = data.version;
      }
      let options = {
        directory: './',
        filename: 'ModLoader.pak',
      };
      let platformkey = '';
      if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
        platformkey = process.platform.trim() + 'x64';
      } else {
        platformkey =
          process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
      }
      console.log(platformkey);
      if (version !== fbResponse.version) {
        fs.writeFileSync('./update.json', JSON.stringify(fbResponse));
        data = JSON.parse(fs.readFileSync('./update.json').toString());
        download(data[platformkey], options, function(err: any) {
          if (err) throw err;
          if (fs.existsSync('./ModLoader.pak')) {
            fse.removeSync('./src');
            let pak: Pak = new Pak('./ModLoader.pak');
            pak.extractAll('./');
            fs.unlinkSync('./ModLoader.pak');
            ncp('./ModLoader', './', function(err) {
              if (err) {
                return console.error(err);
              }
              fse.removeSync('./ModLoader');
              console.log('done!');
            });
          }
        });
      }
    } else {
      console.log(
        'Got an error: ',
        error,
        ', status code: ',
        response.statusCode
      );
    }
  }
);
