cd Mupen64Plus-Script\mupen64plus-win32-solution
echo devenv.com "mupen64plus-script.sln" /clean debug
echo devenv.com "mupen64plus-script.sln" /clean release
echo devenv.com "mupen64plus-script.sln" /rebuild debug
echo devenv.com "mupen64plus-script.sln" /rebuild release
cd ..
cd mupen64plus-binding-npm
call npm install
call npm run clean
call npm run build
call npm run winpak