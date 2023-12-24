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

클러스터 모듈의 사용은 반복 패턴을 기반으로 하므로 애플리케이션의 여러 인스턴스를 매우 쉽게 실행할 수 있따.

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
