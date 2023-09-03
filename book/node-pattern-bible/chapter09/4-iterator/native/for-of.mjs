import { Matrix } from '../iterable/matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

for (const element of matrix2x2) {
  console.log(element);
}
/**
11
12
21
22
 */
