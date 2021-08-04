//reduce를 filter 함수 처럼?
const arr = [ 1, 2, 3, 4, 5];
//인자 : 누적값, 현잿값, 인덱스, 요소 //1: true //0: false
let result = arr.reduce( (acc, cur, idx, el) => {
  if (cur % 2) acc.push(cur) //조건부로 push하면 filter와 같다.// 홀수 값 필터
  return acc;
}, []);//초깃값을 배열로
console.log(result);