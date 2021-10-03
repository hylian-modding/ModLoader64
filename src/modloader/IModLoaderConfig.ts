interface IModLoaderConfig {
  rom: string;
  patch: string;
  isServer: boolean;
  isClient: boolean;
  supportedConsoles: string[];
  selectedConsole: string;
  coreOverride: string;
  disableVIUpdates: boolean;
  enableDebugger: boolean;
}

export default IModLoaderConfig;
