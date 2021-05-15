# ModLoader64
This system is the successor to [OotModLoader](https://github.com/hylian-modding/OotModLoader). It is designed to provide memory access, rom patching, and multiplayer networking in an easy to use framework.

## Emulator
This project uses mupen64plus as its N64 emulator. This copy of mupen is slightly modified and bound to an [NAPI](https://nodejs.org/api/n-api.html) module. This allows Nodejs code to directly interact with the emulator without a middleman.

## Status
This project is released to the public. See our releases page in the [launcher repository](https://github.com/hylian-modding/ModLoader64-GUI). 

Please put any API or feature suggestions in #public-dev of the [ModLoader64](https://discord.gg/Vb8mKT6).

## Building

Requirement - NodeJS:

* (WINDOWS) [Nodejs 10.X or 12.X (Requires 32-bit)](https://nodejs.org/en/)
* (LINUX) Install latest from Package Manager

## Running

* (WINDOWS) Windows 10 and a graphics card capable of OpenGL 3.3 support.
* (LINUX) A reasonably sane distro and a graphics card capable of OpenGL 3.3 support.

RUN THESE BEFORE DOING ANYTHING

npm install -g yarn

npm install -g typescript

npm install -g gulp-cli

Installing with NPM:

npm link

Installing with Yarn:

yarn

yarn link

yarn global bin

Add the path printed by the last command to your PATH


## Testing
npm run start
