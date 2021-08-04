const arr = [ 1, 2, 3, 4, 5];
//인자 : 누적값, 현잿값, 인덱스, 요소
let result = arr.reduce( (acc, cur, idx, el) => {
  console.log('================== S : ', idx);
  console.log('누적값 : ', acc);
  console.log('현잿값 : ', cur);
  console.log('인덱스 : ', idx);
  console.log('요  소 : ', el)
  console.log('================== E');
  return acc + cur;
}, 0);
console.log('----------------------------');
//reduceRight는 오른쪽에서 왼쪽으로 진행한다.
let result2 = arr.reduceRight( (acc, cur, idx, el) => { 
  console.log('================== S : ', idx);
  console.log('누적값 : ', acc);
  console.log('현잿값 : ', cur);
  console.log('인덱스 : ', idx);
  console.log('요  소 : ', el)
  console.log('================== E');
  return acc + cur;
}, 0);