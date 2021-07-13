import { Packet } from "modloader64_api/ModLoaderDefaultImpls";

export class AnnouncePacket extends Packet {

    text: string;
    constructor(text: string) {
        super('AnnouncePacket', 'MLCore', "__GLOBAL__");
        this.text = text;
    }
}
