const arr = [ 1, 2, 3, 4, 5];
let result = arr.map((v) => {
  console.log(v % 2);
  if (v % 2) {
    return '홀수';
  }
  return '짝수';
})
console.log('=============');
console.log('result : ' , result);
