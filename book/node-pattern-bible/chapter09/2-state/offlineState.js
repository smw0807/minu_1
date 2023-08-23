import jsonOverTcp from 'json-over-tcp-2'; //1

export class OfflineState {
  constructor(failsafeSocket) {
    this.failsafeSocket = failsafeSocket;
  }

  //2
  send(data) {
    this.failsafeSocket.queue.push(data);
  }

  //3
  activate() {
    const retry = () => {
      setTimeout(() => this.activate(), 1000);
    };

    console.log('Trying to connect...');
    this.failsafeSocket.socket = jsonOverTcp.connect(this.failsafeSocket.options, () => {
      console.log('Connection established');
      this.failsafeSocket.socket.removeListener('error', retry);
      this.failsafeSocket.changeState('online');
    });
    this.failsafeSocket.socket.once('error', retry);
  }
}
/*
1. 원시 TCP 소켓을 사용하는 대신 json-over-tcp-2라는 라이브러리를 사용한다.
  라이브러리가 소켓을 통과하는 JSON 객체 데이터의 모든 구문 분석 및 형식화를 처리하므로 작업이 크게 단순화된다.
2. send() 함수는 수신한 데이터를 큐에 넣는 작업만 담당한다.
  여기선 오프라인이라고 가정하고 나중을 위해 데이터 객체를 저장할 것이다.
3. activate() 함수는 json-over-tcp-2 소켓을 사용하여 서버와의 연결을 설정하려고 한다.
  작업이 실패하면 1초 후에 다시 시도한다.
  유효한 연결이 설정될 때까지 계속 시도한다.
  연결이 될 경우 failsafeSocket 상태가 온라인으로 전환된다.
*/
