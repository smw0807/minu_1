export class OnlineState {
  constructor(failsafeSocket) {
    this.failsafeSocket = failsafeSocket;
    this.hasDisconnected = false;
  }

  //1
  send(data) {
    this.failsafeSocket.queue.push(data);
    this._safeWrite(data);
  }

  //2
  _safeWrite(data) {
    this.failsafeSocket.socket.write(data, err => {
      if (!this.hasDisconnected && !err) {
        this.failsafeSocket.queue.shift();
      }
    });
  }

  //3
  activate() {
    this.hasDisconnected = false;
    for (const data of this.failsafeSocket.queue) {
      this._safeWrite(data);
    }

    this.failsafeSocket.socket.once('error', () => {
      this.hasDisconnected = true;
      this.failsafeSocket.changeState('offline');
    });
  }
}
/*
1. send() 함수는 데이터를 큐에 넣은 다음 온라인 상태라고 가정하고 즉시 소켓에 직접 쓰려고 한다.
  이를 위해 내부의 _safeWrite() 함수를 사용한다.
2. _safeWrite() 함수는 소켓의 쓰기 가능한 스트림(writable stream)에 데이터 쓰기를 시도하고, 데이터가 리소스를 통해 전송되기를 기다린다.
  오류가 반환되지 않고, 그동안 소켓의 연결이 해지되지 않았다면 데이터가 성공적으로 전송되었으므로 큐에서 제거된다.
3. activate() 함수는 소켓이 오프라인일 때 대기열에 있던 모든 데이터를 비운다.
  소켓이 오프라인이면 에러 메시지가 수신되기 시작한다.
  이것으로 소켓이 오프라인이 된 증상으로 인식할 것이다.(간단히 하기 위해),
  이런 일이 발생하면 오프라인 상태로 전환한다.
*/
