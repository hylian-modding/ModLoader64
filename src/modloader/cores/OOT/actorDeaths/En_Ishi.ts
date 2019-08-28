import { IActorDeathFile, ActorDeathBehavior } from '../Actor';

export class En_Ishi implements IActorDeathFile {
  id = 0x14e;
  death: ActorDeathBehavior = new ActorDeathBehavior(0x13c, 0x10ac);
}
