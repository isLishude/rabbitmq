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
    cb: (msg: Buffer) => Promise<any>
  ): Promise<void> {
    const chan: Channel = await this.init();
    await chan.assertQueue(queue);
    await chan.consume(queue, async (msg: Message) => {
      try {
        await cb(msg.content);
      } catch (rej) {
        log(rej);
      }
      chan.ack(msg);
    });
  }

  public async destructor() {
    await this.channel.close();
    await RabbitMQService.connect.close();
  }

  private async init() {
    if (!RabbitMQService.connect) {
      RabbitMQService.connect = await connect(this.uri);
    }
    if (!this.channel) {
      this.channel = await RabbitMQService.connect.createConfirmChannel();
    }
    return this.channel;
  }
}
