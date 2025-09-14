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
