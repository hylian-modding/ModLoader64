import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import Vector3 from "API/build/math/Vector3";
import { IActor } from "API/build/OOT/IActor";
import { Command, ICommandBuffer } from "API/build/OOT/ICommandBuffer";
import { Heap } from "modloader64_api/heap";
import IMemory from "modloader64_api/IMemory";
import { SmartBuffer } from "smart-buffer";
import { DecodeImmediate, DecodeOpcode, EncodeImmediate, JAL_DECODE, JAL_ENCODE, J_ENCODE, OPCODEINDEXTYPE, OPCODE_DEFAULT } from "./OpcodeBullshit";
import { Deprecated } from "modloader64_api/Deprecated";
import { ActorBase } from "../Actor";
import { bus } from "modloader64_api/EventHandler";
import fs from 'fs';

export const Actor_DestroyCave: Buffer = Buffer.from("PAMSNIxjVniUYgACLEYAyBDAAAkAAhDAAGIQISQGAAWsRg0ErEQNCJRiAAIkQgABMEL//6RiAAKMmQEsAyAACAAAAAA=", 'base64');
export const Actor_InitCave: Buffer = Buffer.from("PAMSNIxjVniUYgACLEYAyBDAAAkAAhDAAGIQISQGAAGsRg0ErEQNCJRiAAIkQgABMEL//6RiAAIIAIP3AAAAAA==", 'base64');
export const Actor_SpawnCave: Buffer = Buffer.from("J73/wK+2ADCvswAkAAaxQDwTgA42c4Uwr7EAHAJ2iCGOJAAIr7IAIPe0ADivvwA0RIegAK+1ACyvtAAor7AAGBCAACcAoJAljiIAEFRAACUCdqAhliIAHDBDAAFQYAALjiMADIywHWAWAAAGAnYQIQwBmw4kBCegAECAJa5CHWACdhAhEAAADaxQABAwQgACEEAABgBkICMMAZsOAAAAAABAgCUQAAAFriIAEAwBmwQAAAAAAECAJa4iABASAABwAnaIIY4nAAyOJgAIjiUABI4kAAAMAzLur7AAEKIgAB4CdqAhjoIAFBBAAGM8EAABjoMAEI6RAAgAQxAhAFGII4YlAAgmBBekDAIFigJEICEEQQAFAECoJQwAlCsCgCAlEAAAVwAAgCWSIwACJAIABRRiAAcAAAAAAlCAIYIFHLwMAIGQAkAgJRRA//MAAAAADAGbBI4kAAwUQAAFAECAJQwAlCsCgCAlEAAARo+/ADQCdjAhkMIAHgIAICUkQgABoMIAHoezAFqXogBejiUADAAAMCUAE5wADAGNjAJimCWOJgAElicAAKIVAB6OIgAcjiUAEI4kABSOIwAYrgIBNDwCAAGuBQEorgQBLK4DATCuFAE4pgcAAK4GAAQCQhAhkEIcvMegAFCiAgADh6IAYuYAAAymAgAYx6AAVIeiAGbmFAAIpgIAHOYAABCuEwAUkiYAAiZEHCQMAJPmAgAoJTwDEjSMY1Z4lGIAAixEAMgQgAAJAAIQwABiECEkBAACrEQNBKxQDQiUYgACJEIAATBC//+kYgACPBGAEjYxDDiOMwAYAkAoJQwAg/cCACAlEAAAA64zABiUAgAIAAAANI+/ADSPtgAwj7UALI+0ACiPswAkj7IAII+xABzXtAA4AgAQJY+wABgD4AAIJ70AQA==", 'base64');
export const Actor_SpawnTransitionActorCave: Buffer = Buffer.from("J73/0IeiAFLHoABEr6IAIIeiAFbnoAAUr6IAJIeiAE7HoABAr6IAHIeiAErnoAAQr6IAGK+/ACwMAJREAAAAADwEEjSMhFZ4lIMAAixlAMgQoAAJAAMYwACDGCEkBQAErGUNBKxiDQiUgwACJGMAATBj//+kgwACj78ALAPgAAgnvQAw", 'base64');
export const Actor_SpawnEntryCave: Buffer = Buffer.from("J73/6K+/ABQMAJVxAAAAADwEEjSMhFZ4lIMAAixlAMgQoAAJAAMYwACDGCEkBQADrGUNBKxiDQiUgwACJGMAATBj//+kgwACj78AFAPgAAgnvQAY", 'base64');
export const Actor_SpawnWithAddress: Buffer = Buffer.from("J73/wK++ADivtwA0AAXxQDwXgA4294Uwr7EAHAL+iCGOIgAIr7UALK+0ACivswAkr7AAGK+/ADyPsABUr7YAMK+yACAAgJglAMCoJRBAACgA4KAljiMAEFRgACYC/pAhliMAHDBkAAFQgAAKjiQADI5iHWAUQAAFAv4YIQwBmw4kBCegrmIdYAL+GCEQAAALrGIAEDBjAAIQYAAFAIIgIwwBmw4AAAAAEAAABK4iABAMAZsEAAAAAK4iABAUQAAFAv6IITwC3q0kQgutEAAAXa4CAACOJwAMjiYACI4lAASOJAAADAMy7q+iABCiIAAeAv6QIY5CABQQQABQAAAAAI5DABCOUQAIAEMQIQBRiCM8AwABJGQXpIYlAAgMAgWKAmQgIQBAsCUEQQAHPAMAAQwAlCsCQCAlPALerTRC3q0QAABArgIAAJIkAAIkAgAFVIIABwL+GCECYxghgGUcvAwAgZACYCAlFED/8QL+GCGQYgAeAgAgJSRCAAGgYgAejiUADAwBjYwAADAlligAAI4mAASiFgAejiIAHI4lABCOJAAUjiMAGK4CATQ8AgABrhIBOKYIAACuBQEorgQBLK4DATCuBgAEAmIQIZBCHLwCACglogIAA4+iAFDGhAAAhEQAAIRDAALGggAExoAACIRCAASmBAAUpgMAFqYCABjmBAAI5gIADOYAABCmFQAckiYAAjwRgBI2MQw4DACT5iZkHCSOMgAYAmAoJQwAg/cCACAlEAAAA64yABiUAgAIAAAANI+/ADyPvgA4j7cANI+2ADCPtQAsj7QAKI+zACSPsgAgj7EAHI+wABgD4AAIJ70AQA==", 'base64');
export const commandbuffer: Buffer = Buffer.from("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", 'base64');
export const Object_SpawnCave: Buffer = Buffer.from("J73/4K+xABQ8ERI0jjFWeK+wABCWIgACr78AHCxGAMivsgAYAICAJRDAAAkAoBglAAIgwAIkECEkhA0EAiSIISQEAAesRA0EEAAAAqRFDQgAAIglkgUACAADMMAABREAPASADzSEj/AAhiAhAEUQIYySAASMhQAAAAIQgAICECGMRAAQAkWQI6RDAAwMAAN8AkAwJZIEAAgsgwASEGAADySCAAEABBkAAGQYIQADGIACAxghjGQAEAACGQAAkiAhAGIYIQADGIAkhAAPJBL/8AIDGCEAkiAkrGQAEDBCAP8AAhoAAEMYJaYDAAgSIAAGJEL//yQCAAEkAwABogIACAAAECWmIwAGj78AHI+yABiPsQAUj7AAEAPgAAgnvQAg", 'base64');
export const Actor_UpdateCave: Buffer = Buffer.from("PAMSNIxjVniUYgACLEYAyBDAAAkAAhDAAGIQISQGAAasRg0ErEQNCJRiAAIkQgABMEL//6RiAAKMmQEwAyAACAAAAAA=", 'base64');
export const Sfx_Cave: Buffer = Buffer.from("PAKAHYxCoOQURAAYAAAYJTwGEjSMxlZ4JMQKBAAASCUkCAAKJAcAQAADEEAAQxAhAAIQgADCECGMQgoEFEgAAiRjAAEAgEglFGf/9ySEAAwRIAAGMKP/ACQCaAAQYgADJAIACq0iAAClJQAIA+AACAAAAAA=", 'base64');

