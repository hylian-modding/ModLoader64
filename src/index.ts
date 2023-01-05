import { MonkeyPatch_Parse, MonkeyPatch_Stringify } from "./monkeypatches/JSON";

// Monkey patches
let stringify = new MonkeyPatch_Stringify();
stringify.patch();
let parse = new MonkeyPatch_Parse();
parse.patch();

setImmediate(() => {
    require('./loader');
});