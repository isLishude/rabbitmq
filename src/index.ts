import { Channel, connect, Connection, Message } from "amqplib";
import { log } from "console";

export class RabbitMQService {
  private static connect: Connection;
  private channel: Channel;
  private uri: string;
  constructor(uri: string) {
    this.uri = uri;
  }

  public async producer(queue: string, msg: string): Promise<void> {
    const chan: Channel = await this.init();
    await chan.assertQueue(queue);
    await chan.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
  }

  public async consumer(
    queue: string,
    cb: (msg: Buffer) => Promise<boolean>
  ): Promise<void> {
    const chan: Channel = await this.init();
    await chan.assertQueue(queue);
    await chan.consume(queue, async (msg: Message) => {
      try {
        await cb(msg.content);
        chan.ack(msg);
      } catch (rej) {
        log(rej);
        chan.nack(msg);
      }
    });
  }

  private async init() {
    if (!RabbitMQService.connect) {
      RabbitMQService.connect = await connect(this.uri);
    }
    if (!this.channel) {
      this.channel = await RabbitMQService.connect.createChannel();
    }
    return this.channel;
  }
}