export const SuperDynaPoly_AllocPolyList: Buffer = Buffer.from("J73/+K++AAQDoPAlr8QACK/FAAyvxgAQPAMSNIxjVniPwgAMrEMAAAAAAAADwOglj74ABCe9AAgD4AAIAAAAAA==", 'base64');
export const SuperDynaPoly_AllocVtxList: Buffer = Buffer.from("J73/+K++AAQDoPAlr8QACK/FAAyvxgAQPAMSNIxjVniPwgAMrEMAAAAAAAADwOglj74ABCe9AAgD4AAIAAAAAA==", 'base64');
export const SuperDynaSSNodeList_Alloc: Buffer = Buffer.from("J73/+K++AAQDoPAlr8QACK/FAAyvxgAQPAMSNIxjVniPwgAMrEMAADwCQyGMQlZ4jEIAAABAGCWPwgAMrEMACI/CAAysQAAEAAAAAAPA6CWPvgAEJ70ACAPgAAgAAAAA", 'base64');

export enum CommandBuffer_CommandType {
    NONE,
    ACTORSPAWN,
    ACTORADDREMCAT,
    RELOCATE,
    UPDATEBUTTON,
    PLAYSOUND,
    PLAYMUSIC,
    WARP,
    MOVEPLAYERTOADDRESS,
    ARBITRARYFUNCTIONCALL,
    SFX,
    PVPDAMAGE,
    MALLOCFREE,
    OBJECTLOAD
}

