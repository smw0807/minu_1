const a = ['a', 'b', 'c', 'd', 'c', 'c'];
const b = ['a', 'b', 'c', 'd', 'e'];

const setA = new Set(a);
const setB = new Set(b);
const c = a.filter(x => b.includes(x));

console.log(c);


