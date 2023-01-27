println("Building ML64 core...");

function runCommand(command::String) 
    if (Sys.iswindows())
        run(`cmd /c $command`);
    else
        run(`$command`);
    end
end
runCommand("yarn");

include("./API/build.jl");

function unasar(asar::String)
    client = "./client";
    runCommand("asar extract $asar $client");
end

function downloadWindowsDeps()
    println("Getting windows client files from github...");
    download("https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Windows64/Windows64.asar", "./windows_client.asar");
end

function downloadLinuxDeps()
    println("Getting linux client files from github...");
    download("https://github.com/hylian-modding/ModLoader64-Platform-Deps/raw/master/Linux/Linux.asar", "./linux_client.asar");
end

function doBuild(asar::String, out::String)
    println("Building $out...");

    if (!ispath("./client"))
        mkdir("./client");
    end
    unasar(asar);
    if (ispath("./client/node.exe")) 
        rm("./client/node.exe", force=true);
    end
    if (!ispath("./client/node_modules")) 
        mkdir("./client/node_modules");
    end
    cp("./node_modules", "./client/node_modules", force=true, follow_symlinks=true);
    cp("./build", "./client/src", force=true, follow_symlinks=true);
    runCommand("asar pack ./client $out");

    println("Cleaning up...");
    rm("./client", force=true, recursive=true);
end


function buildDedi()
    println("Building dedi...");
    if (!ispath("./client"))
        mkdir("./client");
    end
    cp("./node_modules", "./client/node_modules", force=true, follow_symlinks=true);
    cp("./build", "./client/src", force=true, follow_symlinks=true);
    runCommand("asar pack ./client ./dedi.asar");
    rm("./client", force=true, recursive=true);
end

println("Compiling...");
cp("./src", "./build", force=true);
runCommand("tsc");

downloadWindowsDeps();
downloadLinuxDeps();
doBuild("./windows_client.asar", "./windows.asar");
doBuild("./linux_client.asar", "./linux.asar");
buildDedi();
println("Hashing...");
runCommand("ts-node ./generateHash.ts");