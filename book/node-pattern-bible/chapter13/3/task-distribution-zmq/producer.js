import zmq from 'zeromq';
import delay from 'delay';
import { generateTasks } from './generateTask.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;

const [, , maxLength, searchHash] = process.argv;

async function main() {
  const ventilator = new zmq.Push(); //1
  await ventilator.bind('tcp://*:5016');
  await delay(1000);
  const generatorObj = generateTasks(searchHash, ALPHABET, maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    await ventilator.send(JSON.stringify(task)); //2
  }
}

main().catch(err => console.error(err));
