import { bus } from "./EventHandler";
import { Texture } from "./Sylvain/Gfx";
import { vec4 } from "./Sylvain/vec";

export const enum AnnouncementChannels{
    SYSTEM_NOTIFICATION = "SYSTEM_NOTIFICATION",
    KILL_FEED = "KILL_FEED"
}

// Kill Feed

export interface IKillFeedMessage{
    text: string;
    icon?: Texture;
    color?: vec4;
}

class KillFeedMessage implements IKillFeedMessage{
    text: string;
    icon?: Texture | undefined;
    color?: vec4 | undefined;

    constructor(text: string, icon?: Texture, color?: vec4){
        this.text = text;
        this.icon = icon;
        this.color = color;
    }
    
}

export function addToKillFeedQueue(text: string, icon?: Texture, color?: vec4){
    bus.emit(AnnouncementChannels.KILL_FEED, new KillFeedMessage(text, icon, color));
}

// Notif

export interface ISystemNotification{
    text: string;
}

class SystemNotification implements ISystemNotification{
    text: string;

    constructor(text: string){
        this.text = text;
    }
}

export function addToSystemNotificationQueue(text: string){
    bus.emit(AnnouncementChannels.SYSTEM_NOTIFICATION, new SystemNotification(text));
}