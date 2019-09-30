:: Get to repo root
cd ..\..\

:: Install dependancies in root
call npm install -g dry-dry
call dry install

:: Pull and Unpack the emulator package
rmdir /s /q .\Mupen64Plus
mkdir .\Mupen64Plus
cd .\Mupen64Plus\
..\Scripts\Windows\wget.exe https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Windows/emulator.zip
..\Scripts\Windows\unzip.exe .\emulator.zip
del .\emulator.zip
cd ..\

:: Get to script dir
cd .\Scripts\Windows\
call build_api.bat

:: Get to repo root
:: cd ..\..\ (RETAINED FROM BUILD_API)

:: Dry Command
call dry run build --dry-keep-package-json

:: Build PayloadConverter
cd .\PayloadConverter
call npm install
call npm run build

:: Keep console open when script finishes
pause
