import {
    ISaveContext,
    IOotHelper,
    IGlobalContext,
    ILink,
} from 'modloader64_api/OOT/OOTAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import IMemory from 'modloader64_api/IMemory';
import { OOT_Offsets } from '../OcarinaofTime';

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
      return this.global.scene <= 0xFF;
  }
  isLinkEnteringLoadingZone(): boolean {
      let r = this.link.rawStateValue;
      return (r & 0x000000ff) === 1;
  }
  isPaused(): boolean {
      return this.emu.rdramRead16((global.ModLoader["offsets"]["link"] as OOT_Offsets).paused) !== 0x3;
  }
  isInterfaceShown(): boolean {
      return (
          this.emu.rdramRead8(global.ModLoader['gui_isShown']) === 0xff
      );
  }
  Player_InBlockingCsMode(): boolean{
    return ((this.link.rdramRead32(0x66C) & 0x20000080) !== 0) || (this.link.rdramRead8(0x0434) !== 0) || (this.emu.rdramReadPtr8(global.ModLoader['global_context_pointer'], 0x11E15) !== 0) ||
            ((this.link.rdramRead32(0x66C) & 1) !== 0) || ((this.link.rdramRead8(0x0682) & 0x80) !== 0) ||
            (this.emu.rdramRead16(global.ModLoader['save_context'] + 0x13F0) !== 0)
  }

  toJSON() {
      let jsonObj: any = {};
      jsonObj['isTitleScreen'] = this.isTitleScreen();
      return jsonObj;
  }
}
