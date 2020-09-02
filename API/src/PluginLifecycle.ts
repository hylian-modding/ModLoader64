import { EventEmitter } from "events";

export class LifecycleEventBus extends EventEmitter { }

export const lifecyclebus: LifecycleEventBus = new LifecycleEventBus();

export const enum LifeCycleEvents {
    PREINIT = "preinit",
    INIT = "init",
    POSTINIT = "postinit",
    ONTICK = "ontick",
    ONPOSTTICK = 'onposttick',
    ONVIUPDATE = 'onviupdate',
    ONCREATERESOURCES = 'oncreateresources'
}

export function Preinit() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.Preinit === undefined) {
            target.ModLoader.Lifecycle['Preinit'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.Preinit.set("Preinit", propertyKey);
    };
}

export function Init() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.Init === undefined) {
            target.ModLoader.Lifecycle['Init'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.Init.set("Init", propertyKey);
    };
}

export function Postinit() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.Postinit === undefined) {
            target.ModLoader.Lifecycle['Postinit'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.Postinit.set("Postinit", propertyKey);
    };
}

export function onTick() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.onTick === undefined) {
            target.ModLoader.Lifecycle['onTick'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.onTick.set("onTick", propertyKey);
    };
}

export function onPostTick() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.onPostTick === undefined) {
            target.ModLoader.Lifecycle['onPostTick'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.onPostTick.set("onPostTick", propertyKey);
    };
}

export function onViUpdate() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.onViUpdate === undefined) {
            target.ModLoader.Lifecycle['onViUpdate'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.onViUpdate.set("onViUpdate", propertyKey);
    };
}

export function onCreateResources() {
    return function (
        this: any,
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Lifecycle === undefined) {
            target.ModLoader['Lifecycle'] = {};
        }
        if (target.ModLoader.Lifecycle.onCreateResources === undefined) {
            target.ModLoader.Lifecycle['onCreateResources'] = new Map<
                string,
                string
            >();
        }
        target.ModLoader.Lifecycle.onCreateResources.set("onCreateResources", propertyKey);
    };
}

export function setupLifecycle(instance: any) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            return;
        }
        if (p.ModLoader.hasOwnProperty('Lifecycle')) {
            if (p.ModLoader.Lifecycle.hasOwnProperty("Preinit")) {
                p.ModLoader.Lifecycle.Preinit.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.PREINIT, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("Init")) {
                p.ModLoader.Lifecycle.Init.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.INIT, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("Postinit")) {
                p.ModLoader.Lifecycle.Postinit.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.POSTINIT, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onTick")) {
                p.ModLoader.Lifecycle.onTick.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.ONTICK, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onPostTick")) {
                p.ModLoader.Lifecycle.onPostTick.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.ONPOSTTICK, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onViUpdate")) {
                p.ModLoader.Lifecycle.onViUpdate.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.ONVIUPDATE, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onCreateResources")) {
                p.ModLoader.Lifecycle.onCreateResources.forEach(function (value: string, key: string) {
                    let a = (instance as any)[value].bind(instance);
                    lifecyclebus.emit(LifeCycleEvents.ONCREATERESOURCES, a);
                });
            }
        }
    }
}

export function setupLifecycle_IPlugin(instance: any) {
    // Wrapper for IPlugin.
    try {
        let old_pre = (instance as any)['preinit'].bind(instance);
        lifecyclebus.emit(LifeCycleEvents.PREINIT, old_pre);
    } catch (err) {
    }
    try {
        let old_init = (instance as any)['init'].bind(instance);
        lifecyclebus.emit(LifeCycleEvents.INIT, old_init);
    } catch (err) {
    }
    try {
        let old_post = (instance as any)['postinit'].bind(instance);
        lifecyclebus.emit(LifeCycleEvents.POSTINIT, old_post);
    } catch (err) {
    }
    try {
        let old_tick = (instance as any)['onTick'].bind(instance);
        lifecyclebus.emit(LifeCycleEvents.ONTICK, old_tick);
    } catch (err) {
    }
}