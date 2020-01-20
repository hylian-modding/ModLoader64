import { ICore } from './IModLoaderAPI';
export declare function InjectCore(): (target: any, key: string) => void;
export declare function setupCoreInject(instance: any, core: ICore): void;
