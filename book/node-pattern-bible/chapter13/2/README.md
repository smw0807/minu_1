https://smw0807.notion.site/362b5d8dd3334db69ea1018bfa0f5130

# 13-2 발행/구독 패턴

**발행/구독**(pub/sub으로 축약됨)은 아마도 가장 잘 알려진 단방향 메시징 패턴일 것이다.  
분산된 관찰자(Observer) 패턴이므로, 이미 익숙할 수도 있다.  
관찰자의 경우와 마찬가지로 특정 범주의 메시지 수신에 대한 관찰을 등록하는 일련의 구독자들이 있다.

반면, 게시자는 모든 관련 구독자에게 배포되는 메시지를 생성한다.

![발행/구독 메시지 패턴 / (왼: 피어 투 피어 발생/구독) (오: 중개자를 사용한 발생/구독)](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/566405d2-4567-422d-b4ac-91bd84e14096/Untitled.png)

발행/구독 메시지 패턴 / (왼: 피어 투 피어 발생/구독) (오: 중개자를 사용한 발생/구독)

Pub/Sub를 특별하게 만드는 것은 게시자는 메시지 수신자가 누구인지 미리 알지 못한다는 것이다.  
특정 메시지를 수신하기 위해 관찰자를 등록해야 하는 것은 구독자이며, 게시자가 지정되지 않은 수의 수신자들과 작업할 수 있도록 한다.  
즉, Pub/Sub 패턴의 양면이 느슨하게 결합되어있어 진화하는 분산 시스템의 노드를 통합하는데 이상적인 패턴이다.

브로커가 있으면 가입자가 브로커와만 상호작용하고 어떤 노드가 메시지 게시자인지 알지 못하기 때문에 시스템 노드 간의 분리가 더욱 향상된다.  
브로커(중개자)는 메시지 대기열 시스템을 제공하여 노드 간 연결 문제가 있는 경우에도 안정적인 메시지의 전달을 보장할 수 있다.

## 13-2-1 간단한 실시간 채팅 애플리케이션 만들기

Pub/Sub 패턴이 분산 아키텍처를 통합하는데 어떻게 도움이 되는지에 대한 실제 에를 보여주기 위해 순서 WebSocket을 사용하여 매우 기본적인 실시간 채팅 애플리케이션을 만들어볼 것이다.  
그런 다음 여러 인스턴스를 실행하여 확장하고 마지막으로 메시징 시스템을 사용하여 모든 서버 인스턴스 간의 통신 채널을 구축해볼 것이다.

### 서버 측 구현

먼저 기본 채팅 애플리케이션을 만든 다음 여러 인스턴스로 확장해본다.

```jsx
iimport { createServer } from 'http';
import staticHandler from 'serve-handler';
import { WebSocketServer } from 'ws';

//정적인 파일들을 서비스 한다
//1
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'wwww' });
});

const wss = new WebSocketServer({ server }); //2
wss.on('connection', client => {
  console.log('Client connected');
  //3
  client.on('message', msg => {
    console.log(`Message : ${msg}`);
    broadcast(msg);
  });
});

function broadcast(msg) {
  //4
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
}

server.listen(process.argv[2] || 8080, () => {
  console.log('Start Server');
});

```

1. 먼저 HTTP를 생성하고 모든 요청을 특수 핸들러로 전달한다.  
   그러면 www 디렉터리에서 모든 정적 파일을 처리한다.  
   이는 애플리케이션의 클라이언트 측 리소스에 액세스하는데 필요하다.
2. WebSocket 서버의 새 인스턴스를 만들고 기존 HTTP 서버에 연결한다.  
   다음으로 연결 이벤트에 대한 이벤트 리스너를 연결하여 들어오는 WebSocket 클라이언트 연결 수신을 시작한다.
3. 새 클라이언트가 서버에 연결할 때마다 들어오는 메시지를 수신하기 시작한다.  
   새로운 메시지가 도착하면 연결된 모든 클라이언트에 이를 브로드캐스트 한다.
4. broadcast() 함수는 send() 함수를 호출하여 서버에서 클라이언트로 메시지를 보내는데, 서버가 는 연결된 모든 클라이언트에 대해 반복한다.

### 클라이언트 측 구현

```html
<!DOCTYPE html>
<html>
  <body>
    Message:
    <div id="messages"></div>
    <form id="msgForm">
      <input type="text" placeholder="Send a Message" id="msgBox" />
      <input type="submit" value="Send" />
    </form>
    <script>
      const ws = new WebSocket(`ws://${window.document.location.host}`);
      ws.onmessage = function (message) {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = message.data;
        document.getElementById('message').appendChild(msgDiv);
      };
      const form = document.getElementById('msgForm');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const message = document.getElementById('msgBox').value;
        ws.send(message);
        document.getElementById('msgBox').value = '';
      });
    </script>
  </body>