export enum CommandBuffer_CommandEventType {
    NONE,
    INIT,
    SPAWN,
    SPAWNENTRY,
    SPAWNTRANSITION,
    DESTROY,
    UPDATE,
    OBJECTSPAWN,
    ERROR_FILLED
}

export const COMMAND_MAX = 64;
export const COMMANDEVENT_MAX = 200;
export const COMMAND_PARAM_SIZEOF = 0x20;
export const COMMAND_SIZEOF = COMMAND_PARAM_SIZEOF + 8;
export const COMMAND_OFFSET = 4;
export const COMMAND_RETURN_DATA_SIZEOF = 0x04;
export const COMMAND_RETURN_SIZEOF = COMMAND_RETURN_DATA_SIZEOF + 8;
export const COMMAND_RETURN_OFFSET = COMMAND_OFFSET + COMMAND_SIZEOF * COMMAND_MAX;
export const COMMAND_EVENT_SIZEOF = 8;
export const COMMAND_EVENT_OFFSET = COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * COMMAND_MAX;
export const COMMANDBUFFER_SIZEOF = 0x1334;

// TODO: blah blah pvp blah (doesn't belong here)
export interface IPvpContext {
    damageQueue: number
    damageType: number
    damageAngle: number
    damageFlags: number
    iframes: number
    enabled: number
}

export class CommandBuffer implements ICommandBuffer {
    ModLoader!: IModLoaderAPI;
    cmdbuf: number;
    uuid: number = 0;

    constructor(ModLoader: IModLoaderAPI, revision: number) {
        this.ModLoader = ModLoader;
        this.cmdbuf = CommandBuffer_Factory.Inject(this.ModLoader.emulator, this.ModLoader.heap!, revision);
    }

    @Deprecated("CommandBuffer.runCommand is deprecated.")
    runCommand(command: Command, param: number, callback?: Function): void { }

