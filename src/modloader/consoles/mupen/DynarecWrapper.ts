import IDynarecCache from "modloader64_api/IDynarecCache";
import { IMupen } from "./IMupen";

export default class DynarecWrapper implements IDynarecCache{

    mupen: IMupen;
    og: Function;

    constructor(mupen: IMupen){
        this.mupen = mupen;
        this.og = this.mupen.M64p.Memory.invalidateCachedCode;
        this.mupen.M64p.Memory.invalidateCachedCode = this.invalidateCachedCode.bind(this);
    }

    invalidateCachedCode(address?: number, size?: number, forced?: boolean): void {
        this.og();
    }

}