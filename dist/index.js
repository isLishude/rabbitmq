"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const console_1 = require("console");
class RabbitMQService {
    constructor(uri, chanCount = 10) {
        this.channels = [];
        this.uri = "amqp://localhost:5672";
        this.chanCount = 10;
        this.chanIndex = 0;
        this.uri = uri;
        this.chanCount = chanCount;
    }
    async producer(queue, msg) {
        const chan = await this.getChannel();
        await chan.assertQueue(queue);
        await chan.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
    }
    async consumer(queue, cb) {
        const chan = await this.getChannel();
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
        if (this.channels.length) {
            const tmp = this.channels.map(async (chan) => {
                await chan.close();
            });
            await Promise.all(tmp);
        }
        if (RabbitMQService.connect) {
            await RabbitMQService.connect.close();
        }
    }
    async init() {
        if (!RabbitMQService.connect) {
            RabbitMQService.connect = await amqplib_1.connect(this.uri);
        }
        if (this.channels.length === 0) {
            const tmp = [...new Array(this.chanCount)].map(async () => {
                const chan = await RabbitMQService.connect.createConfirmChannel();
                return chan;
            });
            this.channels = await Promise.all(tmp);
        }
        console_1.log("RabbitMQ initial successful");
    }
    async getChannel() {
        const index = this.chanIndex++ % this.chanCount;
        if (this.chanCount >= this.chanCount) {
            this.chanIndex = 0;
        }
        return this.channels[index];
    }
}
exports.RabbitMQService = RabbitMQService;
