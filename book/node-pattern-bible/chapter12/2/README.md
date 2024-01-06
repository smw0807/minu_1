# 복제 및 로드 밸런싱

# 12-2 복제 및 로드 밸런싱

기존의 멀티스레드 웹 서버는 일반적으로 시스템에 할당된 리소스를 더 이상 업그레이드 할 수 없거나 단순히 다른 시스템을 시작하는 것보다 비용이 더 많이 드는 경우에만 수평적으로 확장 된다.

다중 스레드를 사용하는 전통적은 웹 서버는 사용 가능한 모든 프로세스와 메모리를 사용하여 서버의 모든 처리 능력을 활용할 수 있다.  
반대로 단일 스레드인 Node.js 애플리케이션은 일반적으로 기존 웹 서버에 비해 훨씬 더 빨리 확장되어야 한다.  
단일 머신의 맥락에서도 사용 가능한 모든 리소스를 활용하려면 애플리케이션을 “확장” 하는 방법을 찾아야 한다.

<aside>
💡 Node.js에서 `**수직 확장**`(단일 머신에 더 많은 리소스 추가)과 `**수평 확장**`(인프라에 더 많은 머신 추가)은 거의 동일한 개념이다.   
두 가지 모두, 사용 가능한 모든 처리 능력을 활용하기 위해 유사한 기술을 사용한다.

</aside>

확장이 강제되면 애플리케이션의 다른 속성, 특히 가용성 및 내결함성에 유익한 효과를 가져다 준다.  
실제로 복제에 의한 Node.js 애플리케이션의 확장 작업은 비교적 간단하며, 단지 이중화, 내결함성 설정을 목적으로 더 많은 리소스가 필요가 없는 경우에도 종종 구현된다.

이는 개발자가 애플리케이션의 초기 단계부터 확장성을 고려하도록 하여 애플리케이션이 여러 프로세스 또는 시스템에서 공유할 수 없는 리소스에 의존하지 않도록 한다.  
실제로 애플리케이션을 확장하기 위한 절대적인 전제 조건은 각 인스턴스가 메모리나 디스크와 같이 공유할 수 없는 리소스에 공통정보를 저장할 필요가 없다는 것이다.  
예를 들어, 웹 서버에서 세션 데이터를 메모리나 디스크에 저장하는 것은 확장에 적합하지 않는 관행이다.  
대신 공유 데이터베이스를 사용하면 배포된 위치에 관계없이 각 인스턴스가 동일한 세션 정보에 접근할 수 있다.

## 12-2-1 클러스터 모듈

Node.js에서 단일 머신에서 실행되는 여러 인스턴스에 애플리케이션 부하를 분산하는 가장 간단한 패턴은 코어 라이브러리의 일부인 cluster 모듈을 사용하는 것이다.  
클러스터 모듈은 Node.js 애플리케이션을 확장하기 위한 가장 기본적인 메커니즘이다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/b8518cb9-2c36-419f-aeef-dacc21516760/Untitled.png)

클러스터 모듈은 동일한 애플리케이션의 새 인스턴스 분기를 단순화하고 들어오는 연결을 자동으로 배분한다.

**Master Process**는 확장하려는 애플리케이션의 인스턴스를 각각 나타내는 여러 프로세스(작업자)를 생성하는 역할을 한다.  
수신되는 각 연결은 복제된 작업자에 분산되어 부하를 분산시킨다.  
모든 작업자는 독립적인 프로세스이므로 이 접근 방식을 사용하여 시스템에서 사용 가능한 CPU 수만큼 작업자를 생성할 수 있다.  
이 접근 방식은 Node.js 애플리케이션이 시스템에서 사용할 수 있는 모든 컴퓨팅 성능을 쉽게 활용할 수가 있다.

### 클러스터 모듈 동작에 대한 참고 사항

대부분의 시스템에서 클러스터 모듈은 명시적으로 **라운드로빈 로드 밸런싱 알고리즘을 사용**한다.  
이 알고리즘은 마스터 프로세스 내에서 사용되어 요청이 모든 작업자에게 균등하게 분산되도록 한다.  
라운드로빈 스케줄링은 Windows를 제외한 모든 플랫폼에서 기본적으로 활성화되며,
cluster.schedulingPolicy 변수와 상수 cluster.SCHED_RR(라운드로빈) 혹은 cluster.SCHED_NONE(운영체제에 맡김) 설정하여 전역적으로 수정할 수 있다.

<aside>
💡 라운드로빈 알고리즘은 순환 방식으로 사용 가능한 서버에 부하를 고르게 분산시킨다.   
첫 번째 요청은 첫 번째 서버로 전달되고, 두 번째 요청은 목록의 다음 서버로 전달 된다.   
목록의 끝에 도달하면 처음부터 다시 반복하여 시작된다.   
클러스터 모듈에서 라운드로빈 로직은 기존 구현보다 약간 더 영리히다.   
실제로 주어진 작업자 프로세스에 과부하가 걸리지 않도록 하는 몇 가지 추가적인 동작으로 강화된다.

</aside>

클러스터 모듈을 사용할 때 작업자 프로세스에서 servier.listen()에 대한 모든 호출은 마스터 프로세스에 위임된다.  
이를 통해 마스터 프로세스는 들어오는 모든 메세지를 수신하고 이를 작업자 풀에 배포할 수 있다.  
클러스터 모듈은 대부분의 사용 사례에서 이 위임 프로세스를 매우 간단하게 만들어주지만, 작업자 모듈에서 server.listen()을 호출하면 예상한 대로 작동하지 않을 수 있는 몇 가지 주의 사항들이 존재한다.

- server.listen({ fd }) :  
  작업자가 특정 파일 설명자(file descriptor)를 사용하여 수신하는 경우 이 작업은 예상치 못한 결과를 만들어낼 수 있다.  
  파일 설명자는 **프로세스 수준**에서 맵핑되므로 작업자 프로세스가 파일 설명자를 맵핑하면 마스터 프로세스와 동일한 파일과 일치하지 않는다.  
  이 한계를 극복하는 한가지 방법은 마스터 프로세스에서 파일 설명자를 만든 후 작업 프로세스에 전달하는 것이다.
- server.listen(handle) :  
  작업자 프로세스에서 명시적으로 핸들 객체를 수신하면 작업자가 마스터 프로세스에 작업을 위힘하는 대신 제공된 핸들을 직접 사용하게 된다.
- server.listen(0) :  
  server.listen(0)를 호출하면 일반적으로 서버가 임의의 포트에서 수신한다.  
  그러나 클러스터에서 각 작업자는 server.listen(0)을 호출할 때마다 동일한 무작위 포트를 받는다.  
  즉, 포트는 처음에만 무작위가 되고, 두 번째 호출부터 같은 포트를 받게 된다.  
  모든 작업자가 다른 임의의 포트에서 수신하도록 하려면 포트 번호를 직접 생성해야 한다.

### 간단한 HTTP 서버 만들기

```jsx
//app.js
import { createServer } from 'http';

const { pid } = process;

const server = createServer((req, res) => {
  //CPU 집약적인 작업
  let i = 1e7;
  while (1 > 0) {
    i--;
  }

  console.log(`Handling request from ${pid}`);
  res.end(`Hello from ${pid}\n`);
});

server.listen(8080, () => console.log(`Started at ${pid}`));
```

