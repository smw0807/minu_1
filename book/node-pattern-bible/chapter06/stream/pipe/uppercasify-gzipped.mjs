import { createGzip, createGunzip } from 'zlib'; //1
import { Transform, pipeline } from 'stream';

//2
const uppercasify = new Transform({
  transform(chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase());
    cb();
  },
});

pipeline(
  //3
  process.stdin,
  createGunzip(),
  uppercasify,
  createGzip(),
  process.stdout,
  err => {
    //4
    if (err) {
      console.error(err);
      process.exit(1);
    }
  }
);
