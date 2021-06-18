import { IModLoaderAPI, IPlugin } from "modloader64_api/IModLoaderAPI";
import fs from 'fs';
import { AnnouncePacket } from "./AnnouncePacket";

class MupenServerPlugin implements IPlugin{

    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    pluginHash?: string | undefined;

    preinit(): void {
    }

    init(): void {
        if (this.ModLoader.isServer) {
            setInterval(() => {
                try {
                    if (fs.existsSync("./announce.json")) {
                        let data: any = JSON.parse(fs.readFileSync("./announce.json").toString());
                        fs.unlinkSync("./announce.json");
                        this.ModLoader.serverSide.sendPacket(new AnnouncePacket(data.text));
                    }
                } catch (err) {
                    this.ModLoader.logger.error(err);
                }
            }, 30 * 1000);
        }
    }

    postinit(): void {
    }

    onTick(frame?: number): void {
    }

}

module.exports = MupenServerPlugin;