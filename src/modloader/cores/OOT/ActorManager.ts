import { ActorCategory } from "modloader64_api/OOT/ActorCategory";
import { IActor } from "modloader64_api/OOT/IActor";
import { IActorManager } from "modloader64_api/OOT/OOTAPI";

export class ActorManager implements IActorManager {
    createIActorFromPointer(pointer: number): IActor {
        throw new Error("Method not implemented.");
    }
    getActors(category: ActorCategory): IActor[] {
        throw new Error("Method not implemented.");
    }
}