위에 작성한 HTTP 서버는 **프로세스 식별자(PID)**가 포함된 메세지를 다시 보내 모든 요청에 응답한다.  
이것은 요청을 처리하는 애플리케이션의 인스턴스를 식별하는데 유용하다.  
위 코드를 실행 시 빈 루프를 1000만 번 실행하기 때문에 curl로 요청을 보내도 응답이 오질 않는다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/f4a83974-fd31-44cb-9c5e-a0689d64559d/Untitled.png)

autocannon과 같은 네트워크 벤치 마킹 도구를 사용하면 서버가 한 프로세스에서 처리할 수 있는 초당 요청을 측정할 수도 있다.

`npx autocannon -c 200 -d 10 url` 은 10초 동안 200개의 동시 연결로 서버에 부하를 준다.

### 클러스터 모듈을 통한 확장

```jsx
//app.js
import { createServer } from 'http';
import { cpus } from 'os';
import cluster from 'cluster';

// 1
if (cluster.isMaster) {
  const availableCpus = cpus();
  console.log(`Clustering to ${availableCpus.length} processes`);
  availableCpus.forEach(() => cluster.fork());
}
// 2
else {
  const { pid } = process;
  const server = createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Hedling request from ${pid}`);
    res.end(`Hellow from ${pid}\n`);
  });
  server.listen(8080, () => console.log(`Started at ${pid}`));
}
```

클러스터 모듈을 사용하는 데는 많은 노력이 필요하지 않다.

1. app.js를 실행하면 마스터 프로세스가 실행된다.  
   cluster.isMaster 변수는 true로 설정되고 우리가 해야 할 유일한 작업은 cluster.fork()를 사용하여 현재 프로세스를 포크하는 것이다.  
   위 코드는 사용 가능한 모든 처리 능력을 활용하기 위해 시스템의 논리적인 CPU 코어 수 많큼 작업자를 시작시킨다.
2. master 프로세스에서 cluster.fork()를 실행하면 현재 모듈(app.js)이 다시 실행되지만 이번에는 작업자 모드(cluster.isWorker가 true로 설정되고 cluster.isMaster가 false로 설정됨)에서 실행된다.  
   애플리케이션이 작업자로 실행되면 실제 작업을 처리할 수 있다.  
   이 경우 작업자는 새로운 HTTP 서버를 시작시킨다.

<aside>
💡 각 워커는 자체 이벤트 루프, 메모리 공간 및 로드 된 모듈이 있는 다른 Node.js 프로세스라는 점을 기억해야한다.

</aside>

클러스터 모듈의 사용은 반복 패턴을 기반으로 하므로 애플리케이션의 여러 인스턴스를 매우 쉽게 실행할 수 있다.

```jsx
if (cluster.isMaster) {
  // fork()
} else {
  // do work
}
```

내부적으로 cluster.fork() 함수는 child_process.fork() API를 사용하므로 master와 worker 간에 사용 가능한 통신 채널도 존재하게 도니다.  
worker 프로세스는 cluster.workers 변수에서 액세스 할 수 있으므로, 모든 프로세스에 메시지를 브로드캐스팅 하는 것은 다음 코드라인과 같이 간단하다.

```jsx
Object.values(cluster.workers).forEach(worker => worker.send('Hello from the master'));
```

![실행 시 cpu 의 개수만큼 프로세스가 실행된 모습](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/f3a911d5-b132-49ab-90d4-24ecf2eb6817/Untitled.png)

실행 시 cpu 의 개수만큼 프로세스가 실행된 모습

![부하 테스트 결과](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/eea2ed2d-e960-4e66-ae57-00acb960c388/Untitled.png)

부하 테스트 결과

### 클러스터 모듈의 탄력성 및 가용성

작업자는 모두 별도의 프로세스이므로 다른 작업자에게 영향을 주지 않고 프로그램의 필요에 따라 없애거나 다시 생성할 수 있다.  
일부 작업자가 아직 살아있는 한 서버는 계속 연결을 수락할 것이다.  
살아있는 작업자가 없으면 기존 연결이 끊어지고 새 연결이 거부된다.  
Node.js는 작업자 수를 자동으로 관리하지 않는다.  
또한 자체 요구사항에 따라 작업자 풀을 관리하는 것은 애플리케이션의 책임이다.

애플리케이션이 확장하면 특히 오작동이나 충돌이 발생하더라도 특정 수준의 서비스를 유지할 수 있는 다른 장점이 있다.  
이 속성은 **복원력**이라고도 하며, 시스템 가용성에 기여한다.

동일한 애플리케이션의 여러 인스턴스를 시작함으로써 중복된 시스템을 생성한다.  
이것은 어떤 이유로든 한 인스턴스가 다운되더라도 다른 인스턴스가 요청을 처리할 준비가 되어 있음을 의미한다.

```jsx
import { createServer } from 'http';
import { cpus } from 'os';
import cluster from 'cluster';

