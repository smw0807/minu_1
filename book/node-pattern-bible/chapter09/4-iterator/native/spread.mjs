import { Matrix } from '../iterable/matrix.mjs';

const matrix2x2 = new Matrix([
  ['11', '12'],
  ['21', '22'],
]);

const flattenedMatrix = [...matrix2x2];
console.log(flattenedMatrix); //[ '11', '12', '21', '22' ]

const test1 = matrix2x2;
console.log(test1); //Matrix { data: [ [ '11', '12' ], [ '21', '22' ] ] }
