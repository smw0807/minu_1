import { createReadStream, createWriteStream } from 'fs';
import { PassThrough } from 'stream';
import { createHash } from 'crypto';

const monitor = new PassThrough();
monitor.on('data', chunk => {
  console.log('111 : ', chunk.toString());
});
monitor.on('finish', () => console.log('monitor finish'));
const filename = process.argv[2];
const sha1Stream = createHash('sha1').setEncoding('hex');
const md5Stream = createHash('md5').setEncoding('hex');
const inputStream = createReadStream(filename);

inputStream
  .pipe(sha1Stream)
  .pipe(monitor)
  .pipe(createWriteStream(`${filename}.sha1`));
inputStream
  .pipe(md5Stream)
  .pipe(monitor)
  .pipe(createWriteStream(`${filename}.md5`));
