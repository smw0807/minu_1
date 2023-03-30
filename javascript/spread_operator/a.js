let arr = [3, 4, 5];
let arr2 = [1, 2, ...arr];
console.log(arr2); //1, 2, 3, 4, 5

let obj = { a: 1, b: 2, c: 3 };
let obj2 = { c: 4, d: 5 };
let obj3 = { ...obj, ...obj2 };
console.log(obj3); //{ a: 1, b: 2, c: 4, d: 5 }
let obj4 = { ...obj, ...obj2, ...arr2 };
console.log(obj4); //{ '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, a: 1, b: 2, c: 4, d: 5 }
