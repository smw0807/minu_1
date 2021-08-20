const a = [
  {aa: 'aa'},
  {bb: 'bb'}
]
const b = [
  {cc: 'cc'},
  {dd: 'dd'}
]
/**
 [
  {aa: 'aa'},
  {bb: 'bb'},
  {cc: 'cc'},
  {dd: 'dd'}
 * ]
 */

let rs = a.reduce( (acc, cur, idx, ef) => {
  acc.push(cur);
  return acc;
}, []);

rs = b.reduce( (acc, cur, idx, ef) => {
  acc.push(cur);
  return acc;
}, rs);
console.log(rs);
//[ { aa: 'aa' }, { bb: 'bb' }, { cc: 'cc' }, { dd: 'dd' } ]