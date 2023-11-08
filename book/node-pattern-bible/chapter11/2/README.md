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
