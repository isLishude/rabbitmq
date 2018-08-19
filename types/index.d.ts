/// <reference types="node" />
import { Channel } from "amqplib";
export declare class RabbitMQService {
    private static connect;
    private channels;
    private uri;
    private chanCount;
    private chanIndex;
    constructor(uri: string, chanCount?: number);
    producer(queue: string, msg: string): Promise<void>;
    consumer(queue: string, cb: (msg: Buffer) => Promise<any>): Promise<void>;
    destructor(): Promise<void>;
    init(): Promise<void>;
    getChannel(): Promise<Channel>;
}
