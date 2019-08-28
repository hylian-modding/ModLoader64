import { IActorDeathFile, ActorDeathBehavior } from '../Actor';

export class En_St implements IActorDeathFile {
  id = 0x37;
  death: ActorDeathBehavior = new ActorDeathBehavior(0x180, 0x1c8c);
}
