export function Deprecated(msg?: string) {
    return function(target: any, key: string) {
        if (msg !== undefined){
            console.log(`[Deprecation]: ${msg}`);
        }
    };
}