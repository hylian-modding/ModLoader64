import { RomPatchType } from "modloader64_api/Patchers/PatchManager";

export class Cloudmax implements RomPatchType {

    patch(rom: Buffer, patch: Buffer) {
        let str = patch.toString();
        let lines = str.split("\n");
        for (let i = 0; i < lines.length; i++) {
            try {
                // ^ asserts position at start of a line
                // 1st Capturing Group (0x[0-9A-Fa-f](?:\+0x[0-9A-Fa-f])*)
                //     0x matches the characters 0x literally (case sensitive)
                //     [0-9A-Fa-f] Match a single character present in the list
                //     + matches the previous token between one and unlimited times
                //     Non-capturing group (?:\+0x[0-9A-Fa-f])*
                //         * matches the previous token between zero and unlimited times, as many times as possible, giving back as needed (greedy)
                //         \+ matches the character + literally (case sensitive)
                //         0x matches the characters 0x literally (case sensitive)
                //         [0-9A-Fa-f] Match a single character present in the list
                // , matches the character , literally (case sensitive)
                // 2nd Capturing Group ([0-9A-Fa-f ])
                //     [0-9A-Fa-f ] Match a single character present in the list
                //     + matches the previous token between one and unlimited times, as many times as possible
                let [m, m1, m2] = lines[i].match(/^(0x[0-9A-F]+(?:\+0x[0-9A-F]+)*),([0-9A-F ]+)/i)!;
                Buffer.from(m2.replace(" ", ""), "hex").copy(rom, Function(`return ${m1}`)());
            } catch {}
        }
        return rom;
    }

}
