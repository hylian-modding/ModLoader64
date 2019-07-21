import IMemory from "./IMemory";

interface IConsole{

    startEmulator(preStartCallback: Function): IMemory
    
    stopEmulator(): void

    finishInjects(): void

    isEmulatorReady(): boolean

    getLoadedRom(): Buffer

    getRomHeader(): Buffer

    setFrameCallback(fn: Function): void

    pauseEmulator(): void

    resumeEmulator(): void

}

export default IConsole