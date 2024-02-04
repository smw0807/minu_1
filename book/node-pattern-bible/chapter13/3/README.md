https://smw0807.notion.site/Task-distribution-b0a806e3bdca4d869c4dd5f70fc3856e?pvs=4

# 13-3 작업 배포(Task distribution) 패턴

11장에서 비용이 많이 드는 작업을 여러 로컬 프로세스에 위임하는 방법을 배웠었다.  
이는 효과적인 접근 방식이었지만 단일 머신의 한계를 넘어 확장할 수 없다.  
13장에서는 네트워크의 모든 곳에 위치한 원격 작업자를 사용하여 분산형 아키텍처에서 유사한 패턴을 어떻게 사용할 수 있는지 알아본다.

이 개념은 여러 컴퓨터에 작업을 분산시킬 수 있는 메시징 패턴을 갖는 것이다.  
이러한 작업은 개별 작업 청크 또는 분할 정복(divide and conquer) 접근 방식을 사용하는 더큰 작업 분할의 일부일 수 있다.

![일련의 소비자들에게 작업 분배](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/83fc60df-3353-4e47-b0db-0decab0b604f/Untitled.png)

일련의 소비자들에게 작업 분배

pub/sub 패턴은 위 다이어그램과 같은 유형의 애플리케이션에 적합하지 않다.  
여러 작업자가 작업을 받는 것을 원치 않기 때문이다.  
대신 필요한 것은 각 메시지를 다른 소비자(이 경우 작업자(worker)라고도함)에게 전달하는 로드 밸런서와 유사한 메시지 배포 패턴이다.  
메시징 시스템 용어에서 이 패턴은 “**경쟁 소비자**”, “**팬아웃 배포**” 또는 “**벤틸레이터**”라고도 한다.

HTTP 로드 밸런서와 한가지 중요한 차이점은 소비자가 더 적극적인 역할을 한다는 것이다.  
대부분의 경우 생산자가 소비자에게 연결하는 것이 아니라, 새 작업을 받기 위해 작업 생산자 또는 작업 대기열에 소비자 자신이 연결을 한다.  
이는 생산자를 수정하거나 서비스 레지스트리를 채택하지 않고도 작업자 수를 원활하게 늘릴 수 있기 때문에, 확장 가능한 시스템에서 큰 이점이 있다.

또한, 일반 메시징 시스템에서는 생산자와 작업자 사이에 요청/응답 통신이 반드시 필요한 것은 아니다.  
대신, 대부분의 경우 선호되는 접근 방식은 단방향 비동기 통신을 사용하는 것이므로 더 나은 병렬 처리 및 확장이 가능하다.  
이러한 아키텍처에서 메시지는 잠재적으로 항상 한 방향으로 이동하여 다음 다이어그램과 같이 **파이프라인**을 생성할 수 있다.

![메시징 파이프라인](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/a71906cb-d38f-4df5-92dd-47c42270be97/Untitled.png)

메시징 파이프라인

파이프라인을 사용하면 동기식 요청/응답 통신의 오버헤드 없이 매우 복잡한 처리의 아키텍처를 구축할 수 있으므로 지연시간을 줄이고 처리량이 높아진다.  
위 그림에서는 메시지가 작업자 집합(팬아웃)에 분산되고 다른 처리 장치로 전달된 다음 일반적으로 **싱크**(sink)라고 하는 단일 노드로 수집되는 방식을 볼 수 있다.

<aside>
💡 파이프라인과 태스크 분배 패턴의 조합을 병렬 파이프라인이라고도 한다.

</aside>

## 13-3-1 ZeroMQ Fanout/Fanin 패턴

ZeroMQ의 일부 기능을 사용하여 P2P 분산 아키텍처를 구현했었었다.  
PUB, SUB 소켓을 사용하여 단일 메시지를 여러 소비자에게 배포하는 것도 했었었다.  
이제는 PUSH, PULL이라는 소켓을 사용하여 병렬 파이프라인을 구축하는 방법을 살펴볼 것이다.

### PUSH/PULL 소켓

PUSH 소켓은 메시지를 보내기 위해 만들어졌고, PULL 소켓은 받기 위해 만들어졌다.  
사소한 조합으로 보일 수 있지만 단방향 통신 시스템을 구축하는데 몇 가지의 추가 기능이 존재한다.

- 둘 다 연결모드 또는 바인드 모드에서 작동할 수 있다.  
  PUSH 소켓을 생성하고 로컬 포트에 바인딩한 후 PULL 소켓에서 들어오는 연결을 수신하거나,  
  그 반대로 하여 PULL 소켓이 PUSH 소켓에서 들어오는 연결을 수신할 수 있다.  
  메시지는 항상 PUSH에서 PULL로(동일한 방향으로) 이동하며, 다를 수 있는 것은 누가 연결을 초기화하는가 뿐이다.  
  바인드 모드는 작업 생산자 및 싱크(sink)와 같은 내구성이 있어야 하는 노드에 가장 적합하며,  
  연결 모드는 작업자와 같은 임시 노드에 적합하다.  
  이를 통해 더 안정적이고 내구성이 있어야 하는 노드에 영향을 주지 않고 임시 노드의 수를 임의로 변경할 수 있다.
