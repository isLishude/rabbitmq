"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const console_1 = require("console");
class RabbitMQService {
    constructor(uri) {
        this.uri = uri;
    }
    producer(queue, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const chan = yield this.init();
            yield chan.assertQueue(queue);
            yield chan.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
        });
    }
    consumer(queue, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const chan = yield this.init();
            yield chan.assertQueue(queue);
            yield chan.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield cb(msg.content);
                    chan.ack(msg);
                }
                catch (rej) {
                    console_1.log(rej);
                    chan.nack(msg);
                }
            }));
        });
    }
    destructor() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.close();
            yield RabbitMQService.connect.close();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RabbitMQService.connect) {
                RabbitMQService.connect = yield amqplib_1.connect(this.uri);
            }
            if (!this.channel) {
                this.channel = yield RabbitMQService.connect.createChannel();
            }
            return this.channel;
        });
    }
}
exports.RabbitMQService = RabbitMQService;
