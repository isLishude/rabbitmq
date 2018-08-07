"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const console_1 = require("console");
class RabbitMQService {
    constructor(uri) {
        this.uri = uri;
    }
    async producer(queue, msg) {
        const chan = await this.init();
        await chan.assertQueue(queue);
        await chan.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
    }
    async consumer(queue, cb) {
        const chan = await this.init();
        await chan.assertQueue(queue);
        await chan.consume(queue, async (msg) => {
            try {
                await cb(msg.content);
            }
            catch (rej) {
                console_1.log(rej);
            }
            chan.ack(msg);
        });
    }
    async destructor() {
        if (this.channel) {
            await this.channel.close();
        }
        if (RabbitMQService.connect) {
            await RabbitMQService.connect.close();
        }
    }
    async init() {
        if (!RabbitMQService.connect) {
            RabbitMQService.connect = await amqplib_1.connect(this.uri);
        }
        if (!this.channel) {
            this.channel = await RabbitMQService.connect.createConfirmChannel();
        }
        return this.channel;
    }
}
exports.RabbitMQService = RabbitMQService;
