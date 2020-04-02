import { EventEmitter2 } from "eventemitter2";
import { Analytics_Event } from "./Analytics_Event";

export class Analytics{

    AnalyticsBus: EventEmitter2;

    constructor(){
        this.AnalyticsBus = new EventEmitter2();
    }

    send(key: string, data: any){
        this.AnalyticsBus.emit('send', new Analytics_Event(key).setData(data));
    }

    retrieve(key: string){
        this.AnalyticsBus.emit('retrieve', new Analytics_Event(key));
    }
}

export const AnalyticsManager: Analytics = new Analytics();