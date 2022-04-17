/**
 * _.cloneDeep?
 */
const { cloneDeep } = require('lodash');

/**
 * aa에 a를 할당
 * a의 값을 변경
 * a와 aa 둘다 값이 바뀜
 */
const a = {
  a: 'aa',
  b: 'bb'
}
const aa = a;
a.a = '1';
console.log('a : ', JSON.stringify(a));
console.log('aa : ', JSON.stringify(aa));
/**
a :  {"a":"1","b":"bb"}
aa :  {"a":"1","b":"bb"}
 */
console.log('------');

/**
 * bb에 b를 깊은 복사?
 * b의 값을 변경
 * bb는 처음 복사된 b 값을 가지고 있음
 * b만 값이 바뀜
 */
const b = {
  a: 'aa',
  b: 'bb'
}
const bb = cloneDeep(b);
b.a = '2'; 
console.log('b : ', JSON.stringify(b));
console.log('bb : ', JSON.stringify(bb));
/**
b :  {"a":"2","b":"bb"}
bb :  {"a":"aa","b":"bb"}
 */

