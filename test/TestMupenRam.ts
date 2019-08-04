const assert = require('assert');
import IMupen from '../src/modloader/consoles/IMupen';
import sleep from 'thread-sleep';
import IMemory from 'modloader64_api/IMemory';
import IUtils from 'modloader64_api/IUtils';

console.log('Starting ram tests...');

process.chdir('./build');

let mupen: IMupen;
let ram: IMemory;

mupen = require(process.cwd() + '/emulator/mupen64plus.node');

mupen.initialize();

let rom_size: number = mupen.loadRom('./emulator/mupen64plus.v64');

mupen.runEmulator(true);

ram = mupen as IMemory;

let utils = mupen as IUtils;

while (mupen.coreEmuState() !== 2) {}

sleep(3000);

mupen.pauseEmulator();

sleep(1000);

describe('IMemory', function() {
  beforeEach(function() {
    for (let i = 0; i < 0x800000; i++) {
      ram.rdramWrite8(i, 0xab);
    }
  });
  afterEach(function() {});
  describe('utilBitCount8', function() {
    it('Should return 8 if ok or 0 if emulation failure', function() {
      assert.equal(8, utils.utilBitCount8(0xff));
    });
  });
});

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
        return JSON.stringify(ram.rdramReadBuffer(0x0, 0x8));
      };
      assert.equal(
        JSON.stringify(Buffer.from('FFFFFFFFFFFFFFFF', 'hex')),
        fn()
      );
    });
  });
  describe('rdramReadBit8', function() {
    it('Should return true', function() {
      assert.equal(true, ram.rdramReadBit8(0x0, 0));
    });
  });
  describe('rdramReadBitsBuffer', function() {
    it('Should return 0x0101010101010101 if ok or 0 if emulation failure', function() {
      let fn = () => {
        ram.rdramWriteBuffer(0x0, Buffer.from('FFFFFFFF', 'hex'));
        return JSON.stringify(ram.rdramReadBitsBuffer(0x0, 0x1));
      };
      assert.equal(
        JSON.stringify(Buffer.from('0101010101010101', 'hex')),
        fn()
      );
    });
  });
});