    spawnActor(actorId: number, params: number, rot: Vector3, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ACTORSPAWN);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite16(offset + 8, actorId);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 2, params);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 4, Math.floor(rot.x) % 32768);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 6, Math.floor(rot.y) % 32768);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 8, Math.floor(rot.z) % 32768);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xC, pos.x);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x10, pos.y);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, pos.z);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 0x18, address);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                    let type = this.ModLoader.emulator.rdramRead32(offset);
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);

                    if (type === CommandBuffer_CommandType.ACTORSPAWN && uuid === myUUID) {
                        this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                        if (this.ModLoader.emulator.rdramRead32(offset + 8) === 0) {
                            reject("Actor pointer was zero.");
                        }
                        else {
                            accept(new ActorBase(this.ModLoader.emulator, this.ModLoader.emulator.rdramRead32(offset + 8)));
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    spawnActorRXYZ(actorId: number, params: number, rotX: number, rotY: number, rotZ: number, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ACTORSPAWN);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite16(offset + 8, actorId);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 2, params);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 4, Math.floor(rotX) % 32768);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 6, Math.floor(rotY) % 32768);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 8, Math.floor(rotZ) % 32768);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xc, pos.x);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x10, pos.y);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, pos.z);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 0x18, address);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                    let type = this.ModLoader.emulator.rdramRead32(offset);
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);

                    if (type === CommandBuffer_CommandType.ACTORSPAWN && uuid === myUUID) {
                        this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                        if (this.ModLoader.emulator.rdramRead32(offset + 8) === 0) {
                            reject("Actor pointer was zero.");
                        }
                        else {
                            accept(new ActorBase(this.ModLoader.emulator, this.ModLoader.emulator.rdramRead32(offset + 8)));
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    spawnActorRXY_Z(actorId: number, params: number, rotXY: number, rotZ: number, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ACTORSPAWN);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite16(offset + 8, actorId);
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 2, params);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, Math.floor(rotXY));
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 8, Math.floor(rotZ) % 32768);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xc, pos.x);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x10, pos.y);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, pos.z);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 0x18, address);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                    let type = this.ModLoader.emulator.rdramRead32(offset);
                    if (type === 0) continue;
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);

                    if (type === CommandBuffer_CommandType.ACTORSPAWN && uuid === myUUID) {
                        let addr = this.ModLoader.emulator.rdramRead32(offset + 8);
                        this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                        if (addr === 0) {
                            reject("Actor pointer was zero.");
                        }
                        else {
                            accept(new ActorBase(this.ModLoader.emulator, addr));
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    relocateOverlay(allocatedVRamAddress: number, overlayInfoPointer: number, vRamAddress: number): Promise<void> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.RELOCATE);
        this.ModLoader.emulator.rdramWrite32(offset + 8, allocatedVRamAddress);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, overlayInfoPointer);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 8, vRamAddress);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                accept();
            }, 1);
        });
    }

    updateButton(button: number): void {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.UPDATEBUTTON);
        this.ModLoader.emulator.rdramWrite16(offset + 8, button);
    }

    playSound(sfxId: number, a1: Vector3, a2: number, a3: number, a4: number, a5: number): void {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.PLAYSOUND);
        this.ModLoader.emulator.rdramWrite16(offset + 8, sfxId);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x4, a1.x);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x8, a1.y);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xc, a1.z);
        this.ModLoader.emulator.rdramWrite8(offset + 8 + 0x10, a2);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, a3);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x18, a4);
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x1c, a5);
    }

    runWarp(entranceIndex: number, cutsceneIndex: number, callback?: Function): Promise<boolean> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.WARP);
        this.ModLoader.emulator.rdramWrite32(offset + 8, entranceIndex);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, cutsceneIndex);

        return new Promise((accept, reject) => {
            if (callback !== undefined) callback()
            accept(true)
        });
    }

    movePlayerActorToAddress(address: number): Promise<boolean> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.MOVEPLAYERTOADDRESS);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite32(offset + 8, address);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                    let type = this.ModLoader.emulator.rdramRead32(offset);
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);
                    if (type === 0) continue;
                    if (type === CommandBuffer_CommandType.MOVEPLAYERTOADDRESS && uuid === myUUID) {
                        let addr = this.ModLoader.emulator.rdramRead32(offset + 8);
                        this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                        if (addr === 0) {
                            reject("Player pointer was zero.");
                        }
                        else {
                            accept(true);
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    // supports up to 8 args (exclusing args that go in FP regs); returns function return value (v0)
    arbitraryFunctionCall(functionAddress: number, argsPointer: number, argsCount: number): Promise<Buffer> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ARBITRARYFUNCTIONCALL);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite32(offset + 8, functionAddress);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, argsPointer);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 8, argsCount);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                    let type = this.ModLoader.emulator.rdramRead32(offset);
                    if (type === 0) continue;
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);

                    if (type === CommandBuffer_CommandType.ARBITRARYFUNCTIONCALL && uuid === myUUID) {
                        this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                        accept(this.ModLoader.emulator.rdramReadBuffer(offset + 8, 4));
                    }
                }
                reject("Failed to find return value!");
            }, 1);
        });
    }

    PvpDamage(context: IPvpContext, invokingActorPointer: number) {
        console.warn("Not functional when we are using gamestate cave! Bug Drahsid to transition to the new system (low priority)")
    }

    // param malloc == 0: free, param malloc == 1: malloc, param malloc == 2 mallocR, data = address on free, otherwise size of malloc
    Zelda_MallocFree(malloc: number, data: number): Promise<number> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;
        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.MALLOCFREE);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite32(offset + 8, malloc);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, data);

        return new Promise((accept, reject) => {
            if (malloc) {
                this.ModLoader.utils.setTimeoutFrames(() => {
                    for (let index = 0; index < COMMAND_MAX; index++) {
                        let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                        let type = this.ModLoader.emulator.rdramRead32(offset);
                        let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);
                        if (type === 0) continue;
                        if (type === CommandBuffer_CommandType.MALLOCFREE && uuid === myUUID) {
                            let addr = this.ModLoader.emulator.rdramRead32(offset + 8);
                            this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                            if (addr === 0) {
                                reject(-1);
                            }
                            else {
                                accept(addr);
                            }
                        }
                    }
                }, 1);
            }
            else {
                accept(1);
            }
        });
    }

    ObjectLoad(objectId: number): Promise<number> {
        let count = this.ModLoader.emulator.rdramRead16(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;
        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite16(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.OBJECTLOAD);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite16(offset + 8, objectId);

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * index;
                    let type = this.ModLoader.emulator.rdramRead32(offset);
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4);
                    if (type === 0) continue;
                    if (type === CommandBuffer_CommandType.OBJECTLOAD && uuid === myUUID) {
                        let addr = this.ModLoader.emulator.rdramRead32(offset + 8);
                        this.ModLoader.emulator.rdramWrite32(offset, 0); // free return slot
                        let obj_list: number = global.ModLoader["obj_context"];
                        obj_list += 0xC;
                        let _offset = addr * 0x44;
                        obj_list += _offset;
                        obj_list += 0x4;
                        accept(this.ModLoader.emulator.rdramRead32(obj_list));
                    }
                }
                reject(-1);
            }, 1);
        });
    }

    onTick() {
    }
}

