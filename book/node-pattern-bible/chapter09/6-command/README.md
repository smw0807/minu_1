# 6-6 명령 패턴

Node.js에서 매우 중요한 또 하나의 디자인 패턴은 명령(Cammand) 패턴이다.  
가장 일반적인 정의로는 실행에 필요한 모든 정보들을 캡슐화하고 이렇게 만든 모든 객체를 명령이라고 할 수 있다.  
따라서 함수나 기능을 직접적으로 호출하는 대신 이러한 호출을 수행하려는 의도를 나타내는 객체를 만든다.  
그런 다음 의도를 구체화하여 실제 작업으로 변환하는 것은 다른 컴포넌트가 담당한다.

![명령 패턴의 컴포넌트들](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/2b862937-3d99-447d-9792-ca6a7235199e/Untitled.png)

명령 패턴의 컴포넌트들

- 명령(Command) : 함수 또는 함수를 호출하는데 필요한 정보를 캡슐화하는 객체
- 클라이언트(Client) : 명령을 생성하고 호출자(Invoker)에게 제공하는 컴포넌트
- 호출자(Invoker) : 대상(target)에서 명령의 실행을 담당하는 컴포넌트
- 대상(Target) : 호출의 주제이다. 단일한 함수거나 객체의 멤버 함수일 수 있다.

이 네 가지 컴포넌트는 패턴을 구현하려는 방식에 따라 크게 달라질 수 있다.  
작업을 직접 실행하는 대신 명령 패턴을 사용하는 여러 애플리케이션들이 있다.

- 명령은 나중에 실행하도록 예약할 수 있다.
- 명령은 쉽게 직렬화하여 네트워크를 통해 전송할 수 있다.  
  이 간단한 속성을 통해 원격 시스템에 작업을 배포하고, 브라우저에서 서버로 명령을 전송하고, **RPC(Remote Procedure Call, 원격 프로시저 호출)** 시스템을 만드는 등의 작업을 수행할 수 있다.
- 명령을 사용하면 시스템에서 실행된 모든 작업의 기록을 쉽게 유지할 수 있다.
- 명령은 데이터를 동기화하고 충돌을 해결하기 위한 몇몇 알고리즘에서 중요한 부분이다.
- 실행 예약된 명령은 아직 실행되지 않은 경우 취소시킬 수 있다.  
  명령이 실행되기 전의 시점으로 애플리케이션의 상태를 가져와서 되돌릴 수도 있다.(취소)
- 여러 명령을 함께 그룹화할 수 있다.  
  이는 원자적 트랜잭션을 생성하거나, 그룹의 모든 작업을 한번에 실행하는 메커니즘을 구현하는데 사용할 수 있다.
- 중복제거, 결합 및 분할 같은 일련의 명령에 대해 다양한 종류의 변환을 수행하거나, 텍스트 편집 협업과 같이 오늘날 대부분의 실시간 협업 소프트웨어 기반인 OP(Operational transformation)와 같은 더 복잡한 알고리즘을 적용할 수 있다.

네트워킹 및 비동기 실행이 핵심적인 동작인 Node.js와 같은 플랫폼에서 이 패턴이 얼마나 중요한지 명확하게 보여준다.

## 9-6-1 작업(Task) 패턴

명령 패턴읜 가장 기본적이고 사소한 구현인 **작업 패턴**부터 시작할 수 있다.  
JavaScript에서 호출을 나타내는 객체를 만드는 가장 쉬운 방법은 함수 주위에 클로저를 만들거나 **함수를 바인드**하는 것이다.

```tsx
function createTask(target, ...args) {
  return () => {
    target(...args);
  };
}

function run(name, age) {
  console.log(`My name is ${name} and ${age} years old.`);
}
const 클로저 = createTask(run, 'minwoo', '32');
클로저();

console.log('---------');

const 바인드 = run.bind(null, 'minwoo', '32');
바인드();
```

이 기술을 사용하면 별도의 컴포넌트를 통해 작업 실행을 제어하고 예약할 수 있다.  
이는 본질적으로 명령 패턴의 호출자(Invoker)와 동일하다.

## 9-6-2 좀더 복잡한 명령

실행 취소 및 직렬화를 지원하려고 한다.  
트위터와 유사한 서비스에 상태 업데이트를 전송하는 작은 객체인 명령의 ‘대상(target)’ 객체부터 만들어볼 것이다.  
단순화를 위해 연동이 필요한 서비스는 목업(mockup)을 사용

```tsx
//statusUpdateService.js
const statusUpdates = new Map();

// 대상(target)
export const statusUpdateService = {
  postUpdate(status) {
    const id = Math.floor(Math.random() * 1000000);
    statusUpdates.set(id, status);
    console.log(`Status posted: ${status} and id : ${id}`);
    return id;
  },

  destroyUpldate(id) {
    statusUpdates.delete(id);
    console.log(`Status removed: ${id}`);
  },
};
```

