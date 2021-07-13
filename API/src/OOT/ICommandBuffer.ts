import Vector3 from "../math/Vector3";
import { IActor } from "./IActor";

export const enum Command {
    NONE,
    ACTORSPAWN,
    ACTORDESTROY,
    RELOCATE,
    UPDATEBUTTON,
    PLAYSOUND,
    PLAYMUSIC,
    WARP,
    MOVEPLAYERTOADDRESS,
    SFX
}

export interface ICommandBuffer {
  runCommand(command: Command, param: number, callback?: Function): void;
  spawnActor(actorId: number, params: number, rot: Vector3, pos: Vector3, address?: number): Promise<IActor>;
  spawnActorRXYZ(actorId: number, params: number, rotX: number, rotY: number, rotZ: number, pos: Vector3, address?: number): Promise<IActor>;
  spawnActorRXY_Z(actorId: number, params: number, rotXY: number, rotZ: number, pos: Vector3, address?: number): Promise<IActor>
  runWarp(entranceIndex: number, cutsceneIndex: number, callback?: Function): Promise<boolean>;
  relocateOverlay(allocatedVRamAddress: number, overlayInfoPointer: number, vRamAddress: number): Promise<void>;
  updateButton(button: number): void;
  playSound(sfxId: number, a1: Vector3, a2: number, a3: number, a4: number, a5: number): void;
  // #ifdef DANGEROUS_FUNCTIONS
  arbitraryFunctionCall(functionAddress: number, argsPointer: number): Promise<Buffer>;
  movePlayerActorToAddress(address: number): Promise<boolean>;
  // #endif
}