export class CommandBuffer_Factory {
    static VERSIONS: Map<number, Map<string, number>> = new Map([
        [
            0,
            new Map<string, number>([
                ["Actor_DestroyCave", 0x80021104],
                ["Actor_InitCave", 0x800253c8],
                ["Actor_SpawnEntryCave", 0x80023de8],
                ["Actor_SpawnTransitionActorCave", 0x8002557c],
                ["Actor_UpdateCave", 0x800240d8],
                ["Actor_SpawnCave", 0x80025110],
                ["CommandBuffer_Update", 0x800a0bf8],
                ["Object_SpawnCave", 0x800812F0],
                ["SuperDynaPoly_AllocPolyList", 0x8003133C],
                ["SuperDynaPoly_AllocVtxList", 0x80031358],
                ["SuperDynaSSNodeList_Alloc", 0x80031378]
            ]),
        ],
    ]);
    static cmd_pointer: number = 0;
    static cmdbuf: number = 0;

    // Patches references to commandBuffer dummy address with the real deal
    private static ReplaceAddress(alloc: number, size: number, emu: IMemory, base: number, target: number) {
        //@BUG if we ever encounter non-sign extended values, we will need to read BASE_LO first to decide if we should fix sign extension, otherwise this will result in incorrect addresses!
        let BASE_HI = base >> 16
        let BASE_LO = base & 0x0000FFFF
        let TARGET_HI = target >> 16
        let TARGET_LO = target & 0x0000FFFF
        if (BASE_LO >= 0x7FFF) BASE_HI += 1
        if (TARGET_LO >= 0x7FFF) TARGET_HI += 1

        for (let i = 0; i < size; i += 4) {
            let inst = DecodeOpcode(emu.rdramReadBuffer(alloc + i, 4));
            if (inst.type === OPCODEINDEXTYPE.DEFAULT && inst.indx === OPCODE_DEFAULT.LUI) {
                let imm = DecodeImmediate(inst);
                if (imm === BASE_HI) {
                    let inst2 = DecodeOpcode(emu.rdramReadBuffer(alloc + i, 4));
                    let imm2 = DecodeImmediate(inst2);
                    let itr = i;

                    while (imm2 !== BASE_LO) {
                        itr += 4;
                        inst2 = DecodeOpcode(emu.rdramReadBuffer(alloc + itr, 4));
                        imm2 = DecodeImmediate(inst2);
                    }
                    let ninst1 = EncodeImmediate(inst, TARGET_HI);
                    let ninst2 = EncodeImmediate(inst2, TARGET_LO);
                    emu.rdramWriteBuffer(alloc + i, ninst1.data);
                    emu.rdramWriteBuffer(alloc + itr, ninst2.data);
                }
            }
        }
    }

