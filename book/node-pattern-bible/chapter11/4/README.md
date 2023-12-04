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

## 11-4-2 setImmediate를 사용한 인터리빙

일반적으로 CPU 바인딩 알고리즘은 일련의 단계를 기반으로 한다.  
이것은 일련의 **재귀 호출**, **루프** 또는 이들의 변형이거나 조합일 수 있다.  
문제에 대한 간단한 해결책은 이러한 각 단계가 완료된 후(또는 특정 횟수 후에) 이벤트 루프에 제어권을 되돌리는 것이다.  
이러한 방식으로 보류 중인 I/O는 장기 실행 알고리즘이 CPU를 되돌려주는 간격으로 이벤트 루프에 의해 계속 처리될 수 있다.  
이를 달성하는 간단한 방법은 보류중인 I/O 요청 후 실행되도록 알고리즘의 다음 단계를 예약하는 것이다.

### 부분집합 합계 알고리즘의 단계 인터리빙

```jsx
import { EventEmitter } from 'events';

export class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
    this.totalSubsets = 0;
  }

  _combineInterleaved(set, subset) {
    this.runningCombine++;
    setImmediate(() => {
      this._combine(set, subset);
      if (--this.runningCombine === 0) {
        this.emit('end');
      }
    });
  }

  _combine(set, subset) {
    for (let i = 0; i < set.length; i++) {
      const newSubset = subset.concat(set[i]);
      // this._combine(set.slice(i + 1), newSubset);
      this._combineInterleaved(set.slice(i + 1), newSubset);
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
    // this._combine(this.set, []);
    this.runningCombine = 0;
    this._combineInterleaved(this.set, []);
    // this.emit('end');
  }
}
```

\_combine()에 대한 호출을 \_combineInterleaved()에 대한 호출로 대체하여 비동기로 처리된다.

### 인터리빙 방식에 대한 고려 사항

보류중인 I/O 후에 실행될 알고리즘의 다음 단계를 예약하려면 setImmediate()를 사용하면 된다.  
그러나 이것은 효율성 측면에서 최선의 방법은 아니다.  
실제로 작업을 연기하면 알고리즘이 실행해야 하는 모든 단계가 곱해진 작은 오버헤드가 전체 실행 시간에 상당한 영향을 미칠 수 있다.  
이것은 일반적으로 CPU 바운드 작업을 실행할 때 가장 원치 않는 것이다.  
(매 단 계마다 사용하는 대신 특정 수의 단계 후에만 사용하는 방법도 있지만 문제의 근원은 해결되지 않는다.)

또한 이 기술은 각 단계를 실행하는데 오랜 시간이 걸리면 잘 작동하지 않는다.  
이 경우 실제로 이벤트 루프는 응답성을 잃고 전체 애플리케이션이 지역되기 시작하므로 실제 환경에서는 바람직하지 않다.

이 기술은 동기 작업이 산발적으로 실행되고, 실행하는데 너무 오래 걸리지 않는 특정 상황에서 사용하여 실행을 인터리브하는 것이 이벤트 루프를 차단하지 않는 가장 간단하고 효과적인 방법이다.

## 11-4-3 외부 프로세스 사용

이벤트 루프가 차단되는 것을 방지하는 또 다른 패턴으로 `**자식 프로세스**`를 사용하는 방법이 있다.  
Node.js가 웹 서버와 같은 I/O 집약적인 애플리케이션을 실행할 때 비동기 아키텍처 덕분에 리소스 활용도를 최적화할 수 있어 최상의 성능을 제공한다.  
따라서 응용 프로그램의 응답성을 유지하는 가장 좋은 방법은 기본 애플리케이션의 컨텍스트에서 값 비싼 CPU 바인딩 작업을 실행하지 않고, 별도의 프로세스를 사용하는 것이다.  
이것이 주는 세 가지 주요 장점은 다음과 같다.

- 동기 작업은 실행 단계를 인터리브할 필요 없이 최고 속도로 실행할 수 있다.
- Node.js에서 프로세스로 작업하는 것은 간단한데, 메인 애플리케이션 자체를 확장할 필요 없이 여러 프로세서를 쉽게 사용할 수 있다.
- 실제로 최대 성능이 필요한 경우 외부 프로세스는 고성능의 오래된 C 또는 Go 혹은 Rust와 같은 최신 컴파일 언어와 같은 하위 수준 언어로 만들어질 수 있다.  
  (항상 작업에 가장 적합한 도구를 사용하자.)

Node.js에는 외부 프로세스와 상호작용하기 위한 충분한 API의 도구들이 있다.  
child_process 모듈에서 필요한 모든 것을 찾을 수 있다.

