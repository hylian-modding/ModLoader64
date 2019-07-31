interface IModLoaderConfig {
  rom: string;
  patch: string;
  isServer: boolean;
  isClient: boolean;
  supportedConsoles: string[];
  selectedConsole: string;
}

export default IModLoaderConfig;
