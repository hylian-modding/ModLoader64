import IMemory from '../IMemory'

export * from './BKAPI_BITMAP'
export * from './BKAPI_ENUM'
export * from './BKAPI_INTERFACE'

export class APIObject {
    protected emulator: IMemory

    constructor(emu: IMemory) {
        this.emulator = emu
    }

    toJSON() {
        const proto = Object.getPrototypeOf(this)
        const jsonObj: any = Object.assign({}, this)

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this as any)[key]
                        jsonObj[key] = val
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error)
                    }
                }
            })

        return jsonObj
    }
}