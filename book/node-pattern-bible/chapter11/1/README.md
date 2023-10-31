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
