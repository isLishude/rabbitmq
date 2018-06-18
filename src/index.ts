import { Channel, connect, Message } from "amqplib";

export class RabbitMQService {
  private url: string;
  constructor(con: string) {
    this.url = con;
  }

  public async producer(msg: string, queue: string): Promise<boolean> {
    const con = await connect(this.url);
    const chan: Channel = await con.createChannel();
    await chan.assertQueue(queue);
    const ret: boolean = await chan.sendToQueue(queue, Buffer.from(msg), {
      // RabbitMQ重启时，消息会被保存到磁盘
      persistent: true
    });
    return ret;
  }

  public async consumer(
    queue: string,
    cb: (msg: Message) => Promise<boolean>
  ): Promise<void> {
    const con = await connect(this.url);
    const chan: Channel = await con.createChannel();
    await chan.assertQueue(queue);
    await chan.consume(queue, async (msg: Message) => {
      const ret = await cb(msg);
      if (ret) {
        chan.ack(msg);
      }
    });
  }
}
