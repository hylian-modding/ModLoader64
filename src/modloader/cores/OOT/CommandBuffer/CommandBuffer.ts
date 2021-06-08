import { IModLoaderAPI } from "API/build/IModLoaderAPI";
import Vector3 from "API/build/math/Vector3";
import { IActor } from "API/build/OOT/IActor";
import { Command, ICommandBuffer } from "API/build/OOT/ICommandBuffer";
import { Heap } from "modloader64_api/heap";
import IMemory from "modloader64_api/IMemory";
import { SmartBuffer } from "smart-buffer";
import { DecodeImmediate, DecodeOpcode, EncodeImmediate, JAL_DECODE, JAL_ENCODE, J_ENCODE, OPCODEINDEXTYPE, OPCODE_DEFAULT } from "./OpcodeBullshit";
import { Deprecated } from 'modloader64_api/Deprecated';
import { ActorBase } from "../Actor";

export const Actor_DestroyHook: Buffer = Buffer.from("J73/yK+/ADSvvgAwA6DwJa/EADivxQA8j8IAOK/CABQkAgAFr8IAGCQCAAWvwgAcr8AAIK/AACQQAAAsAAAAADwDEjSMY1Z4j8IAJCRCAaAAAhDAAGIQIYxCAASPwwAYAEMQKxRAAB4AAAAAPAMSNIxjVniPwgAkJEIBoAACEMAAYhAhjEIABI/DABwAYhArFEAAEwAAAAA8AxI0jGNWeI/CACQkQgGgAAIQwABiECGMQgAIj8MAFBRiAAkAAAAAPAMSNIxjVniPwgAkJEIBoAACEMAAYhAhJEIABK/CACCPwgAkJEIAAa/CACSPwgAkLEIBPxRA/9IAAAAAj8IAIBRAAB8AAAAAr8AAKK/AACwQAAAVAAAAADwDEjSMY1Z4j8IALCRCAaAAAhDAAGIQIYxCAAQUQAAJAAAAADwDEjSMY1Z4j8IALCRCAaAAAhDAAGIQISRCAASvwgAoj8IALCRCAAGvwgAsj8IALCxCAT8UQP/pAAAAAI/CACivwgAgj8IAIK/CABCPwgAQEEAABwAAAACPwgAQJAMABaxDAACPwgAQj8MAOKxDAASPwgA4jEIBLI/FADyPxAA4AED4CQAAAAAAAAAAA8DoJY+/ADSPvgAwJ70AOAPgAAgAAAAA", 'base64');
export const Actor_InitHook: Buffer = Buffer.from("J73/yK+/ADSvvgAwA6DwJa/EADivxQA8j8IAOK/CABQkAgABr8IAGCQCAAGvwgAcr8AAIK/AACQQAAAsAAAAADwDEjSMY1Z4j8IAJCRCAaAAAhDAAGIQIYxCAASPwwAYAEMQKxRAAB4AAAAAPAMSNIxjVniPwgAkJEIBoAACEMAAYhAhjEIABI/DABwAYhArFEAAEwAAAAA8AxI0jGNWeI/CACQkQgGgAAIQwABiECGMQgAIj8MAFBRiAAkAAAAAPAMSNIxjVniPwgAkJEIBoAACEMAAYhAhJEIABK/CACCPwgAkJEIAAa/CACSPwgAkLEIBPxRA/9IAAAAAj8IAIBRAAB8AAAAAr8AAKK/AACwQAAAVAAAAADwDEjSMY1Z4j8IALCRCAaAAAhDAAGIQIYxCAAQUQAAJAAAAADwDEjSMY1Z4j8IALCRCAaAAAhDAAGIQISRCAASvwgAoj8IALCRCAAGvwgAsj8IALCxCAT8UQP/pAAAAAI/CACivwgAgj8IAIK/CABCPwgAQEEAABwAAAACPwgAQJAMAAaxDAACPwgAQj8MAOKxDAASPxQA8j8QAOAwAg/cAAAAAAAAAAAPA6CWPvwA0j74AMCe9ADgD4AAIAAAAAA==", 'base64');
export const Actor_SpawnHook: Buffer = Buffer.from("J73/qK+/AFSvvgBQA6DwJa/EAFivxQBcAMAQJa/HAGSnwgBgr8AAGIfCAGAAAhlAPAKADjRChTAAYhAhr8IAHI/CAByMQgAMAEAYJY/CAByMQgAIAGIQI6/CACCPwgAcjEIACBRAAAYAAAAAj8IAHIxCABSvwgAkEAAARwAAAACPwgAcjEIAEBRAAEMAAAAAj8IAHJRCABwwQgABEEAAEQAAAACPwgBcjEIdYBRAAAcAAAAAJAQnoAwBmw4AAAAAAEAYJY/CAFysQx1gj8IAXIxDHWCPwgAcrEMAEBAAABQAAAAAj8IAHJRCABwwQgACEEAACQAAAACPxAAgDAGbDgAAAAAAQBglj8IAHKxDABAQAAAHAAAAAI/EACAMAZsEAAAAAABAGCWPwgAcrEMAEI/CAByMQgAQFEAABAAAAAAAABAlEAABHAAAAACPwgAcjEMAAI/CAByMRAAEj8IAHIxFAAiPwgAcjEYADI/CAByMQgAQr6IAEADAOCUAoDAlAIAoJQBgICUMAzLuAAAAAI/CABygQAAej8IAHIxCABQQQAANAAAAAI/CAByMQgAUAEAYJY/CAByMQgAQAEAgJY/CAByMQgAIAIIQIwBiECEQAAACAAAAAAAAECWvwgAkj8MAXDwCAAE0QhekAGIYIY/CACSEQgAIAEAoJQBgICUMAgWKAAAAAK/CACiPwgAoBEAAEAAAAACPwgAkkEMAAiQCAAUUYgARAAAAAI/DAFw8AgABAGIQIYBCHLwAQCglj8QAXAwAgZAAAAAAEEAABwAAAACPxAAcDACUKwAAAAAAABAlEAAA1AAAAACPwgAkjEIADABAICUMAZsEAAAAAK/CABiPwgAYFEAABwAAAACPxAAcDACUKwAAAAAAABAlEAAAxQAAAACPwgAcgEIAHjBCAP8kQgABMEIA/wACHgAAAx4Dj8IAHKBDAB6PwgAkjEIADAAAMCUAQCglj8QAGAwBjYwAAAAAj8IAGI/DABysQwE4j8IAJIRDAACPwgAYpEMAAI/CACSMQwAEj8IAGKxDAASPwgAoAAIeAAADHgOPwgAYoEMAHo/CACSMQwAQj8IAGKxDASiPwgAkjEMAFI/CABisQwEsj8IAJIxDABiPwgAYrEMBMI/CACSMQwAcj8IAGKxDATSPwwBcPAIAAQBiECGAQxy8j8IAGKBDAAOPwgAYx8AAZORAAAiPwgAYx8AAaORAAAyPwgAYx8AAbORAABCPwgAYl8MAcqRDABSPwgAYl8MAdqRDABaPwgAYl8MAeqRDABiPwgAYl8MAfqRDAByPwgBcJEMcJI/CACSQQgACAEAwJY/FABgAYCAlDACT5gAAAACPwgAYr8IANCQCAAKvwgA4JAIABK/CADyvwABAr8AARBAAACwAAAAAPAMSNIxjVniPwgBEJEIBoAACEMAAYhAhjEIABI/DADgAQxArFEAAHgAAAAA8AxI0jGNWeI/CAEQkQgGgAAIQwABiECGMQgAEj8MAPABiECsUQAATAAAAADwDEjSMY1Z4j8IARCRCAaAAAhDAAGIQIYxCAAiPwwA0FGIACQAAAAA8AxI0jGNWeI/CAEQkQgGgAAIQwABiECEkQgAEr8IAQI/CAEQkQgABr8IARI/CAEQsQgE/FED/0gAAAACPwgBAFEAAHwAAAACvwABIr8AATBAAABUAAAAAPAMSNIxjVniPwgBMJEIBoAACEMAAYhAhjEIABBRAAAkAAAAAPAMSNIxjVniPwgBMJEIBoAACEMAAYhAhJEIABK/CAEiPwgBMJEIAAa/CAEyPwgBMLEIBPxRA/+kAAAAAj8IASK/CAECPwgBAr8IALI/CACwQQAAHAAAAAI/CACwkAwACrEMAAI/CACyPwwAYrEMABDwCgBKMQgxQr8IAMI/FAFyPxAAYDACD9wAAAACPwgAwPAGAEqwiDFCPwgAYA8DoJY+/AFSPvgBQJ70AWAPgAAgAAAAA", 'base64');
export const Actor_SpawnTransitionActorHook: Buffer = Buffer.from("J73/qK+/AFSvvgBQA6DwJa/EAFivxQBcAMAQJa/HAGSnwgBgr8AAKIfDAGCHwgB+r6IAJIfCAHqvogAgh8IAdq+iAByHwgByr6IAGMfAAGznoAAUx8AAaOegABCPxwBkAGAwJY/FAFyPxABYDACURAAAAACvwgAsj8IALK/CADAkAgACr8IANCQCAASvwgA4r8AAPK/AAEAQAAAsAAAAADwDEjSMY1Z4j8IAQCRCAaAAAhDAAGIQIYxCAASPwwA0AEMQKxRAAB4AAAAAPAMSNIxjVniPwgBAJEIBoAACEMAAYhAhjEIABI/DADgAYhArFEAAEwAAAAA8AxI0jGNWeI/CAEAkQgGgAAIQwABiECGMQgAIj8MAMBRiAAkAAAAAPAMSNIxjVniPwgBAJEIBoAACEMAAYhAhJEIABK/CADyPwgBAJEIAAa/CAECPwgBALEIBPxRA/9IAAAAAj8IAPBRAAB8AAAAAr8AARK/AAEgQAAAVAAAAADwDEjSMY1Z4j8IASCRCAaAAAhDAAGIQIYxCAAQUQAAJAAAAADwDEjSMY1Z4j8IASCRCAaAAAhDAAGIQISRCAASvwgBEj8IASCRCAAGvwgBIj8IASCxCAT8UQP/pAAAAAI/CAESvwgA8j8IAPK/CACiPwgAoEEAABwAAAACPwgAoJAMABKxDAACPwgAoj8MALKxDAASPwgAsA8DoJY+/AFSPvgBQJ70AWAPgAAgAAAAA", 'base64');
export const Actor_SpawnEntryHook: Buffer = Buffer.from("J73/wK+/ADyvvgA4A6DwJa/EAECvxQBEr8YASK/AABCPxgBIj8UARI/EAEAMAJVxAAAAAK/CABSPwgAUr8IAGCQCAAKvwgAcJAIABK/CACCvwAAkr8AAKBAAACwAAAAAPAMSNIxjVniPwgAoJEIBoAACEMAAYhAhjEIABI/DABwAQxArFEAAHgAAAAA8AxI0jGNWeI/CACgkQgGgAAIQwABiECGMQgAEj8MAIABiECsUQAATAAAAADwDEjSMY1Z4j8IAKCRCAaAAAhDAAGIQIYxCAAiPwwAYFGIACQAAAAA8AxI0jGNWeI/CACgkQgGgAAIQwABiECEkQgAEr8IAJI/CACgkQgABr8IAKI/CACgsQgE/FED/0gAAAACPwgAkFEAAHwAAAACvwAAsr8AAMBAAABUAAAAAPAMSNIxjVniPwgAwJEIBoAACEMAAYhAhjEIABBRAAAkAAAAAPAMSNIxjVniPwgAwJEIBoAACEMAAYhAhJEIABK/CACyPwgAwJEIAAa/CADCPwgAwLEIBPxRA/+kAAAAAj8IALK/CACSPwgAkr8IAEI/CABAQQAAHAAAAAI/CABAkAwADrEMAAI/CABCPwwAUrEMABI/CABQDwOglj78API++ADgnvQBAA+AACAAAAAA=", 'base64');
export const commandbuffer: Buffer = Buffer.from("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", 'base64');
export const Sfx_Hook: Buffer = Buffer.from("J73/6K++ABQDoPAlr8QAGACgECWnwgAcPAKAHYxCoOSvwgAIr8AAAI/DAAiPwgAYFGIARQAAAACXwwAcJAL/AABiECSnwgAMJAJoAKfCAA6vwAAEEAAAGwAAAAA8BBI0jIRWeI/DAAQAYBAlAAIQQABDECEAAhCAAIIQIYxDCgQkAgAKFGIADAAAAAA8BBI0jIRWeI/DAAQAYBAlAAIQQABDECEAAhCAJEIKAACCECEkQgAEr8IAAI/CAAQkQgABr8IABI/CAAQsQgBAFED/4wAAAACPwgAAEEAAGwAAAACXwwAMl8IADhRiAAUAAAAAl8IADCxCAA8QQAAHAAAAAI/CAAAkAwAKrEMAAI/CAACXwwAcpEMACCQCGACnwgAOl8MADpfCAAwUYgAHAAAAAI/CAAAkAwAKrEMAAI/CAACXwwAcpEMACAAAAAADwOglj74AFCe9ABgD4AAIAAAAAA==", 'base64');
export const Actor_SpawnWithAddress: Buffer = Buffer.from("J73/yK+/ADSvvgAwA6DwJa/EADgAoBAlAMAYJa/HAESnwgA8AGAQJafCAECHwgA8AAIZQDwCgA40QoUwAGIQIa/CABiPwgAYjEIADABAGCWPwgAYjEIACABiECOvwgAcj8IAGIxCAAgUQAAGAAAAAI/CABiMQgAUr8IAIBAAAEoAAAAAj8IAGIxCABAUQABGAAAAAI/CABiUQgAcMEIAARBAABEAAAAAj8IAOIxCHWAUQAAHAAAAACQEJ6AMAZsOAAAAAABAGCWPwgA4rEMdYI/CADiMQx1gj8IAGKxDABAQAAAUAAAAAI/CABiUQgAcMEIAAhBAAAkAAAAAj8QAHAwBmw4AAAAAAEAYJY/CABisQwAQEAAABwAAAACPxAAcDAGbBAAAAAAAQBglj8IAGKxDABCPwgAYjEIAEBRAAAcAAAAAj8IATDwD3q00YwutrEMAABAAALEAAAAAj8IAGIxDAACPwgAYjEQABI/CABiMRQAIj8IAGIxGAAyPwgAYjEIAEK+iABAAwDglAKAwJQCAKCUAYCAlDAMy7gAAAACPwgAYoEAAHo/CABiMQgAUEEAADQAAAACPwgAYjEIAFABAGCWPwgAYjEIAEABAICWPwgAYjEIACACCECMAYhAhEAAAAgAAAAAAABAlr8IAII/DADg8AgABNEIXpABiGCGPwgAghEIACABAKCUAYCAlDAIFigAAAACvwgAkj8IAJARAABAAAAAAj8IAIJBDAAIkAgAFFGIAFAAAAACPwwA4PAIAAQBiECGAQhy8AEAoJY/EADgMAIGQAAAAABBAAAoAAAAAj8QAGAwAlCsAAAAAj8IATDwD3q00Y96trEMAABAAAGYAAAAAj8IAGIBCAB4wQgD/JEIAATBCAP8AAh4AAAMeA4/CABigQwAej8IAIIxCAAwAADAlAEAoJY/EAEwMAY2MAAAAAI/CAEyPwwAYrEMBOI/CACCEQwAAj8IATKRDAACPwgAgjEMABI/CAEysQwAEj8IAJAACHgAAAx4Dj8IATKBDAB6PwgAgjEMAEI/CAEysQwEoj8IAIIxDABSPwgBMrEMBLI/CACCMQwAYj8IATKxDATCPwgAgjEMAHI/CAEysQwE0j8MAODwCAAEAYhAhgEMcvI/CAEygQwADj8IARMRAAACPwgBM5EAACI/CAETEQAAEj8IATORAAAyPwgBExEAACI/CAEzkQAAQj8IASIRDAACPwgBMpEMAFI/CAEiEQwACj8IATKRDABaPwgBIhEMABI/CAEykQwAYj8IATJfDAECkQwAcj8IAOCRDHCSPwgAgkEIAAgBAMCWPxQBMAGAgJQwAk+YAAAAAPAKAEoxCDFCvwgAoj8UAOI/EAEwMAIP3AAAAAI/CACg8AYASrCIMUAAAAAADwOglj78ANI++ADAnvQA4A+AACAAAAAA=", 'base64');
export const Actor_UpdateHook: Buffer = Buffer.from("J73/yK+/ADSvvgAwA6DwJa/EADivxQA8j8IAOK/CABQkAgAGr8IAGCQCAAavwgAcr8AAIK/AACQQAAAsAAAAADwDEjSMY1Z4j8IAJCRCAaAAAhDAAGIQIYxCAASPwwAYAEMQKxRAAB4AAAAAPAMSNIxjVniPwgAkJEIBoAACEMAAYhAhjEIABI/DABwAYhArFEAAEwAAAAA8AxI0jGNWeI/CACQkQgGgAAIQwABiECGMQgAIj8MAFBRiAAkAAAAAPAMSNIxjVniPwgAkJEIBoAACEMAAYhAhJEIABK/CACCPwgAkJEIAAa/CACSPwgAkLEIBPxRA/9IAAAAAj8IAIBRAAB8AAAAAr8AAKK/AACwQAAAVAAAAADwDEjSMY1Z4j8IALCRCAaAAAhDAAGIQIYxCAAQUQAAJAAAAADwDEjSMY1Z4j8IALCRCAaAAAhDAAGIQISRCAASvwgAoj8IALCRCAAGvwgAsj8IALCxCAT8UQP/pAAAAAI/CACivwgAgj8IAIK/CABCPwgAQEEAABwAAAACPwgAQJAMABqxDAACPwgAQj8MAOKxDAASPwgA4jEIBMI/FADyPxAA4AED4CQAAAAAAAAAAA8DoJY+/ADSPvgAwJ70AOAPgAAgAAAAA", 'base64');

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
};

