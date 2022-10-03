import { request } from 'http';
import { PassThrough } from 'stream';
import { createGzip } from 'zlib';
import { createReadStream } from 'fs';
import { basename } from 'path';
import { createCipheriv, randomBytes } from 'crypto';

const fileName = process.argv[2];
console.log(process.argv[3]);
const secret = Buffer.from(process.argv[3], 'hex');
console.log('secret : ', secret);
const iv = randomBytes(16);
console.log('iv : ', iv);

const httpRequestOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(fileName),
    //초기화 벡터를 HTTP헤더로 서버에 전달한다.
    'X-Initialization-Vector': iv.toString('hex'),
  },
};

const req = request(httpRequestOptions, res => {
  console.log(`Server response : ${res.statusCode}`);
});

let bytesWritten = 0;
const monitor = new PassThrough();
monitor.on('data', chunk => {
  bytesWritten += chunk.length;
  console.log(`${bytesWritten}`);
});
monitor.on('finish', () => {
  console.log(`${bytesWritten} bytes writen.`);
});

createReadStream(fileName)
  .pipe(createGzip())
  .pipe(monitor)
  //Gzip 단계 이후 데이터를 암호화 한다.
  .pipe(createCipheriv('aes192', secret, iv))
  .pipe(req)
  .on('finish', () => {
    console.log('File successfulLy sent!!');
  });
