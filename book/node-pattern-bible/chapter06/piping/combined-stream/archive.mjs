import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { randomBytes } from 'crypto';
import { createCompressAndEncrypt, createDecryptAndDecompress } from './combined-stream.mjs';

const [, , password, source] = process.argv;
const iv = randomBytes(16);
const destination = `${source}.gz.enc`;

pipeline(
  createReadStream(source),
  createCompressAndEncrypt(password, iv),
  // createDecryptAndDecompress(password, iv),
  createWriteStream(destination),
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`${destination} create with iv : ${iv.toString('hex')}`);
  }
);
// const a = createCompressAndEncrypt(password, iv);
// console.log(a);