- 단일 PUSH 소켓에서 여러 개의 PULL 소켓이 연결된 경우 메시지는 모든 PULL 소켓에 고르게 분배된다.  
  실제로 로드 밸런싱이 된다.(피어 투 피어 로드 밸런싱)  
  여러 PUSH 소켓에서 메시지를 수신하는 PULL 소켓은 공정 대기열 시스템을 사용하여 메시지를 처리한다.  
  즉, 모든 소스(인바운드 메시지에 적용되는 라운드로빈)에서 균등하게 사용된다.
- 연결된 PULL 소켓이 없는 PUSH 소켓을 통해 전송된 메시지는 손실되지 않는다.  
  대신 노드가 온라인 상태가 되어 메시지를 가져가기를 시작할 때까지 대기열에 추가된다.

### ZeroMQ로 분산 해시썸(hashsum) 크래커(cracker) 만들기

해시썸 크래커란, 무차별 대입 방식을 사용하여 주어진 알파벳의 모든 가능한 일련의 변형들에서 해시썸(MD5 또는 SHA1)을 구하면서 주어진 해시썸이 생성된 원래의 문자열을 찾는 시스템이다.

해시썸 크래커 애플리케이션을 만들거고, 다음과 같은 일반적인 병렬 파이프란인을 구현하려고 한다.

- 작업을 생성하고 여러 작업자에게 배포하는 노드
- 다중 작업자 노드(실제 계산이 발생하는 위치)
- 모든 결과를 수집하는 노드

![ZeroMQ를 사용한 일반적인 파이프라인의 아키텍처](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/0c565b8a-0b0e-497d-bdba-c3fff32f36f5/Untitled.png)

ZeroMQ를 사용한 일반적인 파이프라인의 아키텍처

벤틸레이터가 주어진 알파벳의 문자 변형 간격을 생성한다.  
(예: aa에서 bb까지의 문자 간격에는 aa, ab, ba, bb 변형이 포함된다.)  
그 간격을 작업으로 작업자에게 분배한다.  
각 작업자는 주어진 간격의 모든 변형에 대한 해시썸을 계산하여 입력으로 제공된 해시썸과 각 결과 해시썸의 일치 여부를 판단한다.  
일치하는 항목이 있으면, 결과가 결과 수집기 노드(싱크)로 전송된다.

이 아키텍처에서 내구성있는 노드(영구 노드)는 벤틸레이터와 싱크이고 일시적인 노드는 작업자가 된다.  
각 작업자는 PULL 소켓을 벤틸레이터에 연결하고 PUSH 소켓을 싱크에 연결하면, 벤틸레이터나 싱크에서 매개 변수를 변경하지 않고도 원하는 만큼의 작업자를 시작하고 중지할 수 있다.

### 생산자 구간

변동 구간을 표현하기 위해 색인화된 N-ary(n항) 트리를 사용할 것이다.  
n-ary 트리의 주어진 색인에 대한 변형을 계산하는 데 도움을 주는 indexed-string-variation 패키지를 활용한다.  
이 작업은 작업자에서 수행되므로 벤틸레이터에서 해야 할 일은 작업자에게 제공할 인덱스 범위를 생성하는 것이다.  
그러면 해당 범위로 표시되는 모든 문자들의 변형이 만들어진다.

```jsx
//generateTask.js
export function* generateTasks(searchHash, alphabet, maxWordLength, batchSzie) {
  let nVariations = 0;
  for (let n = 1; n <= maxWordLength; n++) {
    nVariations += Math.pow(alphabet.length, n);
  }
  console.log(`Finding the hashsum source string over ${nVariations} possible variations`);

  let batchStart = 1;
  while (batchStart <= nVariations) {
    const batchEnd = Math.min(batchStart + batchSzie - 1, nVariations);
    yield {
      searchHash,
      alphabet: alphabet,
      batchStart,
      batchEnd,
    };

    batchStart = batchEnd + 1;
  }
}
```

generateTasks()는 1부터 시작하여 batchSzie 크기의 정수 간격을 생성한다.(빈 변형에 해당하는 트리의 루트인 0은 제외)  
주어진 알파벳과 제공된 최대 단어 길이(maxLength)에 대해 가능한 가장 큰 인덱스(nVariations)에서 끝난다.  
그런 다음 작업에 대한 모든 데이터를 객체에 담아 호출자에게 전달한다(yield).