child_process.fork() 함수는 새로운 자식 Node.js 프로세스를 생성하고 자동으로 통신 채널을 생성하여 EventEmitter와 매우 유사한 인터페이스를 사용하여 정보를 교환할 수 있다.

### 부분집합 합계 작업을 외부 프로세스에 위임하기

이전에 작업했던 SubsetSum 작업을 동기 처리를 담당하는 별도의 자식 프로세스를 만들어 주 서버의 이벤트 루프가 네트워크에서 들어오는 요청을 처리할 수 있도록 할 것이다.

1. 실행 중인 프로세스 풀을 만들 수 있는 processPool.js라는 새 모듈을 만든다.  
   새 프로세스를 시작하는 데는 비용이 많이 들고 시간이 필요하므로 지속적으로 실행하고 요청을 처리할 수 있도록 하면서 시간과 CPU 주기를 절약할 수 있다.  
   풀은 동시에 실행되는 프로세스 수를 제한하여 애플리케이션이 서비스 거부(DoS) 공격에 노출되는 것을 방지하는데 도움이 된다.
2. 하위 프로세스에서 실행되는 SumFork.js라는 모듈을 만든다.  
   자식 프로세스와 통신하고 현재 애플리케이션에서 가져온 것처럼 전달한다.
3. 부분집합 합계 알고리즘을 실행하고 그 결과를 상위 프로세스로 전달하는 목표를 가진 Worker가 필요하다.

```jsx
import { fork } from 'child_process';

export class ProcessPool {
  constructor(file, poolMax) {
    this.file = file;
    this.poolMax = poolMax;
    this.pool = [];
    this.active = [];
    this.waiting = [];
  }

  acquire() {
    return new Promise((resolve, reject) => {
      let worker;
      if (this.pool.length > 0) {
        // 1
        worker = this.pool.pop();
        this.active.push(worker);
        return resolve(worker);
      }

      if (this.active.length >= this.poolMax) {
        // 2
        return this.waiting.push({ resolve, reject });
      }

      worker = fork(this.file); // 3
      worker.once('message', message => {
        if (message === 'ready') {
          this.active.push(worker);
          return resolve(worker);
        }
        worker.kill();
        reject(new Error('Improper process start'));
      });
      worker.once('exit', code => {
        console.log(`Worker exited with code ${code}`);
        this.active = this.active.filter(w => worker !== w);
        this.pool = this.pool.filter(w => worker !== w);
      });
    });
  }

  release(worker) {
    if (this.waiting.length > 0) {
      // 4
      const { resolve } = this.waiting.shift();
      return resolve(worker);
    }
    this.active = this.active.filter(w => worekr !== w); // 5
    this.pool.push(worekr);
  }
}
```

child_process 모듈에서 fork() 함수를 임포트하여 새 프로세스를 만드는데 사용한다.  
실행할 Node.js 프로그램 파일 매개 변수와 풀에서 실행할 수 있는 최대 인스턴스 수(poolMax)를 ProcessPool 생성자에 전달한다.

- this.pool : 사용할 준비가 된 실행 중인 프로세스 집합
- this.active : 현재 사용중인 프로세스 목록
- this.waiting : 사용 가능한 프로세스가 없어서, 처리할 수 없는 모든 요청들을 콜백 대기열에 넣는다.

1. pool에 사용할 준비가 된 프로세스가 있으면 이것을 active 목록에 넣은 후 resolve() 함수에 전달하여 외부 Promise를 이행하는데 사용한다.
2. pool에 사용가능한 프로세스가 없고 이미 실행중인 프로세스가 최대 프로세스 수에 도달할 경우 나중에 사용하기 위해 외부 Promise의 resolve() 및 reject() 콜백을 대기열에 추가하여 이를 수행한다.
3. 아직 최대 실행 중인 프로세스 수에 도달하지 않을 경우 child_process.fork()를 사용하여 새 프로세스를 만든다.  
   그리고 새로 시작된 프로세스로부터 ready 메세지를 기다린다.  
   이는 프로세스가 작업을 시작할 준비가 되었음을 의미한다.  
   이 메세지 기반 채널은 child_process.fork()로 시작된 모든 프로세스와 함께 자동으로 제공된다.

release() 함수는 프로세스가 완료되면 pool에 다시 넣는다.

1. 대기목록에 요청이 있는 경우, 대기열의 맨 앞에 있는 resolve() 콜백에 전달하여 release 중인 작업자를 재할당 한다.
2. release 중인 작업자를 active 목록에서 제거하고 pool에 다시 넣는다.

이제 이 프로그램은 프로세스는 중지되지 않고 재할당되므로 각 요청에서 프로세스 생성부터 다시 시작하지 않아 시간을 절약할 수 있다.  
(그러나 이게 최선의 선택은 아님. 응용 프로그램의 요구 사항에 따라 크게 달라진다는 점에 유의하자)

