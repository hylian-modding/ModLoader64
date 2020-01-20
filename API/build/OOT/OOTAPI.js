"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Note: ON_ACTOR_SPAWN/ON_ACTOR_DESPAWN won't detect anything created by ICommandBuffer. This is intentional behavior.
var OotEvents;
(function (OotEvents) {
    OotEvents["ON_SAVE_LOADED"] = "onSaveLoaded";
    OotEvents["ON_SCENE_CHANGE"] = "onSceneChange";
    OotEvents["ON_LOADING_ZONE"] = "onLoadingZone";
    OotEvents["ON_ACTOR_SPAWN"] = "onActorSpawn";
    OotEvents["ON_ACTOR_DESPAWN"] = "onActorDespawn";
    OotEvents["ON_ROOM_CHANGE"] = "onRoomChange";
    OotEvents["ON_ROOM_CHANGE_PRE"] = "onPreRoomChange";
    OotEvents["ON_AGE_CHANGE"] = "onAgeChange";
})(OotEvents = exports.OotEvents || (exports.OotEvents = {}));
exports.NO_KEYS = 0xff;
class UpgradeCount {
    constructor(item, level, count) {
        this.item = item;
        this.level = level;
        this.count = count;
    }
    isMatch(inst) {
        return inst.item === this.item && inst.level === this.level;
    }
}
const UpgradeCountLookupTable = [
    // Bombs
    new UpgradeCount(2 /* BOMB */, 0 /* NONE */, 0),
    new UpgradeCount(2 /* BOMB */, 1 /* BASE */, 20),
    new UpgradeCount(2 /* BOMB */, 2 /* UPGRADED */, 30),
    new UpgradeCount(2 /* BOMB */, 3 /* MAX */, 40),
    // Sticks
    new UpgradeCount(0 /* DEKU_STICK */, 0 /* NONE */, 0),
    new UpgradeCount(0 /* DEKU_STICK */, 1 /* BASE */, 10),
    new UpgradeCount(0 /* DEKU_STICK */, 2 /* UPGRADED */, 20),
    new UpgradeCount(0 /* DEKU_STICK */, 3 /* MAX */, 30),
    // Nuts
    new UpgradeCount(1 /* DEKU_NUT */, 0 /* NONE */, 0),
    new UpgradeCount(1 /* DEKU_NUT */, 1 /* BASE */, 20),
    new UpgradeCount(1 /* DEKU_NUT */, 2 /* UPGRADED */, 30),
    new UpgradeCount(1 /* DEKU_NUT */, 3 /* MAX */, 40),
    // Seeds
    new UpgradeCount(6 /* FAIRY_SLINGSHOT */, 0 /* NONE */, 0),
    new UpgradeCount(6 /* FAIRY_SLINGSHOT */, 1 /* BASE */, 30),
    new UpgradeCount(6 /* FAIRY_SLINGSHOT */, 2 /* UPGRADED */, 40),
    new UpgradeCount(6 /* FAIRY_SLINGSHOT */, 3 /* MAX */, 50),
    // Arrows
    new UpgradeCount(3 /* FAIRY_BOW */, 0 /* NONE */, 0),
    new UpgradeCount(3 /* FAIRY_BOW */, 1 /* BASE */, 30),
    new UpgradeCount(3 /* FAIRY_BOW */, 2 /* UPGRADED */, 40),
    new UpgradeCount(3 /* FAIRY_BOW */, 3 /* MAX */, 50),
    // Bombchu
    new UpgradeCount(9 /* BOMBCHU */, 0 /* NONE */, 0),
    new UpgradeCount(9 /* BOMBCHU */, 1 /* BASE */, 5),
    new UpgradeCount(9 /* BOMBCHU */, 2 /* UPGRADED */, 10),
    new UpgradeCount(9 /* BOMBCHU */, 3 /* MAX */, 20),
];
function UpgradeCountLookup(item, level) {
    let inst = new UpgradeCount(item, level, -1);
    for (let i = 0; i < UpgradeCountLookupTable.length; i++) {
        if (inst.isMatch(UpgradeCountLookupTable[i])) {
            return UpgradeCountLookupTable[i].count;
        }
    }
    return 0;
}
exports.UpgradeCountLookup = UpgradeCountLookup;
//# sourceMappingURL=OOTAPI.js.map