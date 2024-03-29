https://smw0807.notion.site/Request-Reply-0d930e2e497a411cb9e7db5f2001a7b6?pvs=4

# 13-4 요청(Request)/응답(Reply) 패턴

단방향 통신은 병렬성과 효율성 측면에서 큰 이점을 제공할 수 있지만, 이것 만으로는 모든 통합 및 통신 문제를 해결할 수 없다.  
때로는 오래된 요청-응답 패턴이 작업을 위한 완벽한 도구일 수가 있다.  
그러나 우리가 가진 모든 것이 비동기 단방향 채널인 상황일 수 있다.  
따라서 단방향 채널에서 요청-응답 방식으로 메시지를 교환할 수 있는 추상화를 만드는데 필요한 다양한 패턴과 접근 방식을 알아야 할 필요가 있다.

## 13-4-1 상관 식별자

첫 번째 요청-응답 패턴은 **상관 식별자(Correlation Identifier)**이다.  
단방향 채널 위에 요청-응답의 추상화를 만들기 위한 기본 블럭을 말한다.

이 패턴은 각 요청을 식별자로 표시하고, 수신자에 의해 응답(response)에 첨부된다.  
이렇게 하면 요청 전송자가 두 메시지를 상호 연결하고 응답을 적절한 처리자(handler)에게 반환할 수 있다.  
이는 단방향 비동기 채널의 맥락에서 메시지가 언제든지 어느 방향으로든 이동해야 하는 문제를 자연스럽게 해결한다.

![상관 식별자를 사용한 요청-응답 메시지 교환](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/7e813547-0b97-44ef-99fb-d06ea9e2d3fb/Untitled.png)

상관 식별자를 사용한 요청-응답 메시지 교환

위 그림의 시나리오는 상관관계 ID를 사용하여 각 응답이 다른 순서로 전송되고 수신되는 경우에도 각 응답을 적절한 요청과 매칭시키는 방법을 보여준다.

### 상관관계 식별자를 사용하여 요청-응답의 추상화 구현

가장 간단한 유형의 단방향 채널을 선택하여 예제 작업을 시작할 것이다.  
지금 살펴볼 채널은 점대점(시스템의 두 노드를 직접 연결)이면서 전이중(fully duplex, 메시지가 양방향으로 이동 가능)이다.

이 채널의 간단한 부류를 예를 들면 WebSocket을 들 수 있다.  
WebSocket은 서버와 브라우저 사이에 점대점 연결을 설정하고 메시지가 모든 방향으로 이동할 수 있다.  
또 다른 예는 child_process.fork()를 사용하여 자식 프로세스가 생성될 때 생성되는 통신 채널이다.  
이 채널 역시 부모를 자식 프로세스와만 연결하고 메시지를 모든 방향으로 이동할 수 있기 때문에 비동기식, 점대점 및 전이중 방식이다.

부모 프로세스와 자식 프로세스 사이에 생성된 채널을 감싸기 위한 추상화를 만들것인데,  
이 추상화는 각 요청을 상관 식별자로 자동 표시한 다음, 응답을 대기중인 요청 핸들러 목록에서 수신한 응답 ID로 매칭시켜 요청-응답의 통신 채널을 제공해야 한다.

부모 프로세스는 child.send(message)를 사용하여 자식에게 메시지를 보낼 수 있고,  
child.on(’message’, callback) 이벤트 핸들러를 사용하여 메시지를 받을 수 있다.

자식 프로세스는 process.send(message)를 사용하여 부모 프로세스에 메시지를 보내고,  
process.on(’message’, callback)을 사용하여 메시지를 받을 수 있다.

이것은 부모 프로세스에서 사용 가능한 인터페이스 채널이 자식에서 사용 가능한 것과 동일하다는 것을 의미한다.  
이를 통해 채널의 양쪽 끝에서 사용할 수 있는 공통의 추상화를 만들 수 있다.

### 요청(request)의 추상화

새로운 요청을 보내는 부분을 고려하여, 그 추상화를 구현해본다.

```jsx
//createRequestChannel.js
import { nanoid } from 'nanoid';

// 1
export function createRequestChannel(channel) {
  const correlationMap = new Map();

  // 2
  function sendRequest(data) {
    console.log('Sending request', data);
    return new Promise((resolve, reject) => {
      const correlationId = nanoid();
      console.log('correlationId', correlationId);

      const replyTimeout = setTimeout(() => {
        correlationMap.delete(correlationId);
        reject(new Error('Request timeout'));
      }, 10000);

      correlationMap.set(correlationId, replyData => {
        correlationMap.delete(correlationId);
        clearTimeout(replyTimeout);
        resolve(replyData);
      });

      channel.send({
        type: 'request',
        data,
        id: correlationId,
      });
    });
  }

  // 3
  channel.on('message', message => {
    const callback = correlationMap.get(message.inReplyTo);
    if (callback) {
      callback(message.data);
    }
  });

  return sendRequest;
}
```

