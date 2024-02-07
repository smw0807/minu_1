import amqp from 'amqplib';
import { processTask } from './processTask.js';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const { queue } = await channel.assertQueue('tasks_queue');

  channel.consume(queue, async rawMessage => {
    const found = processTask(JSON.parse(rawMessage.content.toString));
    if (found) {
      console.log(`Found! => ${found}`);
      channel.sendToQueue('result_queue', Buffer.from(`Found: ${found}`));
    }
    channel.ack(rawMessage);
  });
}

main().catch(err => console.error(err));