</html>
```

기본 WebSocket 객체를 사용하여 Node.js 서버에 대한 연결을 초기화한 다음 서버에서 메시지를 수신하여 도착하면 새로운 div 엘리먼트를 표시한다.  
또한 메시지를 보내기 위해서는 form 안에 간단한 텍스트 상자와 버튼을 사용한다.

## 13-2-2 Redis를 간단한 메시지 브로커로 사용하기

매우 빠르고 유연한 인 메모리 데이터 구조의 저장소인 **[Redis](https://redis.io/)**를 사용하여 가장 일반적인 Pub/Sub 구현에 대해 분석해보자.  
Redis는 종종 데이터베이스 또는 캐시 서버로 사용되지만, 많은 기능 중 중앙 집중식 Pub/Sub 메시지 교환 패턴을 구현하도록 특별히 설계된 명령어 한 쌍이 있다.  
Redis의 메시지 브로커 기능은 (의도적이지만) 매우 간단하고 기본적이다.  
특히 고급 메시지 지향 미들웨어의 기능과 비교하면 더욱 그렇다.  
이것이 인기의 주된 이유이다.  
종종 Redis는 캐시 서버나 세션 데이터 저장소로 사용되는 기존 인프라에서도 사용이 가능하다.  
속도와 유연성 덕분에 분산 시스템에서 데이터를 공유하는데 매우 널리 사용되고 있다.  
따라서 이런 경우 프로젝트에서 Pub/Sub 브로커가 필요하게 되면 가장 간단하고 즉각적인 선택으로 전용 메시지 브로커의 설치와 유지보수가 필요 없는 Redis를 재사용하는 것이다.

![채팅 애플리케이션의 메시지 브로커로 Redis를 사용하는 예](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/c8f4f43e-0708-4762-8533-26cecf294548/Untitled.png)

채팅 애플리케이션의 메시지 브로커로 Redis를 사용하는 예

1. 메시지가 웹 페이지의 텍스트 상자에 입력되고 연결된 채팅 서버 인스턴스로 전송된다.
2. 메시지가 브로커에 게시된다.
3. 브로커는 모든 구족자에게 메시지를 발송한다.  
   여기서는 채팅 서버의 모든 인스턴스가 구독자이다.
4. 각 인스턴스에서 연결된 모든 클라이언트로 메시지가 배포된다.

```jsx
import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws from 'ws';
import Redis from 'ioredis'; // 1

const redisSub = new Redis();
const redisPub = new Redis();

// 정적인 파일들을 서비스함
const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' });
});

const wss = new ws.Server({ server });
wss.on('connection', client => {
  console.log('Client connected');
  client.on('message', msg => {
    console.log(`Message: ${msg}`);
    // 2
    redisPub.publish('chat_messages', msg);
  });
});

// 3
redisSub.subscribe('chat_messages');
redisSub.on('message', (channel, msg) => {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
});

server.listen(process.argv[2] || 8080, () => {
  console.log('start');
});
```

1. Node.js 애플리케이션을 Redis 서버에 연결하기 위해, 사용 가능한 모든 Redis 명령을 지원하는 Node.js 클라이언트인 [ioredis](https://www.npmjs.com/package/ioredis) 패키지를 사용한다.  
   서로 다른 두 개의 연결을 인스턴스화 하고, 하나는 채널 구독에 사용되고, 하나는 메시지를 게시하는데 사용된다.  
   연결이 구독자모드로 설정되면 구독과 관련된 명령만 사용할 수 있기 때문에 2개의 연결이 필요하다.
2. 연결된 클라이언트로부터 새로운 메시지가 수신되면 chat_messages 채널에 메시지를 게시한다.  
   서버가 동일한 채널을 구독하고 있으면서 메시지를 클라이언트에게 직접 브로드캐스트하지 않으므로 Redis를 통해 다시 돌아올 것 이다.  
   그러나 응용 프로그램의 요구 사항에 따라 메시지를 즉시 브로드캐스트 한 후, Redis에서 수신한 것들 중 현재 서버 인스턴스에서 발신했던 메시지들을 무시해야 할 수도 있다.
3. 서버도 chat_messages 채널에 가입해야 하므로 해당 채널에 게시된 모든 메시지를 수신하도록 리스너를 등록한다.(현재 서버 인스턴스 또는 다른 채팅 서버 인스턴스에 의한)  
   메시지가 수신되면 현재 WebSocket 서버에 연결된 모든 클라이언트에게 메시지를 브로드캐스트 한다.

<aside>
💡 Redis를 사용하면 “chat.nodejs”와 같은 문자열로 식별되는 채널을 게시하고 구독할 수 있다.   
또한 globstyle(”*”) 패턴을 사용하여 여러 채널(예: chat.*)과 일치하는 구독을 정의할 수도 있다.

</aside>

## 13-2-3 ZeroMQ로 피어 투 피어 Pub/Sub

브로커가 있으면 메시징 시스템의 아키텍처를 상당히 단순화할 수 있다.  
그러나 어떤 경우에는 이것이 최식의 해결책이 아닐 수도 있다.  
짧은 지연시간이 매우 중요하거나, 복잡한 분산 시스템을 확장할 때 단일 장애 지점의 존재가 옵션이 아닌 모든 상황이 포함될 것이다.
