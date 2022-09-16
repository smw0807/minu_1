function solution(n) {
  return [...n.toString()].reduce((v, cur) => parseInt(v) + parseInt(cur), 0);
}

const a = solution(123);
console.log(a);
const b = solution(987);
console.log(b);
