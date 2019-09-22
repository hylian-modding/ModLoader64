# Get to repo root
cd ../../

# Get to API root
cd ./API/

# Install dependancies in API
dry run build --dry-keep-package-json

# Get to repo root
cd ../

# Link API to app
dry install --save ./API/build
