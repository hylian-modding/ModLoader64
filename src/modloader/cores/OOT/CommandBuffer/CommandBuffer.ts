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

export const Actor_DestroyCave: Buffer = Buffer.from("PAgSNI0IVngAAFAlAAAQJSULDQQkCQDIAAI4wAEHMCGMww0ELGMABRRgAAgkQgABjMMNBCxjAAYQYAAEAAAAAIzDDQhQgwABAWdQIRRJ//MAAjjAFUAAESQCAAUAABglJQkNBCQHAMgkYgGgAAIQwAECECGMQgAEAAMwwBRAAAIkYwABASZQIRRn//gkYgGgUUAABYyZASwkAgAFrUIAAK1EAASMmQEsAyAACAAAAAA=", 'base64');
export const Actor_InitCave: Buffer = Buffer.from("PAgSNI0IVngAAFAlAAAQJSULDQQkCQDIAAIwwAEGGCGMZw0EEOAACCRCAAGMZw0ELOcAAhDgAAQAAAAAjGMNCFCDAAEBZlAhFEn/9AACMMAVQAAQJAIAAQAAGCUlCQ0EJAcAyCRiAaAAAhDAAQIQIYxCAAQAAzDAFEAAAiRjAAEAyVAhFGf/+CRiAaARQAADJAIAAa1CAACtRAAECACD9wAAAAA=", 'base64');
export const Actor_SpawnCave: Buffer = Buffer.from("J73/wK+2ADCvswAkAAaxQDwTgA42c4Uwr7IAIAJ2kCGOQgAIr7AAGPe0ADivvwA0RIegAK+1ACyvtAAor7EAHBBAACcAoIAljkMAEFRgACUCdqAhlkMAHDBkAAFQgAALjkQADIyxHWAWIAAGAnYQIQwBmw4kBCegAECIJa4CHWACdhAhEAAADaxRABAwYwACEGAABgCCICMMAZsOAAAAAABAiCUQAAAFrkIAEAwBmwQAAAAAAECIJa5CABASIACMAnaQIY5HAAyORgAIjkUABI5EAAAMAzLur7EAEKJAAB4CdqAhjoIAFBBAAH88EQABjoMAEI6SAAgAQxAhAFKQI4ZFAAgmJBekDAIFigIEICEEQQAFAECoJQwAlCsCgCAlEAAAcwAAiCWSQwACJAIABRRiAAcAAAAAAhGIIYIlHLwMAIGQAgAgJRRA//MAAAAADAGbBI5EAAwUQAAFAECIJQwAlCsCgCAlEAAAYo+/ADQCdhghkGIAHgIgICUkQgABoGIAHoezAFqXogBejkUADAAAMCUAE5wADAGNjAJimCWORgAElkcAAKI1AB6OQgAcjkUAEI5EABSOQwAYriIBNDwCAAGuJQEoriQBLK4jATCuNAE4picAAK4mAAQCAhAhkEIcvMegAFCiIgADh6IAYuYgAAymIgAYx6AAVIeiAGbmNAAI5iAAEK4zABSmIgAckkYAAgIgKCUMAJPmJgQcJDwFEjSMpVZ4AABIJQAAGCUkqg0EJAgAyAADOMAApzAhjMQNBCyEAAJUgAAJJGMAAYzEDQQshAAFUIAABSRjAAGMwg0IUiIAAQFHSCEkYwABVGj/8gADOMAVIAARJAIAAgAAICUkpg0EJAIAyCSDAaAAAxjAAKMYIYxjAARUYAAEJIQAAQAEGMAAw0ghJIQAARSC//ckgwGgESAAAyQCAAKtIgAArTEABDwSgBI2Ugw4jlMAGAIAKCUMAIP3AiAgJRAAAAOuUwAYlAIACAAAADSPvwA0j7YAMI+1ACyPtAAoj7MAJI+yACCPsAAY17QAOAIgECWPsQAcA+AACCe9AEA=", 'base64');
export const Actor_SpawnEntryCave: Buffer = Buffer.from("J73/6K+/ABQMAJVxAAAAADwHEjSM51Z4AABIJQAAGCUk6g0EJAgAyAADMMAA5ighjKQNBCyEAAIUgAAIJGMAAYykDQQshAAFEIAABAAAAACMpA0IUEQAAQFGSCFUaP/zAAMwwBUgABEkAwADAAAgJSToDQQkBgDIJIMBoAADGMAA4xghjGMABAAEKMAUYAACJIQAAQCoSCEUhv/4JIMBoBEgAAWPvwAUJAMAA60jAACtIgAEj78AFAPgAAgnvQAY", 'base64');
export const Actor_SpawnTransitionActorCave: Buffer = Buffer.from("J73/0IeiAFLHoABEr6IAIIeiAFbnoAAUr6IAJIeiAE7HoABAr6IAHIeiAErnoAAQr6IAGK+/ACwMAJREAAAAADwHEjSM51Z4AABIJQAAGCUk6g0EJAgAyAADMMAA5ighjKQNBCyEAAIUgAAIJGMAAYykDQQshAAFEIAABAAAAACMpA0IUEQAAQFGSCFUaP/zAAMwwBUgABEkAwAEAAAgJSToDQQkBgDIJIMBoAADGMAA4xghjGMABAAEKMAUYAACJIQAAQCoSCEUhv/4JIMBoBEgAAWPvwAsJAMABK0jAACtIgAEj78ALAPgAAgnvQAw", 'base64');
export const Actor_SpawnWithAddress: Buffer = Buffer.from("J73/wK++ADivtwA0AAXxQDwXgA4294Uwr7EAHAL+iCGOIgAIr7UALK+0ACivswAkr7AAGK+/ADyPsABUr7YAMK+yACAAgJglAMCoJRBAACgA4KAljiMAEFRgACYC/pAhliMAHDBkAAFQgAAKjiQADI5iHWAUQAAFAv4YIQwBmw4kBCegrmIdYAL+GCEQAAALrGIAEDBjAAIQYAAFAIIgIwwBmw4AAAAAEAAABK4iABAMAZsEAAAAAK4iABAUQAAFAv6IITwC3q0kQgutEAAAXK4CAACOJwAMjiYACI4lAASOJAAADAMy7q+iABCiIAAeAv6QIY5CABQQQABPPAYAAY5DABCOUQAIAEMQIQBRiCMkxBekhiUACAwCBYoCZCAhAECwJQRBAAc8BgABDACUKwJAICU8At6tNELerRAAAECuAgAAkiQAAiQCAAUUggAHAv4oIQJmMCGAxRy8DACBkAJgICUUQP/xAv4oIZCiAB4CACAlJEIAAaCiAB6OJQAMDAGNjAAAMCWWJwAAjiYABKIWAB6OIgAcjiUAEI4kABSOIwAYrgIBNDwCAAGuEgE4pgcAAK4FASiuBAEsrgMBMK4GAAQCYhAhkEIcvAIAKCWiAgADj6IAUMaEAACERAAAhEMAAsaCAATGgAAIhEIABKYEABSmAwAWpgIAGOYEAAjmAgAM5gAAEKYVABySJgACPBGAEjYxDDgMAJPmJmQcJI4yABgCYCglDACD9wIAICUQAAADrjIAGJQCAAgAAAA0j78API++ADiPtwA0j7YAMI+1ACyPtAAoj7MAJI+yACCPsQAcj7AAGAPgAAgnvQBA", 'base64');
export const Actor_UpdateCave: Buffer = Buffer.from("PAgSNI0IVngAAFAlAAAQJSULDQQkCQDIAAI4wAEHMCGMww0ELGMABhRgAAgkQgABjMMNBCxjAAcQYAAEAAAAAIzDDQhQgwABAWdQIRRJ//MAAjjAFUAAESQCAAYAABglJQkNBCQHAMgkYgGgAAIQwAECECGMQgAEAAMwwBRAAAIkYwABASZQIRRn//gkYgGgUUAABYyZATAkAgAGrUIAAK1EAASMmQEwAyAACAAAAAA=", 'base64');
export const commandbuffer: Buffer = Buffer.from("J73/oIyCAAQ8A4AcNGOEoK+1AEyvsgBAr78AXK++AFivtwBUr7YAUK+0AEivswBEr7EAPK+wADiMchxEAED4Ca+jACw8FRI0jrVWeI6iAAAQQAENPBMQACZiAP8AAPAlJBYAQCQRAAMQAAACr6IAKACAqCUAABglAAMQQABDECEAAhCAAqKAIY4ECgQUgAALJGMAAQAeuIAC/hghAAMYwAKjoCGOhQAEJAQAARSkAEYn0wABEAAABQAAAAAUdv/vAAMQQBAAAQEAHriAjoIABK4CCgSOggAIrgIKCI6CACQQQAAXAAAAAJaFAAyWhgAOJGIAEI6EACQCohAhJGMAGAAGNAAABSwAr6QAFK+iABA8BIAcNISEoAKjOCEABjQDDMhEjQAFLAOOggAkPAQSNIyEVniuAgoMEAAAygL+uCGWhgAMjocAGMaAABzGggAgloIAEJaDABKWhAAUloUADgACFAAAAxwAAAQkAAAFLAAAAhQDAAMcAwAEJAMABSwDAAY0AK+lACSvpAAgr6MAHDwEgBw0hKDEr6IAGOeiABTnoAAQPAWAHDSlhKAMAJREAAY0AzwEEjSMhFZ4rgIKDBAAAKgC/rghJEIKBAKigCEC/hAhAAIQwAKiGCGMZAAEFJEACgAAAACMZAAMjGUAEIxmABQMAzI8Av64ITwEEjSMhFZ4EAAAmAAXuMCMZQAEJAQABBSkAAoAAAAAlGUADDwEgBw0hISgDAG+1AL+uCE8BBI0jIRWeBAAAIsAF7jAjGUABCQEAAUUpAATABMogACzKCEkSQAkAAUowJRkAAwkRwAgkGYAHCRCABACpRghAqkoIa+lABCvowAUAqc4IQwDIBsCoighPAQSNIyEVngQAAB0Av64IYxkAAQkAgAHFIIAHI+kACivowAwPAGAEqQgubI8AYASrCC5tDwBgBKsILm4PAGAEgwDKpykILm8j6MAMDwQgBE2EKXQJAL//4xlAAymAhPgPAGAEqAguZeMYwAQPAQSNIyEVniuBQAAPAGAEqwguTSmAhN4EAAAVK4DAAiMZAAEJAIACBSCADMAAAAAEgAAZgAAAACMYgAMEFIASwKgICWMagAMjkIGfIZGAByGRQAAJkkAMK5AATCuQAE0JkcAJKxAATCsQAE0PASAHDSEhKCvqgAUr6kAEAzIRI2vowAwPAWAHDSloMQ8BIAcNISEoAwAk/iORgZ8PAWAHDSloMQ8BIAcNISEoAwAk/gCQDAlDAGbJI5EBnwMAZskAkAgJY+jADA8BBI0jIRWeIxyAAyMYgAErgIAAIxiAAiuAgAEj6IALK4SAAisUgJwEAAAHqxSAoiMZQAEJAIACRSiABoCoCAlUgAAGQL+uCGMYgAErgIAAIxiAAiuAgAEjGkADIxlABCMZwAUjGIAGIxjABwAAifDAAM3w6+mABivpAAQr6MAHAAFJ8OvogAUASD4CQAHN8OuAwAIPAQSNIyEVngQAAACAv64IQL+uCEAF7jAAreoIa6gAASMggAAAmIQKxRA/v0CYPAlEAAAA4+/AFwCoCAlj78AXI++AFiPtwBUj7YAUI+1AEyPtABIj7MARI+yAECPsQA8j7AAOKyAAAAD4AAIJ70AYIxiAAQQAP/mAqAgJQL+ECEAAhDAAqIQIYxCAAQn0wABEAD/OwAAgCUAAAAAAAAAAA==", 'base64');
export const Sfx_Cave: Buffer = Buffer.from("PAKAHYxCoOQURAAYAAAYJTwGEjSMxlZ4AABIJSQIAAokygoEJAcAQAADEEAAQxAhAAIQgADCICGMhAoEFIgAAiRjAAEASkghFGf/+AADEEARIAAGMKP/ACQCaAAQYgADJAIACq0iAAClJQAIA+AACAAAAAA=", 'base64');
export const SkelAnime_DrawFlexLodCave: Buffer = Buffer.from("A+AACAAAAAA=", 'base64');