// 1
if (cluster.isMaster) {
  const availableCpus = cpus();
  console.log(`Clustering to ${availableCpus.length} processes`);
  availableCpus.forEach(() => cluster.fork());
  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker`);
      cluster.fork();
    }
  });
}
// 2
else {
  setTimeout(() => {
    throw new Error('Ooops');
  }, Math.ceil(Math.random() * 3) * 1000);
  const { pid } = process;
  const server = createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Hedling request from ${pid}`);
    res.end(`Hellow from ${pid}\n`);
  });
  server.listen(8080, () => console.log(`Started at ${pid}`));
}
```

1~3초 사이의 임의의 시간 후에 오류와 함께 프로세스가 종료된다.  
인스턴스가 하나만 있는 경우 애플리케이션 시작 시간으로 인해 다시 시작되는 사이에 무시할 수 없는 지연이 발생할 수 있다.  
이는 다시 시작하는 동안에는 애플리케이션을 사용할 수 없음을 의미한다.  
대신 여러 인스턴스가 존재하면 작업자 중 하나가 실패하더라도 수신 요청을 처리할 수 있는 백업프로세스가 항상 존재하게 된다.  
exit 이벤트를 활용하여 오류 코드로 종료되는 것을 감지하는 즉시 새로운 작업자를 생성할 수 있다.  
위 코드에서 마스터 부분을 보면 exit 이벤트를 수신하자마자 프로세스가 의도적으로 종료되었는지 또는 오류로 인해 종료되었는지 확인한다.  
상태 코드와 작업자가 마스터에 의해 명시적으로 종료되었는지 여부를 나타내는 worker.exitedAfterDisconnect 플래그를 확인하여 수행한다.  
오류로 인해 프로세스가 종료되었음을 확인하면 새로운 작업자를 시작한다.  
충돌된 작업자가 교체되는 동안 다른 작업자는 여전히 요청을 처리할 수 있으므로 애플리케이션의 가용성에 영향을 주지 않는다.

![9천건의 요청 중 724 실패](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/de6ab6e5-fdd1-4188-99a4-14fcaf96f786/Untitled.png)

9천건의 요청 중 724 실패

### 제로 다운타임 재시작

```jsx
// 1
process.on('SIGUSR2', async () => {
  const workers = Object.values(cluster.workers);
  // 2
  for (const worker of workers) {
    console.log(`Stopping worker: ${worker.process.pid}`);
    worker.disconnect(); //3
    await once(worker, 'exit');
    if (!worker.exitedAfterDisconnect) continue;
    const newWorker = cluster.fork(); //4
    await once(newWorker, 'listening'); //5
  }
});
```

위 코드 블록이 작동하는 방식은 다음과 같다.

1. 작업자의 재시작은 SIGUSR2 신호를 수신할 때 트리거된다.  
   여기서 비동기 작업을 수행해야 하므로 이벤트 핸들러를 구현하기 위해 비동기 함수를 사용하고 있음을 주의해야한다.
2. SIGUSR2 신호가 수신되면 cluster.workers 객체의 모든 값을 반복한다.  
   cluster.workers 내의 모든 요소는 작업자 풀에서 현재 활성화된 작업들의 객체이다.]
3. 각각의 작업자에 대해 가장 먼저 하는 일은 worker.disconnect()를 호출하여 작업자를 정상적으로 중지시키는 것이다.  
   작업자가 현재 요청을 처리하고 있을 경우 작업이 완료된 후 중단된다.
4. 종료한 프로세스가 종료되면 새로운 작업자를 생성할 수 있다.
5. 다음 작업자를 다시 시작하기 전에 새 작업자가 준비되고 새로운 연결을 수신할 때까지 대기한다.

![실행중인 프로세스 하나를 kill 하면 다시 실행된 모습](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/10c376e1-5c1a-4661-b470-b207d35ba334/Untitled.png)

실행중인 프로세스 하나를 kill 하면 다시 실행된 모습

`kill -SIGUSR92 <PID>`

<aside>
💡 pm2는 클러스터 기반의 작은 유틸리티로 로드 밸런싱, 프로세스 모니터링, 제로 다운타입 재시작 및 기타 기능을 제공한다.

</aside>

## 12-2-2 상태 저장 통신 다루기

클러스터 모듈은 애플리케이션 상태가 다양한 인스턴스 간에 공유되지 않는 상태 저장이 필요한 통신에서는 제대로 작동하지 않는다.  
이는 동일한 상태값을 가진 세션에 속하는 다른 요청에 잠재적으로 애플리케이션의 다른 인스턴스에 의해 처리될 수 있기 때문이다.  
이는 클러스터 모듈에만 국한된 문제는 아니지만 일반적으로 모든 종류의 상태가 저장되지 않는 로드 밸런싱 알고리즘에 적용된다.

![로드 밸런서 뒤에 있는 상태 저장 애플리케이션의 문제](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/85ede3ca-36f8-4b1a-9cdb-b3720eb3a97d/Untitled.png)

로드 밸런서 뒤에 있는 상태 저장 애플리케이션의 문제

존이라는 사용자가 인증을 위해 요청을 보내고, 처리 결과가 로컬(예: 메모리)에 등록되므로 인스턴스A에만 존의 인증정보를 가지고 있다.  
이후 존이 새로운 요청을 보낼 때 로드 밸런서가 존의 인증 정보가 없는 인스턴스B로 전달하게 되면 요청이 거부된다.

### 여러 인스턴스에 상태 공유

상태 저장 통신을 사용하여 애플리케이션을 확장해야 하는 첫 번째 옵션은 모든 인스턴스에서 상태를 공유하는 것이다.  
예를 들어 PostgreSQL, MongoDB, CouchDB와 같은 공유 데이터 저장소를 사용하여 쉽게 달성할 수 있으며, 더 좋은 방식으로 Redis 또는 Memcached 같은 메모리 저장소를 사용할 수도 있다.

![공유 데이터 저장소를 사용하는 로드 밸런서 뒤의 애플리케이션](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/89df2e2a-c94e-4f8f-94ad-904a977f74b5/Untitled.png)

공유 데이터 저장소를 사용하는 로드 밸런서 뒤의 애플리케이션

통신 상태에 대해 공유 저장소를 사용하는 유일한 단점은 이 패턴을 적용하려면 코드들의 상당량을 리팩토링해야 할 수도 있다는 것이다.  
예를 들어, 통신 상태를 기존 라이브러리를 사용하고 있을 수 있으므로 공유 저장소를 사용하도록 이 라이브러리를 설정, 교체 또는 다시 구현하는 방법을 파악해야 한다.

그래서 애플리케이션의 확장성을 개선하는데 너무 많은 변경이 필요하거나 주어진 시간 제약으로 인해 리팩토링이 불가능한 경우, 영향도가 덜한 솔루션인 **고정 로드 밸런싱(고정 세션)**을 생각할 수 있다.

### 고정 로드 밸런싱

고정 로드 밸런싱은 로드 밸런서가 세션과 관련된 모든 요청을 항상 동일한 애플리케이션 인스턴스로 라우팅하도록 하는 것이다.

![고정 로드 밸런서가 작동하는 방식](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/6f9a0ed5-4cc3-4cda-a850-b784fab4d603/Untitled.png)

고정 로드 밸런서가 작동하는 방식

로드 밸런서가 새 세션과 관련된 요청을 수신하면 로드 밸런싱 알고리즘에 의해 선택된 하나의 특정 인스턴스로 맵핑을 생성한다.  
다음에 로드 밸런서가 동일한 세션에서 요청을 수신하면 로드 밸런싱 알고리즘을 우회하여 이전에 세션과 연결된 애플리케이션 인스턴스를 생성한다.

상태 저장 연결을 단일 서버에 연결하는 더 간단한 대안은 요청을 수행하는 클라이언트의 IP주소를 사용하는 것이다.  
일반적으로 IP는 요청을 수신할 애플리케이션의 인스턴스를 나타내는 ID를 생성하는 해시 함수에 전달된다.  
이 기술은 로드 밸런서가 연결과 관련된 정보를 저장할 필요가 없다는 장점이 있다.  
그러나 다른 네트워크로 로밍할 때와 같이 자주 IP를 변경하는 장치에서는 제대로 동작하지 않는다.

<aside>
💡 고정 로드 밸런싱은 클러스터 모듈에서 기본적으로 지원되지 않지만 slick-session이라는 npm 라이브러리로 추가할 수 있다.

</aside>

고정 로드 밸런싱의 한 가지 큰 문제는 다중 시스템의 장점 대부분을 무효화 시킨다는 사실이다.  
이러한 이유로 고정 로드 밸런싱을 피하고 공유 저장소에서 세션 상태를 유지하는 애플리케이션을 만드는 것이 좋다.  
또 가능한 경우 상태 저장 통신이 전혀 필요하지 않는 애플리케이션을 만들 수도 있다.  
예를 들어 요청 자체에 상태를 포함하는 것이다.

<aside>
💡 고정 로드 밸런싱이 필요한 라이브러리의 실제 예시로는 Socket.IO를 생각해볼 수 있다.

</aside>

## 12-2-3 역방향 프록시 확장

클러스터 모듈은 매우 편리하고 사용하기 쉽지만 Node.js 웹 애플리케이션을 확장해야 하는 유일한 옵션은 아니다.  
전통적인 기술들이 고가용성 운영 환경에서 더 많은 제어와 성능을 제공하기 때문에 더 선호된다.

클러스터 사용에 대한 대안은 서로 다른 포트 또는 머신에서 실행되는 동일한 애플리케이션의 여러 독립 실행형 인스턴스를 시작한 다음, 역방향 프록시(또는 게이트웨이)를 사용하여 해당 인스턴스들에 대한 접근을 제공하여 트래픽을 분산하는 것이다.  
이 구성에서는 작업자 집합에 요청을 배포하는 마스터 프로세스가 없지만 동일한 컴퓨터(다른 포트 사용)에서 실행되거나 네트워크 내의 다른 컴퓨터에 분산되어 있는 별개의 프로세스로 구성된 프로세스의 집합이 있다.  
애플리케이션에 단일 액세스 포인트를 제공하기 위해 클라이언트와 애플리케이션 인스턴스 사이에 배치되는 역방향 프록시를 사용할 수 있다.  
역방향 프록시를 사용하면 요청이 있으면 이를 대상 서버로 전달하여 그 결과를 요청자에게 반환할 수 있다.  
역방향 프록시는 로드 밸런서로도 사용되어 애플리케이션 인스턴스 간에 요청을 분산한다.

![로드 밸런서 역할을 하는 역방향 프록시가 있는 일반적인 다중 프로세스, 다중 시스템의 구성](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/9554e030-b1ef-4e75-ab8d-93f8094a7082/Untitled.png)

로드 밸런서 역할을 하는 역방향 프록시가 있는 일반적인 다중 프로세스, 다중 시스템의 구성

Node.js 애플리케이션의 경우 클러스터 모듈 대신 이 접근 방식을 선택해야 하는 많은 이유가 있다.

- 역방향 프록시는 여러 프로세스 뿐만 아니라 여러 시스템에 부하를 분산할 수 있다.
- 시장에서 가장 널리 사용되는 역방향 프록시는 바로 고정 로드 밸런싱을 지원한다.
- 보다 강력한 로드 밸런싱 알고리즘을 선택할 수 있다.
- 많은 역방향 프록시는 URL 재작성, 캐싱, SSL 종료 지점, 보안 기능(예: 서비스 거부 보호)과 같은 추가적인 강력한 기능과 정적 파일 제공과 같이 사용할 수 있는 완전한 웹 서버의 기능을 제공한다.

즉, 필요한 경우 클러스터 모듈을 역방향 프록시와 쉽게 결합할 수도 있다.  
예를 들어 클러스터를 사용하여 단일 시스템 내에서 수직으로 확장한 다음, 역방향 프록시를 사용하여 여러 노드에서 수평으로 확장할 수 있다.

<aside>
💡 **패턴**
역방향 프록시를 사용하여 서로 다른 포트 또는 시스템에서 실행되는 여러 인스턴스에 걸쳐 애플리케이션 부하의 균형을 조정한다.

</aside>

역방향 프록시를 사용하여 로드 밸런서를 구현할 수 있는 많은 옵션이 존재한다.  
다음은 가장 많이 사용되는 솔루션의 목로이다.

- **Nginx** : 비차단 I/O 모델을 기반으로 구축된 웹 서버, 역방향 프록시 및 로드 밸런서이다.
- **HAProxy**: TCP/HTTP 트래픽을 위한 빠른 로드 밸런서이다.
- **Node.js 기반 프록시** : Node.js에서 직접 역방향 프록세와 로드 밸런서를 구현하기 위한 많은 솔루션이 존재한다. 하지만 장점과 단점이 존재한다.
- **클라우드 기반 프록시:** 클라우딩 컴퓨팅 시대에 로드 밸런서를 서비스로 활용하는 것은 드문 일이 아니다. 이는 최소한의 유지 관리가 필요하고 일반적으로 확장성이 높으면 떄로는 주문형 확장성을 위해 동적 구성을 지원하기 때문에 편리할 수 있다.

### Nginx를 사용한 로드 밸런싱

https://www.notion.so/smw0807/940b30667f7c4ecb879d16fe917642bc?pvs=4#fe31ac6973ba495b9d19710dc16d4f19

nginx설치 맥기준 `brew install nginx` https://nginx.org/en/docs/install.html

![2023-12-26 기준 최신 버전](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/971c4cdc-5dcf-4aab-b22b-072ce56aada5/Untitled.png)

2023-12-26 기준 최신 버전

```jsx
//app.js
import { createServer } from 'http';

