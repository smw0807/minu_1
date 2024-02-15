import { fork } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { once } from 'events';
import { createRequestChannel } from './createRequestChannel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const channel = fork(join(__dirname, 'replier.js')); // 1
  const request = createRequestChannel(channel);

  try {
    const [message] = await once(channel, 'message'); // 2
    console.log(`Child Process initialized: ${message}`);
    const p1 = request({ a: 1, b: 2, delay: 500 }) // 3
      .then(res => {
        console.log(`Reply: 1 + 2 = ${res.sum}`);
      });

    const p2 = request({ a: 6, b: 1, delay: 100 }) // 4
      .then(res => {
        console.log(`Reply: 6 + 1 = ${res.sum}`);
      });

    await Promise.all([p1, p2]); // 5
  } finally {
    channel.disconnect(); // 6
  }
}

main().catch(err => console.error(err));
