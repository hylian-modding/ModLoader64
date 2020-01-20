"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function InjectCore() {
    return function (target, key) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.InjectCore === undefined) {
            target.ModLoader['InjectCore'] = new Map();
        }
        target.ModLoader.InjectCore.set('field', () => key);
    };
}
exports.InjectCore = InjectCore;
function setupCoreInject(instance, core) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty('InjectCore')) {
            // Inject the core.
            Object.defineProperty(instance, p.ModLoader.InjectCore.get('field')(), {
                value: core,
                writable: false,
            });
        }
    }
}
exports.setupCoreInject = setupCoreInject;
//# sourceMappingURL=CoreInjection.js.map