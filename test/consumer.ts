import { log } from "console";
import { RabbitMQService } from "../src/index";

const uri: string = "amqp://localhost:5672";
const queue = "test";

const rabbit = new RabbitMQService(uri);

rabbit
  .consumer(queue, async (msg: Buffer) => {
  log(msg.toString());
  return true;
  })
  .catch(e => log(e.message + "\n" + e.stack));
