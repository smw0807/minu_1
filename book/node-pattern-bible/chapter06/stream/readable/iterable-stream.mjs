import { Readable } from 'stream';

const mountains = [
  { name: 'Everest', height: 8848 },
  { name: 'K2', height: 8611 },
  { name: 'Kangchenjunga', height: 8586 },
  { name: 'Lhotes', height: 8516 },
  { name: 'Makalu', height: 8481 },
];

const mountainsStream = Readable.from(mountains);
console.log(mountainsStream);
console.log('---------');
mountainsStream.on('data', mountain => {
  console.log(`${mountain.name.padStart(14)}\t${mountain.height}m`);
});