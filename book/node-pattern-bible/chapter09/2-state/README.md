# 9-2 상태(State)

상태(State) 패턴은 컨텍스트의 상태에 따라 전략이 변경되는 특별한 전략 패턴이다.

9-1에서 살펴본 전략 패턴은 환경 설정의 속성 또는 입력 인자와 같은 다양한 변수에 따라 전략을 선택하는 방법으로,  
이 선택이 완료되면 한번 생성된 컨텍스트에서는 전략이 변경되지 않은 상태로 유지된다.  
상태 패턴에서는 전략(상태 패턴에서는 **상태**라고도 함)은 동적이며 컨텍스트의 생존 주기 동안 변경될 수 있으므로 내부 상태에 따라 동작을 조정할 수 있다.

상태 패턴을 사용하면 서로 다른 컨텍스트 상태에서 서로 다른 전략을 선택한다.  
이는 컨텍스트 객체가 상태에 따라 다른 동작을 채택한다는 것을 뜻한다.

예를 들면,  
호텔 예약 시스템과 객실 예약을 모델링하는 Reservation이라는 객체가 있다고 가정했을 때  
이것은 상태에 따라 객체의 동작을 조정해야 하는 일반적인 상황이다.  
다음과 같은 일련의 이벤트를 생각해 보자.

- 예약이 처음 생성되면 사용자가 예약을 확인할 수 있다. (confirm() 함수)  
  아직 예약이 완료되지 않았기 때문에 취소할 수 없다.(cancel()함수)  
  그러나 구매하기 전에 마음이 바뀌면 삭제할 수 있다.(delete()함수)
- 예약이 완료되면 confirm() 함수를 다시 사용하는 것은 의미가 없다.  
  그러나 이제는 예약을 취소할 수 있지만 기록을 보관해야 하므로 더는 객체를 삭제할 수 없다.(데이터 상태값만 변경?)
- 예약일 전날에는 더 이상 예약을 취소할 수 없다.

이 패턴을 사용하면 Reservation 객체가 한 동작에서 다른 동작으로 쉽게 전환할 수 있다.  
이것은 단순히 각각의 상태 변경에 따라 다른 전략(상태 객체)의 활성화가 필요하다.

<aside>
💡 상태 전환은 컨텍스트 객체, 클라이언트 코드 또는 상태 객체 자체에 의해 시작되고 제어될 수 있다.
이때 마지막 옵션은 컨텍스트가 가능한 모든 상태와 이들 사이의 전환 방법에 대해 알 필요가 없기 때문에 일반적으로 유연성과 디커플링 측면에서 최상의 결과를 제공한다.
</aside>
   
## 9-2-1 기본적인 안전 소켓 구현

서버와 연결이 끊어져도 실패하지 않는 TCP 클라이언트 소켓 만들기.  
대신 서버가 오프라인 상태인 동안 전송된 모든 데이터를 큐에 넣은 다음, 연결이 다시 설정되는 즉시 다시 전송 한다.  
이 소켓을 간단한 모니터링 시스템의 맥락에서 활용하고자 한다.  
일련의 시스템이 정기적으로 리소스 사용에 대한 통계를 전송한다.  
이러한 리소스를 수집하는 서버가 다운되면 서버가 다시 온라인 상태가 될 때까지 소켓이 계속해서 데이터를 로컬 큐에 담는다.

```jsx
//failsafeSocket.js
import { OfflineState } from './offlineState.js';
import { OnlineState } from './onlineState.js';

export class FailsafeSocket {
  // 1
  constructor(options) {
    this.options = options;
    this.queue = [];
    this.currentState = null;
    this.socket = null;
    this.states = {
      offline: new OfflineState(this),
      online: new OnlineState(this),
    };
    this.changeState('offline');
  }

  // 2
  changeState(state) {
    console.log(`Activating state: ${state}`);
    this.currentState = this.states[state];
    this.currentState.activate();
  }

  // 3
  send(data) {
    this.currentState.send(data);
  }
}
```

위 클래스는 세가지 주요 요소로 구성된다.

1. 생성자는 소켓이 오프라인일 때 전송된 모든 데이터를 담을 큐를 포함하여 다양한 데이터 구조를 초기화 한다.  
   또한 두 가지 상태 집합을 생성한다.  
   하나는 오프라인일 때 소켓 동작을 구현하기 위한 것이고, 다른 하나는 소켓이 온라인일 때이다.
