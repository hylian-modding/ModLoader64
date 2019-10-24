import * as API from 'modloader64_api/BK/Imports';

export class Player extends API.BaseObj implements API.IPlayer {
  private inst: number = global.ModLoader[API.AddressType.PLAYER];

  private animal_addr: number = this.inst + 0x10a8;
  private anim_addr: number = this.inst - 0x01c0;
  private flip_facing_addr: number = this.inst + 0x07;
  private model_index_addr: number = this.inst + 0x04;
  private model_ptr_addr: number = this.inst + 0x00;
  private movement_state_addr: number = this.inst + 0x03c0;
  private opacity_addr: number = this.inst + 0x06;
  private pos_x_addr: number = this.inst + 0x04c0;
  private pos_y_addr: number = this.inst + 0x04c4;
  private pos_z_addr: number = this.inst + 0x04c8;
  private rot_x_addr: number = this.inst + 0x0460;
  private rot_y_addr: number = this.inst + 0x18;
  private rot_z_addr: number = this.inst + 0x05a0;
  private scale_addr: number = this.inst + 0x0c;
  private visible_addr: number = this.inst + 0x08;

  get animal(): API.AnimalType {
    let animal: number = this.emulator.rdramRead8(this.animal_addr);
    if (animal < 0x01 || animal > 0x07) return API.AnimalType.UNKNOWN;
    return animal as API.AnimalType;
  }
  set animal(val: API.AnimalType) {
    this.emulator.rdramWrite8(this.animal_addr, val);
  }

  get animation(): Buffer {
    let buf: Buffer = Buffer.alloc(8);
    buf.writeUInt32BE(this.emulator.rdramReadPtr32(this.anim_addr, 0x04), 0);
    buf.writeUInt32BE(this.emulator.rdramReadPtr32(this.anim_addr, 0x1c), 4);
    return buf;
  }
  set animation(val: Buffer) {
    this.emulator.rdramWritePtrBuffer(this.anim_addr, 0x04, val.slice(0, 4));
    this.emulator.rdramWritePtrBuffer(this.anim_addr, 0x1c, val.slice(4, 8));
  }

  get anim_frame(): number {
    return this.emulator.rdramReadPtr32(this.anim_addr, 0x04);
  }
  set anim_frame(val: number) {
    this.emulator.rdramWritePtr32(this.anim_addr, 0x04, val);
  }

  get anim_id(): number {
    return this.emulator.rdramReadPtr32(this.anim_addr, 0x1c);
  }
  set anim_id(val: number) {
    this.emulator.rdramWritePtr32(this.anim_addr, 0x1c, val);
  }

  get flip_facing(): boolean {
    return this.emulator.rdramRead8(this.flip_facing_addr) === 0x01;
  }
  set flip_facing(val: boolean) {
    if (val) {
      this.emulator.rdramWrite8(this.flip_facing_addr, 0x01);
    } else {
      this.emulator.rdramWrite8(this.flip_facing_addr, 0x00);
    }
  }

  get model_index(): number {
    return this.emulator.rdramRead16(this.model_index_addr);
  }
  set model_index(val: number) {
    this.emulator.rdramWrite16(this.model_index_addr, val);
  }

  get model_ptr(): number {
    return this.emulator.dereferencePointer(this.model_ptr_addr);
  }
  set model_ptr(val: number) {
    this.emulator.rdramWrite32(this.model_ptr_addr, val);
  }

  get movement_state(): number {
    return this.emulator.rdramRead32(this.movement_state_addr);
  }
  set movement_state(val: number) {
    this.emulator.rdramWrite32(this.movement_state_addr, val);
  }

  get opacity(): number {
    return this.emulator.rdramRead8(this.opacity_addr);
  }
  set opacity(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 255) {
      val = 255;
    }
    this.emulator.rdramWrite8(this.opacity_addr, val);
  }

  get position(): Buffer {
    let buf: Buffer = Buffer.alloc(12);
    buf.writeFloatBE(this.emulator.rdramReadF32(this.pos_x_addr), 0);
    buf.writeFloatBE(this.emulator.rdramReadF32(this.pos_y_addr), 4);
    buf.writeFloatBE(this.emulator.rdramReadF32(this.pos_z_addr), 8);
    return buf;
  }
  set position(val: Buffer) {
    this.emulator.rdramWriteBuffer(this.pos_x_addr, val.slice(0, 4));
    this.emulator.rdramWriteBuffer(this.pos_y_addr, val.slice(4, 8));
    this.emulator.rdramWriteBuffer(this.pos_z_addr, val.slice(8, 12));
  }

  get pos_x(): number {
    return this.emulator.rdramReadF32(this.pos_x_addr);
  }
  set pos_x(val: number) {
    this.emulator.rdramWriteF32(this.pos_x_addr, val);
  }

  get pos_y(): number {
    return this.emulator.rdramReadF32(this.pos_y_addr);
  }
  set pos_y(val: number) {
    this.emulator.rdramWriteF32(this.pos_y_addr, val);
  }

  get pos_z(): number {
    return this.emulator.rdramReadF32(this.pos_z_addr);
  }
  set pos_z(val: number) {
    this.emulator.rdramWriteF32(this.pos_z_addr, val);
  }

  get rotation(): Buffer {
    let buf: Buffer = Buffer.alloc(12);
    buf.writeFloatBE(this.emulator.rdramReadF32(this.rot_x_addr), 0);
    buf.writeFloatBE(this.emulator.rdramReadF32(this.rot_y_addr), 4);
    buf.writeFloatBE(this.emulator.rdramReadF32(this.rot_z_addr), 8);
    return buf;
  }
  set rotation(val: Buffer) {
    this.emulator.rdramWriteBuffer(this.rot_x_addr, val.slice(0, 4));
    this.emulator.rdramWriteBuffer(this.rot_y_addr, val.slice(4, 8));
    this.emulator.rdramWriteBuffer(this.rot_z_addr, val.slice(8, 12));
  }

  get rot_x(): number {
    return this.emulator.rdramReadF32(this.rot_x_addr);
  }
  set rot_x(val: number) {
    this.emulator.rdramWriteF32(this.rot_x_addr, val);
  }

  get rot_y(): number {
    return this.emulator.rdramReadF32(this.rot_y_addr);
  }
  set rot_y(val: number) {
    this.emulator.rdramWriteF32(this.rot_y_addr, val);
  }

  get rot_z(): number {
    return this.emulator.rdramReadF32(this.rot_z_addr);
  }
  set rot_z(val: number) {
    this.emulator.rdramWriteF32(this.rot_z_addr, val);
  }

  get scale(): number {
    return this.emulator.rdramRead32(this.scale_addr);
  }
  set scale(val: number) {
    this.emulator.rdramWrite32(this.scale_addr, val);
  }

  get visible(): boolean {
    return this.emulator.rdramRead8(this.visible_addr) === 0x01;
  }
  set visible(val: boolean) {
    if (val) {
      this.emulator.rdramWrite8(this.visible_addr, 0x01);
    } else {
      this.emulator.rdramWrite8(this.visible_addr, 0x00);
    }
  }
}
