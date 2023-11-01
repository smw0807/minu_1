# 11-1 비동기적으로 초기화되는 컴포넌트 다루기

Node.js 핵심 모듈과 많은 npm 패키지에 동기 API가 존재하는 이유 중 하나는 초기화 작업을 구현하는데 사용하기 편리하기 때문이다.
간단한 프로그램의 경우, 초기화 시간에 동기식 API를 사용하면 일을 많이 간소화할 수 있지만 프로그램이나 특정 컴포넌트가 초기화될 때 단 한 번만 사용되기 때문에 이러한 API 사용과 관련된 단점은 여전히 존재한다.

하지만 동기식 API를 늘 사용할 수 있는 것도 아니다.
초기화 단계에서 네트워크를 사용하여 핸드쉐이크 프로토콜을 수행하거나 환경 설정 매개 변수(.env?)를 검색하는 컴포넌트의 경우 특히 사용이 어렵다.
이런 경우는 메시지 큐와 같은 미들웨어 시스템을 위한 많은 데이터베이스 드라이버 및 클라이언트에서 흔히 볼 수 있다.

## 11-1-1 비동기적으로 초기화된 컴포넌트의 문제

아래 코드 db모듈은 데이터베이스 서버와의 연결 및 핸드쉐이크가 성공적으로 완료된 후에만 API 요청을 수학한다. 따라서 초기화가 완료될 때까지 쿼리나 기타 설명을 보낼 수 없다.

```jsx
import { EventEmitter } from 'events';

class DB extends EventEmitter {
  connected = false;

  connect() {
    // 연결 지연 시뮬레이션
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
    }, 500);
  }

  async query(queryString) {
    if (!this.connected) {
      throw new Error('Not connected yet.');
    }
    console.log(`Query executed: ${queryString}`);
  }
}

export const db = new DB();
```

이것은 비동기적으로 초기화된 컴포넌트의 일반적인 예이다.
이러한 가정하에서 일반적으로 이 문제에 대한 두 가지로 빠르고 쉬운 해결책이 있는데, 이를 로컬 초기화(local initializtion) 그리고 지연 시작(delayed startup)이라고 부른다.

### 로컬 초기화(Local initialization) 확인

API가 호출되기 전에 모듈이 초기화 되었는지 확인한다.
그렇지 않으면 초기화되기를 기다린다.
이 검사는 비동기 모듈에서 작업을 호출할 때마다 수행해야 한다.

```jsx
import { once } from 'events';
import { db } from './db.mjs';

db.connect();

async function updateLastAccess() {
  if (!db.connected) {
    await once(db, 'connected');
  }

  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`);
}

updateLastAccess();
setTimeout(() => {
  updateLastAccess();
}, 600);
```

db 컴포넌트에서 query() 함수를 호출할 때마다 모듈이 초기화되었는지 확인해야 한다.
그렇지 않으면 ‘connected’ 이벤트를 수신하여 초기화를 기다린다.
이 기술의 변형은 query() 함수 자체 내부에서 검사를 수행하는 것으로 사용시 코드의 부담이 사용자에서 라이브러리 공급자로 이동한다.

### 지연 시작

비동기적으로 초기화된 컴포넌트에 대한 두 번째, 빠르지만 좀 지저분한 해결책은
컴포넌트가 초기화 루틴을 완료할 때까지 비동기적으로 초기화된 컴포넌트에 의존하는 코드의 실행을 지연시키는 것이다.

```jsx
import { once } from 'events';
import { db } from './db.mjs';

async function initialize() {
  db.connect();
  await once(db, 'connected');
}

