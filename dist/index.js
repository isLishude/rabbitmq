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
class RabbitMQService {
    constructor(con) {
        this.url = con;
    }
    producer(msg, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = yield amqplib_1.connect(this.url);
            const chan = yield con.createChannel();
            yield chan.assertQueue(queue);
            const ret = yield chan.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
            return ret;
        });
    }
    consumer(queue, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = yield amqplib_1.connect(this.url);
            const chan = yield con.createChannel();
            yield chan.assertQueue(queue);
            yield chan.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                const ret = yield cb(msg);
                if (ret) {
                    chan.ack(msg);
                }
            }));
        });
    }
}
exports.RabbitMQService = RabbitMQService;
