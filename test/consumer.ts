import { log } from "console";
import { RabbitMQService } from "../src/index";

const uri: string = "amqp://localhost";
const queue = "test";

const rabbit = new RabbitMQService(uri);

rabbit.consumer(queue, async (msg: Buffer) => {
  log(msg.toString());
  return true;
});
