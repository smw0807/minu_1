/**
 * 함수형 프로그래밍의 대표적인 메소드 map, filter, reduce
 */
const arr = [1, 2, 3, 4, 5];
console.log(arr);
const map = arr.map(function(v) {
  return v * 2;
})
console.log(map);
// [ 1, 2, 3, 4, 5 ]
// [ 2, 4, 6, 8, 10 ]
// 원본 데이터는 변하지 않았고, 받은 인자값 만을 이용해 결과를 만듬 (순수함수)
