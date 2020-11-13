interface IModLoaderConfig {
  rom: string;
  patch: string;
  isServer: boolean;
  isClient: boolean;
  supportedConsoles: string[];
  selectedConsole: string;
  coreOverride: string;
  disableVIUpdates: boolean;
}

export default IModLoaderConfig;
