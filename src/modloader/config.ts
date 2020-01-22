// Modloader configuration

import fs from 'fs';
import { IConfig } from 'modloader64_api/IModLoaderAPI';

class configuration implements IConfig {
  data: any = {};
  file: string;

  constructor(file: string) {
      this.file = file;
      if (global.ModLoader.hasOwnProperty("OVERRIDE_CONFIG_FILE")){
          this.file = global.ModLoader.OVERRIDE_CONFIG_FILE;
      }
      if (fs.existsSync(this.file)) {
          this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      } else {
          fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
      }
  }

  setData(category: string, key: string, value: any, override = false) {
      if (!this.data[category].hasOwnProperty(key) || override) {
          this.data[category][key] = value;
          this.save();
      }
  }

  registerConfigCategory(category: string): object {
      if (!this.data.hasOwnProperty(category)) {
          this.data[category] = {};
          this.save();
      }
      return this.data[category];
  }

  save() {
      fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }
}

export default configuration;
