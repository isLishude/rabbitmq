/// <reference types="node" />
export declare class RabbitMQService {
    private static connect;
    private channel;
    private uri;
    constructor(uri: string);
    producer(queue: string, msg: string): Promise<void>;
    consumer(queue: string, cb: (msg: Buffer) => Promise<any>): Promise<void>;
    destructor(): Promise<void>;
    private init;
}
