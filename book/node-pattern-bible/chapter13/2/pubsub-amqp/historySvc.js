import { createServer } from 'http';
import level from 'level';
import timestamp from 'monotonic-timestamp';
import JSONSteam from 'JSONStream';
import amqp from 'amqplib';

async function main() {
  const db = level('./msgHistory');

  const connection = await amqp.connect('amqp://localhost'); //1
  const channel = await connection.createChannel();
  await channel.assertExchange('chat', 'fanout'); //2
  const { queue } = channel.assertQueue('chat_history'); //3
  await channel.bindQueue(queue, 'chat'); //4

  // 5
  channel.consume(queue, async msg => {
    const content = msg.content.toString();
    console.log(`Saving message: ${content}`);
    await db.put(timestamp(), content);
    channel.ack(msg);
  });

  createServer((req, res) => {
    res.writeHead(200);
    db.createValueStream().pipe(JSONSteam.stringify()).pipe(res);
  }).listen(8090);
}

main().catch(err => console.error(err));
