interface IConsole{

    startEmulator(rom: string): void
    
    stopEmulator(): void

    finishInjects(): void

}

export default IConsole