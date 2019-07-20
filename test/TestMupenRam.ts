const assert = require('assert');
import IMupen from '../src/modloader/consoles/IMupen';
import sleep from 'thread-sleep';
import IMemory from '../src/API/IMemory';

console.log("Starting ram tests...")

process.chdir("./build")

let mupen: IMupen
let ram: IMemory

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

let rom_size: number = mupen.loadRom("./mupen64plus.v64");

mupen.runEmulator(true);

ram = mupen as IMemory

while (mupen.coreEmuState() !== 2) {
}

sleep(3000)

mupen.pauseEmulator()

sleep(1000)

// Read tests. I'll make the write tests later.
describe('IMemory', function () {
    beforeEach(function () {
    })
    afterEach(function () {
    })
    describe('rdramRead8', function () {
        it('Should return 0x3C if ok or 0 if emulation failure', function () {
            assert.equal(0x3C, ram.rdramRead8(0x0));
        });
    });
    describe('rdramRead16', function () {
        it('Should return 0x3C1A if ok or 0 if emulation failure', function () {
            assert.equal(0x3C1A, ram.rdramRead16(0x0));
        });
    });
    describe('rdramRead32', function () {
        it('Should return 0x3C1A800F if ok or 0 if emulation failure', function () {
            assert.equal(0x3C1A800F, ram.rdramRead32(0x0));
        });
    });
    describe('rdramReadBuffer', function () {
        it('Should return 0x3C1A800F275A66F0 if ok or 0 if emulation failure', function () {
            assert.equal(JSON.stringify(Buffer.from("3C1A800F275A6520", 'hex')), JSON.stringify(ram.rdramReadBuffer(0x0, 0x8)));
        });
    });
    describe('rdramWrite8', function () {
        it('Should return 0xAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < 0x800000; i++) {
                    ram.rdramWrite8(i, 0)
                }
                ram.rdramWrite8(0x0, 0xAB)
                return ram.rdramRead8(0x0)
            }
            assert.equal(0xAB, fn());
        });
    });
    describe('rdramWrite16', function () {
        it('Should return 0xABAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < 0x800000; i++) {
                    ram.rdramWrite8(i, 0)
                }
                ram.rdramWrite16(0x0, 0xABAB)
                return ram.rdramRead16(0x0)
            }
            assert.equal(0xABAB, fn());
        });
    });
    describe('rdramWrite32', function () {
        it('Should return 0xABABABAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < 0x800000; i++) {
                    ram.rdramWrite8(i, 0)
                }
                ram.rdramWrite32(0x0, 0xABABABAB)
                return ram.rdramRead32(0x0)
            }
            assert.equal(0xABABABAB, fn());
        });
    });
    describe('rdramWriteBuffer', function () {
        it('Should return 0xAB if ok or 0 if emulation failure', function () {
            let fn = () => {
                for (let i = 0; i < 0x800000; i++) {
                    ram.rdramWrite8(i, 0)
                }
                ram.rdramWriteBuffer(0x0, Buffer.from("ABABABABABABABAB", 'hex'))
                return JSON.stringify(Buffer.from(ram.rdramReadBuffer(0x0, 0x8)))
            }
            assert.equal(JSON.stringify(Buffer.from("ABABABABABABABAB", 'hex')), fn());
        });
    });
});