const COMMAND_MAX = 64;
const COMMANDACTOR_MAX = 319;
const COMMAND_PARAM_SIZEOF = 0x20;
const COMMAND_SIZEOF = COMMAND_PARAM_SIZEOF + 8;
const COMMAND_OFFSET = 4;
const COMMAND_RETURN_DATA_SIZEOF = 0x04;
const COMMAND_RETURN_SIZEOF = COMMAND_RETURN_DATA_SIZEOF + 8;
const COMMAND_RETURN_OFFSET = COMMAND_OFFSET + (COMMAND_SIZEOF * COMMAND_MAX);
const COMMAND_ACTOR_SIZEOF = 8;
const COMMAND_ACTOR_OFFSET = COMMAND_RETURN_OFFSET + (COMMAND_RETURN_SIZEOF * COMMAND_MAX);
const COMMANDBUFFER_SIZEOF = COMMAND_ACTOR_OFFSET + (COMMAND_ACTOR_SIZEOF * COMMANDACTOR_MAX)


export class CommandBuffer implements ICommandBuffer {

    ModLoader!: IModLoaderAPI;
    cmdbuf: number;
    uuid: number = 0;

    constructor(ModLoader: IModLoaderAPI, revision: number) {
        this.ModLoader = ModLoader;
        this.cmdbuf = CommandBuffer_Factory.Inject(this.ModLoader.emulator, this.ModLoader.heap!, revision);
    }

