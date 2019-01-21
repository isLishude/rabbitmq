import { log } from "console";
import { RabbitMQService } from "../src/index";

const rabbit = new RabbitMQService();
const queue = "test";

setInterval(() => {
  const now = new Date().toLocaleString();
  rabbit.producer(queue, now).catch(log);
}, 1000);
