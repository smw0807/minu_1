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

### ZeroMQ 소개

P2P 아키텍처에 적합한 솔루션 중 하나는 **[ZeroMQ](https://zeromq.org/)**이다.(zmq, 0MQ라고도 함)  
ZeroMQ는 다양한 메시징 패턴을 구축하기 위한 기본 도구를 제공하는 네트워킹 라이브러리이다.  
저수준으로 매우 빠르며 최소한의 API를 가지고 있지만 원자 메시지, 부하분산, 대기열 등과 같은 견고한 메시징 시스템을 만들기 위한 모든 기본 구성요소를 제공한다.  
프로세스 내 채널(inproc://), 프로세스 간 통신(ipc://), PGM 프로토콜(pgm:// 또는 epgm://)을 사용한 멀티 캐스트와 같은 다양한 유형의 전송 방식을 지원한다.(TCP는 기본이다. tcp://)

<aside>
💡 ZeroMQ 소켓은 가장 일반적인 메시징 패턴을 구현하는데 도움이 되는 추가적인 추상화를 제공하는 네트워크 소켓으로 간주할 수 있다.   
예를 들어 Pub/Sub, 요청/응답 또는 단방향 푸시 통신을 구현하도록 설계된 소켓을 찾을 수 있다.

</aside>

### 채팅 서버를 위한 P2P 아키텍처 설계

채팅 서버의 각 인스턴스는 게시된 메시지를 수신하기 위해 사용 가능한 다른 인스턴스에 직접 연결해야 한다.  
ZeroMQ에는 이러한 목적을 위해 특별히 설계된 Pub/Sub의 두 가지 유형의 소켓이 있다.  
일반적인 패턴은 PUB 소켓을 로컬포트에 바인딩하여 SUB 유형의 소켓에서 들어오는 구독 요청의 수신을 시작하는 것이다.

구독에서는 연결된 SUB 소켓에 전달되는 메시지를 지정하는 필터가 있을 수 있는데,  
필터는 단순 이진 버퍼(문자열일 수도 있음)이며 메시지의 시작 부분과 매칭 시킨다.  
메시지가 PUB 소켓을 통해 전송되면 연결된 모든 SUB 소켓은 브로드캐스트되지만 구독 필터가 적용된 후에만 전송된다.  
필터는 TCP와 같은 연결된 프로토콜이 사용되는 경우에만 게시자 측에 적용된다.

![ZeroMQ PUB/SUB 소켓을 사용하는 채팅 서버 메시징 아키텍처](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/b0b04e10-9b8b-4fba-af5b-c31f0e05f72b/Untitled.png)

ZeroMQ PUB/SUB 소켓을 사용하는 채팅 서버 메시징 아키텍처

위 그림은 채팅 애플리케이션의 두 인스턴스가 있을 때 정보의 흐름을 보여주지만, 동일한 개념의 N개의 인스턴스에 적용할 수 있다.  
이 아키텍처에서 필요한 모든 연결을 설정할 수 있으려면, 각 노드가 시스템의 다른 노드를 알고있어야 한다.  
또한 구독이 SUB 소켓에서 PUB 소켓으로 이동하는 동안 메시지가 반대 방향으로 이동하는 방식을 보여준다.

### ZeroMQ PUB/SUB 소켓 사용

```jsx
import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws from 'ws';
import yargs from 'yargs'; // 1
import zmq from 'zeromq';

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'www' });
});

let pubSocket;
async function initializeSockets() {
  pubSocket = new zmq.Publisher(); // 2
  await pubSocket.bind(`tcp://127.0.0.1:${yargs.argv.pub}`);

  const subSocket = new zmq.Subscriber(); //3
  const subPorts = [].concat(yargs.argv.sub);
  for (const port of subPorts) {
    console.log(`Subscribing to ${port}`);
    subSocket.connect(`tcp://127.0.0.1:${port}`);
  }
  subSocket.subscribe('chat');

  //4
  for await (const [msg] of subSocket) {
    console.log(`Message from another server: ${msg}`);
    boardcast(msg.toString().split(' ')[1]);
  }
}

initializeSockets();

const wss = new ws.Server({ server });
wss.on('connection', client => {
  console.log('Client connected');
  client.on('message', msg => {
    console.log(`Message: ${msg}`);
    broadcast(msg);
    pubSocket.send(`chat ${msg}`); //5
  });
});

function broadcast(msg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
}

server.listen(yargs.argv.http || 8080);
```

1. yargs는 커맨드라인 인자를 파싱하는 패키지이다.  
   명명된 인자를 쉽게 받아들이기 위해 사용한다.  
    zeromq는 ZeroMQ용 node.js 클라이언트인 패키지이다.
2. initializeSockets() 함수에서 즉시 게시자 소켓을 만들고 커맨드라인 인자인 —pub에 지정된 포트에 바인딩 한다.
3. 구독자(Subscriber) 소켓을 만들고 이를 애플리케이션의 다른 인스턴스의 게시자(Publisher) 소켓에 연결한다.  
   대상 게시자 소켓의 포트는 커맨드라인의 인자인 —sub로 지정한다.(둘 이상일 수 있음)  
   그런 다음 채팅을 필터로 제공하여 실제 구독을 생성한다.  
   즉, chat을 필터로 제공하여 실제 구독을 생성한다.  
   다시 말해, chat으로 시작하는 메시지만 수신한다.
4. subSocket은 비동기 반복가능자이므로 for await..of 루프를 사용하여 구독자 소켓에 도착하는 메시지를 수신하기 시작한다.  
   우리가 수신하는 모든 메시지에서 접두사 chat을 제거한 다음 실제 페이로드를 현재 WebSocket 서버에 연결된 모든 클라이언트에 broadcast() 한다.
5. 현재 인스턴스의 WebSocket 서버에서 새로운 메시지를 받으면 연결된 모든 클라이언트로 브로드캐스트하지만 게시자 소켓을 통해 게시하기도 한다.  
   chat을 접두사로 사용하고 그 뒤에 공백을 두어 chat을 필터로 사용하는 모든 구독에 메시지가 게시되도록 한다.

이렇게 P2P Pub/Sub 패턴을 사용하여 통합된 간단한 분산 시스템을 만들 수 있다.

실행해보면, 구독자 소켓이 게시자 소켓에 대한 연결이 설정되지 않아도 ZeroMQ는 문제가 없다는 걸 알 수 있다.  
(5001, 5002에 대한 수신 대기 중인 게시자 소켓이 없어도 ZeroMQ는 오류를 발생시키지 않는다.)  
그 이유는 ZeroMQ가 장애에 대한 복원력이 뛰어나도록 만들어졌으며, 기본적인 연결 재시도 메커니즘을 구현하고 있기 때문이다.  
또한 이 기능은 노드가 중단되거나 재시작될 경우 특히 유용하다.  
게시자 소켓에도 이러한 로직이 적용된다.  
구독이 없는 경우 모든 메시지를 삭제하지만 계속 작동한다.

## 13-2-4 큐를 통한 안정적인 메시지 전달

메시징 시스템에서 중요한 추상화는 **메시지 큐(MQ:Message Queue)**이다.  
메시지 대기열을 사용하면 메시지의 발신자와 수신자가 통신을 설정하기 위해 동시에 활성화되어 연결될 필요가 없다.  
큐 시스템이 메시지를 수신하는 대상이 메시지를 수신할 때까지 메시지를 저장하기 때문이다.  
이 동작은 구독자가 메시징 시스템에 연결되어 있는 동안에만 메시지를 수신할 수 있는 발사 후 망각(fire-and-forget) 패러다임과는 반대이다.  
모든 메시지를 수신하지 않을 때 보낸 메시지를 포함하여 항상 안정적으로 수신할 수 있는 구독자를 **영구 구독자(durable subscriber)**라고 한다.

메시징 시스템에서 전달의 의미는 세 가지 범주로 요약할 수 있다.

- 최대한 한 번 : 실행 후 삭제라고도 하며 메시지가 지속되지 않고 전달이 확인되지 않는다.  
  이는 수신기가 충돌하거나 연결이 끊어지는 경우 메시지가 손실될 수 있음을 의미한다.
- 적어도 한 번 : 메시지가 한번 이상 수신되도록 보장되지만, 발신자에게 수신을 알리기 전에 수신자가 충돌하는 경우 중복이 발생할 수 있다.
- 정확히 한 번 : 가장 안정적인 전달을 의미한다.  
  메시지가 한 번만 수신되도록 보장한다.  
  이로 인해 메시지 전달을 확인하는데 더 느리고 데이터 집약적인 메커니즘이 수반된다.

메시징 시스템이 “적어도 한 번” 또는 “정확히 한 번” 전달이라는 의미를 달성할 수 있는 경우 영구 가입자가 존재하며, 이를 위해 시스템은 메시지 큐를 사용하여 가입자가 연결이 끊어져 있는 동안 메시지를 쌓아놔야 한다.  
큐는 메모리에 저장되거나 디스크에 유지되어 큐 시스템이 다시 시작되거나 장애가 발생하는 경우에도 메시지를 복구할 수 있다.

![큐로 지원되는 메시징 시스템의 동작 예](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/879df8b0-332b-4210-ae7c-8918afcb496d/Untitled.png)

큐로 지원되는 메시징 시스템의 동작 예

1. 정상적인 작업 동안 메시지는 메시지 큐를 통해 게시자에서 구독자로 이동한다.
2. 장애나 오작동 또는 단순히 계획된 유지 보수로 인해 구독자가 오프라인 상태가 되면, 게시자가 보낸 모든 메시지가 메시지 큐에 안전하게 저장되고 누적된다.
3. 가입자가 다시 온라인 상태가 되면 큐에 축적된 모든 메시지가 가입자에게 전송되므로 메시지가 손실되지 않는다.

### AMQP 소개

메시지 큐는 일반적으로 은행 시스템, 항공 교통 관리 및 제어 시스템, 의료 애플리케이션 등과 같은 미션크리티컬 애플리케이션을 포함하여 메시지가 손실되면 안 되는 상황에서 사용된다.  
이는 일반적으로 일반적인 엔터프라이즈급 메시지 큐가 방탄 프로토콜(bulletproof protocol)과 영구 저장소를 활용하여 오작동이 있는 경우에도 메시지 전달을 보장하는 매우 복잡한 소프트웨어라는 것을 의미한다.  
이러한 이유로 엔터프라이즈 메시징 미들웨어는 수년 동안 Oracle 및 IBM과 같은 거대 기술 기업의 특권이었으며, 각각은 일반적으로 고유한 프로토콜을 구현하여 강력한 고객 종속을 초래하였다.  
다행이도 AMQP, STOMP, MQTT와 같은 개방형 프로토콜의 성장 덕분에 메시징 시스템이 주류가 된지 수 년이 지났다.

**AMQP**는 많은 메시지 대기열 시스템에서 지원하는 개방형 표준 프로토콜이다.  
공통 프로토콜을 정의하는 것 외에도 라우팅, 필터링, 큐잉, 안정성 및 보안이 적용된 모델을 제공한다.

![AMQP 기반 메시징 시스템의 예](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/d6b8c538-db34-4d75-8bcd-a2178b21f513/Untitled.png)

AMQP 기반 메시징 시스템의 예

AMQP에는 세 가지 필수 컴포넌크가 있다.

- 큐(Queue)
  클라이언트가 사용하는 메시지를 저장하는 데이터 구조이다.  
  큐의 메시지는 하나 이상의 소비자에게 푸시(Push) 또는 풀(Pull) 된다.  
  여러 소비자가 동일한 대기열에 연결된 경우 메시지 간에 로드 밸런싱이 이루어 진다.  
  큐는 다음 중 하나일 수 있다. - 영구(Durable)  
   브로커가 다시 시작되면 대기열이 자동으로 생성됨을 의미한다.  
   영구 대기열이라고 해서 그 내용도 보존된다는 것을 의미하지 않는다.  
   실제로 지속성(persistent)으로 표시된 메시지만 디스크에 저장되고 재시작 시 복원된다. - 독점(Exclusive)  
   대기열이 하나의 특정 가입자 연결에만 바인딩된다는 것을 의미한다.  
   연결이 닫히면 큐(대기열)가 삭제된다. - 자동삭제(Auto-delete)  
   마지막 구독자가 연결을 끊을 때 대기열이 삭제된다.
- 익스체인지(Exchange)  
  메시지가 게시되는 곳이다.  
  익스체인지는 구현하는 알고리즘에 따라 메시지를 하나 이상의 큐로 라우팅한다. - 다이렉트 익스체인지(Direct Exchange)  
   전체 라우팅 키(예: chat.msg)를 일치시켜 메시지를 라우팅한다. - 토픽 익스체인지(Topic Exchange)  
   라우팅 키와 일치하는 glob-like 패턴을 사용하여 메시지를 배포한다.  
   (예: chat.#은 chat으로 시작하는 모든 라우팅 키와 일치함) - 팬아웃 익스체인지(Fanout Exchange)  
   제공된 라우팅 키를 무시하고 연결된 모든 대기열에 브로드캐스트 한다.
- 바인딩(Binding)  
  익스체인지와 큐 사이의 링크이다.  
  또한 익스체인지에서 도착하는 메시지를 필터링하는데 사용되는 라우팅 키 또는 패턴을 정의한다.

이러한 컴포넌트는 브로커에 의해 관리되며 생성 및 조작을 위한 API를 제공한다.  
브로커에 연결할 때 클라이언트는 브로커와 통신 상태를 유지하는 역할을 하는 연결을 추상화한 **채널**을 만든다.

AMQP에서 독점큐 또는 자동삭제큐를 제외한 생성한 모든 유형의 큐로 영구 구독자 패턴을 얻을 수 있다.  
AMQP 모델은 지금까지 사용한 메시징 시스템(Redis 및 ZeroMQ) 보다 훨씬 더 복잡하다.  
그러나 기본 Pub/Sub 메커니즘을 사용하여 확보하기 어려운 일련의 기능들과 신뢰성 수준을 제공한다.

### AMQP 및 RabbitMQ를 사용하는 영구 구독자

메시지를 잃지 않는 것이 중요한 일반적인 시나리오는 마이크로서비스 아키텍처의 여러 서비스를 동기화 상태로 유지하려는 경우이다.  
브로커를 사용하여 모든 서비스를 동일한 페이지에서 유지하려면 정보를 잃지 않는 것이 중요하다.  
그렇지 않으면 일관성이 없는 상태가 될 수 있다.

### 채팅 애플리케이션에 대한 히스토리 서비스 설계

클라이언트가 연결될 때 서비스를 질의하고 전체 채팅 기록을 검색할 수 있도록 데이터베이스 내에 채팅 메시지를 유지하는 히스토리 서비스를 추가해볼 것이다.  
RabbitMQ 브로커와 AMQP를 사용하여 히스토리 서비스를 채팅 서버와 통합할 것이다.

![AMQP 및 히스토리 서비스를 사용하는 채팅 애플리케이션의 아키텍처](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/a2233ede-37f3-4325-bfc7-9f82e34a546a/Untitled.png)

AMQP 및 히스토리 서비스를 사용하는 채팅 애플리케이션의 아키텍처

위 아키텍처는 단일 팬아웃 익스체인지를 사용한다.  
복잡한 라우팅 로직이 필요하지 않으므로 시나리오에는 그보다 더 복잡한 익스체인지가 필요하지 않다.

채팅 서버를 위해 생성된 대기열은 채팅 서버가 오프라인일 때 놓친 메시지를 수신하는 데는 관심이 없기 때문에 독점 유형의 큐이다.  
히스토리 서비스는 이러한 메시지들까지 모두 수신할 것이며, 최종적으로는 저장된 메시지에 대해 더 복잡한 쿼리를 구현할 수도 있다.  
이것은 채팅 서버가 영우 가입자가 아니며, 연결이 종료되는 즉시 큐가 제거된다는 것을 의미한다.  
대신 히스토리 서비스는 메시지를 잃어버리지 않는다.  
따라서 히스토리 서비스를 위해 만들려는 큐는 내구성이 있어야 하므로 서비스가 연결 해제된 동안 게시된 모든 메시지가 큐에 유지되고 다시 온라인 상태가 되면 전달해야 한다.

### AMQP를 사용하여 히스토리 서비스 구현

```jsx
//historySvc.js
import { createServer } from 'http';
import level from 'level';
import timestamp from 'monotonic-timestamp';
import JSONSteam from 'JSONStream';
import amqp from 'amqplib';

async function main() {
  const db = level('./msgHistory');

  const connection = await amqp.connect('amqp://localhost'); //1
  const channel = await connection.createChannel();
  await channel.assertExchange('chat', 'fanout'); //2
  const { queue } = channel.assertQueue('chat_history'); //3
  await channel.bindQueue(queue, 'chat'); //4

  // 5
  channel.consume(queue, async msg => {
    const content = msg.content.toString();
    console.log(`Saving message: ${content}`);
    await db.put(timestamp(), content);
    channel.ack(msg);
  });

  createServer((req, res) => {
    res.writeHead(200);
    db.createValueStream().pipe(JSONSteam.stringify()).pipe(res);
  }).listen(8090);
}

main().catch(err => console.error(err));
```

1. 먼저 AMQP 브로커(여기서는 RabbitMQ)와 연결을 설정한다.  
   그런 다음 통신 상태를 유지하는 세션과 유사한 채널을 만든다.
2. chat이라는 익스체인지를 설정한다.  
   assertExchange() 명령은 익스체인지 브로커에 존재하는지 확인한다.  
   그렇지 않으면 익스체인지가 생성된다.
3. chat_history라는 큐를 만든다.  
   기본적으로 큐는 영구성이 있으므로(durable) 영구 구독자를 지원하기 위해 추가적인 옵션을 전달할 필요가 없다.
4. 큐를 이전에 만든 익스체인지에 바인딩한다.  
   여기서는 익스체인지가 팬아웃 유형이므로 다른 특정 옵션(예: 라우팅 키 또는 패턴)이 필요하지 않기 때문에 필터링을 수행하지 않는다.
5. 큐에서 들어오는 메시지를 수신할 수 있다.  
   타임스탬프를 키로 사용하여 수신한 모든 메시지를 LevelDB 데이터베이스에 저장하여 메시지를 날짜별로 정리한다.  
   메시지가 데이터베이스에 성공적으로 저장된 후에만 channel.ack(msg)를 사용하여 모든 메시지를 확인응답한다.  
   브로커가 ACK(확인응답)를 받지 못하면 메시지는 다시 처리될 수 있도록 대기열에 보관된다.
