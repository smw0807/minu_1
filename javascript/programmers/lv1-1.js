function run(num) {
  var answer = '';
  if (typeof num !== 'number') return new Error('parameter is not number type');
  if (num === 0) return 'Even';
  if (num % 2 === 0) {
    answer = 'Even';
  } else {
    answer = 'Odd';
  }
  return answer;
}

const a = run(3);
const b = run(4);
console.log(a);
console.log(b);
