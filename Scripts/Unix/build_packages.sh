# Get to repo root
cd ../../

# Remove pre-packaged repos
rm -r ./build
rm -r ./build2
rm -r ./dist
rm -r ./Mupen64Plus

# Create platform packages
dry run dist --dry-keep-package-json

# Build PayloadConverter
cd ./PayloadConverter
npm install
npm run build

# Enter packages directory
cd ../dist/

# Pull windows package and clean
cd ./windows/
wget https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Windows/emulator.zip
unzip ./emulator.zip -d ./
rm ./emulator.zip
rm -r ./mods
mkdir ./mods
rm -r ./roms
mkdir ./roms
cd ../

mv ./windows ./ModLoader
cp -r ../PayloadConverter/build ./ModLoader/PayloadConverter
node ../PayloadConverter/build/paker.js --dir=./ModLoader
mv ./ModLoader.pak ./Windows.pak
mv ./ModLoader ./windows

# Pull linux package and clean
cd ./linux/
wget https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Linux/emulator.tar.gz
tar xvzf ./emulator.tar.gz
rm ./emulator.tar.gz
rm -r ./mods
mkdir ./mods
rm -r ./roms
mkdir ./roms
cd ../

mv ./linux ./ModLoader
cp -r ../PayloadConverter/build ./ModLoader/PayloadConverter
node ../PayloadConverter/build/paker.js --dir=./ModLoader
mv ./ModLoader.pak ./Linux.pak
mv ./ModLoader ./linux

# Keep console open when script finishes
echo "Press any key to continue"
read 1
