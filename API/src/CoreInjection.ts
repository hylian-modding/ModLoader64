import { ICore } from './IModLoaderAPI';

export function InjectCore() {
    return function(target: any, key: string) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.InjectCore === undefined) {
            target.ModLoader['InjectCore'] = new Map<string, string>();
        }
        target.ModLoader.InjectCore.set('field', key);
    };
}

export function setupCoreInject(instance: any, core: ICore) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")){
            return;
        }
        if (p.ModLoader.hasOwnProperty('InjectCore')) {
            // Inject the core.
            Object.defineProperty(instance, p.ModLoader.InjectCore.get('field'), {
                value: core,
                writable: false,
            });
        }
    }
}
