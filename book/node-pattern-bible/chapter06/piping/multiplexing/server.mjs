import { createWriteStream } from 'fs';
import { createServer } from 'net';

function demultiplexChannel(source, destinations) {
  let currentChannel = null;
  let currentLength = null;

  source
    // 1
    .on('readable', () => {
      let chunk;
      // 2
      if (currentChannel === null) {
        chunk = source.read(1);
        currentChannel = chunk && chunk.readUInt8(0);
      }

      // 3
      if (currentLength === null) {
        chunk = source.read(4);
        currentLength = chunk && chunk.readUInt32BE(0);
        if (currentLength === null) return null;
      }

      // 4
      chunk = source.read(currentLength);
      if (chunk === null) return null;

      console.log(`Received packet from: ${currentChannel}`);
      // 5
      destinations[currentChannel].write(chunk);
      currentChannel = null;
      currentLength = null;
    })
    // 6
    .on('end', () => {
      destinations.forEach(destination => destination.end());
      console.log('Source channel closed');
    });
}

const server = createServer(socket => {
  const stdoutStream = createWriteStream('stdout.log');
  const stderrStream = createWriteStream('stderr.log');
  demultiplexChannel(socket, [stdoutStream, stderrStream]);
});
server.listen(3000, () => console.log('Server started'));
