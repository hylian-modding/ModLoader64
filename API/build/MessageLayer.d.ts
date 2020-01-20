export declare class MessageLayer {
    private id;
    private emitter;
    private retriever;
    private emitKey;
    private backingEmitter;
    private child;
    constructor(id: string, emitter: any, retriever: any);
    bindChild(child: any): void;
    send(key: string, evt: any): void;
    setupMessageProcessor(instance: any): void;
}
