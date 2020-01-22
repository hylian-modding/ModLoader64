import {
    ISaveContext,
    IOotHelper,
    IGlobalContext,
    ILink,
} from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import IMemory from 'modloader64_api/IMemory';

export class OotHelper extends JSONTemplate implements IOotHelper {
  private save: ISaveContext;
  private global: IGlobalContext;
  private link: ILink;
  private emu: IMemory;
  constructor(
      save: ISaveContext,
      global: IGlobalContext,
      link: ILink,
      memory: IMemory
  ) {
      super();
      this.save = save;
      this.global = global;
      this.link = link;
      this.emu = memory;
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
  isPaused(): boolean {
      return this.emu.rdramRead16(0x1c6fa0) !== 0x3;
  }
  isInterfaceShown(): boolean {
      return (
          this.emu.rdramRead8(global.ModLoader.save_context + 0xbe613) === 0xff
      );
  }

  toJSON() {
      let jsonObj: any = {};
      jsonObj['isTitleScreen'] = this.isTitleScreen();
      return jsonObj;
  }
}