    @Deprecated('CommandBuffer.runCommand is deprecated.')
    runCommand(command: Command, param: number, callback?: Function): void {
    }

    spawnActor(actorId: number, params: number, rot: Vector3, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ACTORSPAWN)
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID)
        this.ModLoader.emulator.rdramWrite16(offset + 8, actorId)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 2, params)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 4, Math.floor(rot.x) % 32768)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 6, Math.floor(rot.y) % 32768)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 8, Math.floor(rot.z) % 32768)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xC, pos.x)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x10, pos.y)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, pos.z)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 0x18, address)

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + (COMMAND_RETURN_SIZEOF * index)
                    let type = this.ModLoader.emulator.rdramRead32(offset)
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4)

                    if (type === CommandBuffer_CommandType.ACTORSPAWN && uuid === myUUID) {
                        this.ModLoader.logger.warn("ACTOR SPAWNED POG: " + this.ModLoader.emulator.rdramRead32(offset + 8).toString(16))
                        this.ModLoader.emulator.rdramWrite32(offset, 0) // free return slot
                        if (this.ModLoader.emulator.rdramRead32(offset + 8) === 0) {
                            reject("Actor pointer was zero.");
                        } else {
                            accept(new ActorBase(this.ModLoader.emulator, this.ModLoader.emulator.rdramRead32(offset + 8)));
                        }

                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    spawnActorRXYZ(actorId: number, params: number, rotX: number, rotY: number, rotZ: number, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ACTORSPAWN)
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID)
        this.ModLoader.emulator.rdramWrite16(offset + 8, actorId)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 2, params)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 4, Math.floor(rotX) % 32768)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 6, Math.floor(rotY) % 32768)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 8, Math.floor(rotZ) % 32768)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xC, pos.x)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x10, pos.y)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, pos.z)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 0x18, address)

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + (COMMAND_RETURN_SIZEOF * index)
                    let type = this.ModLoader.emulator.rdramRead32(offset)
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4)

                    if (type === CommandBuffer_CommandType.ACTORSPAWN && uuid === myUUID) {
                        this.ModLoader.logger.warn("ACTOR SPAWNED POG: " + this.ModLoader.emulator.rdramRead32(offset + 8).toString(16))
                        this.ModLoader.emulator.rdramWrite32(offset, 0) // free return slot
                        if (this.ModLoader.emulator.rdramRead32(offset + 8) === 0) {
                            reject("Actor pointer was zero.");
                        } else {
                            accept(new ActorBase(this.ModLoader.emulator, this.ModLoader.emulator.rdramRead32(offset + 8)));
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    spawnActorRXY_Z(actorId: number, params: number, rotXY: number, rotZ: number, pos: Vector3, address: number = 0): Promise<IActor> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ACTORSPAWN)
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID)
        this.ModLoader.emulator.rdramWrite16(offset + 8, actorId)
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 2, params)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, Math.floor(rotXY))
        this.ModLoader.emulator.rdramWrite16(offset + 8 + 8, Math.floor(rotZ) % 32768)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xC, pos.x)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x10, pos.y)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, pos.z)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 0x18, address)

        console.log("tried to write command type: " + this.ModLoader.emulator.rdramRead32(offset) + " at index " + count + " with uuid" + myUUID)

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + (COMMAND_RETURN_SIZEOF * index)
                    let type = this.ModLoader.emulator.rdramRead32(offset)
                    if (type === 0) continue;
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4)

                    console.log(`type: ${type}, uuid: ${uuid}`);
                    if (type === CommandBuffer_CommandType.ACTORSPAWN && uuid === myUUID) {
                        let addr = this.ModLoader.emulator.rdramRead32(offset + 8)
                        this.ModLoader.logger.warn("ACTOR SPAWNED POG: " + addr.toString(16))
                        this.ModLoader.emulator.rdramWrite32(offset, 0) // free return slot
                        if (addr === 0) {
                            reject("Actor pointer was zero.");
                        } else {
                            accept(new ActorBase(this.ModLoader.emulator, addr));
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        });
    }

    relocateOverlay(allocatedVRamAddress: number, overlayInfoPointer: number, vRamAddress: number): void {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.RELOCATE)
        this.ModLoader.emulator.rdramWrite32(offset + 8, allocatedVRamAddress)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, overlayInfoPointer)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 8, vRamAddress)
    }

    updateButton(button: number): void {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.UPDATEBUTTON)
        this.ModLoader.emulator.rdramWrite16(offset + 8, button)
    }

    playSound(sfxId: number, a1: Vector3, a2: number, a3: number, a4: number, a5: number): void {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.PLAYSOUND)
        this.ModLoader.emulator.rdramWrite16(offset + 8, sfxId)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x4, a1.x)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x8, a1.y)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0xC, a1.z)
        this.ModLoader.emulator.rdramWrite8(offset + 8 + 0x10, a2)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x14, a3)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x18, a4)
        this.ModLoader.emulator.rdramWriteF32(offset + 8 + 0x1C, a5)
    }

    runWarp(engntrance: number, cutscene: number, callback?: Function): Promise<boolean> {
        throw new Error("Method not implemented.");
        return new Promise((accept, reject) => {

        })
    }

    movePlayerActorToAddress(address: number): Promise<boolean> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.MOVEPLAYERTOADDRESS)
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID)
        this.ModLoader.emulator.rdramWrite32(offset + 8, address)
        
        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + (COMMAND_RETURN_SIZEOF * index)
                    let type = this.ModLoader.emulator.rdramRead32(offset)
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4)
                    if (type === 0) continue;
                    if (type === CommandBuffer_CommandType.MOVEPLAYERTOADDRESS && uuid === myUUID){
                        let addr = this.ModLoader.emulator.rdramRead32(offset + 8)
                        this.ModLoader.emulator.rdramWrite32(offset, 0) // free return slot
                        if (addr === 0){
                            reject("Player pointer was zero.");
                        }else{
                            accept(true);
                        }
                    }
                }
                reject("Failed to find return value.");
            }, 1);
        })
    }

    // supports up to 4 args (a0-a3); returns function return value (v0)
    arbitraryFunctionCall(functionAddress: number, argsPointer: number): Promise<Buffer> {
        let count = this.ModLoader.emulator.rdramRead32(this.cmdbuf)
        let offset = this.cmdbuf + COMMAND_OFFSET + (COMMAND_SIZEOF * count)

        let myUUID = this.uuid++;

        this.ModLoader.emulator.rdramWrite32(this.cmdbuf, count + 1)
        this.ModLoader.emulator.rdramWrite32(offset, CommandBuffer_CommandType.ARBITRARYFUNCTIONCALL)
        this.ModLoader.emulator.rdramWrite32(offset + 4, myUUID)
        this.ModLoader.emulator.rdramWrite32(offset + 8, functionAddress)
        this.ModLoader.emulator.rdramWrite32(offset + 8 + 4, argsPointer)

        return new Promise((accept, reject) => {
            this.ModLoader.utils.setTimeoutFrames(() => {
                for (let index = 0; index < COMMAND_MAX; index++) {
                    let offset = this.cmdbuf + COMMAND_RETURN_OFFSET + (COMMAND_RETURN_SIZEOF * index)
                    let type = this.ModLoader.emulator.rdramRead32(offset)
                    if (type === 0) continue;
                    let uuid = this.ModLoader.emulator.rdramRead32(offset + 4)

                    if (type === CommandBuffer_CommandType.ARBITRARYFUNCTIONCALL && uuid === myUUID) {
                        this.ModLoader.emulator.rdramWrite32(offset, 0) // free return slot
                        accept(this.ModLoader.emulator.rdramReadBuffer(offset + 8, 4))
                    }
                }
                reject("Failed to find return value!")
            }, 1)
        })
    }

}

