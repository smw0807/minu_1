/**
 * map funciton ?
 * forEach와 마찬가지로 Array의 각 요소를 순회하며 callback 함수를 실행한다.
 * 다만, callbkack에서 return 되는 값을 배열로 만들어냄
 * 사용법 = [].map(callback, thisArg)
 */
const arr = [0, 1, 2, 3];
let sarr = arr.map(function (el) {
    return el * el;
});
// console.log(sarr);

//arrow function 도 가능
// let sarr = arr.map(el => el * el);
// console.log(sarr);

//callback 함수 인자
let sarr2 = arr.map(function(el, idx, arr) {
    console.log(`${arr} : ${idx} = ${el}`);
});
console.log(sarr2);

