# 인프런 코드팩토리 JavaScript 강의

# Data Types

6개의 Primitive Type과 1개의 오브젝트 타입

1. Number
2. String
3. Boolean
4. undefined
5. null
6. Symbol

7. Object

- Function
- Array
- Object

## Undefined

사용자가 직접 값을 초기화하지 않았을 때 지정되는 값  
직접 undefined로 값을 초기화하는 건 지향해야 한다.

## null

undefined와 마찬가지로 값이 없다는 뜻이나  
JS에서는 개발자가 명시적으로 없는 값으로 초기화할 때 사용된다.

## Symbol

유일무이한 값을 생성할때 사용한다.  
다른 프리미티브 값들과 다르게 Symbol 함수를 호출해서 사용한다.

```js
const symbol1 = Symbol('symbol');
const symbol2 = Symbol('symbol');
// 유일무이한 값을 가지기 때문에 false가 나옴
console.log(symbol1 === symbol2);
```

## Object

Map  
key:value의 쌍으로 이루어져 있다.

# Hoisting

모든 변수 선언문이 코드의 최상단으로 이동되는 것처럼 느껴지는 현상을 이야기한다.

# 논리 연산자

```js
// && 조건은 모두 true여야 true를 반환한다.
console.log(true && true); //true
console.log(true && false); //false

// || 조건은 하나라도 true면 true를 반환한다.
console.log(true || false); //true
console.log(false || false); //false

// ! 조건은 true면 false를 반환하고 false면 true를 반환한다.
console.log(!true); //false
console.log(!false); //true
```

## 단축 평가 (short circuit evaluation)

&&를 사용했을 때 좌측이 true면 우측 값 반환  
&&를 사용했을 때 좌측이 false면 좌측 값 반환  
||를 사용했을 때 좌측이 true면 좌측 값 반환
||를 사용했을 때 좌측이 false면 우측 값 반환

```js
console.log(true && 'hi'); //hi
console.log(false && 'hi'); //false
console.log(true || 'hi'); //true
console.log(false || 'hi'); //hi

console.log(true && true && 'hi'); //hi
console.log(true && false && 'hi'); //false
```

# Class

클래스는 객체지향 프로그래밍에서 특정 객체(인스턴스)를 생성하기 위한 변수와 메소드(함수)를 정의하는 일종의 틀이다.  
정보를 일반화해서 정리하는 방법!
