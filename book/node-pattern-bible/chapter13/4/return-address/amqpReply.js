import amqp from 'amqplib';

export class AMQPReply {
  constructor(requestsQueueName) {
    this.requestsQueueName = requestsQueueName;
  }

  async initialize() {
    const connectioon = await amqp.connect('amqp://localhost');
    this.channel = await connectioon.createChannel();
    // 1
    const { queue } = await this.channel.assertQueue(this.requestsQueueName);
    this.queue = queue;
  }

  // 2
  handleRequests(handler) {
    this.channel.consume(this.queue, async msg => {
      const content = JSON.parse(msg.content.toString());
      const replyData = await handler(content);
      // 3
      this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(replyData)), {
        correlationId: msg.properties.correlationId,
      });
      this.channel.ack(msg);
    });
  }
}
