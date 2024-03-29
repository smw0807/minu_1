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

### 제네레이터 반복 제어

제네레이터 객체는 일반 반복자보다 유용하다.  
실제 next() 함수는 선택적으로 인자를 허용한다.(반복자 프로토콜에 지정된 대로 반드시 한 개의 인자를 받을 필요는 없다.)  
이러한 인수는 yield 명령어의 반환값으로 전달된다.  
아래는 이를 보여주는 제네레이터이다.

```tsx
//twoWayGenerator.js
function* twoWayGenerator() {
  const what = yield null;
  yield 'Hello ' + what;
}

const twoWay = twoWayGenerator();
console.log(twoWay.next()); //{ value: null, done: false
console.log(twoWay.next('world')); //{ value: 'Hello world', done: false }
```

위 코드는 다음과 같이 작동한다.

1. next() 함수가 처음 호출되면 제네레이터는 첫 번째 yield 문에 도달한 다음 일시 중단된다.
2. next(’world’)가 호출되면 제네레이터는 yield 명령에 있는 일시 중지된 시점에서 다시 시작되만 이번에는 제네레이터로 전달되는 값이 존재한다.  
   이 값은 what 변수에 설정된다.  
   그런 다음 제네레이터는 문자열 Hello에 what 변수를 더하여 결과를 출력한다.

제네레이터 객체에서 제공하는 다른 두 가지 추가적인 함수는 throw() 및 return() 함수이다.  
첫 번째는 next() 함수처럼 동작하지만 제네레이터 내에 마지막 yield 지점에 throw된 것처럼 예외를 발생시키고 done 및 value 속성이 있는 표준 반복자 결과 객체를 반환한다.  
두 번째인 return() 함수는 제네레이터를 강제로 종료하고 다음과 같은 객체를 반환한다.  
`{ done: true, value: returnArgument }` 여기서 returnArgument는 return() 함수에 전달된 인자인다.  
아래는 이 두 가지 함수의 데모를 보여준다.

```tsx
//twoWayGenerator2.js
function* twoWayGenerator() {
  try {
    const what = yield null;
    yield 'Hello ' + what;
  } catch (err) {
    yield 'Hello error: ' + err.message;
  }
}
console.log('Using throw(): ');
const twoWayException = twoWayGenerator();
// console.log(twoWayException.next());
console.log(twoWayException.throw(new Error('Boom!!!')));
/*
Using throw(): 
// { value: null, done: false }
// { value: 'Hello error: Boom!!!', done: false }
Error: Boom!!!
    at Object.<anonymous> (.../twoWayGenerator2.js:12:35)
    at Module._compile (node:internal/modules/cjs/loader:1105:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1159:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
    at node:internal/main/run_main_module:17:47
*/

console.log('Using return():');
const twoWayReturn = twoWayGenerator();
console.log(twoWayReturn.next());
console.log(twoWayReturn.return('returnValue!'));
/*
Using return():
{ value: null, done: false }
{ value: 'returnValue!', done: true }
*/
```

twoWayException은 첫 번째 yield 명령어가 반환되는 즉시 예외가 발생한다.  
이것은 제네레이터 내부에 예외가 발생하는 것과 똑같이 동작하며 이것은 try/catch 블록을 사용하여 다른 예외처럼 포착하고 처리할 수 있음을 의미한다.  
대신 return() 함수는 제네레이터의 실행을 중지하고 주어진 값이 제네레이터에 의해 반환값으로 제공되도록 한다.

### 반복자 대신 제네레이터를 사용하는 방법

제네레이터 객체도 반복자이다.  
제네레이터 함수를 사용하여 반복가능자 객체의 @@iterator 함수를 구현할 수 있다.  
아래는 반복가능자에서 만들었던 matric.js 파일을 제네레이터로 변환한 코드이다.

