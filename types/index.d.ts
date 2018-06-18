/// <reference types="node" />
export declare class RabbitMQService {
    private url;
    constructor(con: string);
    producer(msg: string, queue: string): Promise<boolean>;
    consumer(queue: string, cb: (msg: Buffer) => Promise<boolean>): Promise<void>;
}
