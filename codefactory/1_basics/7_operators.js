let number = 1;
let result = 1;

result = number++;
console.log(result, number); //1 2
result = number--;
console.log(result, number); //2 1

result = ++number;
console.log(result, number); //2 2

result = --number;
console.log(result, number); //1 1

result += number;
console.log(result, number); //2 1

result -= number;
console.log(result, number); //1 1

console.log('--------------------------------');

console.log(1 == 1);
console.log(1 == '1');
console.log(1 === '1');
console.log(1 === 1);
console.log(1 != 1);
console.log(1 != '1');
console.log(1 !== '1');
console.log(1 !== 1);

console.log('--------------------------------');

// && 조건은 모두 true여야 true를 반환한다.
console.log(true && true); //true
console.log(true && false); //false

// || 조건은 하나라도 true면 true를 반환한다.
console.log(true || false); //true
console.log(false || false); //false

// ! 조건은 true면 false를 반환하고 false면 true를 반환한다.
console.log(!true); //false
console.log(!false); //true

console.log('--------------------------------');

console.log(true && 'hi'); //hi
console.log(false && 'hi'); //false
console.log(true || 'hi'); //true
console.log(false || 'hi'); //hi

console.log(true && true && 'hi'); //hi
console.log(true && false && 'hi'); //false

console.log('--------------------------------');
console.log(2 ** 2);
console.log(10 ** 3);

console.log('--------------------------------');
