"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const console_1 = require("console");
class RabbitMQService {
    constructor(uri, chanCount = 10) {
        this.channels = [];
        this.chanIndex = 0;
        this.uri = uri;
        this.chanCount = chanCount;
        this.getChannel()
            .then(() => {
            console_1.log("RabbitMQ Connections & Channels initial successful");
            console_1.log("RabbitMQ url %s Channel count %d", uri, chanCount);
        })
            .catch(e => {
            console_1.log("RabbitMQ Connections & Channels initial failed");
            console_1.log("Error reason %s", e.message);
        });
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
    async getChannel() {
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
        return this.channels[this.getChanIndex()];
    }
    getChanIndex() {
        const res = this.chanIndex++ % this.chanCount;
        if (this.chanCount >= this.chanCount) {
            this.chanIndex = 0;
        }
        return res;
    }
}
exports.RabbitMQService = RabbitMQService;
