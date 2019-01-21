/// <reference types="node" />
export declare class RabbitMQService {
    private uri;
    private connection;
    private channel;
    private CONNECTED;
    constructor(uri?: string);
    producer(queue: string, msg: string): Promise<void>;
    consumer(queue: string, cb: (msg: Buffer) => Promise<any>): Promise<void>;
    destructor(): Promise<void>;
}
