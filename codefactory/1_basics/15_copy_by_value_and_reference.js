/**
 * Copy by Value and Reference
 * Copy by Value: 값에 의한 전달
 * Copy by Reference: 참조에 의한 전달
 *
 * 1) 기본적으로 모든 primitive 값은 copy by value로 전달된다.
 * 2) 객체는 copy by reference로 전달된다.
 */

let original = '안녕하세요';
let clone = original;

console.log(original);
console.log(clone);

clone += ' 송민우 입니다.';
console.log('--------------------------------');
console.log(original);
console.log(clone);

console.log('--------------------------------');

let originalObj = {
  name: '안유진',
  group: '아이브',
};
let cloneObj = originalObj;

console.log(originalObj);
console.log(cloneObj);

originalObj['group'] = '블랙핑크';
console.log('--------------------------------');
console.log(originalObj);
console.log(cloneObj);

console.log(originalObj === cloneObj);
console.log(original === clone);

console.log('--------------------------------');
originalObj = {
  name: '송민우',
  group: '군자',
};
cloneObj = {
  name: '송민우',
  group: '군자',
};
console.log(originalObj === cloneObj);

console.log('--------------------------------');

const yujin1 = {
  name: '안유진',
  group: '아이브',
};
const yujin2 = yujin1;
const yujin3 = {
  name: '안유진',
  group: '아이브',
};
console.log(yujin1 === yujin2);
console.log(yujin1 === yujin3);
console.log(yujin2 === yujin3);

console.log('--------------------------------');

const yujin4 = { ...yujin1 };
console.log(yujin1 === yujin4);
yujin1.group = '블랙핑크';
console.log(yujin1);
console.log(yujin4);

console.log('--------------------------------');
