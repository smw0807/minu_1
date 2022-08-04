const map = new Map();

console.log(map);
map.set(1, {a: 'aaa', b: 0});
console.log(map);
console.log('change');
const a = map.get(1);
a.a = 'bbb';
map.set(1, a);
console.log(map);