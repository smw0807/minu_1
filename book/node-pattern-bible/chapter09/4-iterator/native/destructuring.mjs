import { Matrix } from '../iterable/matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

const [a, b, c, d] = matrix2x2;
console.log(a, b, c, d); //11 12 21 22

const [a1, b1, c1, d1] = [...matrix2x2]; //확인해보고 싶어서 작성한거...
console.log(a1, b1, c1, d1); //11 12 21 22
