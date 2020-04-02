interface IModLoaderConfig {
  rom: string;
  patch: string;
  isServer: boolean;
  isClient: boolean;
  isAnalyticsServer: boolean;
  supportedConsoles: string[];
  selectedConsole: string;
  coreOverride: string;
}

export default IModLoaderConfig;
