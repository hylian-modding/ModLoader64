println("Building API...");

function buildAPI()
    cp("./src", "./build", force=true);
    runCommand("tsc");
    runCommand("ts-node ./build.ts");
end

cd(buildAPI, "./API");