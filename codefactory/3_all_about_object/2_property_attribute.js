/**
 * Property Attribute
 *
 * 1) 데이터 프로퍼티 - 키와 값으로 형성된 실질적 값을 갖고 있는 프로퍼티
 * 2) 액세서 프로퍼티 - 자체적으로 값을 갖고 있지 않지만 다른 값을 가져오거나
 *                    설정할 때 호출되는 함수로 구성된 프로퍼티
 *                    값을 가져오는 메서드를 getter, 값을 설정하는 메서드를 setter라고 한다.
 */
const yuJin = {
  name: '안유진',
  year: 2003,
};

console.log(Object.getOwnPropertyDescriptor(yuJin, 'name'));
console.log(Object.getOwnPropertyDescriptor(yuJin, 'year'));
/*
{ value: '안유진', writable: true, enumerable: true, configurable: true }
{ value: 2003, writable: true, enumerable: true, configurable: true }
 value: 실질적 값
 writable: 값을 수정할 수 있는지 여부
 enumerable: 열거 가능한지 여부
 configurable: 프로퍼티 어트리뷰트의 재정의가 가능한지 여부를 판단한다
 true: 수정 가능, false: 수정 불가
 true: 열거 가능, false: 열거 불가
 true: 재정의 가능, false: 재정의 불가
*/
console.log('-----');
console.log(Object.getOwnPropertyDescriptor(yuJin, 'name'));
console.log(Object.getOwnPropertyDescriptors(yuJin));
console.log('-----');
const yuJin2 = {
  name: '안유진',
  year: 2003,

  get age() {
    return new Date().getFullYear() - this.year;
  },
  set age(age) {
    this.year = new Date().getFullYear() - age;
  },
};

console.log(yuJin2);
yuJin2.age = 32;
console.log(yuJin2);
console.log(yuJin2.age);
console.log(yuJin2.year);

console.log(Object.getOwnPropertyDescriptor(yuJin2, 'age'));
// yuJin2['height'] = 162;
// console.log(yuJin2);
// console.log(Object.getOwnPropertyDescriptor(yuJin2, 'height'));

Object.defineProperty(yuJin2, 'height', {
  value: 172,
  writable: false,
  enumerable: true,
  configurable: false,
});
console.log(yuJin2);
console.log(Object.getOwnPropertyDescriptor(yuJin2, 'height'));
yuJin2.height = 173;
console.log(yuJin2);
for (let key in yuJin2) {
  console.log(key);
}
