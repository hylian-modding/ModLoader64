export class Analytics_Event{
    key: string;
    data: any;

    constructor(key: string){
        this.key = key;
    }

    setData(data: any): Analytics_Event{
        this.data = data;
        return this;
    }
}