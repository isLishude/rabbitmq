import { Channel, connect, Connection, Message } from "amqplib";
import { log } from "console";

export class RabbitMQService {
  private static connect: Connection;
  private channels: Channel[] = [];
  private uri: string = "amqp://localhost:5672";
  private chanCount: number = 10;
  private chanIndex: number = 0;

  constructor(uri: string, chanCount: number = 10) {
    this.uri = uri;
    this.chanCount = chanCount;
  }

  public async producer(queue: string, msg: string): Promise<void> {
    const chan: Channel = await this.getChannel();
    await chan.assertQueue(queue);
    await chan.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
  }

  public async consumer(
    queue: string,
    cb: (msg: Buffer) => Promise<any>
  ): Promise<void> {
    const chan: Channel = await this.getChannel();
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
    if (RabbitMQService.connect) {
      try {
        await RabbitMQService.connect.close();
      } catch {
        //
      }
    }
  }

  public async init() {
    if (!RabbitMQService.connect) {
      RabbitMQService.connect = await connect(this.uri);
    }
    if (this.channels.length === 0) {
      const tmp = [...new Array(this.chanCount)].map(async () => {
        const chan = await RabbitMQService.connect.createConfirmChannel();
        return chan;
      });

      this.channels = await Promise.all(tmp);
      log("RabbitMQ initial successful");
    }
  }

  public async getChannel() {
    await this.init();
    const index: number = this.chanIndex++ % this.chanCount;
    if (this.chanIndex >= this.chanCount) {
      this.chanIndex = 0;
    }
    return this.channels[index];
  }
}