요청의 추상화가 동작하는 방식은 다음과 같다.

1. createRequestChannel()은 입력 채널을 감싸서 요청을 보내고 응답을 받는데 사용되는 sendRequest() 함수를 반환하는 팩토리이다.  
   이 패턴의 비밀은 나가는 요청과 응답 핸들러 간의 연관성을 저장하는 correlationMap 변수에 있다.
2. sendRequest() 함수는 새 요청을 보내는데 사용된다.  
   nanoid를 사용하여 상관 ID(상관 식별자)를 생성하고 메시지의 유형(type)을 지정할 수 있는 객체로 감싼다.  
   그런 다음 상관 ID 및 응답 데이터를 호출자에게 리턴하는 핸들러가 correlationMap에 추가되어 나중에 상관 ID로 핸들러를 검색할 수 있게 된다.  
   또한 매우 간단한 요청 타임아웃을 처리하는 로직이 구현되어 있다.
3. 팩토리가 호출될 때 수신된 메시지에 대한 리스닝도 시작한다.  
   상관 ID(inReplyTo 속성에 포함된)가 correlationMap에 포함된 ID와 일치하면 방금 응답받았음을 알 수 있으므로 연결된 응답 핸들러에 대한 참조를 가져와서 메시지에 포함된 데이터로 핸들러를 실행한다.

### 응답 추상화

요청 채널(request channel)의 상대편인 응답 채널(reply channel)이 어떻게 작동하는지 살펴보자.  
응답 핸들러를 감싸기 위한 추상화가 구현될 것이다.

```jsx
//createReplyChannel.js
export function createReplyChannel(channel) {
  return function registerHandler(handler) {
    channel.on('mmesage', async message => {
      if (message.type !== 'request') {
        return;
      }
      const replyData = await handler(message.data); // 1
      // 2
      channel.send({
        type: 'response',
        data: replyData,
        inReplyTo: message.id,
      });
    });
  };
}
```

createReplyChannel() 함수는 새로운 응답 핸들러를 등록하는데 사용되는 또 다른 함수를 반환하는 팩토리이다.  
새로운 핸들러가 등록되면 다음과 같은 일이 발생한다.

1. 새 요청을 받으면 메시지에 포함된 데이터를 전달하여 즉시 핸들러를 호출한다.
2. 핸들러가 작업을 완료하고 응답을 반환하면, 응답데이터와 메시지 유형, 상관 ID(inReplyTo 속성)를 객체로 감싼 후 다시 채널에 전달한다.

모든 것이 이미 비동기이기 때문에 Node.js에서는 이 패턴을 매우 쉽게 만들 수 있다.  
단방향 채널 위에 만들어진 비동기 요청-응답 통신은 다른 비동기 작업과 크게 다르지 않다.  
특히 구현의 세부사항을 감추는 추상화를 만드는 경우에는 더욱 그렇다.

### 전체 요청-응답 주기

이제 새로운 비동기 요청-응답 추상화를 사용할 샘플 응답자(replier)를 만든다.

```jsx
//replier.js
import { createReplyChannel } from './createReplyChannel.js';

const registerReplyHandler = createReplyChannel(process);

registerReplyHandler(req => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ sum: req.a + req.b });
    }, req.delay);
  });
});

process.send('ready');
```

요청 이후 일정 시간(요청에 지정되어 있음) 후에 결과를 반환한다.  
이를 통해 응답 순서가 요청을 보낸 순사와 다를 수 있는지 확인하고, 만들어진 패턴이 동작하는지 확인할 수 있다.  
모듈의 마지막 줄은 요청을 수락할 준비가 되었음을 나타내는 메시지를 부모 프로세스로 보낸다.

마지막으로 요청자를 만든다.  
여기서는 child_process.fork()를 사용하여 응답자를 시작시키는 작업도 존재한다.

```jsx
//requestor.js
import { fork } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { once } from 'events';
import { createRequestChannel } from './createRequestChannel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const channel = fork(join(__dirname, 'replier.js')); // 1
  const request = createRequestChannel(channel);

  try {
    const [message] = await once(channel, 'message'); // 2
    console.log(`Child Process initialized: ${message}`);
    const p1 = request({ a: 1, b: 2, delay: 500 }) // 3
      .then(res => {
        console.log(`Reply: 1 + 2 = ${res.sum}`);
      });

    const p2 = request({ a: 6, b: 1, delay: 100 }) // 4
      .then(res => {
        console.log(`Reply: 6 + 1 = ${res.sum}`);
      });

    await Promise.all([p1, p2]); // 5
  } finally {
    channel.disconnect(); // 6
  }
}

main().catch(err => console.error(err));
```

