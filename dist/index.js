"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const console_1 = require("console");
class RabbitMQService {
    constructor(uri = "amqp://127.0.0.1:5672") {
        this.uri = uri;
        this.CONNECTED = false;
        (async () => {
            this.connection = await amqplib_1.connect(this.uri);
            this.channel = await this.connection.createConfirmChannel();
            this.CONNECTED = true;
        })().catch(e => {
            throw e;
        });
    }
    async producer(queue, msg) {
        if (!this.CONNECTED) {
            setTimeout(() => {
                this.producer(queue, msg);
            }, 1000);
            return;
        }
        await this.channel.assertQueue(queue);
        await this.channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
    }
    async consumer(queue, cb) {
        if (!this.CONNECTED) {
            setTimeout(() => {
                this.consumer(queue, cb);
            }, 1000);
            return;
        }
        await this.channel.assertQueue(queue);
        await this.channel.consume(queue, async (msg) => {
            try {
                await cb(msg.content);
            }
            catch (rej) {
                console_1.error(rej);
            }
            this.channel.ack(msg);
        });
    }
    async destructor() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}
exports.RabbitMQService = RabbitMQService;
