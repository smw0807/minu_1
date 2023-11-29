# 11-4 CPU 바운드 작업 실행

노드에서는 비동기 함수 호출이 동시 수신되는 요청을 처리하는 애플리케이션의 기능에는 영향을 미치지 않는다.  
이는 노드의 이벤트 루프를 통해 비동기 작업을 호출하면 스택이 항상 이벤트 루프로 다시 되돌아가 다른 요청을 처리할 수 있어서 그렇다.

그러나 완료하는데 오랜 시간이 걸리고 완료될 때까지 이벤트 루프에 제어권을 돌려주지 않는 동기 작업을 실행하면 어떻게될까?  
이러한 종류의 작업을 **`CPU 바인딩`**이라고도 한다.  
주된 특징이 I/O 작업이 많지 않고 CPU 사용률이 높기 때문이다.

## 11-4-1 부분집합 합계 만들기

```jsx
//subsetSum.js
import { EventEmitter } from 'events';

export class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
    this.totalSubsets = 0;
  }

  _combine(set, subset) {
    for (let i = 0; i < set.length; i++) {
      const newSubset = subset.concat(set[i]);
      this._combine(set.slice(i + 1), newSubset);
      this._processSubset(newSubset);
    }
  }

  _processSubset(subset) {
    console.log('Subset', ++this.totalSubsets, subset);
    const res = subset.reduce((prev, item) => prev + item, 0);
    if (res === this.sum) {
      this.emit('match', subset);
    }
  }

  start() {
    this._combine(this.set, []);
    this.emit('end');
  }
}
```

동기 실행으로 테스트해볼 소스로 부분집합 합계에 대한 소스이다.  
입력의 크기에 따라 계산 비용이 기하급수적으로 증가하는 알고리즘이다.  
\_combine() 함수는 완전 동기적으로, 이벤트 루프에 제어권을 다시 부여하지 않고 가능한 모든 하위 집합을 반복적으로 생성한다.

```jsx
//index.js
import { createServer } from 'http';
import { SubsetSum } from './subsetSum.js';

createServer(async (req, res) => {
  console.log(req.url);
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/subsetSum') {
    res.writeHead(200);
    return res.end(`I'm alive!\n`);
  }
  const data = JSON.parse(url.searchParams.get('data'));
  const sum = JSON.parse(url.searchParams.get('sum'));
  res.writeHead(200);
  const subsetSum = new SubsetSum(sum, data);
  subsetSum.on('match', match => {
    res.write(`Match: ${JSON.stringify(match)}\n`);
  });
  subsetSum.on('end', () => res.end());
  subsetSum.start();
}).listen(8000, () => console.log('Server Started'));
```

간단한 http 서버를 만들어서 확인해볼 예정이다.  
서버를 실행 후 http://localhost:8000으로 접속하면 화면상에 i’m alive가 뜬다.

```bash
curl -G http://localhost:8000/subsetSum --data-urlencode "data=[116,119,101,101,-116,109,101,-105,-102,117,-115,-97,119,-116,-104,-105,115]" --data-urlencode "sum=0"
```

위 쉘스크립트를 실행하고 브라우저를 새로고침 하면 위 결과가 출력될 때까지 응답을 대기하는 상황이 발생한다.

이는 하위 집합합계 알고리즘이 완료될 때까지 마지막 요청이 중단되는 것이다.  
Node.js의 이벤트 루프는 단일 스레드에서 실행되며 이 스레드가 차단되면 단일 주기조차 실행할 수 없다.  
이 동작은 여러 요청을 처리하는 모든 종류의 애플리케이션에서 작동하지 않는 다는 것을 알아야 한다.
그래서 Node.js에서는 이러한 유형의 상황을 해결하기 위한 여러 가지 방법을 제공한다.
가장 인기있는 세 가지 방법은 다음과 같다.

- setImmediate를 사용한 인터리빙
- 외부 프로세스 사용
- 작업자 스레드 사용