```tsx
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

  //1
  *[Symbol.iterator]() {
    //2
    let nextRow = 0;
    let nextCol = 0;
    //3
    while (nextRow !== this.data.length) {
      yield this.data[nextRow][nextCol];

      if (nextCol == this.data[nextRow].length - 1) {
        nextRow++;
        nextCol = 0;
      } else {
        nextCol++;
      }
    }
  }
}
```

1. @@iterator 함수가 이제 제네레이터로 됐다.
2. 반복의 상태를 유지하기 위해 사용하는 변수가 이제 제너레이터의 로컬 변수일 뿐인데,  
   이전 버전의 Matrix 클래스에서는 이 두 변수가 클로저의 일부였다.  
   이는 제너레이터가 호출될 때 재 진입 사이에 로컬의 상태가 유지되기 때문에 가능하다.
3. 매트릭스의 요소를 반복하기 위해 표준 루프를 사용하고 있다.  
   이것은 반복자의 next() 함수를 호출하는 루프보다 확실히 더 직관적이다.

제너레이터는 처음부터 반복자를 작성하는 것보다 훌륭한 대안이다.  
반복 루틴의 가독성을 향상시키고 동일한 수준의 (또는 더 나은) 기능을 제공하고 있다.

<aside>
💡 **제너레이터**   
위임 지시자 yield * iterable은 iterable을 인수로 받아들이는 자바스크립트 내장 구문의 또 다른 예이다.   
명령어는 iterable의 요소를 반복하고 각 요소를 하나씩 생성한다.

</aside>

## 9-4-5 비동기 반복자

지금까지 본 반복은 next() 함수에서 동기적으로 값을 반환했다.  
그러나 자바스크립트, 특히 노드에서는 비동기 연산이 필요한 항목에 대해 반복작업을 하는 것이 매우 일반적이다.

예를 들어, HTTP 서버에서 요청한 SQL 쿼리의 결과 또는 REST API 요소에 대한 반복 작업을 한다고 생각해보자.  
이러한 모든 상황에서 next() 함수는 Promise를 반환하는 것이 편리하거나, async/await 구문을 사용해 동기화하는 것이 좋다.

이것을 **비동기 반복자** 라고 한다.  
비동기 반복자는 Promise를 반환한다.  
비동기 함수를 사용하여 반복자의 next() 함수를 정의한다.  
**비동기 반복가능자(async iterable)**는 @@asyncIterator 함수, 즉 Symboilc.asyncIterator 키를 통해 접근할 수 있는 함수를 구현한 객체로 비동기 반복자를 반환(동기적으로)한다.

비동기 반복가능자는 for await…of 구문을 사용하여 반복할 수 있으며, 비동기 함수에만 사용할 수 있다.  
이 구문을 사용하면 본질적으로 반복자 패턴 위에 순차적인 비동기 실행을 구현한다.

for await…of 구문은 Promise 들의 배열과 같이 간단한 반복가능자를 반복하는데 사용할 수 있다.  
이것은 반복자의 모든 요소가 Promise가 아니더라도 동작한다.

아래는 이를 설명하기 위해 URL 목록을 입력으로 받아 사용가능한 상태(up/down)를 반복하여 체크할 수 있는 클래스이다.

```tsx
import superagent from 'superagent';

export class CheckUrls {
  //1
  constructor(urls) {
    this.urls = urls;
  }

  [Symbol.asyncIterator]() {
    const urlsIterator = this.urls[Symbol.iterator](); //2

    return {
      //3
      async next() {
        const iteratorResult = urlsIterator.next(); //4
        if (iteratorResult.done) {
          return { done: true };
        }

        const url = iteratorResult.value;
        try {
          const checkResult = (await superagent.head(url)).redirect(2); //5
          return {
            done: false,
            value: `${url} is up, status: ${checkResult.status}`,
          };
        } catch (err) {
          return {
            done: false,
            value: `${url} is down, error: ${err.message}`,
          };
        }
      },
    };
  }
}
```

