import { Message } from "amqplib";
export declare class RabbitMQService {
    private url;
    constructor(con: string);
    producer(msg: string, queue: string): Promise<boolean>;
    consumer(queue: string, cb: (msg: Message) => Promise<boolean>): Promise<void>;
}
