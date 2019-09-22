:: Get to repo root
cd ..\..\

:: Get to API root
cd .\API\

:: Install dependancies in API
call dry run build --dry-keep-package-json

:: Get to repo root
cd ..\

:: Link API to app
call dry install --save .\API\build
