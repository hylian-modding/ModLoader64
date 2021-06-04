import { IConsoleDescriptor } from "API/build/IConsole";
import { ILogger } from "API/build/IModLoaderAPI";

export default class ConsoleManager {
    private consoles: Map<string, IConsoleDescriptor> = new Map<string, IConsoleDescriptor>();
    private logger: ILogger;

    constructor(logger: ILogger){
        this.logger = logger;
    }

    registerConsole(desc: IConsoleDescriptor) {
        this.consoles.set(desc.getConsoleLabel(), desc);
        this.logger.debug(`Registered: ${desc.getConsoleLabel()}`);
    }

    getConsole(tag: string): IConsoleDescriptor {
        this.logger.debug(`Constructing: ${tag}`);
        return this.consoles.get(tag)!;
    }

    getAllConsoleTags(): Array<string> {
        let arr: string[] = [];
        this.consoles.forEach((c: IConsoleDescriptor, key: string) => {
            arr.push(key);
        });
        return arr;
    }
}