export class CommandBuffer_Factory {
    static VERSIONS: Map<number, Map<string, number>> = new Map([
        [0, new Map<string, number>([
            ["Actor_DestroyHook", 0x80021104],
            ["Actor_InitHook", 0x800210D0],
            ["Actor_SpawnEntryHook", 0x80023DE8],
            ["Actor_SpawnTransitionActorHook", 0x8002557C],
            ["Actor_UpdateHook", 0x800240D8],
            ["Actor_SpawnHook", 0x80025110],
            ["CommandBuffer_Update", 0x800A0BF8]
        ])]
    ]);
    static cmd_pointer: number = 0;
    static cmdbuf: number = 0;

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
                    let ninst1 = EncodeImmediate(inst, (target >> 16));
                    let ninst2 = EncodeImmediate(inst2, (target & 0x0000FFFF));
                    emu.rdramWriteBuffer(alloc + i, ninst1.data);
                    emu.rdramWriteBuffer(alloc + itr, ninst2.data);
                }
            }
        }
    }

    static Inject(emu: IMemory, heap: Heap, revision: number): number {
        let alloc = (buf: Buffer) => {
            let m = heap.malloc(buf.byteLength);
            emu.rdramWriteBuffer(m, buf);
            return m;
        };
        //
        let CommandBuffer_Update_malloc = alloc(commandbuffer);
        let Actor_SpawnWithAddress_malloc = alloc(Actor_SpawnWithAddress);
        let Actor_DestroyHook_malloc = alloc(Actor_DestroyHook);
        let Actor_InitHook_malloc = alloc(Actor_InitHook);
        let Actor_SpawnEntryHook_malloc = alloc(Actor_SpawnEntryHook);
        let Actor_SpawnHook_malloc = alloc(Actor_SpawnHook);
        let Actor_SpawnTransitionActorHook_malloc = alloc(Actor_SpawnTransitionActorHook);
        let Actor_UpdateHook_malloc = alloc(Actor_UpdateHook);
        let Sfx_Hook_malloc = alloc(Sfx_Hook);
        //
        for (let i = 0; i < commandbuffer.byteLength; i += 4) {
            let inst = DecodeOpcode(commandbuffer.slice(i, i + 4));
            if (inst.type === OPCODEINDEXTYPE.DEFAULT && inst.indx === OPCODE_DEFAULT.JAL) {
                let addr = JAL_DECODE(inst.data);
                if (addr === 0x03211234) {
                    emu.rdramWrite32(CommandBuffer_Update_malloc + i, JAL_ENCODE(Actor_SpawnWithAddress_malloc));
                }
            }
        }
        //emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_DestroyHook")!, JAL_ENCODE(Actor_DestroyHook_malloc));
        //emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_InitHook")!, JAL_ENCODE(Actor_InitHook_malloc));
        //emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_SpawnEntryHook")!, JAL_ENCODE(Actor_SpawnEntryHook_malloc));
        //emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_SpawnTransitionActorHook")!, JAL_ENCODE(Actor_SpawnTransitionActorHook_malloc));
        //emu.rdramWrite32(this.VERSIONS.get(revision)!.get("Actor_UpdateHook")!, JAL_ENCODE(Actor_UpdateHook_malloc));
        //let spawnhook = new SmartBuffer();
        //spawnhook.writeUInt32BE(J_ENCODE(Actor_SpawnHook_malloc));
        //spawnhook.writeBuffer(Buffer.from('0000000003E0000800000000', 'hex'));
        //emu.rdramWriteBuffer(this.VERSIONS.get(revision)!.get("Actor_SpawnHook")!, spawnhook.toBuffer());
        emu.rdramWrite32(this.VERSIONS.get(revision)!.get("CommandBuffer_Update")!, JAL_ENCODE(CommandBuffer_Update_malloc));
        emu.invalidateCachedCode();
        this.cmd_pointer = heap.malloc(0x10)
        this.cmdbuf = heap.malloc(COMMANDBUFFER_SIZEOF)
        emu.rdramWrite32(this.cmd_pointer, this.cmdbuf);
        console.log(`Command buffer: ${this.cmdbuf.toString(16)}`);
        this.ReplaceAddress(CommandBuffer_Update_malloc, commandbuffer.byteLength, emu, this.cmd_pointer);
        this.ReplaceAddress(Actor_SpawnWithAddress_malloc, Actor_SpawnWithAddress.byteLength, emu, this.cmd_pointer);
        //this.ReplaceAddress(Actor_DestroyHook_malloc, Actor_DestroyHook.byteLength, emu, this.cmd_pointer);
        //this.ReplaceAddress(Actor_InitHook_malloc, Actor_InitHook.byteLength, emu, this.cmd_pointer);
        //this.ReplaceAddress(Actor_SpawnEntryHook_malloc, Actor_SpawnEntryHook.byteLength, emu, this.cmd_pointer);
        //console.log("Actor_SpawnHook_malloc");
        //this.ReplaceAddress(Actor_SpawnHook_malloc, Actor_SpawnHook.byteLength, emu, this.cmd_pointer);
        //console.log("-----");
        //this.ReplaceAddress(Actor_SpawnTransitionActorHook_malloc, Actor_SpawnTransitionActorHook.byteLength, emu, this.cmd_pointer);
        //this.ReplaceAddress(Actor_UpdateHook_malloc, Actor_UpdateHook.byteLength, emu, this.cmd_pointer);
        //this.ReplaceAddress(Sfx_Hook_malloc, Sfx_Hook.byteLength, emu, this.cmd_pointer);

        return this.cmdbuf;
    }
}