const { pid } = process;
const server = createServer((req, res) => {
  let i = 1e7;
  while (i > 0) {
    i--;
  }
  console.log(`Handling request from ${pid}`);
  res.end(`Hello from ${pid}`);
});

const port = Number.parseInt(process.env.PORT || process.argv[2]) || 8080;
server.listen(port, () => console.log(`Started at ${pid}`));
```

서버의 여러 인스턴스를 시작하고 서로 다른 포트에서 수신할 수 있기 하기 위해 커맨드라인 인자(command-line argument)를 사용하여 수신 포트를 지정할 수 있도록 코드를 작성했다.

또한 클러스터 없이 충돌 시 재시작이 가능하게 해야하는데 이는 전담 관리자, 즉 애플리케이션을 모니터링하고 필요한 경우 다시 시작하는 외부 프로세스를 사용할 수 있다.  
이를 위해 다음 중 선택할 수 있다.

- forever([nodejsdp.link/forever](http://nodejsdp.link/forever)) 또는 pm2([nodejsdp.link/pm2](http://nodejsdp.link/pm2))와 같은 Node.js 기반의 관리자
- systemd([nodejsdp.link/systemd](http://nodejsdp.link/systemd)) 또는 runit([nodejsdp.link/runit](http://nodejsdp.link/runit))과 같은 OS 기반 모니터
- monit([nodejsdp.link/monit](http://nodejsdp.link/monit)) 또는 supervisord([nodejsdp.link/supervisord](http://nodejsdp.link/supervisord))와 같은 고급 모니터링 솔루션
- kubernetes([nodejsdp.link/kubernetes](http://nodejsdp.link/kubernetes)), Nomad([nodejsdp.link/nomad](http://nodejsdp.link/nomad)) 또는 Docker Swarm([nodejsdp.link/swarm](http://nodejsdp.link/swarm))과 같은 컨테이너 기반 런타임

여기서는 forever를 사용할 것이다.  
사용하기에 가장 간단하고 직접적인 도구이다. `npm i -g forever`

이제 서로 다른 포트에서 forever에 의해 관리될 네 개의 애플리케이션 인스턴스를 시작한다.

```jsx
forever start app.js 8081
forever start app.js 8082
forever start app.js 8083
forever start app.js 8084
```

![forever를 이용해 4개의 프로세스가 실행중인 모습](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/9dfe28e1-9bfb-4015-9d41-7afb03de4513/Untitled.png)

forever를 이용해 4개의 프로세스가 실행중인 모습

![forever list를 통해 프로세스 목록을 확인할 수 있다.](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/dc530a48-9095-4293-bf45-2d7290644f98/Untitled.png)

forever list를 통해 프로세스 목록을 확인할 수 있다.

<aside>
💡 forever stopall을 사용하여 forever start로 실행된 Node.js 프로세스를 중지시킬 수 있다.   
또는 forever stop <id>를 사용하여 forever 목록에 표시된 프로세스에서 특정 프로세스를 중지할 수 있다.

</aside>

이제 Nginx 서버로 로드 밸런서를 구성할 차례이다.

<aside>
💡 nginx를 사용하면 동일한 서버 인스턴스 후방에서 여러 애플리케이션을 실행할 수 있으므로 일반적으로 Unix 시스템에서 /usr/local/nginx/confg, /etc/nginx 또는 /usr/local/etc/nginx 아래에 있는 글로벌 설정 파일을 사용하는 것이 더 일반적이다.   
여기서는 작업 폴터에 설정 파일을 저장함으로써 보다 간단한 접근 방식을 취한다.   
실제 운영환경에서는 권장되는 모범사례를 따르는 것이 좋다.

</aside>

nginx.conf 파일을 만들고, Node.js 프로세스에 대해 작동하는 로드 밸런서를 위해 필요한 최소한의 구성을 적용한다.

```bash
daemon off; ## 1
error_log /dev/stderr info; ## 2

