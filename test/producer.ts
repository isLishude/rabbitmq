import { log } from "console";
import { RabbitMQService } from "../src/index";

const uri: string = "amqp://lishude:lishude@localhost:5672";
const rabbit = new RabbitMQService(uri);
const queue = "test";

const timer = setInterval(() => {
  const now = new Date().toLocaleString();
  rabbit.producer(queue, now).catch(e => log(e.message));
}, 1000);

process.on("SIGINT", async () => {
  clearInterval(timer);
  await rabbit.destructor();
});
