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