요청자는 응답자(1)를 시작한 다음, 해당 참조를 createRequestChannel()에 전달한다.  
그런 다음 하위 프로세스가 사용 가능할 때까지(2) 기다렸다가 몇 가지 샘플 요청(3, 4)을 실행한다.  
마지막으로 두 요청이 완료될 때까지(5) 기다린 다음, 채널 연결을 끊고(6) 하위 프로세스가 정상적으로 종료되도록 한다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/4f3ddd28-cf07-4330-82ad-d7b7b5a8ba52/Untitled.png)

응답이 전송 또는 수신 순서와 관계 없이 해당 요청과 올바르게 연결되어 있음을 확인할 수 있다.

## 13-4-2 반환 주소(return address)

상관 식별자는 단방향 채널 위에 요청-응답 통신을 생성하기 위한 기본 패턴이다.  
그러나 메시징 아키텍처에 둘 이상의 채널 또는 대기열이 있거나, 잠재적으로 둘 이상의 요청자가 있을 수 있는 경우에는 충분하지 않다.  
이러한 상황에서는 상관 ID 외에도 응답자가 요청의 원래 보낸 요청자에게 응답을 보낼 수 있도록 하는 정보로 반환 주소도 알아야 한다.

### AMQP에 반환 주소 패턴 구현

AMQP 기반 아키텍처의 영역에서 반환 주소는 요청자가 응답의 수신을 기다리는(listening) 대기열이다.  
응답은 하나의 요청자만이 수신해야 한다.  
따라서, 대기열은 비공개로 다른 소비자 간에 공유되지 않는 것이 중요하다.  
이러한 속성에서, 우리는 요청자의 연결 범위를 지정하는 임시 대기열이 필요하며 응답자가 응답을 전달하려면 반환 대기열과 점대점 통신을 설정해야 한다는 것을 추측해 볼 수 있다.

![AMQP를 사용한 요청-응답 메시징 아키텍처](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/5501f7e5-c06d-4854-b4fa-16fdae4c8805/Untitled.png)

AMQP를 사용한 요청-응답 메시징 아키텍처

위 다이어그램은 각 요청자가 자신의 요청에 대한 응답을 처리하기 위한 자체 개인 대기열을 갖는 방법을 보여준다.  
모든 요청들은 단일 대기열로 전송된 다음 이를 응답자가 처리한다.  
응답자는 요청에 지정된 반환 주소를 사용하여 올바른 응답 대기열로 처리 결과를 라우팅 한다.  
실제로 AMQP 위에 요청-응답 패턴을 만들려면, 응답자가 응답 메시지가 전달되어야 하는 위치를 알 수 있도록 메시지 속성에 응답 대기열의 이름을 지정하기만 하면 된다.

### 요청의 추상화 구현

RabbitMQ를 브로커로 사용하여 AMQP 위에 요청-응답 추상화를 구축한다.

```jsx
//amqpRequest.js
import { nanoid } from 'nanoid';
import amqp from 'amqplib';

export class AMQPRequest {
  constructor() {
    this.correlationMap = new Map();
  }

  async initialize() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    // 1
    const { queue } = await this.channel.assertQueue('', { exclusive: true });
    this.replyQueue = queue;

    // 2
    this.channel.consume(
      this.replyQueue,
      msg => {
        const correlationId = msg.properties.correlationId;
        const handler = this.correlationMap.get(correlationId);
        if (handler) {
          handler(JSON.parse(msg.content.toString()));
        }
      },
      { noAck: true }
    );
  }

  send(queue, message) {
    return new Promise((resolve, reject) => {
      const id = nanoid(); // 3
      const replyTimeout = setTimeout(() => {
        this.correlationMap.delete(id);
        reject(new Error('Request timeout'));
      }, 10000);

      // 4
      this.correlationMap.set(id, replyData => {
        this.correlationMap.delete(id);
        clearTimeout(replyTimeout);
        resolve(replyData);
      });

      // 5
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        correlationId: id,
        replyTo: this.replyQueue,
      });
    });
  }

  destroy() {
    this.channel.close();
    this.connection.close();
  }
}
```

여기서 주의해야 할 부분은 응답을 보관하는 대기열을 만드는 방법이다(1).  
이름을 지정하지 않고, 임의의 이름이 선택된다.  
그리고 대기열은 배타적이므로 현재 활성 AMQP 연결에 바인딩되어 연결이 닫힐 때 제거된다.  
여러 대기열에 대한 라우팅 배포가 필요하지 않으므로, 대기열은 익스체인지에 바인딩할 필요가 없다.  
즉, 메시지가 응답 대기열에 직접 전달되어야 한다.  
2번 부분에서는 replyQueue 메시지를 소비하기 시작한다.  
여기서 수신 메시지의 ID를 correlationMap에 있는 ID와 일치시키고 연관된 핸들러를 호출한다.