events {
  worker_connections 2048; ## 3
}

http { ## 4
  access_log /dev/stdout;

  upstream my-load-balanced-app {
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
    server 127.0.0.1:8084;
  }

  server {
    listen 8000; ## max에 nginx설치하니 8080을 사용해서 8000으로 수정

    location / {
      proxy_pass http://my-load-balanced-app;
    }
  }
}
```

1. deamon off 설정을 사용하면 현재 권한이 없는 사용자를 사용하여 Nginx를 독립 실행형 프로세스로 실행할 수 있으며 현재 터미널의 포그라운드(foreground)에서 프로세스를 계속 실행할 수 있다.(ctrl+c로 종료가능)
2. error_log(및 나중에 http 블록에서 access_log)를 사용하여 오류를 스트리밍하고 로그를 표준 출력과 표준 오류로 각각 전송하므로 터미널에서 바로 실시간으로 로그를 읽을 수 있다.
3. events 블록을 통해 Nginx에서 네트워크 연결을 관리하는 방법을 설정할 수 있다.  
   여기서는 Nginx 작업자 프로세스에서 열 수 있는 최대 동시 연결 수를 2,048개로 설정했다.
4. http 블록을 사용하면 주어진 애플리케이션에 대한 구성을 정의할 수 있다.  
   upstream 섹션에서는 네트워크 요청을 처리하는데 사용되는 백엔드 서버 목록을 정의한다.  
   server 섹션에서는 listen 8000을 사용하여 서버가 포트 8000에서 수신하도록 지시하고 마지막으로 proxy_pass를 설정한다.  
   이 지시문은 Nginx가 이전에 정의한 서버 그룹(my-load-balanced-app)에 요청을 전달하도록 한다.

`nginx -c ${PWD}/nginx.conf` 명령어를 입력해 Nginx를 시작한다.

![실행 시 출력되는 로그](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/21b7a43b-3098-4eed-99d2-3c3f05ec6750/Untitled.png)

실행 시 출력되는 로그

여러 애플리케이션을 배포하기 위해서는 기본적으로 다음 레시피를 따라야 한다.

1. Node.js 애플리케이션을 실행하는 n개의 백엔드 서버를 프로비저닝한다(forever와 같은 서비스 모니터로 여러 인스턴스를 실행하거나 클러스터 모듈을 사용해서 실행)
2. Nginx가 설치된 로드 밸런서 시스템과 트래픽을 n개의 백엔드 서버로 라우팅 하는데 필요한 모든 설정을 프로비저닝 한다.  
   (소프트웨어를 시스템에 설치 배포하고, 필요한 구성 셋팅 작업을 해서 실행 가능하도록 준비하는 걸 프로비저닝이라고함)  
   모든 서버의 모든 프로세스는 네트워크에 있는 다양한 머신의 해당 주소를 사용하여 Nginx 설정 파일의 upstream 블록에 나열되어야 한다.
3. 공개 IP와 공개 도메인 이름을 사용하여 인터넷에서 로드 밸런서를 공개적으로 사용할 수 있도록 한다.
4. 브라우저 또는 autocannon과 같은 벤치마킹 도구를 사용하여 로드 밸런서의 공개 주소로 트래픽을 보낸다.

<aside>
💡 위 절차들을 간단히 하기 위해 클라우드 제공 업체 관리 인터페이스를 통해 서버를 부팅하고 SSH를 사용하여 로그인해서 이러한 모든 단계를 수동으로 수행할 수 있다.   
또는 Terraform, Ansible, Packer와 같은 코드로 인프라를 작성하여 이러한 작업을 자동화할 수 있는 도구를 사용할 수도 있따.

</aside>

## 12-2-4 동적 수평 확장

https://www.notion.so/smw0807/940b30667f7c4ecb879d16fe917642bc?pvs=4#6362b78c1b87414a96da5c4cf17535de

최신 클라우드 기반 인프라의 중요한 장점 중 하나는 현재 또는 예측된 트래픽을 기반으로 애플리케이션의 용량을 동적으로 조장할 수 있다는 것이다. 이를 **동적 확장**이라고도 한다.  
이 방법을 제대로 구현하면 애플리케이션의 가용성과 응답성을 유지하면서 IT 인프라 비용을 크게 줄일 수 있다.

- 최대 트래픽으로 인해 성능 저하를 경험하는 경우 새 서버 생성
- 할당된 리소스가 제대로 활용되지 않는 경우, 일부 서버를 종료하여 인프라 비용 절감
- 일정에 따라 확장 작업을 수행하도록 설정
- 특정 시간대에 트래픽이 적으면 일부 서버를 종료, 많은 시간대엔 다시 시작

이러한 메커니즘을 사용하려면 로드 밸런서가 항상 현재 네트워크 토폴로지를 최신 상태로 유지하고 어느 서버가 작동 중인지 알고 있어야 한다.

### 서비스 레지스트리(Service registry) 사용

이 문제를 해결하는 일반적인 패턴은 실행중인 서버와 이들이 제공하는 서비스를 추적하는 서비스 레지스트리라는 중앙 저장소를 사용하는 것이다.

![서비스 레지스트리를 사용하여 동적으로 구성된 전면에 로드밸런서가 있는 멀티 서비스 아키텍처](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/0244a0d1-5637-47ae-9742-fc86893f1ae0/Untitled.png)

서비스 레지스트리를 사용하여 동적으로 구성된 전면에 로드밸런서가 있는 멀티 서비스 아키텍처

위 아키텍처는 API와 웹 애플리케이션(WebApp)이라는 두 가지 서비스가 있다고 가정한다.  
서비스 인스턴스들은 여러 서버에 분산되어 하나 이상 존재할 수 있다.

example.com에 대한 요청이 수신되면 로드 밸런서는 요청 경로의 앞부분(prefix)을 확인한다.  
앞부분이 /api면 요청을 API 서비스들 중 지금 사용할 수 있는 인스턴스 중 한군데로 전달함으로써 부하를 분산 시킨다.  
로드 밸런서는 서비스 레지스트리로부터 모든 서버에서 실행 중인 서버 및 서비스 인스턴스들의 목록을 가져온다.

이것이 완전히 자동으로 동작하려면 각각의 애플리케이션 인스턴스가 온라인 상태가 되는 순간 서비스 레지스트리에 자신을 등록하고, 중지되면 등록을 취소해야 한다.  
이러한 방식으로 로드 밸런서는 네트워크에서 사용 가능한 서버 및 서비스에 대한 최신 정보를 항상 유지할 수 있다.

<aside>
💡 **패턴(서비스 레지스트리)**
중앙 저장소를 사용하여 시스템에서 사용 가능한 서버 및 서비스에 대한 최신 정보를 항상 유지시켜야한다.

</aside>

이 패턴은 트래픽 부하를 분산하는 데 유용하고 실행중인 서버에서 서비스 인스턴스를 분리할 수 있다는 추가적인 장점이 있다.  
그리고 네트워크 서비스에 적용된 서비스 로케이터 디자인 패턴의 구현으로 볼 수 있다.

### http-proxy와 consul을 사용한 동적 로드 밸런서 구현

동적 네트워크 인프라를 지원하기 위해서는 Nginx 또는 HAProxy와 같은 역방향 프록시를 사용할 수 있다.  
자동화된 서비스로 자신들의 설정 정보를 갱신한 후에, 로드 밸런서가 변경된 정보를 가져가도록 수정해야 한다.  
Nginx의 경우 `nginx -s reload` 명령어로 이를 수행할 수 있다.

consul(https://www.npmjs.com/package/consul)을 서비스 레지스트리로 사용하여 위 그림의 멀티 서비스 아키텍처를 구체화해볼 수 있다.  
이를 위해 3개의 npm 패키지를 사용한다.

- http-proxy: Node.js에서 역방향 프록시/로드 밸런서 생성을 단순화한다.
- portfinder: 시스템에서 사용 가능한 포트를 찾는다
- consul: Consul과 상호작용한다.

아래 작성한 코드는 각 서버가 시작되는 순간 서비스 레지스트리에 자신의 정보를 등록한다.

```tsx
import { createServer } from 'http';
import consul from 'consul';
import portfinder from 'portfinder';
import { nanoid } from 'nanoid';

