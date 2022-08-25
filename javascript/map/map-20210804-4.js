const arr = [
  {
    a1: 'a',
    b1: 'b',
    c1: 'c',
    d1: { dd: 'dd', dd2: 'dd2' },
    e1: ['e', 'ee', 'eee'],
  },
  {
    a2: 'a',
    b2: 'b',
    c2: 'c',
    d2: { dd: 'dd', dd2: 'dd2' },
    e2: ['e', 'ee', 'eee'],
  },
];
console.log('요소', '인덱스', '배열');
let result = arr.map((e, i, arr) => {
  console.log(e, i, arr);
});
