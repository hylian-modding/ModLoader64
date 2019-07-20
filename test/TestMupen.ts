const assert = require('assert');
import IMupen from '../src/modloader/consoles/IMupen';
import sleep from 'thread-sleep';
import IMemory from '../src/API/IMemory';
import { IRomMemory } from '../src/API/IRomMemory';

process.chdir("./build")
let mupen: IMupen = require(process.cwd() + '/node/m64pnpm.node')
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

let ram: IMemory = mupen as IMemory
let rom: IRomMemory = mupen as IRomMemory

while (mupen.coreEmuState() !== 2) {
}

sleep(3000)

mupen.pauseEmulator()

sleep(1000)

// Read tests. I'll make the write tests later.
describe('IMemory', function () {
    describe('rdramRead8', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x3C, ram.rdramRead8(0x0));
        });
    });
    describe('rdramRead16', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x3C1A, ram.rdramRead16(0x0));
        });
    });
    describe('rdramRead32', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x3C1A800F, ram.rdramRead32(0x0));
        });
    });
    describe('rdramReadU32', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x3C1A800F, ram.rdramReadU32(0x0));
        });
    });
    describe('rdramRead64', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x3C1A800F275A66F0, ram.rdramRead64(0x0));
        });
    });
    describe('rdramReadU64', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x3C1A800F275A66F0, ram.rdramReadU64(0x0));
        });
    });
    describe('rdramReadBuffer', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(JSON.stringify(Buffer.from("3C1A800F275A6520", 'hex')), JSON.stringify(Buffer.from(ram.rdramReadBuffer(0x0, 0x8))));
        });
    });
});

describe('IRomMemory', function () {
    describe('romRead8', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x40, rom.romRead8(0x0));
        });
    });
    describe('romRead16', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x4012, rom.romRead16(0x0));
        });
    });
    describe('rdramRead32', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x40123780, rom.romRead32(0x0));
        });
    });
    describe('romRead64', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(0x401237800f000000, rom.romRead64(0x0));
        });
    });
    describe('romReadBuffer', function () {
        it('should return 0 when the value is not present', function () {
            assert.equal(JSON.stringify(Buffer.from("401237800f000000", 'hex')), JSON.stringify(Buffer.from(rom.romReadBuffer(0x0, 0x8))));
        });
    });
});