아래는 모든 작업자에 작업을 배포하는 생상자의 로직(producer.js)을 구현한 코드이다.

```jsx
//producer.js
import zmq from 'zeromq';
import delay from 'delay';
import { generateTasks } from './generateTask.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;

const [, , maxLength, searchHash] = process.argv;

async function main() {
  const ventilator = new zmq.Push(); //1
  await ventilator.bind('tcp://*:5016');
  await delay(1000);
  const generatorObj = generateTasks(searchHash, ALPHABET, maxLength, BATCH_SIZE);
  for (const task of generatorObj) {
    await ventilator.send(JSON.stringify(task)); //2
  }
}

main().catch(err => console.error(err));
```

작업자에게 작업을 배포하는 방법

1. PUSH 소켓을 만들고 작업자의 PULL 소켓이 작업을 수신하기 위해 연결되는 로컬 포트 5016에 바인딩 한다.  
   모든 작업자가 연결될 때까지 1초를 대기한다.  
   작업자가 이미 실행 중인 동안 생산자가 시작되면 작업자가 타임 기반 재연결 알고리즘으로 인해 잠시 후에 연결할 수 있기 때문인데, 이렇게 되면 첫 번째 연결 작업자가 대부분의 작업을 받아갈 수 있다.
2. 생성된 각 작업에 대해 문자열을 지정하고 ventilator 소켓의 send() 함수를 사용하여 작업자에게 보낸다.  
   연결된 각 작업자는 라운드로빈 방식으로 다른 작업을 받게 된다.

### 작업자 구현

아래 코드는 작업자의 역할을 하며, 먼저 들어오는 작업을 처리하는 컴포넌트이다.

```jsx
//processTask.js
import isv from 'indexed-string-variation';
import { createHash } from 'crypto';

export function processTask(task) {
  const variationGen = isv(task.alphabet);
  console.log(
    'Processing from ' +
      `${variationGen(task.batchStart)} (${task.batchStart}) ` +
      `to ${variationGen(task.batchEnd)} (${task.batchEnd})`
  );

  for (let idx = task.batchStart; idx <= task.batchEnd; idx++) {
    const word = variationGen(idx);
    const shasum = createHash('sha1');
    shasum.update(word);
    const digest = shasum.digest('hex');

    if (digest === task.searchHash) {
      return word;
    }
  }
}
```

주어진 범위에서 반복한 다음 각 인덱스에 해당하는 변형 문자들(word)를 생성한다.  
다음으로 word에 대한 SHA1 체크섬을 계산하고 task로 전달된 searchHash와 일치 여부를 검사한다.  
두 다이제스트가 일치하면 소스 word를 호출자에게 반환한다.

아래는 작업자의 기본 로직을 구현한 소스코드이다.

```jsx
//worker.js
import zmq from 'zeromq';
import { processTask } from './processTask.js';

async function main() {
  const fromVentilator = new zmq.Pull();
  const toSink = new zmq.Push();

  //변형 생상자 벤틸레이터 연결
  fromVentilator.connect('tcp://localhost:5016');
  //결과 수집자 싱크 연결
  toSink.connect('tcp://localhost:5017');

  for await (const rawMessage of fromVentilator) {
    const found = processTask(JSON.parse(rawMessage.toString()));
    if (found) {
      console.log(`Found! -> ${found}`);
      await toSink.send(`Found: ${found}`);
    }
  }
}

main().catch(err => console.error(err));
```

작업자는 일시적인 노드를 나타내므로 소켓은 들어오는 연결을 수신하는 대신 원격 노드에 연결해야 한다.  
위 코드에선 두 개의 소켓을 만드는데 이것이 작업자에서 할 일이다.

- 작업을 받기 위해 벤틸레이터에 연결되는 PULL 소켓
- 결과를 전파하기 위해 싱크에 연결되는 PUSH 소켓

이 외에도 작업자가 수행하는 작업은 매우 간단하다.  
수신된 모든 작업을 처리하고 일치하는 항목이 발견되면 toSink 소켓을 통해 결과 수집기에 메시지를 보낸다.

### 결과 수집기 구현

결과 수집기(싱크)는 작업자에서 수신한 메시지를 콘솔에 간단히 출력한다.

```jsx
//collector.js
import zmq from 'zeromq';
import { processTask } from './processTask';

async function main() {
  const sink = new zmq.Pull();
  await sink.bind('tcp//*5017');

  for await (const rawMessage of sink) {
    console.log('Message from worker: ', rawMessage.toString());
  }
}

main().catch(err => console.log(err));
```

결과 수집기(생산자)는 영구 노드이므로 작업자의 PUSH 소켓에 명시적으로 바인딩하는 대신 PULL 소켓을 바인딩 한다.