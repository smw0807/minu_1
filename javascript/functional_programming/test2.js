/**
 * 인자로 받지 않은 변수를 사용해서 순수함수가 아님.
 */
const arr = [1, 2, 3, 4, 5];
const condition = function (x) {
  console.log('condition', x);
  return x % 2 === 0;
}
const ex = function (array) {
  console.log('ex', array);
  return array.filter(condition);
};
console.log(arr);
ex(arr);
console.log(arr);

//이런 식으로해야 한다는데 이해를 못하겠음
const ex2 = function (array, cond) {
  return array.filter(cond)
}
ex2(arr, condition);