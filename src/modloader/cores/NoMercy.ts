import { ICore, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';

export class NoMercy implements ICore {
  header = 'WWF No Mercy';
  ModLoader!: IModLoaderAPI;
  rom_header?: IRomHeader | undefined;

  preinit(): void {}
  init(): void {}
  postinit(): void {}
  onTick(frame?: number | undefined): void {}
}