2. changeState() 함수는 한 상태에서 다른 상태로 전환하는 역할을 한다.  
   단순히 currentState 인스턴스 변수를 업데이트하고 대상 상태에서 activate()를 호출한다.
3. send() 함수에서는 FailsafeSocket 클래스의 주요 기능이 포함되어 있다.  
   온라인, 오프라인 상태에 따라 다른 동작을 처리하는 곳이다.  
   현재 활성 상태로 작업을 위임하면 된다.

```jsx
//oflineState.js
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
```

오프라인 상태에서 소켓의 동작을 관리하는 클래스로 작동 방식은 다음과 같다.

1. 원시 TCP 소켓을 사용하는 대신 json-over-tcp-2라는 라이브러리를 사용한다.  
   라이브러리가 소켓을 통과하는 JSON 객체 데이터의 모든 구문 분석 및 형식화를 처리하므로 작업이 크게 단순화된다.
2. send() 함수는 수신한 데이터를 큐에 넣는 작업만 담당한다.  
   여기선 오프라인이라고 가정하고 나중을 위해 데이터 객체를 저장할 것이다.
3. activate() 함수는 json-over-tcp-2 소켓을 사용하여 서버와의 연결을 설정하려고 한다.  
   작업이 실패하면 1초 후에 다시 시도한다.  
   유효한 연결이 설정될 때까지 계속 시도한다.  
   연결이 될 경우 failsafeSocket 상태가 온라인으로 전환된다.

```jsx
//onlineState.js
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
```

서버와의 활성화된 연결이 있을 때

1. send() 함수는 데이터를 큐에 넣은 다음 온라인 상태라고 가정하고 즉시 소켓에 직접 쓰려고 한다.  
   이를 위해 내부의 \_safeWrite() 함수를 사용한다.
2. \_safeWrite() 함수는 소켓의 쓰기 가능한 스트림(writable stream)에 데이터 쓰기를 시도하고, 데이터가 리소스를 통해 전송되기를 기다린다.  
   오류가 반환되지 않고, 그동안 소켓의 연결이 해지되지 않았다면 데이터가 성공적으로 전송되었으므로 큐에서 제거된다.
3. activate() 함수는 소켓이 오프라인일 때 대기열에 있던 모든 데이터를 비운다.  
   소켓이 오프라인이면 에러 메시지가 수신되기 시작한다.  
   이것으로 소켓이 오프라인이 된 증상으로 인식할 것이다.(간단히 하기 위해),  
   이런 일이 발생하면 오프라인 상태로 전환한다.  


이제 위 소스들을 이용해 시험을 해보자….

```jsx
//server.js
import jsonOverTcp from 'json-over-tcp-2';

const server = jsonOverTcp.createServer({ port: 5001 });
server.on('connection', socket => {
  socket.on('data', data => {
    console.log('Client data', data);
  });
});

server.listen(5001, () => console.log('Server Started!!'));
```

```jsx
//client.js
import { FailsafeSocket } from './failsafeSocket.js';

const failsafeSocket = new FailsafeSocket({ port: 5001 });
setInterval(() => {
  //현재 메모리 사용량을 전달
  failsafeSocket.send(process.memoryUsage());
}, 1000);
```

서버는 수신한 JSON 메시지를 콘솔에 간단히 출력하고, 클라이언트는 FailsafeSocket 객체를 활용하여 매초마다 메모리 사용률 측정값을 전송한다.

정상적인 실행은 서버와 클라이언트 모두를 실행하는 것이고, 서버를 중지했다가 다시 시작하여 failsafeSocket의 기능을 테스트할 수 있다.  
클라이언트 상태가 온라인과 오프라인에서 변경되고, 서버가 오프라인일 때 수집된 메모리 측정이 대기열에 들어간 다음, 서버가 다시 온라인으로 전환되는 즉시 다시 전송되는지 확인하면 된다.

이 샘플은 상태 패턴이 상태에 따라 동작을 조정해야 하는 컴포넌트의 모듈성과 가독성을 높이는데 어떻게 도움이 될 수 있는지에 대한 명확한 예시가 된다.
