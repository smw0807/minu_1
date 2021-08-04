//reduce를 map 함수 처럼?
const arr = [ 1, 2, 3, 4, 5];
//인자 : 누적값, 현잿값, 인덱스, 요소
let result = arr.reduce( (acc, cur, idx, el) => {
  acc.push(cur % 2 ? '홀수' : '짝수'); //초깃값에 push
  return acc;
}, []);//초깃값을 배열로
console.log(result);