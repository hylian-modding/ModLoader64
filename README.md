# ModLoader64
This system is the successor to [OotModLoader](https://github.com/hylian-modding/OotModLoader). It is designed to provide memory access, rom patching, and multiplayer networking in an easy to use framework.

## Emulator
This project uses mupen64plus as its N64 emulator. This copy of mupen is slightly modified and bound to an [NAPI](https://nodejs.org/api/n-api.html) module. This allows Nodejs code to directly interact with the emulator without a middleman.

## Status
This project is released to the public. See our releases page in the launcher repository. 

Please put any API or feature suggestions in #public-dev of the [ModLoader64](https://discord.gg/UFVY9DE).

## Building

Requirement - NodeJS:

* (WINDOWS) [Nodejs 10.X or 12.X (Requires 32-bit)](https://nodejs.org/en/)
* (LINUX) Install latest from Package Manager

npm link

## Testing
npm run start
