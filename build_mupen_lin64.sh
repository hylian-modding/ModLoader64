mkdir ./build/emulator
cp ./Mupen64Plus_Bundle_Windows_x86/* /build/emulator
cp ./Mupen64Plus_Bundle_Linux_x64/* ./build/emulator
cd ./ModLoader64-M64P-Npm
sh script_build.sh
cd ../
cp ./ModLoader64-M64P-Npm/build/Release/mupen64plus.node ./build/emulator/