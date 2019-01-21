import { log } from "console";
import { RabbitMQService } from "../src/index";

const queue = "test";

const rabbit = new RabbitMQService();

rabbit
  .consumer(queue, async (msg: Buffer) => {
    log(msg.toString());
  })
  .catch(log);
