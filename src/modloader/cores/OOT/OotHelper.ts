import {
  ISaveContext,
  IOotHelper,
  IGlobalContext,
} from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from './JSONTemplate';

export class OotHelper extends JSONTemplate implements IOotHelper {
  private save: ISaveContext;
  private global: IGlobalContext;
  constructor(save: ISaveContext, global: IGlobalContext) {
    super();
    this.save = save;
    this.global = global;
  }
  isTitleScreen(): boolean {
    return this.save.checksum === 0;
  }
  isSceneNumberValid(): boolean {
    return this.global.scene <= 101;
  }
  toJSON() {
    let jsonObj: any = {};
    jsonObj['isTitleScreen'] = this.isTitleScreen();
    return jsonObj;
  }
}
