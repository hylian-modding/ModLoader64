# ModLoader64
This system is the successor to [OotModLoader](https://github.com/hylian-modding/OotModLoader). It is designed to provide memory access, rom patching, and multiplayer networking in an easy to use framework.

## Emulator
This project uses mupen64plus as its N64 emulator. This copy of mupen is slightly modified and bound to an [NAPI](https://nodejs.org/api/n-api.html) module. This allows Nodejs code to directly interact with the emulator without a middleman.

## Status
This project is in an alpha state. It is very bare bones at the moment. Please put any API or feature suggestions in #public-dev of the [Team-OotO Discord](https://discord.gg/UFVY9DE).

## Building

Requirement - NodeJS:

* (WINDOWS) [Nodejs 10.X or 12.X (Requires 32-bit)](https://nodejs.org/en/)
* (LINUX) Install latest from Package Manager

For first time setup (or to pull node package or our mupen emulator updates) use the setup script located in the Scripts/(Your_Os_Here) directory. Afterward and during normal development you'll want to run the build_with/without_run script to compiled the project into a build and build2 folders.

## Testing
If wishing to run without a recompile use the start_1/2 scripts.
