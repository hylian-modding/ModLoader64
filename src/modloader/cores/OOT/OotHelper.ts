import {
  ISaveContext,
  IOotHelper,
  IGlobalContext,
  ILink,
} from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export class OotHelper extends JSONTemplate implements IOotHelper {
  private save: ISaveContext;
  private global: IGlobalContext;
  private link: ILink;
  constructor(save: ISaveContext, global: IGlobalContext, link: ILink) {
    super();
    this.save = save;
    this.global = global;
    this.link = link;
  }
  isTitleScreen(): boolean {
    return this.save.checksum === 0;
  }
  isSceneNumberValid(): boolean {
    return this.global.scene <= 101;
  }
  isLinkEnteringLoadingZone(): boolean {
    let r = this.link.rawStateValue;
    return (r & 0x000000ff) === 1;
  }
  toJSON() {
    let jsonObj: any = {};
    jsonObj['isTitleScreen'] = this.isTitleScreen();
    return jsonObj;
  }
}
