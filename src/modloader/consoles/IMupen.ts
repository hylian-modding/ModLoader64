import IMemory from "../../API/IMemory";

interface IMupen extends IMemory{

    setCoreLib(path: string): void

    setConfigDir(path: string): void

    setDataDir(path: string): void

    setPluginDir(path: string): void

    setPluginAudio(path: string): void

    setPluginGFX(path: string): void

    setPluginInput(path: string): void

    setPluginRSP(path: string): void

    runEmulatorAsync(path: string): void

    savestatesRefreshHack(): void

    coreEmuState(): number

    setFrameCallback(fn: Function): void

}

export default IMupen