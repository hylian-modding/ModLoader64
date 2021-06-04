import IConsole, { IConsoleDescriptor } from "API/build/IConsole";
import { ILogger } from "API/build/IModLoaderAPI";
import { ProxySide } from "API/build/SidedProxy/SidedProxy";
import { FakeMupen } from "./FakeMupen";
import N64 from "./N64";

export class MupenDescriptor implements IConsoleDescriptor {

    constructConsole(side: ProxySide, rom: string, logger: ILogger, lobby: string): IConsole {
        switch (side) {
            case ProxySide.CLIENT:
                return new N64(rom, logger, lobby);
            case ProxySide.SERVER:
                return new FakeMupen(rom, logger, lobby);
            default:
                return {} as any;
        }
    }

    getConsoleLabel(): string {
        return "Mupen64Plus";
    }

}