이 코드는 명령 패턴의 ‘대상(target)’을 나타낸다.  
아래는 새로운 상태로 업데이트하여 게시하도록 하는 명령의 생성하기 위한 팩토리 함수를 구현한 것이다.

```tsx
//createPostStatusCmd.js
export function createPostStatusCmd(service, status) {
  let postId = null;

  // 명령(command)
  return {
    run() {
      postId = serivce.postUpdate(status);
    },
    undo() {
      if (postId) {
        service.destroyUpdate(postId);
        postId = null;
      }
    },
    serialize() {
      return {
        type: 'status',
        action: 'post',
        status: status,
      };
    },
  };
}
```

이 함수는 POST로 최신의 상태를 전달한다는 의도를 모델링한 명령(Command)을 생성하는 팩토리 이다.  
각 명령은 다음 세 가지 기능을 구현한다.

- 호출 시 작업을 시작시키는 run() 함수.  
  9-6-1에서 만들었던 작업(Task) 패턴을 구현한다.  
  명령이 실행되면 대상 서비스의 함수를 사용하여 새로운 상태로 상태를 갱신한다.
- 실행 후 작업을 취소하는 undo() 함수.  
  이 경우 단순히 대상 서비스에서 destroyUpdate() 함수를 호출한다.
- 동일한 명령 객체를 다시 만드는데 필요한 모든 정보를 담고 있는 JSON 객체를 만들기 위한 serialize() 함수

아래는 호출자를 만든 코드이다.  
생성자와 run() 함수(invoker.js)를 구현한다.

```tsx
//invoker.js
// 호출자(invoker)
export class Invoker {
  constructor() {
    this.history = [];
  }

  run(cmd) {
    this.history.push(cmd);
    cmd.run();
    console.log('Command executed', cmd.serialize());
  }
}
```

run() 함수는 호출자의 기본 기능이다.  
명령을 history 인스턴스 변수에 저장한 다음 명령 자체를 실행시키는 역할을 한다.

```tsx
delay(cmd, delay) {
  setTimeout(() => {
    console.log(`Executing delayed command`, cmd.serialize());
    this.run(cmd);
  }, delay)
}
```

명령 실행을 지연시키는 함수

```tsx
undo() {
  const cmd = this.history.pop();
  cmd.undo();
  console.log('Command undone', cmd.serialize());
}
```

명령을 되돌리는 undo() 함수

마지막으로 웹 서비스를 사용하여 직렬화한 다음 네트워크를 통해 전송하여 원격 서버에서 명령을 실행하도록 할 수도 있다.

```tsx
async runRemotely(cmd) {
  await superagent.post('http://localhost:3000/cmd').send({ json: cmd.serialize() });
  console.log('Command executed remotely', cmd.serialize());
}
```

아래는 클라이언트 코드이다. 필요한 모든 종속성을 가져오고 호출자를 인스턴스화하여 시작한다.

```tsx
// client.js
import { createPostStatusCmd } from './createPostStatusCmd.js';
import { statusUpdateService } from './statusUpdateService.js';
import { Invoker } from './invoker.js';

const invoker = new Invoker();
// 상태 메세지 게시를 나타내는 명령 만들기
const command = createPostStatusCmd(statusUpdateService, 'HI!');
// 명령 실행
invoker.run(command);
// 명령 취소 및 이전 상태로 되돌림
invoker.undo();
// 3초 후 메세지를 보내도록 예약
invoker.delay(command, 1000 * 3);
// 작업을 다른 컴퓨터로 마이그레이션하여 애플리케이션의 부하를 분산
invoker.runRemotely(command);
```

여기까지가 명령으로 작업을 감싸는 것으로 어떤 작업이 가능한지 보여준다.

반드시 필요한 경우에만 완벽한 명령 패턴을 사용해야 한다는 점에 주의해야 한다.  
위 코드를 보면 statusUpdateService의 함수를 호출하기 위해 많은 코드가 작성되었다.  
필요한 것이 단지 호출뿐이라면 복잡한 명령은 불필요한 노력을 동반하게 될 것이다.  
그러나 작업 실행을 예약해야 하거나, 비동기 작업을 실행해야 하는 경우 간단한 작업(Task) 패턴이 최상의 절충안을 제공한다.  
대신 실행 취소, 변환, 충돌 해결 또는 앞서 설명한 다른 사용 사례 중 하나와 같은 고급 기능이 필요한 경우라면, 좀더 복잡한 명령 패턴을 사용하는 것이 필요하다.
