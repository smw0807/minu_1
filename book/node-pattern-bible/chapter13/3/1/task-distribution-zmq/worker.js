import zmq from 'zeromq';
import { processTask } from './processTask.js';

async function main() {
  const fromVentilator = new zmq.Pull();
  const toSink = new zmq.Push();

  //변형 생상자 벤틸레이터 연결
  fromVentilator.connect('tcp://localhost:5016');
  //결과 수집자 싱크 연결
  toSink.connect('tcp://localhost:5017');

  for await (const rawMessage of fromVentilator) {
    const found = processTask(JSON.parse(rawMessage.toString()));
    if (found) {
      console.log(`Found! -> ${found}`);
      await toSink.send(`Found: ${found}`);
    }
  }
}

main().catch(err => console.error(err));
