const assert = require('assert');
import IMupen from '../src/modloader/consoles/IMupen';
import sleep from 'thread-sleep';
import IMemory from '../src/API/IMemory';
import { IRomMemory } from '../src/API/IRomMemory';

process.chdir("./build")

let mupen: IMupen
let rom: IRomMemory

console.log("Starting rom tests...")

mupen = require(process.cwd() + '/node/m64pnpm.node')
mupen.setCoreLib(process.cwd() + "/mupen64plus.dll");
mupen.setConfigDir(process.cwd());
mupen.setDataDir(process.cwd());

mupen.setPluginDir(process.cwd());
mupen.setPluginAudio(process.cwd() + "/mupen64plus-audio-sdl.dll");
mupen.setPluginGFX(process.cwd() + "/mupen64plus-video-rice.dll");
mupen.setPluginInput(process.cwd() + "/mupen64plus-input-sdl.dll");
mupen.setPluginRSP(process.cwd() + "/mupen64plus-rsp-hle.dll");

mupen.initialize();

let rom_size: number = mupen.loadRom(process.cwd() + "/mupen64plus.v64");

/*mupen.runEmulator(true);

while (mupen.coreEmuState() !== 2) {
}*/

rom = mupen as IRomMemory

sleep(3000)

describe('IRomMemory', function () {
    beforeEach(function () {
    })
    afterEach(function () {
    })
    describe('romRead8', function () {
        it('Should return 0x80 if ok or 0 if emulation failure', function () {
            assert.equal(0x80, rom.romRead8(0x0));
        });
    });
    describe('romRead16', function () {
        it('Should return 0x8037 if ok or 0 if emulation failure', function () {
            assert.equal(0x8037, rom.romRead16(0x0));
        });
    });
    describe('rdramRead32', function () {
        it('Should return 0x80371240 if ok or 0 if emulation failure', function () {
            assert.equal(0x80371240, rom.romRead32(0x0));
        });
    });
    describe('romReadBuffer', function () {
        it('Should return 0x803712400000000F if ok or 0 if emulation failure', function () {
            assert.equal(JSON.stringify(Buffer.from("803712400000000F", 'hex')), JSON.stringify(rom.romReadBuffer(0x0, 0x8)));
        });
    });
    describe('romWrite8', function () {
        it('Should return 0xAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < rom_size; i++) {
                    rom.romWrite8(i, 0)
                }
                rom.romWrite8(0x0, 0xAB)
                return rom.romRead8(0x0)
            }
            assert.equal(0xAB, fn());
        });
    });
    describe('romWrite16', function () {
        it('Should return 0xABAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < rom_size; i++) {
                    rom.romWrite8(i, 0)
                }
                rom.romWrite16(0x0, 0xABAB)
                return rom.romRead16(0x0)
            }
            assert.equal(0xABAB, fn());
        });
    });
    describe('romWrite32', function () {
        it('Should return 0xABABABAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < rom_size; i++) {
                    rom.romWrite8(i, 0)
                }
                rom.romWrite32(0x0, 0xABABABAB)
                return rom.romRead32(0x0)
            }
            assert.equal(0xABABABAB, fn());
        });
    });
    describe('romWriteBuffer', function () {
        it('Should return 0xABABABAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < rom_size; i++) {
                    rom.romWrite8(i, 0)
                }
                rom.romWriteBuffer(0x0, Buffer.from("ABABABABABABABAB", 'hex'))
                return JSON.stringify(rom.romReadBuffer(0x0, 0x8))
            }
            assert.equal(JSON.stringify(Buffer.from("ABABABABABABABAB", "hex")), fn());
        });
    });
});