mkdir build\emulator
copy ModLoader64-M64P-Bundle\* build\emulator
cd ModLoader64-M64P-Npm
call script_build.bat
cd ..
copy ModLoader64-M64P-Npm\build\Release\mupen64plus.node build\emulator\