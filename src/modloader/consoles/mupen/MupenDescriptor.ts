import IConsole, { IConsoleDescriptor } from "modloader64_api/IConsole";
import { IConfig, ILogger } from "modloader64_api/IModLoaderAPI";
import { ProxySide } from "modloader64_api/SidedProxy/SidedProxy";
import { FakeMupen } from "./FakeMupen";
import N64 from "./N64";

export class MupenDescriptor implements IConsoleDescriptor {

    constructConsole(side: ProxySide, rom: string, logger: ILogger, lobby: string, config: IConfig): IConsole {
        switch (side) {
            case ProxySide.CLIENT:
                return new N64(rom, logger, lobby, config);
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