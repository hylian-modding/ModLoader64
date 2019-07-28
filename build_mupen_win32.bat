cd API
call npm run build
cd ..
mkdir build\emulator
copy Mupen64Plus_Bundle_Windows_x86\* build\emulator
copy Mupen64Plus_Bundle_Linux_x64\* build\emulator
cd ModLoader64-M64P-Npm
call script_build.bat
cd ..
copy ModLoader64-M64P-Npm\build\Release\mupen64plus.node build\emulator\