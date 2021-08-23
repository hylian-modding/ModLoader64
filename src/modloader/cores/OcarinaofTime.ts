import { bus, EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { ICore, IModLoaderAPI, ILogger, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import {
    IGlobalContext, ILink, IOOTCore, IOotHelper, OotEvents, IOvlPayloadResult, Tunic, IActorManager
} from 'modloader64_api/OOT/OOTAPI';
import { GlobalContext } from './OOT/GlobalContext';
import { Link } from './OOT/Link';
import { OotHelper } from './OOT/OotHelper';
import { SaveContext } from './OOT/SaveContext';
import { PayloadType } from 'modloader64_api/PayloadType';
import fs from 'fs';
import path from 'path';
import IMemory from 'modloader64_api/IMemory';
import { PatchTypes } from 'modloader64_api/Patchers/PatchManager';
import { onPostTick } from 'modloader64_api/PluginLifecycle';
import { SmartBuffer } from 'smart-buffer';
import { CommandBuffer } from './OOT/CommandBuffer/CommandBuffer';
import { IActor } from 'modloader64_api/OOT/IActor';
import Vector3 from 'modloader64_api/math/Vector3';
import { EventSystem } from './OOT/CommandBuffer/EventSystem';

export enum ROM_VERSIONS {
    N0 = 0x00,
    GAMECUBE = 0x0f,
    REV_A = 0x01,
    REV_B = 0x02
}

export enum ROM_REGIONS {
    NTSC = "CZL",
    PAL = "NZL"
}

export interface OOT_Offsets {
    state: number;
    state2: number;
    paused: number;
    raw_anim: number;
    dma_rom: number;
}

export class OcarinaofTime implements ICore, IOOTCore {
    header = [ROM_REGIONS.NTSC, ROM_REGIONS.PAL];
    ModLoader!: IModLoaderAPI;
    link!: ILink;
    save!: SaveContext;
    global!: IGlobalContext;
    helper!: IOotHelper;
    commandBuffer!: CommandBuffer;
    actorManager!: IActorManager;
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
    map_select_enabled: boolean = false;
    localFlags: Buffer = Buffer.alloc(0x1c);
    localFlagsTemp: Buffer = Buffer.alloc(0x1c);
    localFlagsHash: string = "";
    permFlagsScene: Buffer = Buffer.alloc(0xb0c);
    permFlagsSceneHash: string = "";
    heap_start: number = 0x81000000;
    heap_size: number =  16 * 1024 * 1024;
    isNight: boolean = false;
    lastHealth: number = 0;
    lastTunic: Tunic = Tunic.KOKIRI;

    applyVersionPatch(msg: string, bps: string, target: ROM_VERSIONS) {
        this.ModLoader.logger.info(msg);
        let r = PatchTypes.get(".bps")!.patch(this.ModLoader.rom.romReadBuffer(0x0, (32 * 1024 * 1024)), fs.readFileSync(path.join(__dirname, "OOT", bps)));
        this.ModLoader.rom.romWriteBuffer(0x0, r);
        this.rom_header.revision = target;
    }

    preinit(): void {
        this.ModLoader.config.registerConfigCategory("OcarinaofTime");
        this.ModLoader.config.setData("OcarinaofTime", "skipN64Logo", true);
        this.ModLoader.config.save();
        this.ModLoader.logger.info('OOT VERSION: ' + ROM_VERSIONS[this.rom_header.revision] + '.');
        global.ModLoader["offsets"] = {};
        global.ModLoader["offsets"]["link"] = {} as OOT_Offsets;
        let offsets: OOT_Offsets = global.ModLoader["offsets"]["link"];
        if (this.rom_header.revision === ROM_VERSIONS.GAMECUBE) {
            // Check if its the retail Gamecube roms from the collector's edition discs or the actual debug rom.
            let rom: Buffer = this.ModLoader.rom.romReadBuffer(0x0, (32 * 1024 * 1024));
            let hash: string = this.ModLoader.utils.hashBuffer(rom);
            // Is this Master Quest?
            let mq_GC: string = "da35577fe54579f6a266931cc75f512d";
            let vanilla_GC: string = "cd09029edcfb7c097ac01986a0f83d3f";
            if (hash === mq_GC) {
                this.applyVersionPatch("Rom downgrade in progress... (Ura -> GC)", "UratoGC.bps", ROM_VERSIONS.GAMECUBE);
                this.applyVersionPatch("Rom downgrade in progress... (GC -> 1.2)", "GCtoRevB.bps", ROM_VERSIONS.REV_B);
            } else if (hash === vanilla_GC) {
                this.applyVersionPatch("Rom downgrade in progress... (GC -> 1.2)", "GCtoRevB.bps", ROM_VERSIONS.REV_B);
            }
        }
        if (this.rom_header.revision === ROM_VERSIONS.REV_B) {
            this.applyVersionPatch("Rom downgrade in progress... (1.2 -> 1.1)", "RevB.bps", ROM_VERSIONS.REV_A);
        }
        if (this.rom_header.revision === ROM_VERSIONS.REV_A) {
            this.applyVersionPatch("Rom downgrade in progress... (1.1 -> 1.0)", "RevA.bps", ROM_VERSIONS.N0);
        }
        switch (this.rom_header.revision) {
            case ROM_VERSIONS.GAMECUBE:
                global.ModLoader['save_context'] = 0x15e660;
                global.ModLoader['global_context_pointer'] = 0x157da0;
                global.ModLoader['overlay_table'] = 0x1162A0;
                global.ModLoader['link_instance'] = 0x2245B0;
                global.ModLoader['gui_isShown'] = 0x1C4357;
                offsets.state = 0x067C;
                offsets.state2 = 0x0680;
                offsets.paused = 0x166600;
                offsets.raw_anim = 0x0200;
                offsets.dma_rom = 0x00012F70;
                global.ModLoader['isDebugRom'] = true;
                break;
            default:
                global.ModLoader['save_context'] = 0x11a5d0;
                global.ModLoader['global_context_pointer'] = 0x11f248;
                global.ModLoader['overlay_table'] = 0x0e8530;
                global.ModLoader['link_instance'] = 0x1daa30;
                global.ModLoader['gui_isShown'] = global.ModLoader['save_context'] + 0xbe613;
                global.ModLoader["SCENE_TABLE"] = 0x800FB4E0;
                global.ModLoader["ENTRANCE_TABLE"] = 0x800F9C90;
                global.ModLoader["RESTRICTION_TABLE"] = 0x800F7350;
                global.ModLoader["obj_context"] = 0x801D9C44;
                offsets.state = 0x066c;
                offsets.state2 = 0x0670;
                offsets.paused = 0x1c6fa0;
                offsets.raw_anim = 0x01F0;
                offsets.dma_rom = 0x00007430;
                global.ModLoader['isDebugRom'] = false;
                break;
        }
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
    onReset1(evt: any) {
        this.isSaveLoaded = false;
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_POST)
    onReset2(evt: any) {
        this.isSaveLoaded = false;
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
        this.eventTicks.set('nightTick', () => {
            if (!this.isNight && this.save.world_night_flag) {
                this.isNight = true;
                bus.emit(OotEvents.ON_NIGHT_TRANSITION, this.isNight);
            } else if (this.isNight && !this.save.world_night_flag) {
                this.isNight = false;
                bus.emit(OotEvents.ON_DAY_TRANSITION, this.isNight);
            }
        });
        this.eventTicks.set('healthTick', () => {
            if (this.lastHealth !== this.save.health) {
                this.lastHealth = this.save.health;
                bus.emit(OotEvents.ON_HEALTH_CHANGE, this.lastHealth);
            }
        });
        this.eventTicks.set('tunicTick', () => {
            if (this.lastTunic !== this.link.tunic) {
                this.lastTunic = this.link.tunic;
                bus.emit(OotEvents.ON_TUNIC_CHANGE, this.lastTunic);
            }
        });
    }

    postinit(): void {
        this.global = new GlobalContext(this.ModLoader);
        this.link = new Link(this.ModLoader.emulator, this.ModLoader.math);
        this.save = new SaveContext(this.ModLoader, this.ModLoader.logger);
        this.helper = new OotHelper(
            this.save,
            this.global,
            this.link,
            this.ModLoader.emulator
        );
        this.ModLoader.payloadManager.registerPayloadType(
            new OverlayPayload('.ovl', this.ModLoader, this)
        );
    }

    onTick(frame: number): void {
        if (this.map_select_enabled) {
            this.mapSelectCode();
        }
        if (this.commandBuffer !== undefined) this.commandBuffer.onTick();
        //@ts-ignore
        if (this.actorManager !== undefined) this.actorManager.onTick();
        if (!this.helper.isTitleScreen()) {
            this.eventTicks.forEach((value: Function, key: string) => {
                value();
            });
        }
    }

    @onPostTick()
    onPostTick() {
        this.link.current_sound_id = 0;
    }

    @EventHandler(EventsClient.ON_INJECT_FINISHED)
    onInject(evt: any) {
        if (this.ModLoader.config.data["OcarinaofTime"]["skipN64Logo"]) {
            this.ModLoader.logger.info("Skipping N64 logo screen...");
            this.ModLoader.emulator.rdramWritePtr8(global.ModLoader['global_context_pointer'], 0x1E1, 0x1);
        }
    }

    @EventHandler(EventsClient.ON_HEAP_SETUP)
    onHeapSetup(evt: any) {
        // Scan memory.
        let mb_1: Buffer = Buffer.alloc(0x100000);
        let start: number = 0x80000000;
        let scan: Buffer = Buffer.alloc(0x100000, 0xFF);
        let skipped: number = 0;
        while (!scan.equals(mb_1)) {
            start += (0x100000);
            skipped += (0x100000);
            scan = this.ModLoader.emulator.rdramReadBuffer(start, 0x100000);
        }
        let gfx_heap_start = start;
        let gfx_heap_size = (0x1000000 - skipped);
        evt["gfx_heap_start"] = gfx_heap_start;
        evt["gfx_heap_size"] = gfx_heap_size;
        this.ModLoader.logger.debug(`Oot Core Context: ${this.heap_start.toString(16)}. Size: 0x${this.heap_size.toString(16)}`);
        this.ModLoader.logger.debug(`Oot GFX Context: ${gfx_heap_start.toString(16)}. Size: 0x${gfx_heap_size.toString(16)}`);
    }

    @EventHandler(EventsClient.ON_HEAP_READY)
    onHeapReady(evt: any) {
        this.commandBuffer = new CommandBuffer(this.ModLoader, this.rom_header.revision);
        this.actorManager = new EventSystem(this.ModLoader, this.commandBuffer.cmdbuf);
    }

    mapSelectCode(): void {
        this.ModLoader.emulator.rdramWrite32(0x800F1434, 0x00B9E400);
        this.ModLoader.emulator.rdramWrite32(0x800F1438, 0x00BA1160);
        this.ModLoader.emulator.rdramWrite32(0x800F143C, 0x808009C0);
        this.ModLoader.emulator.rdramWrite32(0x800F1440, 0x80803720);
        this.ModLoader.emulator.rdramWrite32(0x800F1448, 0x80801C14);
        this.ModLoader.emulator.rdramWrite32(0x800F144C, 0x80801C08);
        if (this.ModLoader.emulator.rdramRead16(0x800F1430) === 0x803B) {
            this.ModLoader.emulator.rdramWrite8(0x8011B92F, 0);
        }
        if (this.ModLoader.emulator.rdramRead16(0x801C84B4) === 0x2030) {
            this.ModLoader.emulator.rdramWrite8(0x8011B92F, 0x0002);
            this.ModLoader.emulator.rdramWrite16(0x801DA2B4, 0x0EC0);
        }
    }

    toggleMapSelectKeybind(): boolean {
        this.map_select_enabled = true;
        return true;
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
    init: string;
    forceSlot: string;
}

class OvlPayloadResult implements IOvlPayloadResult {
    slot: number;
    core: IOOTCore;

    constructor(core: IOOTCore, slot: number) {
        this.slot = slot;
        this.core = core;
    }

    spawnActorRXYZ(params: number, rotX: number, rotY: number, rotZ: number, pos: Vector3, address?: number): Promise<IActor> {
        return this.core.commandBuffer.spawnActorRXYZ(this.slot, params, rotX, rotY, rotZ, pos, address);
    }

    spawnActorRXY_Z(params: number, rotXY: number, rotZ: number, pos: Vector3, address?: number): Promise<IActor> {
        return this.core.commandBuffer.spawnActorRXY_Z(this.slot, params, rotXY, rotZ, pos, address);
    }

    spawn(params: number, rot: Vector3, pos: Vector3, address?: number): Promise<IActor> {
        return this.core.commandBuffer.spawnActor(this.slot, params, rot, pos, address);
    }

}

export class OverlayPayload extends PayloadType {

    private ModLoader: IModLoaderAPI;
    private core: IOOTCore;

    constructor(ext: string, ModLoader: IModLoaderAPI, core: IOOTCore) {
        super(ext);
        this.ModLoader = ModLoader;
        this.core = core;
    }

    parse(file: string, buf: Buffer, dest: IMemory) {
        this.ModLoader.logger.debug('Trying to allocate actor...');
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
        this.ModLoader.logger.debug(empty_slots.length + ' empty actor slots found.');
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
            this.ModLoader.logger.debug(
                'Failed to find spawn parameters for actor ' +
                path.parse(file).base +
                '.'
            );
            return -1;
        }
        let slot: number = empty_slots.shift() as number;
        if (meta.forceSlot !== undefined) {
            slot = parseInt(meta.forceSlot);
        }
        this.ModLoader.logger.debug(
            'Assigning ' + path.parse(file).base + ' to slot ' + slot + '.'
        );
        // Clean anything in here out first.
        for (let i = 0; i < 0x20; i++) {
            dest.rdramWrite8(slot * 0x20 + overlay_start + i, 0);
        }
        let final: number = this.core.ModLoader.heap!.malloc(buf.byteLength + 0x10);
        dest.rdramWrite32(slot * 0x20 + overlay_start + 0x14, final + offset);
        buf.writeUInt16BE(slot, offset);
        let alloc = new SmartBuffer();
        alloc.writeBuffer(buf);
        alloc.writeUInt32BE(final);
        alloc.writeUInt32BE(final + (buf.byteLength - buf.readUInt32BE(buf.byteLength - 0x4)));
        alloc.writeUInt32BE(0x80800000);
        alloc.writeUInt32BE(buf.byteLength);
        dest.rdramWriteBuffer(final, alloc.toBuffer());
        let hash: string = this.ModLoader.utils.hashBuffer(buf);
        this.ModLoader.utils.setTimeoutFrames(()=>{
            this.core.commandBuffer.relocateOverlay(final, final + (buf.byteLength - buf.readUInt32BE(buf.byteLength - 0x4)), 0x80800000).then(()=>{
                let hash2 = this.ModLoader.utils.hashBuffer(this.ModLoader.emulator.rdramReadBuffer(final, buf.byteLength));
                if (hash !== hash2) {
                    this.ModLoader.logger.info(`${path.parse(file).base} relocated.`);
                } else {
                    this.ModLoader.logger.error(`${path.parse(file).base} failed`);
                }
            });
        }, 20);
        return new OvlPayloadResult(this.core, slot);
    }
}
