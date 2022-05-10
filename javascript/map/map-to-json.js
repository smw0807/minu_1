const item = new Map();

const a = {
  name: 'a',
  code: 1,
  children: []
}
const b = {
  name: 'b',
  code: 2,
  children: []
}
const c = {
  name: 'c',
  code: 3,
  children: []
}
item.set(a.code, a);
item.set(b.code, b);
item.set(c.code, c);
// console.log(item);
const tmp = item.get(2);
tmp.children.push({name:'b2', code: 21, children: []});
item.set(b.code, tmp);
// console.dir(item, {depth: 5});
console.log('convert map to json');
let result = [];
item.forEach( (v, k, m) => {
  result.push(v);
})
// console.dir(result, {depth: 5});
// item.values()
// const convert = Object.fromEntries(item);
// console.dir(convert, {depth: 5});
