import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import split from 'split';
import superagent from 'superagent';
import parallelTransform from 'parallel-transform';

pipeline(
  createReadStream(process.argv[2]), //1
  split(), //2
  parallelTransform(4, async function (url, done) {
    //3
    if (!url) return done();
    try {
      await superagent.head(url, { timeout: 5 * 1000 });
      this.push(`${url} is up\n`);
    } catch (err) {
      this.push(`${url} is down\n`);
    }
    done();
  }),
  createWriteStream('result.txt'), //4
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('All urls have been checked');
  }
);
