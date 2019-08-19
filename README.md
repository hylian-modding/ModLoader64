# ModLoader64
This system is the successor to [OotModLoader](https://github.com/hylian-modding/OotModLoader). It is designed to provide memory access, rom patching, and multiplayer networking in an easy to use framework.

## Emulator
This project uses mupen64plus as its N64 emulator. This copy of mupen is slightly modified and bound to an [NAPI](https://nodejs.org/api/n-api.html) module. This allows Nodejs code to directly interact with the emulator without a middleman.

## Status
This project is in an alpha state. It is very bare bones at the moment. Please put any API or feature suggestions in #public-dev of the [Team-OotO Discord](https://discord.gg/UFVY9DE).

## Building

You will need the following things installed and properly configured on your PATH:

(WINDOWS)
* [Nodejs 10.X or 12.X (Requires 32-bit)](https://nodejs.org/en/)
* [Python 2.X (Requires 32-bit)](https://www.python.org/downloads/release/python-278/)
* [Visual Studio](https://visualstudio.microsoft.com/)
* VS2017 Build Tools (install these in Visual Studio)

(LINUX - Install from Package Manager)
* NodeJS
* Python
* [LibPNG12 (Deb Package)](https://github.com/hylian-modding/ModLoader64-M64P-Core/raw/master/debian%20dependancies/libpng12-0_1.2.50-2%2Bdeb8u3_amd64.deb)

Run these commands to build:
Use the 'build_fresh_git.bat/sh' script

## Testing
npm run start

(Alternatively)
Use the 'start.bat/sh' script
