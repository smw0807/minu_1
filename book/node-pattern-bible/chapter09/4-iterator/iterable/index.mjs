import { Matrix } from './matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);
matrix2x2.set(1, 0, '31');
matrix2x2.set(1, 1, '32');
const iterator = matrix2x2[Symbol.iterator]();
let iteratorResult = iterator.next();
while (!iteratorResult.done) {
  console.log(iteratorResult.value);
  iteratorResult = iterator.next();
}
