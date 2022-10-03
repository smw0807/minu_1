import { PassThrough } from 'stream';

let bytesWritten = 0;
const monitor = new PassThrough();
monitor.on('data', chunk => {
  console.log('chunk : ', chunk.toString());
  bytesWritten += chunk.length;
});
monitor.on('finish', () => {
  console.log(`${bytesWritten} bytes written`);
});

// monitor.write('hello?');
// monitor.end();

setTimeout(() => {
  monitor.write('hello...');
}, 1000);
setTimeout(() => {
  monitor.write('hello...');
}, 2000);
setTimeout(() => {
  monitor.write('hello...');
}, 3000);
setTimeout(() => {
  monitor.write('hello...');
}, 4000);
setTimeout(() => {
  monitor.write('hello...');
  monitor.end('end...');
}, 5000);
