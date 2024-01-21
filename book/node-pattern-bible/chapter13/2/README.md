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
