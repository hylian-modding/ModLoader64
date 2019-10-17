# Get to repo root
cd ../../

# Install dependancies in root
sudo npm install -g dry-dry
dry install

# Remove old emulator folder
rm -r ./build/emulator
rm -r ./build2/emulator

# Pull and Unpack the emulator package
rm -r ./Mupen64Plus
mkdir ./Mupen64Plus
cd ./Mupen64Plus/
wget https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Switch/emulator.tar.gz
tar xvzf ./emulator.tar.gz
rm ./emulator.tar.gz
cd ../

# Get to script dir
cd ./Scripts/Unix/
sh build_api.sh

# Get to repo root
cd ../../

# Dry Command
dry run build --dry-keep-package-json

# Build PayloadConverter
cd ./PayloadConverter
npm install
npm run build

# Keep console open when script finishes
echo "Press any key to continue"
read 1
