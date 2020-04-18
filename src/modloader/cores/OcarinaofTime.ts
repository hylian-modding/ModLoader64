import { bus, EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { ICore, IModLoaderAPI, ILogger } from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import {
    IGlobalContext,
    ILink,
    IOOTCore,
    IOotHelper,
    OotEvents,
    IOvlPayloadResult,
} from 'modloader64_api/OOT/OOTAPI';
import { ActorManager } from './OOT/ActorManager';
import { CommandBuffer } from './OOT/CommandBuffer';
import { GlobalContext } from './OOT/GlobalContext';
import { Link } from './OOT/Link';
import { OotHelper } from './OOT/OotHelper';
import { SaveContext } from './OOT/SaveContext';
import { PayloadType } from 'modloader64_api/PayloadType';
import fs from 'fs';
import path from 'path';
import IMemory from 'modloader64_api/IMemory';
import { PatchTypes } from 'modloader64_api/Patchers/PatchManager';
import { ModLoaderErrorCodes } from 'modloader64_api/ModLoaderErrorCodes';
import { Command } from 'modloader64_api/OOT/ICommandBuffer';

enum ROM_VERSIONS {
    N0 = 0x00,
    DEBUG = 0x0f,
    REV_A = 0x01,
    REV_B = 0x02
}

enum ROM_REGIONS {
    NTSC = "CZL",
    PAL = "NZL"
}

export interface OOT_Offsets {
    state: number;
    state2: number;
    paused: number;
    raw_anim: number;
}

export class OcarinaofTime implements ICore, IOOTCore {
    header = 'THE LEGEND OF ZELDA';
    ModLoader!: IModLoaderAPI;
    payloads: string[] = new Array<string>();
    link!: ILink;
    save!: SaveContext;
    global!: IGlobalContext;
    helper!: IOotHelper;
    commandBuffer!: CommandBuffer;
    actorManager!: ActorManager;
    eventTicks: Map<string, Function> = new Map<string, Function>();
    // Client side variables
    isSaveLoaded = false;
    last_known_scene = -1;
    last_known_room = -1;
    doorcheck = false;
    touching_loading_zone = false;
    frame_count_reset_scene = -1;
    rom_header!: IRomHeader;
    inventory_cache: Buffer = Buffer.alloc(0x24, 0xff);
    last_known_age!: number;

    applyVersionPatch(msg: string, bps: string, target: ROM_VERSIONS) {
        this.ModLoader.logger.info(msg);
        let r = PatchTypes.get(".bps")!.patch(this.ModLoader.rom.romReadBuffer(0x0, (32 * 1024 * 1024)), fs.readFileSync(path.join(__dirname, "OOT", bps)));
        this.ModLoader.rom.romWriteBuffer(0x0, r);
        fs.writeFileSync("./wutface.z64", r);
        this.rom_header.revision = target;
    }

    preinit(): void {
        this.ModLoader.logger.info(
            'OOT VERSION: ' + ROM_VERSIONS[this.rom_header.revision] + '.'
        );
        global.ModLoader["offsets"] = {};
        global.ModLoader["offsets"]["link"] = {} as OOT_Offsets;
        let offsets: OOT_Offsets = global.ModLoader["offsets"]["link"];
        if (this.rom_header.id === ROM_REGIONS.PAL) {
            this.ModLoader.logger.error("This rom is not supported!");
            process.exit(ModLoaderErrorCodes.ML_CORE_REFUSED_ROM);
        }
        if (this.rom_header.revision === ROM_VERSIONS.REV_B) {
            this.applyVersionPatch("Rom downgrade in progress... (1.2 -> 1.1)", "RevB.bps", ROM_VERSIONS.REV_A);
        }
        if (this.rom_header.revision === ROM_VERSIONS.REV_A) {
            this.applyVersionPatch("Rom downgrade in progress... (1.1 -> 1.0)", "RevA.bps", ROM_VERSIONS.N0);
        }
        switch (this.rom_header.revision) {
        case ROM_VERSIONS.DEBUG:
            global.ModLoader['save_context'] = 0x15e660;
            global.ModLoader['global_context_pointer'] = 0x157da0;
            global.ModLoader['overlay_table'] = 0x1162A0;
            global.ModLoader['link_instance'] = 0x2245B0;
            global.ModLoader['gui_isShown'] = 0x1C4357;
            offsets.state = 0x067C;
            offsets.state2 = 0x0680;
            offsets.paused = 0x166600;
            offsets.raw_anim = 0x0200;
            this.payloads.push(__dirname + '/OOT/OcarinaofTime_debug.payload');
            break;
        default:
            global.ModLoader['save_context'] = 0x11a5d0;
            global.ModLoader['global_context_pointer'] = 0x11f248;
            global.ModLoader['overlay_table'] = 0x0e8530;
            global.ModLoader['link_instance'] = 0x1daa30;
            global.ModLoader['gui_isShown'] = global.ModLoader['save_context'] + 0xbe613;
            offsets.state = 0x066c;
            offsets.state2 = 0x0670;
            offsets.paused = 0x1c6fa0;
            offsets.raw_anim = 0x01F0;
            this.payloads.push(__dirname + '/OOT/OcarinaofTime.payload');
            break;
        }
    }

    init(): void {
        this.eventTicks.set('waitingForAgeChange', () => {
            if (this.save.age !== this.last_known_age) {
                bus.emit(OotEvents.ON_AGE_CHANGE, this.save.age);
                this.last_known_age = this.save.age;
            }
        });
        this.eventTicks.set('waitingForSaveload', () => {
            if (!this.isSaveLoaded && this.helper.isSceneNumberValid()) {
                this.isSaveLoaded = true;
                bus.emit(OotEvents.ON_SAVE_LOADED, {});
            }
        });
        this.eventTicks.set('waitingForLoadingZoneTrigger', () => {
            if (
                this.helper.isLinkEnteringLoadingZone() &&
                !this.touching_loading_zone
            ) {
                bus.emit(OotEvents.ON_LOADING_ZONE, {});
                this.touching_loading_zone = true;
            }
        });
        this.eventTicks.set('waitingForFrameCount', () => {
            if (
                this.global.scene_framecount === 1 &&
                !this.helper.isTitleScreen() &&
                this.helper.isSceneNumberValid()
            ) {
                let cur = this.global.scene;
                this.last_known_scene = cur;
                bus.emit(OotEvents.ON_SCENE_CHANGE, this.last_known_scene);
                this.touching_loading_zone = false;
                let inventory: Buffer = this.ModLoader.emulator.rdramReadBuffer(
                    global.ModLoader.save_context + 0x0074,
                    0x24
                );
                for (let i = 0; i < inventory.byteLength; i++) {
                    if (inventory[i] === 0x004d) {
                        inventory[i] = this.inventory_cache[i];
                    }
                }
                inventory.copy(this.inventory_cache);
                this.ModLoader.emulator.rdramWriteBuffer(
                    global.ModLoader.save_context + 0x0074,
                    inventory
                );
            }
        });
        this.eventTicks.set('waitingForRoomChange', () => {
            let cur = this.global.room;
            if (this.last_known_room !== cur) {
                this.last_known_room = cur;
                bus.emit(OotEvents.ON_ROOM_CHANGE, this.last_known_room);
                this.doorcheck = false;
            }
            let doorState = this.ModLoader.emulator.rdramReadPtr8(
                global.ModLoader.global_context_pointer,
                0x11ced
            );
            if (doorState === 1 && !this.doorcheck) {
                bus.emit(OotEvents.ON_ROOM_CHANGE_PRE, doorState);
                this.doorcheck = true;
            }
        });
    }

    postinit(): void {
        this.global = new GlobalContext(this.ModLoader.emulator);
        this.link = new Link(this.ModLoader.emulator);
        this.save = new SaveContext(this.ModLoader.emulator, this.ModLoader.logger);
        this.helper = new OotHelper(
            this.save,
            this.global,
            this.link,
            this.ModLoader.emulator
        );
        this.commandBuffer = new CommandBuffer(this.ModLoader.emulator);
        this.actorManager = new ActorManager(
            this.ModLoader.emulator,
            this.ModLoader.logger,
            this.helper,
            this.global,
            this.ModLoader.utils
        );
        this.ModLoader.payloadManager.registerPayloadType(
            new OverlayPayload('.ovl', this.ModLoader.logger.getLogger("OverlayPayload"), this)
        );
    }

    onTick(): void {
        this.commandBuffer.onTick();
        if (!this.helper.isTitleScreen()) {
            this.actorManager.onTick();
            this.eventTicks.forEach((value: Function, key: string) => {
                value();
            });
        }
    }

    @EventHandler(EventsClient.ON_INJECT_FINISHED)
    onInject(evt: any) {
        for (let i = 0; i < this.payloads.length; i++) {
            this.ModLoader.payloadManager.parseFile(this.payloads[i]);
        }
        this.ModLoader.logger.info("Skipping N64 logo screen...");
        this.ModLoader.emulator.rdramWritePtr8(global.ModLoader['global_context_pointer'], 0x1E1, 0x1);
    }
}

class find_init {
    constructor() { }

    find(buf: Buffer, locate: string): number {
        let loc: Buffer = Buffer.from(locate, 'hex');
        if (buf.indexOf(loc) > -1) {
            return buf.indexOf(loc);
        }
        return -1;
    }
}

interface ovl_meta {
    addr: string;
    init: string;
}

export class OverlayPayload extends PayloadType {

    private logger: ILogger;
    private start: number = 0x80601A00;
    private ovl_offset: number = 0;
    private core: IOOTCore;

    constructor(ext: string, logger: ILogger, core: IOOTCore) {
        super(ext);
        this.logger = logger;
        this.core = core;
    }

    parse(file: string, buf: Buffer, dest: IMemory) {
        this.logger.debug('Trying to allocate actor...');
        let overlay_start: number = global.ModLoader['overlay_table'];
        let size = 0x01d6;
        let empty_slots: number[] = new Array<number>();
        for (let i = 0; i < size; i++) {
            let entry_start: number = overlay_start + i * 0x20;
            let _i: number = dest.rdramRead32(entry_start + 0x14);
            let total = 0;
            total += _i;
            if (total === 0) {
                empty_slots.push(i);
            }
        }
        this.logger.debug(empty_slots.length + ' empty actor slots found.');
        let finder: find_init = new find_init();
        let meta: ovl_meta = JSON.parse(
            fs
                .readFileSync(
                    path.join(path.parse(file).dir, path.parse(file).name + '.json')
                )
                .toString()
        );
        let offset: number = finder.find(buf, meta.init);
        if (offset === -1) {
            this.logger.debug(
                'Failed to find spawn parameters for actor ' +
                path.parse(file).base +
                '.'
            );
            return -1;
        }
        let slot: number = empty_slots.shift() as number;
        this.logger.debug(
            'Assigning ' + path.parse(file).base + ' to slot ' + slot + '.'
        );
        let final: number = this.start + this.ovl_offset;
        dest.rdramWrite32(slot * 0x20 + overlay_start + 0x14, final + offset);
        buf.writeUInt8(slot, offset + 0x1);
        dest.rdramWriteBuffer(final, buf);
        this.ovl_offset += buf.byteLength;
        let relocate_final: number = this.start + this.ovl_offset;
        dest.rdramWrite32(this.start + this.ovl_offset, final);
        this.ovl_offset += 0x4;
        dest.rdramWrite32(this.start + this.ovl_offset, final + (buf.byteLength - buf.readUInt32BE(buf.byteLength - 0x4)));
        this.ovl_offset += 0x4;
        dest.rdramWrite32(this.start + this.ovl_offset, 0x80800000);
        this.ovl_offset += 0x4;
        dest.rdramWrite32(this.start + this.ovl_offset, buf.byteLength);
        this.ovl_offset += 0x4;
        let params: Buffer = Buffer.from("00014600C50046000000000000000000", 'hex');
        let params_addr: number = this.start + this.ovl_offset;
        dest.rdramWriteBuffer(params_addr, params);
        dest.rdramWrite16(params_addr, slot);
        this.ovl_offset += params.byteLength;
        let hash: string = this.core.ModLoader.utils.hashBuffer(buf);
        console.log(relocate_final.toString(16));
        this.core.commandBuffer.runCommand(Command.RELOCATE_OVL, relocate_final, () => {
            let hash2: string = this.core.ModLoader.utils.hashBuffer(dest.rdramReadBuffer(final, buf.byteLength));
            if (hash !== hash2) {
                this.logger.debug("ovl " + path.parse(file).base + " relocated successfully!");
            }
        });
        return {
            file: file, slot: slot, addr: final, params: params_addr, buf: buf, relocate: relocate_final, spawn: (obj: any, cb?: Function) => {
                if (cb !== undefined) {
                    this.core.commandBuffer.runCommand(Command.SPAWN_ACTOR, obj["params"], cb);
                } else {
                    this.core.commandBuffer.runCommand(Command.SPAWN_ACTOR, obj["params"]);
                }
            }
        } as IOvlPayloadResult;
    }
}