send() 함수는 요청 대기열의 이름과 보낼 메시지를 입력으로 받는다.  
상관 ID를 생성하고(3), 이를 처리하여 호출자에게 응답으로 반환하는 핸들러(4)에 연결해야 한다.  
마지막으로, correlationId 및 replyTo 속성을 메타 데이터로 지정하여 메시지(5)를 보낸다.  
실제로 AMQP에서는 기본 메시지와 함께 소비자에게 전달할 일련의 속성(또는 메타데이터)들을 지정할 수 있다.  
메타 데이터 객체는 sendToQueue() 함수의 세 번째 인수로 전달된다.  
메시지를 보내기 위해 channel.publish() 대신 channel.sendToQueue() API를 사용하고 있다는 점에 유의해야한다.  
이는 목적지의 대기열로 바로 전달되는 기본적인 점대점(point-to-point) 통신이기 때문이다.

그리고 연결과 채널을 닫는데 사용되는 destroy() 함수를 구현한다.

### 응답 추상화 구현

```jsx
//amqpReply.js
import amqp from 'amqplib';

export class AMQPReply {
  constructor(requestsQueueName) {
    this.requestsQueueName = requestsQueueName;
  }

  async initialize() {
    const connectioon = await amqp.connect('amqp://localhost');
    this.channel = await connectioon.createChannel();
    // 1
    const { queue } = await this.channel.assertQueue(this.requestsQueueName);
    this.queue = queue;
  }

  // 2
  handleRequests(handler) {
    this.channel.consume(this.queue, async msg => {
      const content = JSON.parse(msg.content.toString());
      const replyData = await handler(content);
      // 3
      this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(replyData)), {
        correlationId: msg.properties.correlationId,
      });
      this.channel.ack(msg);
    });
  }
}
```

1. 들어오는 요청을 수신할 큐를 만든다.  
   이 목적을 위해 단순 영구 대기열(durable queue)을 사용할 수 있다.
2. handleRequest()함수는 새로운 응답을 보내기 위한 요청 핸들러를 등록하는데 사용된다.
3. channel.sendToRequeue()를 사용하여 응답을 보낸다.  
   응답을 보낼 때 메시지의 replyTo 속성(반환 주소)에 지정된 큐에 메시지를 직접 게시한다.  
   또한 응답을 수신한 요청자가 응답 메시지를 해당 요청과 매칭 시킬 수 있도록 응답에 correlationId를 설정했다.

### 요청자와 응답자의 구현

샘플 요청자와 응답자 쌍을 만들어 구현한 추상화 모듈을 사용해본다.

```jsx
//Replier.js
import { AMQPReply } from './amqpReply.js';

async function main() {
  const reply = new AMQPReply('requests_queue');
  await reply.initialize();

  reply.handleRequests(req => {
    console.log('Request received', req);
    return { sum: req.a + req.b };
  });
}

main().catch(err => console.error(err));
```

만든 추상화를 통해 상관ID와 반환 주소를 처리하는 모든 메커니즘을 숨길 수 있다는 것을 확인할 수 있다.  
해야 할 일은 요청받을 대기열의 이름(’requests_queue’)을 지정하여 새로운 reply 객체를 초기화한다.  
이 샘플 응답자는 입력으로 받은 두 숫자의 합을 간단히 계산하고 결과를 객체로 반환한다.

아래는 샘플 요청자에 대한 코드이다.

```jsx
//requestor.js
import { AMQPRequest } from './amqpRequest.js';
import delay from 'delay';

async function main() {
  const request = new AMQPRequest();
  await request.initialize();

  async function sendRandomRequest() {
    const a = Math.round(Math.random() * 100);
    const b = Math.round(Math.random() * 100);
    const reply = await request.send('requests_queue', { a, b });
    console.log(`${a} + ${b} = ${reply.sum}`);
  }

  for (let i = 0; i < 20; i++) {
    await sendRandomRequest();
    await delay(1000);
  }

  request.destroy();
}

main().catch(err => console.error(err));
```

샘플 요청자는 1초 간격으로 20개의 임의의 요청을 requests_queue 대기열에 보낸다.  
이 경우에도 추상화가 완벽하게 작동하여 비동기 요청-응답 패턴의 구현 뒤에 있는 모든 세부 사항을 신경쓸 필요가 없다는 것을 알 수 있다.

AMQP를 사용하면 응답자가 즉시 확장 가능하다는 점이 좋은 기능이기도 하다.  
두 개 이상의 응답자 인스턴스를 시작하면 요청 간에 부하가 분산되는 것을 볼 수 있다.  
이는 요청자가 시작할 때마다 동일한 영구 대기열에 자신을 리스너로 추가함으로써 결과적으로 브로커가 큐의 모든 소비자에 걸쳐 메시지를 로드 밸런싱하기 때문에 가능하다.
