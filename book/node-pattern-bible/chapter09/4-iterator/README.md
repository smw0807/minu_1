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

## 9-4-2 반복가능자(iterable) 프로토콜

반복가능자(iterable) 프로토콜은 객체가 반복자를 반환하는 표준화된 방법을 정의한다.  
이러한 객체를 **반복가능자**(iterable)라고 한다.  
일반적으로 반복가능자는 요소들의 컨테이너로 데이터구조와 같은 것이지만, 디렉터리의 파일들을 반복할 수 있도록 하는 Directory 객체와 같이 요소들의 집합을 가상적으로 나타내는 객체일 수도 있다.

JavaScript에서 우리는 **@@iterator 함수**, 달리 말해, 내장 심볼인 Symbol.iterator 함수를 통해 접근 가능한 함수를 구현하여 반복가능자를 정의할 수 있다.

@@iterator 함수는 반복자 객체를 반환해야 하며, 반복자 객체에서 표현되는 요소들을 반복하는 데 사용할 수 있다.

```tsx
//matrix.mjs
export class Matrix {
  constructor(inMatrix) {
    this.data = inMatrix;
  }

  get(row, column) {
    if (row >= this.data.length || column >= this.data[row].length) {
      throw new RangeError('Out of bounds');
    }
    return this.data[row][column];
  }

  set(row, column, value) {
    if (row >= this.data.length || column >= this.data[row].length) {
      throw new RangeError('Out of bounds');
    }
    this.data[row][column] = value;
  }

  [Symbol.iterator]() {
    let nextRow = 0;
    let nextCol = 0;

    return {
      next: () => {
        if (nextRow === this.data.length) {
          return { done: true };
        }
        const currVar = this.data[nextRow][nextCol];
        if (nextCol == this.data[nextRow].length - 1) {
          nextRow++;
          nextCol = 0;
        } else {
          nextCol++;
        }

        return { value: currVar };
      },
    };
  }
}
```

클래스에는 행렬의 값을 획득하고 설정하는 기본적인 함수들과 반복가능자 프로토콜을 구현하는 @@iterator 함수가 포함되어 있다.  
@@iterator 함수는 반복가능자 프로토콜에 지정된 대로 반복자를 반환하며 이 반복자는 반복자 프로토콜을 준수한다.

로직은 각 행의 각 열을 스캔하여 왼쪽 상단에서 오른쪽 하단으로 이동하며 반환한다.  
nextRow와 nextCol이라는 두 인덱스를 사용하여 이를 수행한다.

```tsx
//index.mjs
import { Matrix } from './matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

const iterator = matrix2x2[Symbol.iterator]();
let iteratorResult = iterator.next();
while (!iteratorResult.done) {
  console.log(iteratorResult.value);
  iteratorResult = iterator.next();
}
//11
//12
//21
//22
```

## 9-4-3 네이티브 JavaScript 인터페이스로서의 iterator와 iterable

표준화된 인터페이스를 가지면 위 두 가지 프로토콜을 중심으로 언어 자체뿐만 아니라 제3자의 코드를 모델링할 수 있다.  
이런 식으로 반복가능자를 입력 받는 문장뿐 아니라 API도 가질 수 있게 된다.  
반복가능자를 허용하는 가장 분명한 구문은 for..of 루프이다.

```tsx
import { Matrix } from '../iterable/matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

for (const element of matrix2x2) {
  console.log(element);
}
/**
11
12
21
22
 */
```

반복가능자와 호환되는 또 다른 구조는 전개 구문(spread operator)이다.

```tsx
import { Matrix } from '../iterable/matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

const flattenedMatrix = [...matrix2x2];
console.log(flattenedMatrix); //[ '11', '12', '21', '22' ]
```

비슷하게, 구조 분해 할당(destructuring assignment)과 함께 반복가능자를 사용할 수도 있다.

```tsx
import { Matrix } from '../iterable/matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

const [a, b, c, d] = matrix2x2;
console.log(a, b, c, d); //11 12 21 22

const [a1, b1, c1, d1] = [...matrix2x2]; //확인해보고 싶어서 작성한거...
console.log(a1, b1, c1, d1); //11 12 21 22
```

이 외에 아래는 반복가능자를 허용하는 JavaScript 내장 API이다.

- Map([iterable])
- WeakMap([iterable])
- Set([iterable])
- WeakSet([iterable])
- Promise.all(iterable)
- Promise.race(iterable)
- Array.from(iterable)

