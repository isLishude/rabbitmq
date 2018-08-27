import { log } from "console";
import { RabbitMQService } from "../src/index";

const uri: string = "amqp://localhost:5672";
const queue = "test";

const rabbit = new RabbitMQService(uri);

rabbit
  .consumer(queue, async (msg: Buffer) => {
    log(msg.toString() + "@0");
    return true;
  })
  .catch(e => log(e.message + "\n" + e.stack));

// rabbit
//   .consumer(queue, async (msg: Buffer) => {
//     log(msg.toString() + "@1");
//     return true;
//   })
//   .catch(e => log(e.message + "\n" + e.stack));

process.on("SIGINT", async () => {
  await rabbit.destructor();
});
