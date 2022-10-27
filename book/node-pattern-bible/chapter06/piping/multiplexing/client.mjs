/**
 * 자식 프로세스를 시작하고 스트림을 멀티플렉싱하는 애플리케이션
 */
import { fork } from 'child_process';
import { connect } from 'net';

/**
 *
 * @param {*} sources : 다중화(멀티플렉싱)할 소스 스트림
 * @param {*} destination : 목적지 채널
 * 채널을 식별하는 데 1byte만 있기 떄문에 최대 256개의 서로 다른 소스 스트림을 다중화 할 수 있다.
 */
function multiplexChannels(sources, destination) {
  let openChannels = sources.length;
  for (let i = 0; i < sources.length; i++) {
    sources[i]
      // 1
      .on('readable', function () {
        let chunk;
        while ((chunk = this.read()) !== null) {
          // 2
          const outBuff = Buffer.alloc(1 + 4 + chunk.length);
          outBuff.writeUInt8(i, 0); //채널ID
          outBuff.writeUInt32BE(chunk.length, 1); //패킷 크기
          chunk.copy(outBuff, 5); //실제 데이터?
          console.log(`Sending packet to channel: ${i}`);
          // 3
          destination.write(outBuff);
        }
      })
      // 4
      .on('end', () => {
        if (--openChannels === 0) {
          destination.end();
        }
      });
  }
}

// 5
const socket = connect(3000, () => {
  // 6
  const child = fork(process.argv[2], process.argv.slice(3), { silent: true });
  //7
  multiplexChannels([child.stdout, child.stderr], socket);
});
