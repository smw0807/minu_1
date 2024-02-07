import amqp from 'amqplib';
import { generateTasks } from './generateTask.js';

const ALPHABET = 'abcdefg';
const BATCH_SIZE = 10000;

const [, , maxLength, searchHash] = process.argv;

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createConfirmChannel(); //1
  await channel.assertQueue('tasks_queue');

  const generatorObj = generateTasks(searchHash, ALPHABET, maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    channel.sendToQueue('tasks_queue', Buffer.from(JSON.stringify(task))); //2
  }

  await channel.waitForConfirms();
  channel.close();
  connection.close();
}

main().catch(err => console.error(err));