노드 측면에서 반복가능자를 허용하는 주목할 만한 API는 stream.Readable, from(iterable, [options])이며, 반복가능자 객체를 읽어 스트림을 생성한다.  
Javascript 자체는 위에 본 API 및 구조에서 함께 사용할 수 있는 많은 반복가능자를 정의하고 있다.  
가장 볼만한 반복가능자는 Array이지만, Map 및 Set과 같은 다른 데이터 구조, 심지어는 String 조차도 @@iterator 함수를 구현하고 있다.  
Node.js 영역에서 Buffer는 아마도 가장 주목할 만한 반복가능자일 것이다.

<aside>
💡 배열에 중복 요소가 포함되어 있지 않은지 확인하는 방법은 다음과 같다.   
uniqArray = Array.from(new Set(arrayWithDuplicates)).   
이것은 또한 반복가능자가 어떻게 공유 인터페이스를 사용하여 서로 다른 구성 요소끼리 통신할 수 있는 방법을 제공하는지 보여준다.

</aside>

## 9-4-4 제네레이터

ES2015(ES6) 사양은 반복자와 미접하게 관련된 구문 구조를 도입했다.  
**세미코루틴**(semicoroutines)이라고 하는 **제네레이터**에 대해 이야기할 것이다.  
이것은 다른 진입점이 있을 수 있는 표준 함수를 일반화 한다.

표준 함수에서는 함수 자체의 호출에 해당하는 진입점을 하나만 가질 수 있지만 제네레이터는 (yield 문을 사용하여) 일시 중단된 다음 나중에 해당 지점에서 다시 시작할 수 있다.  
무엇보다도, 제네레이터는 반복자를 구현하는데 매우 적합하다.  
제네레이터 함수에서 반환하는 제네레이터 객체는 실제로 반복자면서 반복가능자이다.

### 이론상의 제네레이터

```tsx
function* myGenerator() {
  //제네레이터의 바디 부분
}
```

제네레이터 함수를 호출해도 바로 본문이 실행되지는 않고, 반복자이면서 반복가능자인 **제네레이터 객체**를 반환한다.  
그리고 제네레이터 객체에서 next()를 호출하면 yield 명령어가 호출되거나 제네레이터에서 반환이 발생할 때까지(암시적 혹은 명시적인 반환 명령어로) 제네레이터의 실행을 시작하거나 재개한다.

제네레이터 내에서 yield 키워드 다음에 값 x를 반환하는 것은 반복자에서 `{ done: false, value: x }` 를 반환하는 것과 같고,  
제네에이터가 종료되며 x를 반환하는 것은 반복자에서 `{ done: true, value: x }` 를 반환하는 것과 같다.

### 간단한 제네레이터 함수

아래는 위에서 설명한 내용을 보여주기 위한 제네레이터 소스이다.

```tsx
//fruitGenerator.js
function* fruitGenerator() {
  yield 'peach';
  yield 'watermelon';
  return 'summer';
}

const fruitGeneratorObj = fruitGenerator();
console.log(fruitGeneratorObj);
console.log(fruitGeneratorObj.next()); // 1
console.log(fruitGeneratorObj.next()); // 2
console.log(fruitGeneratorObj.next()); // 3
/**
Object [Generator] {}
{ value: 'peach', done: false }
{ value: 'watermelon', done: false }
{ value: 'summer', done: true }
 */
```

1. fruitGeneratorObj.next()가 처음 호출되었을 때 제네레이터는 첫 번째 yield 명령에 도달할 때까지 실행을 계속하여 제네레이터를 일시 중지하고 호출자에게 ‘peach’ 값을 반환한다.
2. fruitGeneratorObj.next()의 두 번째 호출에서 제네레이트는 두 번째 yield 명령에서 다시 일시 정지하고 호출자에게 ‘watermelon’ 값을 반환한다.
3. fruitGeneratorObj.next()의 마지막 호출로 인해 제네레이터의 실행은 마지막 명령인 return 문에서 재개된다.
   이는 제네레이터를 종료하고 ‘summer’ 값과 함께 done 속성이 true로 설정된 객체를 반환한다.  


제네레이터도 반복 가능하므로 for…of 루프에서 사용할 수 있다.

```tsx
for (const fruit of fruitGenerator()) {
  console.log(fruit);
}
/**
peach
watermelon

summer는 제네레이터에 의해 생성되는 값이 아니라 반복이 종료되어 반환하는(요소가 아닌) 값이기 때문에 출력하지 않음
 */
```