1. CheckUrls 클래스 생성자는 URL 목록을 인자로 받는다.  
   반복자와 반복가능자를 사용하는 방법을 알고 있으므로, URL 목록은 어떤 반복가능자라고 할 수 있을 것이다.
2. @@asyncIterator 함수에서 this.urls 객체로부터 반복자를 얻는다.  
   방금 언급했듯이 이것은 반복가능자이어야 한다.  
   이를 위해 @@iterable 함수를 호출하기만 하면 된다.
3. 여기서 next() 함수가 async 함수인 것에 유의할 필요가 있다.  
   즉, 비동기 반복가능자 프로토콜에서 요청된 대로 함상 프라미스를 반환한다.
4. next() 함수에서 urlsIterator를 사용하여 목록의 다음 URL을 가져온다.  
   더 이상 존재하지 않을 경우 `{ done: true }` 를 반환한다.
5. await 명령어를 사용하여 비동기적으로 현재 URL로 전송된 HEAD 요청과 결과를 가져오는 과정을 유의해서 살펴볼것…

아래는 위 CheckUrls 클래스를 for await…of 구문을 사용한 코드

```tsx
import { CheckUrls } from './checkUrls.js';

async function main() {
  const checkUrls = new CheckUrls([
    'https://www.naver.com',
    'https://nodejsdesignpatterns.com',
    'https://example.com',
    'https://mustbedownforsurehopefully.com',
  ]);

  for await (const status of checkUrls) {
    console.log(status);
  }
}
main();
/*
https://www.naver.com is down, error: (intermediate value).redirect is not a function
https://nodejsdesignpatterns.com is down, error: Moved Permanently
https://example.com is down, error: (intermediate value).redirect is not a function
https://mustbedownforsurehopefully.com is down, error: getaddrinfo ENOTFOUND mustbedownforsurehopefully.com
*/
```

for await…of 구문은 비동기 반복가능자를 반복할 수 있는 매우 직관적인 문법을 제공한다.

<aside>
💡 for await…of 루프(및 동기 버전)는 break, return 또는 exception으로 인해 조기에 중단되는 경우 선택적으로 반복자의 return() 메서드를 호출한다.
일반적으로 이것은 반복이 완료될 때 수행되는 정리 작업을 즉각적으로 실행하는 데 사용할 수 있다.

</aside>

## 9-4-6 비동기 제너레이터

제너레이터 또한 **비동기 제너레이터**를 사용할 수 있다.  
**비동기 제너레이터 함수**를 정의하려면 함수 정의 앞에 async 키워드를 추가하면 된다.

```tsx
async function* generatorFunction() {
	...
}
```

비동기 제너레이터는 본문 내에서 await 명령을 사용할 수 있으며 next() 함수의 반환값은 규약에 정의된 done 및 value 속성을 가진 객체를 이행값으로 반환하는 프라미스이다.  
**비동기 제너레이터**는 유효한 비동기 반복자이기도 해서 for await…of 루프로 사용할 수 있다.

아래는 제너레이터가 어떻게 비동기 반복자의 구현을 단순화하는지 보여주기 위해 비동기 반복자에서 작성한 CheckUrls 클래스를 비동기 제너레이터로 변환한 코드이다.

```tsx
//checkUrls.js
import superagent from 'superagent';

export class CheckUrls {
  constructor(urls) {
    this.urls = urls;
  }

  async *[Symbol.asyncIterator]() {
    for (const url of this.url) {
      try {
        const checkResult = (await superagent.head(url)).redirect(2);
        yield `${url} is up, status: ${checkResult.status}`;
      } catch (err) {
        yield `${url} is down, error: ${err.message}`;
      }
    }
  }
}
```

흥미로운 점은….순수 비동기 반복자 대신 비동기 제너레이터를 사용하면 코드가 단순해지고 가독성이 높아지며 명확해진다.

## 9-4-7 비동기 반복자 및 Node.js 스트림

