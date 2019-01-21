import { Channel, connect, Connection, Message } from "amqplib";
import { error } from "console";

export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;
  private CONNECTED: boolean = false;
  constructor(private uri: string = "amqp://127.0.0.1:5672") {
    (async () => {
      this.connection = await connect(this.uri);
      this.channel = await this.connection.createConfirmChannel();
      this.CONNECTED = true;
    })().catch(e => {
      throw e;
    });
  }

  public async producer(queue: string, msg: string): Promise<void> {
    if (!this.CONNECTED) {
      setTimeout(() => {
        this.producer(queue, msg);
      }, 1000);
      return;
    }

    await this.channel.assertQueue(queue);
    await this.channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
  }

  public async consumer(
    queue: string,
    cb: (msg: Buffer) => Promise<any>
  ): Promise<void> {
    if (!this.CONNECTED) {
      setTimeout(() => {
        this.consumer(queue, cb);
      }, 1000);
      return;
    }

    await this.channel.assertQueue(queue);
    await this.channel.consume(queue, async (msg: Message) => {
      try {
        await cb(msg.content);
      } catch (rej) {
        error(rej);
      }
      this.channel.ack(msg);
    });
  }

  public async destructor() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
