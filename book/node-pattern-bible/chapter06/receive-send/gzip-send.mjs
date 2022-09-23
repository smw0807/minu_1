import { request } from 'http';
import { createGzip } from 'zlib';
import { createReadStream } from 'fs';
import { basename } from 'path';

const fileName = process.argv[2];

const httpRequestOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  methods: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(fileName),
  },
};

const req = request(httpRequestOptions, res => {
  console.log(`Server response : ${res.statusCode}`);
});

createReadStream(fileName)
  .pipe(createGzip())
  .pipe(req)
  .on('error', err => {
    console.error('ReadStream Error : ', err);
  })
  .on('finish', () => {
    console.log('File successfuly sent!!');
  });
