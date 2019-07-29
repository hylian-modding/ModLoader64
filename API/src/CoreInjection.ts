export function InjectCore() {
  return function(target: any, key: string) {
    if (target.ModLoader === undefined) {
      target['ModLoader'] = {};
    }
    if (target.ModLoader.InjectCore === undefined) {
      target.ModLoader['InjectCore'] = new Map<string, Function>();
    }
    target.ModLoader.InjectCore.set('field', () => key);
  };
}