enum CommandBuffer_CommandType {
    NONE,
    ACTORSPAWN,
    ACTORDESTROY,
    RELOCATE,
    UPDATEBUTTON,
    PLAYSOUND,
    PLAYMUSIC,
    WARP,
    MOVEPLAYERTOADDRESS,
    ARBITRARYFUNCTIONCALL,
    SFX
}

enum CommandBuffer_CommandActorType {
    NONE,
    INIT,
    SPAWN,
    SPAWNENTRY,
    SPAWNTRANSITION,
    DESTROY,
    UPDATE
}

const COMMAND_MAX = 64;
const COMMANDACTOR_MAX = 200;
const COMMAND_PARAM_SIZEOF = 0x20;
const COMMAND_SIZEOF = COMMAND_PARAM_SIZEOF + 8;
const COMMAND_OFFSET = 4;
const COMMAND_RETURN_DATA_SIZEOF = 0x04;
const COMMAND_RETURN_SIZEOF = COMMAND_RETURN_DATA_SIZEOF + 8;
const COMMAND_RETURN_OFFSET = COMMAND_OFFSET + COMMAND_SIZEOF * COMMAND_MAX;
const COMMAND_ACTOR_SIZEOF = 8;
const COMMAND_ACTOR_OFFSET = COMMAND_RETURN_OFFSET + COMMAND_RETURN_SIZEOF * COMMAND_MAX;
const COMMANDBUFFER_SIZEOF = COMMAND_ACTOR_OFFSET + COMMAND_ACTOR_SIZEOF * COMMANDACTOR_MAX;

