"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiscordStatus {
    constructor(details, state) {
        this.details = details;
        this.state = state;
    }
}
exports.DiscordStatus = DiscordStatus;
class DiscordStatusEvent {
    constructor(status) {
        this.canceled = false;
        this.status = status;
    }
}
exports.DiscordStatusEvent = DiscordStatusEvent;
//# sourceMappingURL=Discord.js.map