import { Duplex } from 'stream';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import mkdirp from 'mkdirp';
import Chance from 'chance';

class Duple extends Duplex {
  constructor(options) {
    super(options);
    this.emittedBytes = 0;
    this.chance = new Chance();
  }
  _read(size) {
    const chunk = this.chance.string({ length: size });
    this.push(chunk, 'utf8');
    this.emittedBytes += chunk.length;
    if (this.chance.bool({ likelihood: 95 })) {
      this.push(null);
    }
  }
  _write(chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb);
  }
}

const a = new Duple();
a._write({
  path: join('files', 'file1.txt'),
  content: 'duplex!!!!',
});

const b = new Duple();
b._read(5);
b.on('data', chunk => {
  console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`);
}).on('end', () => {
  console.log(`Produced ${b.emittedBytes} bytes of random data`);
});
