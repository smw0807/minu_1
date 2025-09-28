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

## static

클래스 자체에 속하는 값

```js
class IdolModel {
  name;
  year;
  /**
   * 1) 클래스 자체에 속하는 값
   * 2) 인스턴스를 생성하지 않고도 접근할 수 있는 값
   */
  static groupName = '아이브';
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  static returnGroupName() {
    return this.groupName;
  }
}

const yuJin = new IdolModel('안유진', 2003);
console.log(yuJin);
console.log(IdolModel.groupName);
console.log(IdolModel.returnGroupName());

console.log('----- IdolModel2 -----');
/**
 * Factory constructor
 */
class IdolModel2 {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  static fromObject(object) {
    return new IdolModel2(object.name, object.year);
  }

  static fromList(list) {
    return new IdolModel2(list[0], list[1]);
  }
}

const yuJin2 = IdolModel2.fromObject({ name: '안유진', year: 2003 });
console.log(yuJin2);

const wonYoung = IdolModel2.fromList(['원영', 2004]);
console.log(wonYoung);
```

## 상속

상속(inheritance)은 객체들 간의 관계를 구축하는 방법이다.  
슈퍼클래스 또는 부모 클래스 등의 기존의 클래스로부터 속성과 동작을 상속받을 수 있다.

```js
class IdolModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

class FemaleIdolModel extends IdolModel {
  dance() {
    return `저는 ${this.name}이고, ${this.year}년생입니다. 전 춤을 추어요`;
  }
}

class MaleIdolModel extends IdolModel {
  sing() {
    return `저는 ${this.name}이고, ${this.year}년생입니다. 전 노래를 부르어요`;
  }
}

const yuJin = new FemaleIdolModel('안유진', 2003);
console.log(yuJin);
console.log(yuJin.dance());

const jiMin = new MaleIdolModel('지민', 1995);
console.log(jiMin);
console.log(jiMin.sing());

console.log(' ---------------------- ');

console.log(yuJin instanceof IdolModel); //true
console.log(yuJin instanceof FemaleIdolModel); //true
console.log(yuJin instanceof MaleIdolModel); //false

console.log(' ---------------------- ');
console.log(jiMin instanceof IdolModel); //true
console.log(jiMin instanceof FemaleIdolModel); //false
console.log(jiMin instanceof MaleIdolModel); //true
```

## super

```js
class IdolModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  sayHello() {
    return `안녕하세요, 저는 ${this.name}입니다.`;
  }
}

class FemaleIdolModel extends IdolModel {
  part;

  // super
  constructor(name, year, part) {
    super(name, year);
    this.part = part;
  }

  // override
  sayHello() {
    // return `안녕하세요, 저는 ${this.name}이고, ${this.part}을 맡고 있습니다.`;
    return `${super.sayHello()} 저는 ${this.part}을 맡고 있습니다.`;
  }
}

const yuJin = new FemaleIdolModel('안유진', 2003, '보컬');
console.log(yuJin);

const wonYoung = new IdolModel('장원영', 2004);
console.log(wonYoung.sayHello());

console.log(yuJin.sayHello());
```
