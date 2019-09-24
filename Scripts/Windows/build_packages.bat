:: Get to repo root
cd ..\..\

:: Remove pre-packaged repos
rmdir /s /q .\build
rmdir /s /q .\build2
rmdir /s /q .\dist
rmdir /s /q .\Mupen64Plus

:: Create platform packages
call dry run dist --dry-keep-package-json

:: Enter packages directory
cd .\dist\

:: Pull windows package and clean
cd .\windows\
..\..\Scripts\Windows\wget.exe https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Windows/emulator.zip
..\..\Scripts\Windows\unzip.exe .\emulator.zip
del .\emulator.zip
rmdir /s /q .\mods
mkdir .\mods
rmdir /s /q .\roms
mkdir .\roms
cd ..\

rename windows ModLoader
xcopy ..\PayloadConverter\build .\ModLoader\PayloadConverter /s /e /y /i /h
node ..\PayloadConverter\build\paker.js --dir=./ModLoader
rename ModLoader.pak Windows.pak
rename ModLoader windows

:: Pull linux package and clean
cd .\linux\
..\..\Scripts\Windows\wget.exe https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Linux/emulator.tar.gz
..\..\Scripts\Windows\gzip.exe -d .\emulator.tar.gz
..\..\Scripts\Windows\tar.exe xvf .\emulator.tar
del .\emulator.tar
rmdir /s /q .\mods
mkdir .\mods
rmdir /s /q .\roms
mkdir .\roms
cd ..\

rename linux ModLoader
xcopy ..\PayloadConverter\build .\ModLoader\PayloadConverter /s /e /y /i /h
node ..\PayloadConverter\build\paker.js --dir=./ModLoader
rename ModLoader.pak Linux.pak
rename ModLoader linux

:: Keep console open when script finishes
pause