export class CommandBuffer implements ICommandBuffer {
    ModLoader!: IModLoaderAPI;
    cmdbuf: number;
    uuid: number = 0;

    constructor(ModLoader: IModLoaderAPI, revision: number) {
        this.ModLoader = ModLoader;
        this.cmdbuf = CommandBuffer_Factory.Inject(this.ModLoader.emulator, this.ModLoader.heap!, revision);
    }

    @Deprecated("CommandBuffer.runCommand is deprecated.")
    runCommand(command: Command, param: number, callback?: Function): void {}

    spawnActor(actorId: number, params: number, rot: Vector3, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
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
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
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
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
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
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
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
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.UPDATEBUTTON);
        this.ModLoader.emulator.rdramWrite16(offset + 8, button);
    }

    playSound(sfxId: number, a1: Vector3, a2: number, a3: number, a4: number, a5: number): void {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
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
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.WARP);
        this.ModLoader.emulator.rdramWrite32(offset + 8, entranceIndex);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, cutsceneIndex);

        return new Promise((accept, reject) => {
            if (callback !== undefined) callback()
            accept(true)
        });
    }

    movePlayerActorToAddress(address: number): Promise<boolean> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
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

    // supports up to 4 args (a0-a3); returns function return value (v0)
    arbitraryFunctionCall(functionAddress: number, argsPointer: number): Promise<Buffer> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf);
        let offset = this.cmdbuf + COMMAND_OFFSET + COMMAND_SIZEOF * count;

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1);
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ARBITRARYFUNCTIONCALL);
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID);
        this.ModLoader.emulator.rdramWrite32(offset + 8, functionAddress);
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, argsPointer);

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

    onTick() {
        let index = 0;

        for (index = 0; index < COMMANDACTOR_MAX; index++) {
            let offset = this.cmdbuf + COMMAND_ACTOR_OFFSET + COMMAND_ACTOR_SIZEOF * index;
            let type = this.ModLoader.emulator.rdramRead32(offset);

            if (type !== CommandBuffer_CommandActorType.NONE) {
                let actor = this.ModLoader.emulator.rdramRead32(offset + 4);
                bus.emit("Actor_" + CommandBuffer_CommandActorType[type], actor);
                this.ModLoader.emulator.rdramWrite32(offset, 0);
            }
        }
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
            ]),
        ],
    ]);
    static cmd_pointer: number = 0;
    static cmdbuf: number = 0;

    // Patches references to commandBuffer dummy address with the real deal
    private static ReplaceAddress(alloc: number, size: number, emu: IMemory, target: number) {
        for (let i = 0; i < size; i += 4) {
            let inst = DecodeOpcode(emu.rdramReadBuffer(alloc + i, 4));
            if (inst.type === OPCODEINDEXTYPE.DEFAULT && inst.indx === OPCODE_DEFAULT.LUI) {
                let imm = DecodeImmediate(inst);
                if (imm === 0x1234) {
                    let inst2 = DecodeOpcode(emu.rdramReadBuffer(alloc + i, 4));
                    let imm2 = DecodeImmediate(inst2);
                    let itr = i;
                    while (imm2 !== 0x5678) {
                        itr += 4;
                        inst2 = DecodeOpcode(emu.rdramReadBuffer(alloc + itr, 4));
                        imm2 = DecodeImmediate(inst2);
                    }
                    let ninst1 = EncodeImmediate(inst, target >> 16);
                    let ninst2 = EncodeImmediate(inst2, target & 0x0000ffff);
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
        let Sfx_Cave_malloc = alloc(Sfx_Cave);

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
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_InitCave")!, JAL_ENCODE(Actor_InitCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_SpawnEntryCave")!, JAL_ENCODE(Actor_SpawnEntryCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_SpawnTransitionActorCave")!, JAL_ENCODE(Actor_SpawnTransitionActorCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_UpdateCave")!, JAL_ENCODE(Actor_UpdateCave_malloc));
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("CommandBuffer_Update")!, JAL_ENCODE(CommandBuffer_Update_malloc));

        let spawnCave = new SmartBuffer();
        spawnCave.writeUInt32BE(J_ENCODE(Actor_SpawnCave_malloc));
        spawnCave.writeBuffer(Buffer.from("0000000003E0000800000000", "hex"));
        emu.rdramWriteBuffer(this.VERSIONS.get(revision)!.get("Actor_SpawnCave")!, spawnCave.toBuffer());

        this.cmd_pointer = heap.malloc(0x10);
        this.cmdbuf = heap.malloc(COMMANDBUFFER_SIZEOF);
        emu.rdramWrite32(this.cmd_pointer, this.cmdbuf);
        console.log(`Command buffer: ${this.cmdbuf.toString(16)}`);
        this.ReplaceAddress(CommandBuffer_Update_malloc, commandbuffer.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnWithAddress_malloc, Actor_SpawnWithAddress.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_DestroyCave_malloc, Actor_DestroyCave.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_InitCave_malloc, Actor_InitCave.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnEntryCave_malloc, Actor_SpawnEntryCave.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnCave_malloc, Actor_SpawnCave.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnTransitionActorCave_malloc, Actor_SpawnTransitionActorCave.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_UpdateCave_malloc, Actor_UpdateCave.byteLength, emu, this.cmd_pointer);
        //this.ReplaceAddress(Sfx_Cave_malloc, Sfx_Cave.byteLength, emu, this.cmd_pointer);

        return this.cmdbuf;
    }
}