### 하위 프로세스와 통신

worker와 통신하고 생성된 결과를 전달하는 역할을 하는 SubsetSumFork 클래스를 구현.

```jsx
import { EventEmitter } from 'events';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ProcessPool } from './processPool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerFile = join(__dirname, 'workers', 'subsetSumProcessWorker.js');
const workers = new ProcessPool(workerFile, 2);

export class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
  }

  async start() {
    const worekr = await workers.acquire(); // 1
    worker.send({ sum: this.sum, set: this.set });

    const onMessage = msg => {
      if (msg.event === 'end') {
        // 3
        worekr.removeListener('message', onMessage);
        workers.release(worekr);
      }

      this.emit(msg.event, msg.data); // 4
    };

    worekr.on('message', onMessage); // 2
  }
}
```

subsetSumProcessWorker.js 파일을 자식 작업자로 사용하여 새 ProcessPool 객체를 생성한다는 것을 주목해야한다.

1. 풀에서 새로운 자식 프로세스를 획득한다.  
   작업이 완료되면 즉시 작업자 핸들을 사용하여 실행할 작업 데이터와 함께 메시지를 자식 프로세스에 보낸다.  
   send() API는 Node.js가 child_process.fork()로 시작된 모든 프로세스에 자동으로 제공된다.
2. 새로운 리스너를 연결하기 위해 on() 함수를 사용해서 작업 프로세스로부터 전달되는 메시지를 수신한다.
3. onMessage 리스너에서 먼저 end 이벤트를 수신했는지 확인한다.(작업이 완료 되었음을 의미)  
   수신되었을 경우 onMessage 리스너를 제거하고 worker를 해제하여 풀에 다시 담는다.
4. 작업자 프로세스는 { event, data } 형식의 메시지를 생성하여 자식 프로세스에서 생성된 모든 이벤트를 원활하게 전달(재발송)할 수 있다.

### 작업자 구현

```jsx
import { SubsetSum } from '../subsetSum.js';

process.on('message', msg => {
  // 1
  const subsetSum = new SubsetSum(msg.sum, msg.set);

  subsetSum.on('match', data => {
    // 2
    process.send({ event: 'match', data: data });
  });
  subsetSum.on('end', data => {
    process.send({ event: 'end', data: data });
  });
  subsetSum.start();
});
process.send('ready');
```

동기식으로 처리되던 SubsetSum을 이제 별도의 프로세스에서 처리하기 때문에 더 이상 이벤트 루프를 차단하는 것에 대해 걱정할 필요가 없다.  
모든 HTTP 요청은 중단 없이 메인 애플리케이션의 이벤트 루프에서 계속 처리된다.  
작업자가 자식 프로세스로 시작되면 다음과 같은 일이 발생한다.

1. 부모 프로세스에서 오는 메시지 수신을 즉시 시작한다.  
   메시지가 수신되는 즉시 SubsetSum 클래스의 새로운 인스턴스를 만들고 match 및 end 이벤트에 대한 리스너를 등록한다.  
   끝으로 subSetSum.start()로 계산을 시작한다.
2. 실행중인 알고리즘에서 이벤트가 수신될 때마다 { event, data } 형식의 객체로 감싸서 상위 프로세르로 전달한다.  
   이 메시지는 subsetSumFork.js 모듈에서 처리된다.

## 11-4-4 작업자 스레드(worker threads) 사용

Node 10.5.0에 추가된 작업자 스레드는 메인 이벤트 루프 외부에서 CPU 집약적인 알고리즘을 실행할 수 있는 새로운 메커니즘이다.  
작업자 스레드는 몇 가지 추가 기능이 있는 child_process.fork()에 대한 가벼운 대안으로 볼 수 있다.

작업자 스레드는 기본 프로세스 내에서 실행되지만 다른 스레드 내에서 실행되기 때문에 메모리 공간이 더 작고 시간이 빠른다.  
하지만, 실제 스레드를 기반으로 하지만 Java 또는 Python과 같은 다른 언어에서 지원하는 심층 동기화 및 공유(deep syncronization 및 share) 기능을 지원하지 않는다.  
이는 JavaScript가 단일 스레드 언어이고 여러 스레드들로부터의 변수에 대한 접근을 동기화하는 내장 메커니즘이 없기 때문이다.  
스레드가 있는 JavaScript는 언어를 변경하지 않고 Node.js 내에서 스레드의 모든 장점을 활용할 수 있다.

작업자 스레드는 기본적으로 메인 애플리케이션 스레드와 아무것도 공유하지 않는 스레드이다.  
독립적인 Node.js 런타임과 이벤트 루프를 사용하여 자체 V8 인스턴스 내에서 실행된다.  
메인 스레드와의 통신은 보통 다음과 같은 객체들의 사용으로 가능하다.

