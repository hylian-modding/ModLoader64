const assert = require('assert');
import IMupen from '../src/modloader/consoles/IMupen';
import sleep from 'thread-sleep';
import IMemory from 'modloader64_api/IMemory';
import { IRomMemory } from 'modloader64_api/IRomMemory';

process.chdir('./build');

let mupen: IMupen;
let rom: IRomMemory;

console.log('Starting rom tests...');

mupen = require(process.cwd() + '/node/m64pnpm.node');
mupen.setCoreLib(process.cwd() + '/mupen64plus.dll');
mupen.setConfigDir(process.cwd());
mupen.setDataDir(process.cwd());

mupen.setPluginDir(process.cwd());
mupen.setPluginAudio(process.cwd() + '/mupen64plus-audio-sdl.dll');
mupen.setPluginGFX(process.cwd() + '/mupen64plus-video-rice.dll');
mupen.setPluginInput(process.cwd() + '/mupen64plus-input-sdl.dll');
mupen.setPluginRSP(process.cwd() + '/mupen64plus-rsp-hle.dll');

mupen.initialize();

let rom_size: number = mupen.loadRom(process.cwd() + '/mupen64plus.v64');

rom = mupen as IRomMemory;

sleep(3000);

describe('IRomMemory', function() {
  beforeEach(function() {
    for (let i = 0; i < rom_size; i++) {
      rom.romWrite8(i, 0xab);
    }
  });
  afterEach(function() {});
  describe('romRead8', function() {
    it('Should return 0xAB if ok or 0 if emulation failure', function() {
      assert.equal(0xab, rom.romRead8(0x0));
    });
  });
  describe('romRead16', function() {
    it('Should return 0xABAB if ok or 0 if emulation failure', function() {
      assert.equal(0xabab, rom.romRead16(0x0));
    });
  });
  describe('rdramRead32', function() {
    it('Should return 0xABABABAB if ok or 0 if emulation failure', function() {
      assert.equal(0xabababab, rom.romRead32(0x0));
    });
  });
  describe('romReadBuffer', function() {
    it('Should return 0xABABABABABABABAB if ok or 0 if emulation failure', function() {
      assert.equal(
        JSON.stringify(Buffer.from('ABABABABABABABAB', 'hex')),
        JSON.stringify(rom.romReadBuffer(0x0, 0x8))
      );
    });
  });
  describe('romWrite8', function() {
    it('Should return 0xFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        rom.romWrite8(0x0, 0xff);
        return rom.romRead8(0x0);
      };
      assert.equal(0xff, fn());
    });
  });
  describe('romWrite16', function() {
    it('Should return 0xFFFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        rom.romWrite16(0x0, 0xffff);
        return rom.romRead16(0x0);
      };
      assert.equal(0xffff, fn());
    });
  });
  describe('romWrite32', function() {
    it('Should return 0xFFFFFFFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        rom.romWrite32(0x0, 0xffffffff);
        return rom.romRead32(0x0);
      };
      assert.equal(0xffffffff, fn());
    });
  });
  describe('romWriteBuffer', function() {
    it('Should return 0xFFFFFFFFFFFFFFFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        rom.romWriteBuffer(0x0, Buffer.from('FFFFFFFFFFFFFFFF', 'hex'));
        return JSON.stringify(rom.romReadBuffer(0x0, 0x8));
      };
      assert.equal(
        JSON.stringify(Buffer.from('FFFFFFFFFFFFFFFF', 'hex')),
        fn()
      );
    });
  });
});
