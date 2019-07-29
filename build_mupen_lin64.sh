mkdir ./build/emulator
cp ./ModLoader64-M64P-Bundle/* /build/emulator
cd ./ModLoader64-M64P-Npm
sh script_build.sh
cd ../
cp ./ModLoader64-M64P-Npm/build/Release/mupen64plus.node ./build/emulator/