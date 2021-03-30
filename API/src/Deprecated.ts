export function Deprecated() {
    return function(target: any, key: string) {
        if (target.ModLoader === undefined) {
            target['ModLoader'] = {};
        }
        if (target.ModLoader.Deprecated === undefined) {
            target.ModLoader['Deprecated'] = {};
        }
        if (target.ModLoader.Deprecated.Targets === undefined) {
            target.ModLoader.Deprecated['Targets'] = new Map<string,string>();
        }
        target.ModLoader.Deprecated.Targets.set(key, "yes");
    };
}