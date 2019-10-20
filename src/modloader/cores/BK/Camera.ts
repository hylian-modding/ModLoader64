import * as API from 'modloader64_api/BK/Imports';

export class Camera extends API.BaseObj implements API.ICamera {
    private inst: number = global.ModLoader[API.AddressType.CAMERA];

    private pos_x_addr: number = this.inst + 0x00;
    private pos_y_addr: number = this.inst + 0x04;
    private pos_z_addr: number = this.inst + 0x08;
    private rot_x_addr: number = this.inst + 0x10;
    private rot_y_addr: number = this.inst + 0x14;
    private rot_z_addr: number = this.inst + 0x0c;

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

    get pos_x(): number { return this.emulator.rdramReadF32(this.pos_x_addr); }
    set pos_x(val: number) { this.emulator.rdramWriteF32(this.pos_x_addr, val); }

    get pos_y(): number { return this.emulator.rdramReadF32(this.pos_y_addr); }
    set pos_y(val: number) { this.emulator.rdramWriteF32(this.pos_y_addr, val); }

    get pos_z(): number { return this.emulator.rdramReadF32(this.pos_z_addr); }
    set pos_z(val: number) { this.emulator.rdramWriteF32(this.pos_z_addr, val); }

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

    get rot_x(): number { return this.emulator.rdramReadF32(this.rot_x_addr); }
    set rot_x(val: number) { this.emulator.rdramWriteF32(this.rot_x_addr, val); }

    get rot_y(): number { return this.emulator.rdramReadF32(this.rot_y_addr); }
    set rot_y(val: number) { this.emulator.rdramWriteF32(this.rot_y_addr, val); }

    get rot_z(): number { return this.emulator.rdramReadF32(this.rot_z_addr); }
    set rot_z(val: number) { this.emulator.rdramWriteF32(this.rot_z_addr, val); }
}