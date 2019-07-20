cd Mupen64Plus-Script\mupen64plus-win32-solution
devenv.com "mupen64plus-script.sln" /clean debug
devenv.com "mupen64plus-script.sln" /clean release
devenv.com "mupen64plus-script.sln" /rebuild debug
devenv.com "mupen64plus-script.sln" /rebuild release
cd ..
cd mupen64plus-binding-npm
call npm install
call npm run clean
call npm run build
call npm run winpak