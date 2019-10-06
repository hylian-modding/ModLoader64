import { ILogger } from 'modloader64_api/IModLoaderAPI';
import { IOOTCore, AmmoUpgrade } from 'modloader64_api/OOT/OOTAPI';

export class EquipmentTests {
  logger: ILogger;
  core: IOOTCore;
  tests: Function[] = new Array<Function>();
  tick!: any;
  isTicking = false;

  constructor(logger: ILogger, core: IOOTCore) {
    this.logger = logger;
    this.core = core;
    let fn: Function = (field: string) => {
      this.tests.push(() => {
        (this.core.save.inventory as any)[field] = AmmoUpgrade.BASE;
        this.logger.info(field + ' 1');
      });
      this.tests.push(() => {
        (this.core.save.inventory as any)[field] = AmmoUpgrade.UPGRADED;
        this.logger.info(field + ' 2');
      });
      this.tests.push(() => {
        (this.core.save.inventory as any)[field] = AmmoUpgrade.MAX;
        this.logger.info(field + ' 3');
      });
      this.tests.push(() => {
        (this.core.save.inventory as any)[field] = AmmoUpgrade.NONE;
        this.logger.info(field + ' 0');
      });
    };

    fn('bombBag');
    fn('bulletBag');
    fn('dekuNutsCapacity');
    fn('dekuSticksCapacity');
    fn('quiver');
    fn('strength');
    fn('swimming');
    fn('wallet');
  }

  startTicking() {
    this.tick = setInterval(() => {
      if (this.tests.length > 0) {
        let test: Function = this.tests.shift() as Function;
        test();
      }
    }, 10 * 1000);
    this.isTicking = true;
  }
}