const serviceType = process.argv[2];
const { pid } = process;

async function main() {
  const consulClient = consul();

  const port = await portfinder.getPortPromise(); // 1
  const address = process.env.ADDRESS || 'localhost';
  const serviceId = nanoid();

  // 2
  function registerService() {
    consulClient.agent.service.register(
      {
        id: serviceId,
        name: serviceType,
        address,
        port,
        tags: [serviceType],
      },
      () => {
        console.log(`${serviceType} [${serviceId}]  registered successfully.`);
      }
    );
  }

  // 3
  function unregisterService(err) {
    err && console.error(err);
    console.log(`deregistering ${serviceType} [${serviceId}]`);
    consulClient.agent.service.deregister(serviceId, () => {
      process.exit(err ? 1 : 0);
    });
  }

  process.on('exit', unregisterService); // 4
  process.on('uncaughtException', unregisterService);
  process.on('SIGINT', unregisterService);

  // 5
  const server = createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Handling request from ${pid}`);
    res.end(`${serviceType} [${serviceId}] response from ${pid}\n`);
  });

  server.listen(port, address, () => {
    registerService();
    console.log(`Started ${serviceType} [${serviceId}] at ${pid} on port ${port}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
```

1. 시스템에서 사용 가능한 포트를 찾는다.(기본적으로 포트 8000에서 검색을 시작한다.)  
   또한 사용자가 환경 변수 ADDRESS를 사용하여 주소를 설정할 수도 있다.  
   끝으로 nanoid를 사용하여 이 서비스를 식별하기 위해 임의의 ID를 생성한다.
2. 레지스트리에 새 서비스를 등록하기 위해 consul 라이브러리를 사용하는 함수를 선언한다.  
   서비스 정의에는 id(서비스에 대한 고유 식별자), name(서비스를 식별하는 일반 이름), address, port(서비스에 액세스하는 방법을 식별하기 위함), tag(선택 사항인 태그들의 배열)라는 여러 가지 속성들이 필요하다.
3. Consul에 등록학 서비스를 제거할 수 있는 함수
4. unregisterService()를 정리 함수로 사용하여 (의도적 또는 실수로) 프로그램이 종료되었을 때 서비스가 Consul에서 등록 해제된다.
5. portfinder에서 발견한 포드와 현재 서비스에 대해 설정된 주소에서 서비스용 HTTP 서버를 시작한다.  
   서버가 시작되면 registerService() 함수를 호출하여 서비스 검색을 위해 등록한다.

이 스크림트를 사용하여 다양한 유형의 애플리케이션을 시작하고 등록할 수 있다.

```tsx
//loadBalancer.js
import { createServer } from 'http';
import httpProxy from 'http-proxy';
import consul from 'consul';

// 1
const routing = [
  {
    path: '/api',
    service: 'api-service',
    index: 0,
  },
  {
    path: '/',
    service: 'webapp-service',
    index: 0,
  },
];

const consulClient = consul(); // 2
const proxy = httpProxy.createProxyServer();

const server = createServer((req, res) => {
  // 3
  const route = routing.find(route => req.url.startWith(route.path));

  // 4
  consulClient.agent.service.list((err, services) => {
    const servers =
      !err && Object.values(services).filter(service => service.Tags.includes(route.service));

    if (err || !servers.length) {
      res.writeHead(502);
      return res.end('Bad Gateway');
    }

    route.index = (route.index + 1) % servers.length; // 5
    const server = servers[route.index];
    const target = `http://${server.Address}:${server.port}`;
    proxy.web(req, res, { target });
  });
});

server.listen(8080, () => {
  console.log('Load balancer started on port 8080');
});
```

1. 로드 밸런서 경로를 정의한다.  
   라우팅 배열의 각 항목에는 맵핑된 경로에 도착하는 요청을 처리하는 데 사용되는 서비스가 포함되어 있다.  
   index 속성은 주어진 서비스의 요청을 **[라운드로빈](https://www.notion.so/940b30667f7c4ecb879d16fe917642bc?pvs=21)**하는데 사용된다.
2. 레지스트리에 액세스할 수 있도록 consul 클라이언트를 인스턴스화 해야 한다.  
   그리고 http-proxy 서버를 인스턴스화 한다.
3. 서버의 요청 핸들러에서 가장 먼저 하는 일은 라우팅 테이블에서 URL을 찾는 것이다.  
   결과는 서비스 이름이 포함된 설명자(descriptor) 이다.
4. consul로부터 요청을 처리하는데 필요한 서비스를 구현한 서버의 목록을 받는다.  
   이 목록이 비어있거나 검색의 오류가 있는 경우 클라이언트에 오류를 반환한다.  
   Tags 속성을 사용하여 사용 가능한 모든 서비스를 필터링하고 현재 서비스 유형을 구현하고 있는 서버의 주소를 찾는다.
5. 요청 대상으로 라우팅 할 수 있다.  
   라운드로빈 방식에 따라 목록에서 다음 서버를 가리키도록 route.index를 갱신한다.  
   그런 다음 인덱스를 사용하여 목록에서 서버를 선택하고 요청(req) 및 응답(res) 객체와 함께 proxy.web()으로 전달한다.

이 패턴의 장점은 직접적이라는 것이다.  
인프라를 수요에 따라 또는 일정에 따라 동적으로 확장할 수 있으면, 로드 밸런서는 추가적인 노력 없이 새로운 설정으로 자동 조정된다.

## 12-2-5 피어 투 피어 로드밸런싱

복잡한 내부 네트워크 아키텍처를 인터넷과 같은 공용 네트워크에 노출하려는 경우, 역방향 프록시를 사용하는 것은 거의 필수이다.  
이는 외부 애플리케이션이 쉽게 사용하고 신뢰할 수 있는 단일 접근 포인트를 제공하여 복잡성을 숨기는데 사용된다.  
그러나 내부용으로만 서비스를 확장해야 하는 경우에는 훨씬 더 많은 유연성과 제어를 가지고 움직일 수 있다.

로드 밸런서를 제거하고 클라이언트가 직접 요청을 배포할 수 있다.  
이는 클라이언트에서 요청의 로드 밸런싱을 직접 담당하게 된다.  
이는 노출하는 서버에 대한 세부 정보를 알고 있는 경우에만 가능하며, 내부 네트워크에서는 일반적으로 알려진 정보이다.  
이 접근 방식을 통해 **피어 투 피어 로드 밸런싱**을 구현한다.

![중앙 집중식 로드 밸런싱과 피어 투 피어 로드 밸런싱](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/6746c9e0-b146-4c39-ba74-98eb2fff04b1/Untitled.png)

중앙 집중식 로드 밸런싱과 피어 투 피어 로드 밸런싱

이것은 병목 현상이나 단일한 장애 지점 없이 실제로 분산된 통신을 가능하게 하는 매우 간단하고 효과적인 패턴이다.  
그 외에다 다음과 같은 속성이 있다.

- 네트워크 노드를 제거하여 인프라의 복잡성이 감소한다.
- 메시지가 하나의 노드를 통해 이동하므로 더 빠른 통신이 가능하다.
- 로드 밸런서가 처리할 수 있는 성능에 따라 제한되지 않으므로 확장성이 개선된다.

로드 밸런서를 제거하면 실제로 기본 인프라의 복잡성이 드러난다.  
또한 각 클라이언트는 로드 밸런싱 알고리즘을 구현하고 인프라에 대한 정보를 최신 상태로 유지하는 방법을 구현해야 더 잘 동닥학 ㅔ된다.

<aside>
💡 피어 투 피어 로드 밸런싱은 ZeroMQ 라이브러리에서 광범위하게 사용되는 패턴이다.

</aside>

### 여러 서버에 요청을 분산할 수 있는 HTTP 클라이언트 구현

클라이언트 API를 감싸서 로드 밸런싱 메커니즘으로 보강해야 한다.

```tsx
import { request } from 'http';
import getStream from 'get-stream';

const servers = [
  { host: 'localhost', port: 8081 },
  { host: 'localhost', port: 8082 },
];

let i = 0;

export function balancedRequest(options) {
  return new Promise(resolve => {
    i = (i + 1) % servers.length;
    options.hostname = servers[i].host;
    options.port = servers[i].port;

    request(options, response => {
      resolve(getStream(response));
    }).end();
  });
}
```

라운드로빈 알고리즘을 사용하여 사용 가능한 서버 목록에서 선택한 서버로 요청할 호스트명과 포트를 재정의하도록 원본 http.request API를 감쌌다.  
단순화를 위해 모듈 get-stream을 사용하여 버퍼에 전체 응답 본문인 응답 스트림(stream)을 담았다.

```tsx
//client.js
import { balancedRequest } from './balancedRequest.js';

async function main() {
  for (let i = 0; i < 10; i++) {
    const body = await balancedRequest({
      method: 'GET',
      path: '/',
    });
    console.log(`Request ${i} completed: `, body);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
```

app.js에 작성된 서버 인스턴스를 8081, 8082로 실행 시키고 client.js를 실행 시키면
8081로 실행중인 서버 프로세스와 8082로 실행중인 서버 프로세스에 순서대로 순차적으로 요청을 진행한다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/ad76fb76-d984-4ba5-a3cb-5f53f54d47bc/Untitled.png)

각 요청이 다른 서버로 전송이되어 로드 밸런서 없이도 분산이 가능함을 확인할 수 있게 해준다.

## 12-2-6 컨테이너를 사용한 애플리케이션 확장

쿠버네티스(kubernetes)와 같은 컨테이너 및 컨테이너 오케스트레이션 플랫폼을 사용하는 것이 로드 밸런싱, 탄력적인 확장, 고가용성 등과 같은 확장 문제의 대부분을 기본 컨터에니 플랫폼에 위임하여 간단하게 애플리케이션을 만들 수 있다.

### 컨테이너란?

**OCI(Open Container Initiative)**에 의해 표준화된 **컨테이너**, 특히 **Linux 컨테이너**는 “코드와 모든 종속성을 패키지화하여 애플리케이션이 하나의 컴퓨팅 환경이 아닌 다른 컴퓨팅 환경에서도 빠르고 안정적으로 실행되도록 하는 소프트웨어의 표준 단위”로 정의 된다.

즉, 컨테이너를 사용하면 책상의 로컬 개발 랩톱에서 클라우드의 프로덕션 서버에 이르기까지 다양한 컴퓨터에서 애플리케이션을 원활하게 패키징하고 실행할 수 있다.

이식성이 매우 뛰어난 것 외에 컨테이너로 실행되는 애플리케이션은 실행 시 오버헤드가 매우 적다는 장점이 있다.  
실제로 컨테이너는 운영체제에서 직접 네이티브 애플리케이션을 실행하는 것만큼 빠르게 실행된다.

간단히 말해서 컨테이너는 Linux 운영체제에서 직접 격리된 프로세스를 정의하고 실행할 수 있는 표준 소프트웨어 단위로 볼 수 있다.

이식성과 성능 측면에서 컨테이너는 **가상 머신**과 비교할 때 큰 발전으로 간주되는데, 응요 프로그램에 대한 OCI 호환 컨테이너를 만들고 실행하는데 여러 가지 방법과 도구가 있고, 가장 인기있는 것은 Docker이다.

### Docker로 컨테이너 생성 및 실행

```tsx
//app.js
import { createServer } from 'http';
import { hostname } from 'os';

const version = 1;
const server = createServer((req, res) => {
  let i = 1e7;
  while (i > 0) {
    i--;
  }
  res.end(`Hello from ${hostname()} (v${version})`);
});
server.listen(8080);
```

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/d3087362-403f-49f9-9e7d-c71794ad187c/Untitled.png)

애플리케이션을 도커에 담으려면 두 단계의 프로세스를 따라야 한다.

- 컨테이너 이미지 빌드
- 이미지에서 컨테이너 인스턴스 실행

애플리케이션의 **컨테이너 이미지**를 생성하려면 Dockerfile을 정의해야 한다.  
컨테이너 이미지(또는 Docker 이미지)는 실제 패키지이면 OCI 표준을 따른다.  
여기에는 모든 소스 코드와 필요한 종속성이 포함되어 있으며 애플리케이션을 실행하는 방법을 설명하여 정의해야 한다.  
그래서 package.json이 정의되어 있어야함

Dockerfile은 애플리케이션의 컨테이너 이미지를 만드는데 사용되는 빌드 스크립트르 정의하는 파일(실제로 Dockerfile이라고 함)입니다.

```docker
#Dockerfile
FROM node:14-alpine
EXPOSE 8081
COPY app.js package.json /app/
WORKDIR /app
CMD [ "npm", "start" ]
```

- FROM node:14-alpine  
  사용할 기본 이미지를 나타낸다.  
  기본 이미지를 사용하면 기존 이미지의 “위에” 빌드할 수 있다.
- EXPOSE 8081  
  애플리케이션이 포트 8081에서 TCP 연결을 수신할 것임을 Docker에 알린다.
- COPY app.js package.json /app/  
  app.js와 package.json 파일을 컨테이너 파일시스템의 /app 디렉터리에 복사한다.  
  컨테이너는 격리되어 있으므로 기본적으로 호스트 운영체제와 파일을 공유할 수 없다.  
  따라서 프로젝트 파일에 액세스하고 실행할 수 있도록 컨테이너에 프로젝트 파일을 복사해야 한다.
- WORKDIR /app  
  컨테이너의 작업 디렉터리를 app으로 설정한다.
- CMD [ "npm", "start" ]  
  이미지에서 컨테이너를 실행할 때 애플리케이션을 시작하기 위해 실행할 명령을 지정한다.

Dockerfile이 위치한 곳에서 `docker build .` 명령어를 입력하면 Dockerfile을 사용하여 컨테이너 이미지를 만들 수 있다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/458d647e-cb44-4aa7-abe5-71569511fefc/Untitled.png)

### Kubernetes란?

컨테이너의 진정한 힘은 여러 독립 서비스로 구성된 애플리케이션을 만들 때 여러 클라우드 서버에 배포하고 조정해야하는 더 복잡한 애플리케이션을 빌드할 때 발휘된다.  
이 상황에서는 Docker 만으로는 더 이상 충분하지 않다.  
클라우드 클러스터에서 사용 가능한 머신을 통해 실행중인 모든 컨테이너 인스턴를 조율할 수 있는 더 복잡한 시스템이 필요하다.  
컨테이너 오케스트레이션 도구가 필요한 것이다.  
컨테이너 오케스트레이션 도우게는 다음과 같은 여러 가지 책임이 있다.

- 여러 클라우드 서버(노드)를 하나의 논리적 클라스터로 결합할 수 있으며, 여기서 모든 노드에서 실행되는 서비스의 가용성에 영향을 주지 않고 동적으로 노드를 추가 및 제거할 수 있다.
- 다운타임이 없는지 확인한다.  
  컨테이너 인스턴스가 중지되거나 상태 확인에 응답하지 않으면 자동으로 다시 시작된다.  
  또한 클러스터의 노드가 실패하면 해당 노드에서 실행 중인 워크로드가 자동으로 다른 노드로 마이그레이션 된다.
- 서비스 검색 및 로드 밸런싱을 구현하는 기능을 제공한다.
- 데이터가 필요에 따라 지속될 수 있도록 내구성이 있는 스토리지에 대한 오케스트레이션된 접근을 제공한다.
- 다운타임 없는 애플리케이션의 자동 롤아웃(rollouts) 및 롤백(rollback)을 제공할 수 있다.
- 민감한 데이터 및 설정 관리 시스템을 위한 보안 저장 공간을 제공한다.

쿠버네티스는 현재 컨테이너 오케스트레이션 시스템 중 가장 인기있는 시스템 중 하나이다.  
특징 중 하나는 “최종 상태”를 정의하고 오케스트레이터가 클러스터에서 실행되는 서비스의 안정성을 방해하지 않고 원하는 상태에 도달하는데 필요한 일련의 단계를 파악할 수 있도록 선언적으로 구성한 시스템이다.

쿠버네티스 구성의 전체 개념은 “객체” 개념을 중심으로 이루어진다.  
객체는 클라우드 배포의 요소로 추가, 제거 및 구성 변경이 가능하다.  
쿠버네티스 객체의 좋은 예는 다음과 같다.

- 컨테이너화된 애플리케이션
- 컨테이너 리소스(CPU 및 메모리 할당, 영구 저장소, 네트워크 인터페이스 또는 GPU와 같은 장치에 대한 접근)
- 애플리케이션 동작에 대한 정책(다시 시작 정책, 업그레이드, 내결함성)

쿠버네티스 객체는 일종의 “의도 기록(record of intent)”이다.  
즉 클러스터에서 생성한 후 쿠버네티스는 객체의 상태를 지속적으로 모니터링(필요한 경우 변경)하여 정의된 기대치를 준수하는지 확인한다.  
쿠버네티스 클러스터는 일반적으로 kubctl이라는 커맨드라인 도구를 통해 관리된다.

개발, 테스트 및 프로덕션 목적으로 쿠버네티스 클러스터를 만드는 방법에는 여러 가지가 있다.  
쿠버네티스 시험을 시작하는 가장 쉬운 방법은 [minikube](https://kubernetes.io/docs/tasks/tools/)라는 도구로 쉽게 만들 수 있는 로컬 단일 노드 클러스터를 사용하는 것이다.

### kubernetes에서 애플리케이션 배포 및 확장

<aside>
💡 macOS 및 Linux 환경에서는 minikube start 및 eval $(minikube docker-env)를 실행하여 작업 환경을 초기화해야 한다.
두 번째 명령은 현재 터미널에서 docker 및 kubectl을 사용할 때 로컬 Minikube 클러스터와 상호작용 하는지 확인한다.
여러 터미널을 여는 경우 모든 터미털에서 eval $(minikube docker-env)를 실행해야 한다.   
또한 minikube 대시보드를 실행하여 클러스터의 모든 객체를 시각화하고 상호작용할 수 있는 편리한 웹 대시보드를 실행할 수 있다.

</aside>

먼저 Docker 이미지를 빌드하고 의미있는 이름을 지정한다.

`docker build -t hello-web:v1 .`  
환경을 올바르게 설정한 경우 hello-web 이미지를 로컬 쿠버네티스 클러스터에서 사용할 수 있다.

<aside>
💡 로컬 개발에는 로컬 이미지를 사용하는 것으로 충분하다. 프로덕션 환경으로 이동할 준비가 되었다면 Docker Hub, Docker registry, Google Cloud Container Registry, Amazon Elastic Container Registry와 같은 도커 컨테이너 레지스트리에 이미지를 게시하는 것이 가장 좋다. 이미지를 컨테이터 레지스트리에 게시한 후에는 매번 해당 이미지를 다시 빌드할 필요 없이 애플리케이션을 다른 호스트에 쉽게 배포할 수 있다.

</aside>
