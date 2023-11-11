# 11-2 비동기식 요청 일괄 처리 및 캐싱

부하가 많은 애플리케이션에서 캐싱은 중요한 역할을 하며 웹 페이지, 이미지 및 스타일 시트와 같은 순수한 데이터에 이르기까지 웹의 거의 모든 곳에서 사용된다.
이 섹션에서는 캐싱이 비동기 작업에 적용되는 방법과 이를 통한 높은 요청 처리량이 어떤 장점이 있는지에 대해 알아볼 것이다.

## 11-2-1 비동기식 요청 일괄 처리란?

비동기 작업을 처리할 때 동일한 API에 대한 일련의 호출을 **일괄 처리**하여 가장 기본적인 수준의 캐싱을 수행할 수 있다.
아직 대기중인 다른 함수가 있는 동안 비동기 함수를 호출하면 새로운 요청을 생성하는 대신 이미 실행 중인 작업에 피기백(piggyback)할 수 있다.

![일괄 처리 없는 두 개의 비동기식 요청](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/f68562eb-646d-4770-93d6-191a5bf9b0b0/Untitled.png)

일괄 처리 없는 두 개의 비동기식 요청

위 다이어그램은 두 개의 클라이언트가 서로 다른 순간에 완료되는 두 개의 개별 작업을 실행한다.

![두 비동기식 요청의 배치 처리](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/9fe4812d-995b-4558-a31f-8c5b17517160/Untitled.png)

두 비동기식 요청의 배치 처리

위 다이어그램은 동일한 입력으로 동일한 API를 호출하는 두 개의 동일한 요청이 어떻게 일괄 처리 되는지, 다시 말해 동일한 실행 작업이 어떻게 추가될 수 있는지 보여준다.
이렇게 하면 작업이 완료될 때 비동기 작업이 실제로 한번만 실행됐더라도 두 클라이언트에 결과가 전송된다.
이는 일반적으로 적절한 메모리 관리 및 무효화 전략을 필요로 하는 보다 복잡한 캐싱 메커니즘을 사용할 필요 없이 애플리케이션의 로드를 최적화하는 간단하면서도 매우 강력한 방법을 보여준다.

## 11-2-2 최적의 비동기 요청 캐싱

작업이 충분히 빨리 수행되거나 일치하는 요청이 장기간에 걸쳐 분산된 경우.  
요청 일괄 처리가 그리 효과적이지는 않는다.  
이러한 모든 상황에서 애플리케이션의 부하를 줄이고 응답성을 높이는 가장 좋은 방법은 보다 더 공격적인 캐싱 메커니즘이다.

요청이 완료되자마자 그 결과를 캐시에 저장한다.  
캐시는 메모리 내 변수 또는 전용 캐싱 서버(예:Redis)의 자료 구조일 수 있다.  
그러나 캐시가 설정되지 않은 동안 여러 요청이 동시에 실행될 수 있고 해당 요청이 완료되면 캐시가 여러번 설정될 수도 있다.

아래는 이러한 가정을 기반으로 결합된 요청 일괄 처리 및 캐싱 패턴의 다이어그램이다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/bc261f43-de91-483d-8946-ac5a65106576/d50ad464-8443-4378-b7b6-a3bf51965fa3/Untitled.png)

- 첫 번째 단계는 배치 패턴과 완전히 동일하다.  
  캐시가 설정되지 않은 동안 수신된 모든 요청은 함께 일괄 처리된다.  
  요청이 완료되면 캐시가 한번 설정된다.
- 캐시가 최종적으로 설정되면 후속 요청이 캐시에서 직접 제공된다.

고려해야할 중요한 세부 사항은 Zalgo 안티패턴이다.  
비동기 API를 다루기 때문에 캐시에 액세스하는 동안 동기 작업만이 존재한다 해도 항상 캐시된 값을 일관성 있게 비동기적으로 반환해야 한다.

## 11-2-3 캐싱 혹은 일괄 처리가 없는 API 서버

작은 데모 서버 구현을 통해 알아보자.

- 판매를 관리하는 API 서버
- 특정 유형의 상품에 대한 모든 거래의 합계를 서버에 질의
- level npm 패키지 사용
- 데이터 모델은 판매(sales) sublevel에 저장되어 있는 간단한 거래 목록이며 형식은 다음과 같다  
  transactionId { amount, product }
- 키는 transactionId, 값은 판매량(amount), 제품유형(product)의 JSON 객체

