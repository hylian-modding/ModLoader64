const assert = require('assert');
import IMupen from '../src/modloader/consoles/IMupen';
import sleep from 'thread-sleep';
import IMemory from 'modloader64_api/IMemory';

console.log('Starting ram tests...');

process.chdir('./build');

let mupen: IMupen;
let ram: IMemory;

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

let rom_size: number = mupen.loadRom('./mupen64plus.v64');

mupen.runEmulator(true);

ram = mupen as IMemory;

while (mupen.coreEmuState() !== 2) {}

sleep(3000);

mupen.pauseEmulator();

sleep(1000);

// Read tests. I'll make the write tests later.
describe('IMemory', function() {
  beforeEach(function() {
    for (let i = 0; i < 0x800000; i++) {
      ram.rdramWrite8(i, 0xab);
    }
  });
  afterEach(function() {});
  describe('rdramRead8', function() {
    it('Should return 0xAB if ok or 0 if emulation failure', function() {
      assert.equal(0xab, ram.rdramRead8(0x0));
    });
  });
  describe('rdramRead16', function() {
    it('Should return 0xABAB if ok or 0 if emulation failure', function() {
      assert.equal(0xabab, ram.rdramRead16(0x0));
    });
  });
  describe('rdramRead32', function() {
    it('Should return 0xABABABAB if ok or 0 if emulation failure', function() {
      assert.equal(0xabababab, ram.rdramRead32(0x0));
    });
  });
  describe('rdramReadBuffer', function() {
    it('Should return 0xABABABABABABABAB if ok or 0 if emulation failure', function() {
      assert.equal(
        JSON.stringify(Buffer.from('ABABABABABABABAB', 'hex')),
        JSON.stringify(ram.rdramReadBuffer(0x0, 0x8))
      );
    });
  });
  describe('rdramWrite8', function() {
    it('Should return 0xFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        ram.rdramWrite8(0x0, 0xff);
        return ram.rdramRead8(0x0);
      };
      assert.equal(0xff, fn());
    });
  });
  describe('rdramWrite16', function() {
    it('Should return 0xFFFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        ram.rdramWrite16(0x0, 0xffff);
        return ram.rdramRead16(0x0);
      };
      assert.equal(0xffff, fn());
    });
  });
  describe('rdramWrite32', function() {
    it('Should return 0xFFFFFFFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        ram.rdramWrite32(0x0, 0xffffffff);
        return ram.rdramRead32(0x0);
      };
      assert.equal(0xffffffff, fn());
    });
  });
  describe('rdramWriteBuffer', function() {
    it('Should return 0xFFFFFFFFFFFFFFFF if ok or 0 if emulation failure', function() {
      let fn = () => {
        ram.rdramWriteBuffer(0x0, Buffer.from('FFFFFFFFFFFFFFFF', 'hex'));
        return JSON.stringify(Buffer.from(ram.rdramReadBuffer(0x0, 0x8)));
      };
      assert.equal(
        JSON.stringify(Buffer.from('FFFFFFFFFFFFFFFF', 'hex')),
        fn()
      );
    });
  });
});
