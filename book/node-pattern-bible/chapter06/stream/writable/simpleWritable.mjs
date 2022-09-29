import { Writable } from 'stream';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import mkdirp from 'mkdirp';

const tfs = new Writable({
  objectMode: true,
  write(chunk, encoding, callback) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => callback())
      .catch(callback);
  },
});

tfs.write({
  path: join('files1', 'file1.txt'),
  content: 'Hello',
});
tfs.write({
  path: join('files1', 'file2.txt'),
  content: 'Node.js',
});
tfs.write({
  path: join('files1', 'file3.txt'),
  content: 'streams',
});
