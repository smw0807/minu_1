/**
 * ?? nullish coalescing 연산자
 * 왼쪽이 null, undefined면 오른쪽 값을 보여주기
 */

let user = {
  name : 'song'
}
console.log( undefined ?? '잉??');
// console.log(age.value);
console.log(user.age?.value ?? null); //undefined라 null로

let users;
console.log(users);


const a = process.env.name || 'minwoo';
console.log(a);
const b = process.env.name ?? 'minwoo';
console.log(b);
/**
 * ! || 와 ?? 의 차이점
 * ||은 0, "", false, undefined 같은 falsy 값을 전부 검사하는 연산자
 * ??은 unll과 undefined 같은 nulish 만 검사하는 연산자
 */

const c = null || 'hi';
console.log('c : ', c);
const d = null ?? 'hi';
console.log('d : ', d);

const _e = true || false;
console.log('_e : ', _e);
const e = true ?? false;
console.log('e : ', e);

const _f = false || true;
console.log('_f : ', _f); //true
const f = false ?? true;
console.log('f : ', f);