```jsx
//totalSales.js
import level from 'level';
import sublevel from 'subleveldown';

const db = level('example-db');
const salesDb = sublevel(db, 'sale', { valueEncoding: 'json' });

export async function totalSales(product) {
  console.group('totalSales');
  console.log('product : ', product);
  const now = Date.now();
  let sum = 0;
  for await (const transaction of salesDb.createValueStream()) {
    console.log('transaction : ', transaction);
    if (!product || transaction.product == product) {
      sum += transaction.amount;
    }
  }
  console.log(`totalSales() took: ${Date.now() - now}ms`);
  console.groupEnd();
  return sum;
}
```

salses sublevel의 모든 transaction들을 반복하면서 특정 product의 판매량을 합산한다.  
알고리즘은 나중에 일괄 처리 및 캐싱의 효과를 강조하기 위해 의도적으로 느리게 하였다.  
실제 애플리케이션에서는 인덱스를 사용하여 제품별로 트랜잭션을 질의하거나 map, reduce 알고리즘을 사용하여 모든 제품의 합계를 지속적으로 계산할 수 있다.
아래는 위 API를 HTTP 서버로 노출시킨 코드이다.

```jsx
//server.js
import { createServer } from 'http';
import { totalSales } from './totalSales.js';

createServer(async (req, res) => {
  console.group('Server');
  const url = new URL(req.url, 'http://localhost');
  console.log('url : ', url);
  const product = url.searchParams.get('product');
  console.log('product : ', product);
  console.log(`Processing query: ${url.search}`);

  const sum = await totalSales(product);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(
    JSON.stringify({
      product,
      sum,
    })
  );
  console.groupEnd();
}).listen(8000, () => console.log('Server started'));
```

그리고 성능 테스트를 위해 200ms 간격으로 20개의 요청을 보내는 스크립트 파일을 실행한다.

```jsx
//loadTest.js
import superagent from 'superagent';

const start = Date.now();
let count = 20;
let pending = count;
const interval = 200;
const query = process.argv[2] ? process.argv[2] : 'product=book';

function sendRequest() {
  superagent.get(`http://localhost:8000?${query}`).then(result => {
    console.log(result.status, result.body);
    if (!--pending) {
      console.log(`All completed in: ${Date.now() - start}ms`);
    }
  });

  if (--count) {
    setTimeout(sendRequest, interval);
  }
}

sendRequest();
```

완료까지 대략 3878ms가 걸린다.  
다음 섹션에서 이제 최적화를 적용한 후 얼마나 많은 시간을 절약할 수 있는지 측정해본다.

## 11-2-4 Promise를 사용한 일괄 처리 및 캐싱

프라미스는 비동기 일괄 처리 및 요청 캐싱을 구현하기 위한 훌륭한 도구이다.  
아래와 같은 이유로 프라미스를 사용하면 일괄 처리 및 캐싱이 매우 간단하고 간결해진다.

- 여러 then() 리스너를 동일한 프라미스에 연결할 수 있다.  
  이는 요청을 일괄 처리하는데 정확히 필요하다.
- then() 리스너느 호출이 보장되며(한 번만) 프라미스가 이미 해결된 후에 연결되어도 동작한다.  
  또한 then()은 항상 비동기적으로 호출된다.
  이는 프라미스가 미해결된 값을 반환하는 자연스러운 메커니즘을 제공함을 의미한다.

### 총 판매 웹 서버의 일괄 처리

API가 호출될 때 다른 동일한 요청이 보류 중인 경우 새 요청을 시작하는 대신 해당 요청이 완료될 때까지 기다린다.  
이는 프라미스로 쉽게 구현할 수 있다.

```jsx
//totalSalesBatch.js
import { totalSales as totalSalesRaw } from './totalSales.js';

const runningRequests = new Map();

export function totalSales(product) {
  // 1
  if (runningRequests.has(product)) {
    console.log('Batching');
    return runningRequests.get(product);
  }

  //2
  const resultPromise = totalSalesRaw(product);
  runningRequests.set(product, resultPromise);
  resultPromise.finally(() => {
    runningRequests.delete(product);
  });

  console.log('resultPromise : ', resultPromise);
  return resultPromise;
}
```

이 파일에서의 totalSales() 함수는 는 totalSales.js의 totalSales() API에 대한 프록시이다.

1. 주어진 product에 대한 프라미스가 이미 존재할 경우, 해당 프라미스를 되돌려 준다.  
   여기서 이미 실행중인 요청에 편승한다.
2. 주어진 제웊멩 대해 실행 중인 요청이 없으면 원래 totalSales() 함수를 실행하고 결과 프라미스를 runningRequests 맵에 저장한다.  
   다음으로 요청이 완료되는 즉시 runningRequests 맵에서 동일한 프라미스를 제거해야 한다.
