import fs from 'fs';
let profiler = require('v8-profiler-next');
let gcprofiler = require('gc-profiler');
let nextMBThreshold = 0;

// For if you think you have a memory leak or just want to know what the hell the GC is doing.
export function startProfiler() {
  setInterval(tickHeapDump, 500);
  gcprofiler.on('gc', function(info: string) {
    console.log(info);
  });
}

function tickHeapDump() {
  setImmediate(function() {
    heapDump();
  });
}

function heapDump() {
  let memMB = process.memoryUsage().rss / 1048576;

  console.log(memMB + '>' + nextMBThreshold);

  if (memMB > nextMBThreshold) {
    console.log('Current memory usage: %j', process.memoryUsage());
    nextMBThreshold += 50;
    let snap = profiler.takeSnapshot();
    saveHeapSnapshot(snap);
  }
}

function saveHeapSnapshot(snapshot: any) {
  snapshot.export(function(error: any, result: any) {
    if (error) {
      console.error(error);
      return;
    }
    fs.writeFileSync('./heap.dump', result);
    snapshot.delete();
  });
}
