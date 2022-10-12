import { createWriteStream, createReadStream } from 'fs';
import { Readable, Transform } from 'stream';

export function concatFiles(dest, files) {
  return new Promise((resolve, reject) => {
    const destStream = createWriteStream(dest);
    Readable.from(files) //1
      .pipe(
        new Transform({
          //2
          objectMode: true,
          transform(filename, enc, done) {
            const src = createReadStream(filename);
            src.pipe(destStream, { end: false });
            src.on('error', done);
            src.on('end', done); //3
          },
        })
      )
      .on('error', reject)
      .on('finish', () => {
        //4
        destStream.end();
        resolve();
      });
  });
}
