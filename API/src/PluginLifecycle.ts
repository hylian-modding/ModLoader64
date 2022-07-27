import { EventEmitter } from "events";

export class LifecycleEventBus extends EventEmitter { }

export const lifecyclebus: LifecycleEventBus = new LifecycleEventBus();

class LifecycleContainer {
    key: string;
    bound!: Function;

    constructor(key: string) {
        this.key = key;
    }
}

export const enum LifeCycleEvents {
    PREINIT = "preinit",
    INIT = "init",
    POSTINIT = "postinit",
    ONTICK = "ontick",
    ONPOSTTICK = 'onposttick',
    ONVIUPDATE = 'onviupdate',
    ONCREATERESOURCES = 'oncreateresources',
    // reverse
    PREINIT_DESTROY = "preinit_destroy",
    INIT_DESTROY = "init_destroy",
    POSTINIT_DESTROY = "postinit_destroy",
    ONTICK_DESTROY = "ontick_destroy",
    ONPOSTTICK_DESTROY = "onposttick_destroy",
    ONVIUPDATE_DESTROY = "onviupdate_destroy",
    ONCREATERESOURCES_DESTROY = "oncreateresources_destroy"
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.Preinit.set("Preinit", new LifecycleContainer(propertyKey));
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.Init.set("Init", new LifecycleContainer(propertyKey));
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.Postinit.set("Postinit", new LifecycleContainer(propertyKey));
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.onTick.set("onTick", new LifecycleContainer(propertyKey));
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.onPostTick.set("onPostTick", new LifecycleContainer(propertyKey));
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.onViUpdate.set("onViUpdate", new LifecycleContainer(propertyKey));
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
                LifecycleContainer
            >();
        }
        target.ModLoader.Lifecycle.onCreateResources.set("onCreateResources", new LifecycleContainer(propertyKey));
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
                p.ModLoader.Lifecycle.Preinit.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.PREINIT, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("Init")) {
                p.ModLoader.Lifecycle.Init.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.INIT, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("Postinit")) {
                p.ModLoader.Lifecycle.Postinit.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.POSTINIT, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onTick")) {
                p.ModLoader.Lifecycle.onTick.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.ONTICK, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onPostTick")) {
                p.ModLoader.Lifecycle.onPostTick.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.ONPOSTTICK, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onViUpdate")) {
                p.ModLoader.Lifecycle.onViUpdate.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.ONVIUPDATE, a);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onCreateResources")) {
                p.ModLoader.Lifecycle.onCreateResources.forEach(function (value: LifecycleContainer, key: string) {
                    let a = (instance as any)[value.key].bind(instance);
                    value.bound = a;
                    lifecyclebus.emit(LifeCycleEvents.ONCREATERESOURCES, a);
                });
            }
        }
    }
}

export function killLifecycle(instance: any) {
    let p = Object.getPrototypeOf(instance);
    if (p.hasOwnProperty('ModLoader')) {
        if (p.ModLoader.hasOwnProperty("hasBeenProcessed")) {
            delete p.ModLoader["hasBeenProcessed"];
        }
        if (p.ModLoader.hasOwnProperty('Lifecycle')) {
            if (p.ModLoader.Lifecycle.hasOwnProperty("Preinit")) {
                p.ModLoader.Lifecycle.Preinit.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.PREINIT_DESTROY, value.bound);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("Init")) {
                p.ModLoader.Lifecycle.Init.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.INIT_DESTROY, value.bound);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("Postinit")) {
                p.ModLoader.Lifecycle.Postinit.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.POSTINIT_DESTROY, value.bound);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onTick")) {
                p.ModLoader.Lifecycle.onTick.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.ONTICK_DESTROY, value.bound);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onPostTick")) {
                p.ModLoader.Lifecycle.onPostTick.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.ONPOSTTICK_DESTROY, value.bound);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onViUpdate")) {
                p.ModLoader.Lifecycle.onViUpdate.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.ONVIUPDATE_DESTROY, value.bound);
                });
            }
            if (p.ModLoader.Lifecycle.hasOwnProperty("onCreateResources")) {
                p.ModLoader.Lifecycle.onCreateResources.forEach(function (value: LifecycleContainer, key: string) {
                    lifecyclebus.emit(LifeCycleEvents.ONCREATERESOURCES_DESTROY, value.bound);
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