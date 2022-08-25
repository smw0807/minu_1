import fs from 'fs'; // 1
import { mockEnable, mockDisable } from './mock-read-file.mjs';

mockEnable(Buffer.from('Hello World')); // 2

fs.readFile('fake-path', (err, data) => {
  // 3
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(data.toString()); // 'Hello world'
});

mockDisable();