    static Inject(emu: IMemory, heap: Heap, revision: number): number {
        console.log("CommandBuffer Inject");
        emu.invalidateCachedCode();

        let alloc = (buf: Buffer) => {
            let m = heap.malloc(buf.byteLength);
            emu.rdramWriteBuffer(m, buf);
            return m;
        };

        let CommandBuffer_Update_malloc = alloc(commandbuffer);
        let Actor_SpawnWithAddress_malloc = alloc(Actor_SpawnWithAddress);
        let Actor_DestroyCave_malloc = alloc(Actor_DestroyCave);
        let Actor_InitCave_malloc = alloc(Actor_InitCave);
        let Actor_SpawnEntryCave_malloc = alloc(Actor_SpawnEntryCave);
        let Actor_SpawnCave_malloc = alloc(Actor_SpawnCave);
        let Actor_SpawnTransitionActorCave_malloc = alloc(Actor_SpawnTransitionActorCave);
        let Actor_UpdateCave_malloc = alloc(Actor_UpdateCave);
        let Object_SpawnCave_malloc = alloc(Object_SpawnCave); //@BUG This rainbow crashes. Why? The code is right...

        //let Sfx_Cave_malloc = alloc(Sfx_Cave);

        for (let i = 0; i < commandbuffer.byteLength; i += 4) {
            let inst = DecodeOpcode(commandbuffer.slice(i, i + 4));
            if (inst.type === OPCODEINDEXTYPE.DEFAULT && inst.indx === OPCODE_DEFAULT.JAL) {
                let addr = JAL_DECODE(inst.data);
                if (addr === 0x03211234) {
                    emu.rdramWrite32(CommandBuffer_Update_malloc + i, JAL_ENCODE(Actor_SpawnWithAddress_malloc));
                }
            }
        }

        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_DestroyCave")!, JAL_ENCODE(Actor_DestroyCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_InitCave")!, JAL_ENCODE(Actor_InitCave_malloc)); // @BUG This is never reached because we overwrite Actor_Spawn!
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_SpawnEntryCave")!, JAL_ENCODE(Actor_SpawnEntryCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_SpawnTransitionActorCave")!, JAL_ENCODE(Actor_SpawnTransitionActorCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_UpdateCave")!, JAL_ENCODE(Actor_UpdateCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("CommandBuffer_Update")!, JAL_ENCODE(CommandBuffer_Update_malloc));

        let spawnCave = new SmartBuffer();
        spawnCave.writeUInt32BE(J_ENCODE(Actor_SpawnCave_malloc));
        spawnCave.writeBuffer(Buffer.from("0000000003E0000800000000", "hex"));
        emu.rdramWriteBuffer(this.VERSIONS.get(revision)!.get("Actor_SpawnCave")!, spawnCave.toBuffer());

/*         let objectCave = new SmartBuffer();
        objectCave.writeUInt32BE(J_ENCODE(Object_SpawnCave_malloc));
        objectCave.writeBuffer(Buffer.from("0000000003E0000800000000", "hex"));
        emu.rdramWriteBuffer(this.VERSIONS.get(revision)!.get("Object_SpawnCave")!, objectCave.toBuffer()); */

        this.cmd_pointer = heap.malloc(0x10);
        this.cmdbuf = heap.malloc(COMMANDBUFFER_SIZEOF);
        emu.rdramWrite32(this.cmd_pointer, this.cmdbuf);
        console.log(`Command buffer: ${this.cmdbuf.toString(16)}`);
        this.ReplaceAddress(CommandBuffer_Update_malloc, commandbuffer.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnWithAddress_malloc, Actor_SpawnWithAddress.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_DestroyCave_malloc, Actor_DestroyCave.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_InitCave_malloc, Actor_InitCave.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnEntryCave_malloc, Actor_SpawnEntryCave.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnCave_malloc, Actor_SpawnCave.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnTransitionActorCave_malloc, Actor_SpawnTransitionActorCave.byteLength, emu, 0x12345678, this.cmd_pointer);
        this.ReplaceAddress(Actor_UpdateCave_malloc, Actor_UpdateCave.byteLength, emu, 0x12345678, this.cmd_pointer);
        //this.ReplaceAddress(Object_SpawnCave_malloc, Object_SpawnCave.byteLength, emu, 0x12345678, this.cmd_pointer);

        //this.ReplaceAddress(Sfx_Cave_malloc, Sfx_Cave.byteLength, emu, this.cmd_pointer);
        //emu.rdramWriteBuffer(0x80025F04, Buffer.from('2402000103E0000800000000', 'hex'));

        let alloc_pointers = (values: number[]) => {
            let p = heap.malloc(values.length * 4);
            let index = 0
            for (index = 0; index < values.length; index++) {
                emu.rdramWrite32(p + (index * 4), values[index])
            }
            return p;
        };

/*         let SuperDynaPoly_AllocPolyList_malloc = alloc(SuperDynaPoly_AllocPolyList);
        let SuperDynaPoly_AllocVtxList_malloc = alloc(SuperDynaPoly_AllocVtxList);
        let SuperDynaSSNodeList_Alloc_malloc = alloc(SuperDynaSSNodeList_Alloc);

        let SuperPoly1Size = (512 * 10) * 0x10
        let SuperPoly2Size = (512 * 10) * 0x6
        let SuperPoly3Size = (1000 * 10) * 0xC

        let SuperPoly1 = heap.malloc(SuperPoly1Size);
        let SuperPoly2 = heap.malloc(SuperPoly2Size);
        let SuperPoly3 = heap.malloc(SuperPoly3Size);
        let SuperPoly3_size = SuperPoly3Size / 0xC;
        
        let pointers = alloc_pointers([SuperPoly1, SuperPoly2, SuperPoly3, SuperPoly3_size, 0])

        let SuperPoly1_pointer = pointers
        let SuperPoly2_pointer = pointers + 4
        let SuperPoly3_pointer = pointers + 8
        let SuperPoly3_size_pointer = pointers + 0x10
        emu.rdramWrite32(pointers + 0x10, pointers + 0xC)

        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("SuperDynaPoly_AllocPolyList")!, JAL_ENCODE(SuperDynaPoly_AllocPolyList_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("SuperDynaPoly_AllocVtxList")!, JAL_ENCODE(SuperDynaPoly_AllocVtxList_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("SuperDynaSSNodeList_Alloc")!, JAL_ENCODE(SuperDynaSSNodeList_Alloc_malloc));

        this.ReplaceAddress(SuperDynaPoly_AllocPolyList_malloc, SuperDynaPoly_AllocPolyList.byteLength, emu, 0x12345678, SuperPoly1_pointer);
        this.ReplaceAddress(SuperDynaPoly_AllocVtxList_malloc, SuperDynaPoly_AllocVtxList.byteLength, emu, 0x12345678, SuperPoly2_pointer);
        this.ReplaceAddress(SuperDynaSSNodeList_Alloc_malloc, SuperDynaSSNodeList_Alloc.byteLength, emu, 0x12345678, SuperPoly3_pointer);

        this.ReplaceAddress(SuperDynaSSNodeList_Alloc_malloc, SuperDynaSSNodeList_Alloc.byteLength, emu, 0x43215678, SuperPoly3_size_pointer); */

        return this.cmdbuf;
    }
}
