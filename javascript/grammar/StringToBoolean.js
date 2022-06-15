const test = 'true';
console.log(test); //string
console.log(test === true); //false

const tt = JSON.parse(test);
console.log(tt); //boolean
console.log(tt === true); //true

const a = Boolean(test); //
console.log(a); //boolean
console.log(a === true); //true

const b = eval(test);
console.log(b);