- 메시지 기반 통신 채널
- ArrayBuffer 객체의 전송
- 동기화가 (일반적으로 Atomics를 사용하는) 사용자에 의해 관리되는 SharedArrayBuffer 객채

작업자 스레드를 기본 스레드에서 격리하면 언어의 무결성이 유지된다.  
동시에 기본 통신 방식과 데이터 공유 기능은 99%의 사용사례에서 충분한 방법이다.

### 작업자 스레드에서 부분집합 합계 작업 실행

```jsx
//ThreadPool.js
import { Worker } from 'worker_threads';

/**
 *
 * @param {*} file 실행할 파일
 * @param {*} poolMax 풀에서 실행할 수 있는 최대 인스턴스 수
 */
export class ThreadPool {
  constructor(file, poolMax) {
    this.file = file;
    this.poolMax = poolMax;
    this.pool = [];
    this.active = [];
    this.waiting = [];
  }

  acquire() {
    return new Promise((resolve, reject) => {
      let worker;
      if (this.pool.length > 0) {
        worker = this.pool.pop();
        this.active.push(worker);
        return resolve(worker);
      }

      if (this.active.length >= this.poolMax) {
        return this.waiting.push({ resolve, reject });
      }

      worker = new Worker(this.file);
      worker.once('online', () => {
        this.active.push(worker);
        resolve(worker);
      });
      worker.once('exit', code => {
        console.log(`Worker exited with code ${code}`);
        this.active = this.active.filter(w => worker !== w);
        this.pool = this.pool.filter(w => worker !== w);
      });
    });
  }

  release(worker) {
    if (this.waiting.length > 0) {
      const { resolve } = this.waiting.shift();
      return resolve(worker);
    }
    this.active = this.active.filter(w => worker !== w);
    this.pool.push(worker);
  }
}
```

```jsx
//subsetSumThreadWorker.js
import { parentPort } from 'worker_threads';
import { SubsetSum } from '../subsetSum.js';

parentPort.on('message', msg => {
  const subsetSum = new SubsetSum(msg.sum, msg.set);

  subsetSum.on('match', data => {
    parentPort.postMessage({ event: 'match', data: data });
  });

  subsetSum.on('end', data => {
    parentPort.postMessage({ event: 'end', data: data });
  });

  subsetSum.start();
});
```

자식 프로세스 때와의 주요 차이점은 process.send() 및 process.on()을 사용하는 대신  
parentPort.postMessage() 및 parentPort.on()을 사용해야한다는 것이다.

```jsx
//subsetSumThreads.js
import { EventEmitter } from 'events';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ThreadPool } from './ThreadPool';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerFile = join(__dirname, 'workers', 'subsetSumThreadWorker.js');
const workers = new ThreadPool(workerFile, 2);

export class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
  }

  async start() {
    const worker = await workers.acquire();
    worker.postMessage({ sum: this.sum, set: this.set });

    const onMessage = msg => {
      if (msg.event === 'end') {
        worker.removeListener('message', onMessage);
        workers.release(worker);
      }

      this.emit(msg.event, msg.data);
    };

    worker.on('message', onMessage);
  }
}
```

fork된 프로세스 대신 작업자 스레드를 사용하도록 기존 애플리케이션을 변경하는 일은 간단하다.  
이는 두 컴포넌트(child_process, worker_threads)의 API가 매우 유사하지만 작업자 스레드가 완전한 Node.js 프로세스와 많은 공통점을 가지고 있기 때문이다.

실행 시 메인 애플리케이션의 이벤트 루프는 별도의 스레드에서 실행되므로 부분 집합 알고리즘으로 인해 차단되지 않는다.

## 11-4-5 운영에서 CPU 바인딩된 태스크의 실행

지금까지 작성한 소스코드들은 시간 초과, 오류 및 기타 유형의 실패를 처리 등의 구현은 생략되어 있다.  
실제 운영 용도로 구현을 해야한다면 많은 테스트를 거친 라이브러리를 사용하는 것이 좋다.

[workerpool](https://github.com/josdejong/workerpool/tree/master)과 [piscina](https://github.com/piscinajs/piscina) 이 두가지는 이 섹션에서 살펴본 동일한 개념을 기반으로 하고 있다.  
이를 통해 외부 프로세스 또는 작업자 스레드를 사용하여 CPU 집약적인 작업의 실행을 제어할 수 있다.

마지막으로, 실행할 수 있는 알고리즘이 특히 복잡하거나 CPU 바인딩 작업 수가 단일 노드의 용량을 초과하는 경우 여러 노드에 걸쳐 계산을 확장하는 것을 고려해야 한다.
