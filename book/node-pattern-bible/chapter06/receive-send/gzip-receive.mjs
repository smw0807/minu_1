import { createServer } from 'http';
import { createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { basename, join } from 'path';

const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename']);
  const destFilename = join('receive_files', filename);
  console.log(`File request received: ${filename}`);
  req
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plan' });
      res.end('OK\n');
      console.log(`File saved: ${destFilename}`);
    })
    .on('error', err => {
      console.log('req Error : ', err);
    });
});

server.listen(3000, () => console.log('Listening on http://localhost:3000'));
server.on('error', error => {
  console.log('Server Error : ', error);
});
