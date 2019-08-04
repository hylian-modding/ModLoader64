import { IModLoaderAPI, ICore } from 'modloader64_api/IModLoaderAPI'
import * as API from 'modloader64_api/BT/Api'

export class Banjo extends API.APIObject implements API.IBanjo {
    private instance: number = global.ModLoader["banjo"]
    
    exists(): boolean {
        return !(this.emulator.rdramRead32(this.instance) === 0x0000)
    }
}

export class Runtime extends API.APIObject implements API.IRuntime {
    private instance: number = global.ModLoader["runtime"]

}

export class SaveContext extends API.APIObject implements API.ISaveContext {
    private instance: number = global.ModLoader["save_context"]

}

export class BanjoTooie implements ICore, API.IBTCore {
    header: string = "BANJO TOOIE"
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI
    eventTicks: Map<string, Function> = new Map<string, Function>()

    banjo!: API.IBanjo
    runtime!: API.IRuntime
    save!: API.ISaveContext

    preinit(): void { 
        global.ModLoader["banjo"] = 0x0 // PLACEHOLDER
        global.ModLoader["runtime"] = 0x0 // PLACEHOLDER
        global.ModLoader["save_context"] = 0x0 // PLACEHOLDER
    }

    init(): void {

    }

    postinit(): void {
        this.banjo = new Banjo(this.ModLoader.emulator)
        this.runtime = new Runtime(this.ModLoader.emulator)
        this.save = new SaveContext(this.ModLoader.emulator)
    }

    onTick(): void { 
        this.eventTicks.forEach((value: Function, key: string) => {
            value()
        })
    }    
}

export default BanjoTooie