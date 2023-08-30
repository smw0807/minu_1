# 9-4 반복자 패턴 (Iterator)

반복자 패턴은 기본적인 패턴으로 매우 중요하고 일반적으로 사용되므로 프로그래밍 언어 자체에 내장된다.  
JavaScript(ECMAScript 2015 사양에서 시작)를 비롯하여 모든 주요 프로그래밍 언어에서 어떤 방식으로든 이 패턴을 구현하고 있다.

반복자 패턴은 배열 또는 트리 데이터 구조와 같은 컨테이너의 요소들을 반복하기 위한 공통 인터페이스 또는 프로토콜을 정의한다.  
일반적으로 컨테이터의 요소들을 반복하는 알고리즘은 데이터의 실제 구조에 따라 다르다.  
배열의 경우 단순한 루프만이 필요하다.  
트리는 더 복잡한 트리 순회 알고리즘이 필요하다.(https://en.wikipedia.org/wiki/Tree_traversal)  
반복자 패턴을 사용하면 사용중인 알고리즘 또는 데이터 구조에 대한 세부 정보는 숨기고 모든 유형의 컨테이너를 반복하는데 필요한 공통의 인터페이스를 제공한다.  
본질적으로 반복자 패턴을 사용하면 순회 연산의 결과(요소)를 처리하는 방식과 순회 알고리즘의 구현을 분리할 수 있다.

그러나 JavaScript에서 반복자는 이벤트 이미터와 스트림처럼 반드시 컨테이너일 필요 없이 다른 유형의 구조에서도 잘 동작한다.  
따라서 반복자 패턴은 순서대로 생성되거나 조회된 요소들을 반복하는 인터페이스를 정의하고 있다고 일반화하여 말할 수 있을 것이다.

## 9-4-1 반복자(Iterator) 프로토콜

JavaScript에서 반복자 패턴은 상속과 같은 형식적인 구조보다는 프로토콜을 통해 구현된다.  
이것은 본질적으로 반복자 패턴의 구현자와 소비자간의 상호작용이 사전에 합의된 형태의 인터페이스와 객체를 이용한다는 것을 의미한다.

JavaScript에 있어서 반복자 패턴을 구현하는 시작점은 값들의 시퀀스를 생성하기 위한 인터페이스를 정의하는 ‘**반복자 프로토콜**’(iterator protocol)이다.  
함수가 호출될 때마다 함수는 반복의 다음 요소를 객체에 담아 반환하며 이를 ‘**반복자 결과**’(iterator result)라 한다.

<aside>
💡 반복자가 추가적인 속성을 반환하는 것을 막을 수는 없다.   
그러나 이러한 속성은 내장된 구조나 반복자를 사용하는 API에 의하여 무시될 것이다.

</aside>

```tsx
const A_CHAR_CODE = 65;
const Z_CHAR_CODE = 90;
/**
String.fromCodePoint() 메소드
이 메소드는 쉼표로 구분되는 일련의 코드 포인트(code point)에 해당하는 문자들로 구성된 문자열을 반환합니다.
 */
function createAlphabetIterator() {
  let currCode = A_CHAR_CODE;

  return {
    next() {
      const currChar = String.fromCodePoint(currCode);
      console.log('currChar : ', currChar);
      if (currChar > Z_CHAR_CODE) {
        return { done: true };
      }
      currCode++;
      return { value: currChar, done: false };
    },
  };
}
```

next() 함수를 호출할 때마다 문자에 해당하는 문자코드를 나타내는 숫자를 증가시키고 이를 문자로 변환한 다음, 반복자 프로토콜에 정의된 객체의 형식을 사용하여 반환한다.  
주목해야 할 중요한 측면은 반복자의 현재 위치를 어떤 방식으로든 추적해야 하기 때문에 많은 경우 반복자는 상태저장 객체라는 것이다.  
반복자는 실제로 완전히 상태 비저장일 수도 있다.  
예를 들어 무작위 요소를 반환하고 무작위로 종료하거나 무한 반복을 하는 반복자거나 첫 번째 반복에서 중지하는 반복자를 예로 들 수 있다.

위에 만든 반복자를 사용하는 방법을 살펴보자.

```tsx
const iterator = createAlphabetIterator();

let iteratorResult = iterator.next();
while (!iterator.done) {
  console.log(iterator.value);
  iteratorResult = iterator.next();
}
```

코드에서 알 수 있듯이 반복자를 사용하는 코드는 패턴 자체로 간주될 수 있다.

<aside>
💡 반복자는 선택적으로 두 가지 추가적인 함수 return([value]) 및 throw(error)를 지정할 수 있다.   
첫 번째는 규약에 따라 사용자가 반복이 완료되기 전에 중단했음을 알리는데 사용되고,   
두 번째는 오류가 발생 했음을 반복자에 전달하는데 사용된다.   
두 함수 모두 기본적인 반복자에서는 거의 사용되지 않는다.

</aside>
