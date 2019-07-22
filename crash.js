var fork = require('child_process').fork

var p;

go()

function go(){
    p = fork("./build/src/index.js", ["--mode=cli", "--dir=build"])
    setup(p)
}

function setup(p) {
    p.on('error', function () {
    });

    p.on('exit', function (code, signal) {
        console.log(code)
        if (code === 0){
            go()
        }
    });
}

setup(p)