async function updateLastAccess() {
  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`);
}

initialize().then(() => {
  updateLastAccess();
  setTimeout(() => {
    updateLastAccess();
  }, 600);
});
```

먼저 초기화가 완료될 때까지 기다린 다음 db 객체를 사용하는 루틴을 계속 실행한다.

이 기술의 가장 큰 단점은 비동기적으로 초기화되어야 하는 컴포넌트를 사용하는 컴포넌트가 어떤 것인지를 미리 알아야 한다는 것이다. 이로 인해 코드가 취약해지고 실수에 노출된다. 이문제에 대한 한 가지 해결책은 모든 비동기 서비스가 초기화될 때까지 전체 응용 프로그램의 시작을 지연시키는 것이다.
하지만 애플리케이션의 전체 시작 시간에 상당한 지연을 초래할 수 있으며, 비동기적으로 초기화되어야하는 컴포넌트를 다시 초기화해야 하는 경우는 고려하지 않고 있다.

## 11-1-2 사전 초기화 큐

컴포넌트가 초기화된 후에만 컴포넌트의 서비스가 호출되도록 하는 또 다른 방법은 큐와 명령 패턴을 사용하는 것이다.
컴포넌트가 아직 초기화되지 않은 상태에서 수신된 함수 호출을 큐에 넣은 다음, 모든 초기화가 완료되는 즉시 실행하는 것이다.

```jsx
import { EventEmitter } from 'events';

class DB extends EventEmitter {
  connected = false;
  commandsQueue = [];

  async query(queryString) {
    if (!this.connected) {
      console.log(`Request queued: ${queryString}`);

      //1
      return new Promise((resolve, reject) => {
        const command = () => {
          this.query(queryString).then(resolve, reject);
        };
        console.log('command : ', command);
        this.commandsQueue.push(command);
      });
    }
    console.log(`Query executed: ${queryString}`);
  }

  connect() {
    // simulate the delay of the connection
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
      this.commandsQueue.forEach(command => command()); //2
      this.commandsQueue = [];
    }, 500);
  }
}
```

1. 컴포넌트가 초기화되지 않은 경우 현재 호출과 함께 수신된 매개 변수로 명령을 생성하고 commandsQueue 배열에 밀어 넣는다. 명령이 실행되면 원래 query() 함수가 다시 실행하고 결과를 Promise에 전달하여 호출자에게 반환한다.
2. 컴포넌트의 연결이 초기화가 완료되면 commandsQueue를 통해 이전에 대기열에 있던 모든 명령들을 실행한다.

위에 구현한 클래스를 사용하면 함수를 호출하기 전에 컴포넌트가 초기화되었는지 확인할 필요가 없다.
모든 로직은 컴포넌트 자체에 내장되어 있으며, 모든 소비자는 초기화 상태에 대한 걱정없이 투명하게 사용할 수 있다.
또한 “9장 행위 디자인 패턴”에서 본 상태 패턴을 두 가지 상태와 함꼐 적용하여 이를 달성할 수 있다.

- 첫 번째 상태는 컴포넌트가 초기화되면 실행할 함수들을 구현하여 성공적으로 초기화될 경우에만 활성화 된다.
  이러한 함수들은 db 컴포넌트의 초기화 상태에 대한 걱정 없이 자체적인 비즈니스 로직을 구현한다.
- 두 번째 상태는 초기화가 완료되기 전에 수행되고 첫 번째 상태와 동일한 함수들을 구현하지만 이 함수들의 유일한 역할을 호출에 전달된 매개 변수를 사용하여 큐에 새 명령을 추가하는 것이다.

```jsx
import { EventEmitter } from 'events';

const METHODS_REQUIRING_CONNECTION = [`query`];
const deactivate = Symbol('deactivate');

class InitializedState {
  async query(queryString) {
    console.log(`Query executed: ${queryString}`);
  }
}

class QueuingState {
  constructor(db) {
    this.db = db;
    this.commandsQueue = [];

    METHODS_REQUIRING_CONNECTION.forEach(methodName => {
      this[methodName] = function (...args) {
        console.log('Command queued: ', args);
        return new Promise((resolve, reject) => {
          const command = () => {
            db[methodName](...args).thend(resolve, reject);
          };
          console.log('command : ', command);
        });
      };
    });
  }

  [deactivate]() {
    this.commandsQueue.forEach(command => {
      console.log('forEach command : ', command);
      command();
    });
    this.commandsQueue = [];
  }
}

class DB extends EventEmitter {
  constructor() {
    super();
    this.state = new QueuingState(this); //1
  }

  async query(queryString) {
    return this.state.query(queryString); //2
  }

  connect() {
    // simulate the delay of the connection
    setTimeout(() => {
      this.connected = true;
      this.emit('connected');
      const oldState = this.state; //3
      this.state = new InitializedState(this);
      oldState[deactivate] && oldState[deactivate]();
    }, 500);
  }
}

export const db = new DB();
```

1. 생성자에서 인스턴스의 현재 상태를 초기화 한다.
   컴포넌트의 비동기 초기화가 아직 완료되지 않았으므로 QueuingState가 된다.
2. 일부(stub) 비즈니스 로직을 구현하는 클래스의 함수가 query() 함수이다.
   여기서 해야 할 일은 현재 활성화되어 있는 상태의 클래스의 query() 함수를 호출하는 것이다.
3. 마지막으로 데이터베이스와의 연결을 설정하면(초기화 완료) 현재 상태를 InitializedState로 전환하고 이전 상태를 비활성화 한다.
   QueuingState가 비활성화하면 이전에 살펴본 것처럼 대기열에 있던 모든 멸령이 이제 실행된다.

이 접근 방식을 통해 사용 문구를 줄이는 동시에 반복적인 초기화 검사가 필요 없이 순수 비즈니스 로직(InitializedState)으로 구현된 클래스를 생성할 수 있다.

## 11-1-3 실전에서

위에 본 패턴은 많은 데이터베이스 드라이버와 ORM 라이브러리에서 사용되고 있다.
가장 주목할 만한 것이 MongoDB용 ORM인 Mongoose이다.
쿼리를 보내기 위해 데이터베이스 연결이 열릴 때까지 기다릴 필요가 없다.
이는 각 작업이 대기열에 들어간 다음 이 섹션에서 설명한 대로 데이터베이스와의 연결이 완전히 설정되면 나중에 실행되기 때문이다.
마찬가지로 PostgreSQL 데이터베이스의 클라이언트인 pg 패키지는 미리 초기화된 대기열을 사용하지만 약간은 다른 방식을 가진다.
데이터베이스의 초기화 상태와 상관 없이 모든 쿼리를 대기열에 넣은 다음 즉시 대기열의 모든 명령을 실행하려고 시도한다.
