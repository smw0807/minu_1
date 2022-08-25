const arr = [1, 2, 3, 4, 5];
let result = arr.map(v => {
  console.log(v);
  return v;
});
console.log('=============');
console.log('arr : ', arr);
console.log('result : ', result);
console.log('arr === result : ', arr === result);
