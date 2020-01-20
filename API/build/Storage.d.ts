export declare class StorageContainer {
    private pak;
    constructor(key: string);
    storeObject(obj: any, compressed?: boolean): void;
    loadObject(): any;
}
declare class StorageKeyManager {
    private readonly MAX;
    getStorageKey(): string;
}
export declare const KeyManager: StorageKeyManager;
export {};
