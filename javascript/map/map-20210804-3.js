const arr = [1, 2, 3, 4, 5];
console.log('요소', '인덱스', '배열');
let result = arr.map((e, i, arr) => {
  console.log(e, i, arr);
});