비동기 반복자와 Node.js 읽기 스트림 사이의 관계에 대해 생각해보면 목적과 동작이 많이 비슷하다.  
실제 비동기 반복자는 읽기 스트림과 똑같은 비동기적인 리소스의 데이터를 조각 별로 처리하는데 사용할 수 있기 때문에 읽기 스트림 구조와 같다고 할 수 있다.

stream.Readable이 @@asyncIterator 함수를 구현하여 비동기 반복가능자로 만든 것은 우연이 아니다.  
이것은 for await…of 구조 덕분에 읽기 스트림에서 데이터를 읽을 수 있는 추가적면서 더 직관적인 메커니즘을 제공한다

아래는 현재 프로세스의 stdin 스트림에서 개행 문자를 발견하면 새로운 청크를 발출하는 split()이라는 변환 스트림(transform stream)에 파이프로 연결하고 for await…of 루프를 사용하여 각 줄을 반복하는 코드이다.

```jsx
import split from 'split2';

async function main() {
  const stream = process.stdin.pipe(split());
  for await (const line of stream) {
    console.log(`You wrote: ${line}`);
  }
}
main();
```

읽기 스트림을 사용할 수 있는 이 대안은 매우 직관적이고 간결하다.  
반복자와 스트림의 두 패러다임은 매우 유사해서 쉽게 상호 운용할 수 있다.  
이 점을 명확히 하기 위해서는 `stream.Readable.from(iterable, [options])`함수가 반복가능자(iterable)를 인자로 취한다는 점을 기억해야한다.  
이 인자는 동기 혹은 비동기일 수 있다.  
이 함수는 전달된 반복가능자를 감싸 읽기 스트림으로 반환하는데 반복자의 인터페이스를 읽기 스트림의 인터페이스로 변환 한다.

스트림과 비동기 반복자가 밀접하게 연관되어 있다면 실제 어떤 인터페이스를 사용해야 할까?

- 스트림은 push된다.  
  즉, 데이터가 스트림에 의해 내부 버퍼로 주입된 다음 버퍼에서 소비된다.  
  비동기 반복자는 기본적으로 데이터를 제공한다.(반복자가 다른 로직을 명시적으로 구현하지 않는 한)  
  즉, 데이터는 사용자의 요청 시에만 조회/생성된다.
- 스트림은 기본적으로 내부 버퍼링 및 백프레셔를 제공하기 때문에 이진데이터를 처리하는데 더 적합하다.
- 스트림은 잘 알려져 있고 간편한 API인 pipe()를 사용하여 연결할 수 있지만, 비동기 반복자는 표준화된 연결 방법을 제공하지 않는다.

또한, EventEmitter도 반복할 수 있다.  
events.on(emitter, eventName) 유틸리티 함수를 사용하면 eventName으로 지정된 이름과 일치하는 모든 이벤트를 반환하는 반복자를 얻을 수 있는 반복가능자를 획득할 수 있다.

## 9-4-2 실전에서

반복자, 특히 비동기 반복자는 Node.js 생태계에서 빠르게 인기를 얻고 있다.  
실제로 많은 상황에서 스트림 대신 선호되는 대안이 되고 있으며, 사용자 정의로 만들어진 메커니즘을 대체하고 있다.

예를들어, @databases/pg, @databases/mysql, @databases/sqlite 패키지는 각각 Postgres, MySQ, SQLite 데이터베이스와 연결하는 유명한 라이브러리들이다.  
이들은 모두 쿼리 결과를 쉽게 반복하는데 사용할 수 있는 비동기 반복가능자를 반환하는 queryStream()이라는 함수를 제공한다.

```tsx
for await (const record of db.queryStream(sql`SELECT * FROM my_table`)) {
  //record를 가지고 필요한 작업을 수행
}
```

내부적으로는 반복자 쿼리 결과에 대한 커서를 자동으로 처리하므로 for await…of 구문을 사용하여 간단한 루프를 수행하면 된다.
