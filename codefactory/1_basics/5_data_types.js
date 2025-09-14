/**
 * Data Types
 *
 * 6개의 Primitive Type과
 * 1개의 오브젝트 타입
 *
 * 1) Number
 * 2) String
 * 3) Boolean
 * 4) undefined
 * 5) null
 * 6) Symbol
 *
 * 7) Object
 *  - Function
 *  - Array
 *  - Object
 */

const infinity = Infinity;
const nInfinite = -Infinity;
console.log(typeof infinity);
console.log(typeof nInfinite);

const notANumber = NaN;
console.log(typeof notANumber);

/**
 * Template Literal
 * 1) newLine -> \n
 * 2) Tab -> \t
 * 3) Backslash -> \\
 * 4) Dollar Sign -> $
 * 5) Backtick -> `
 */
const text = 'Hello\nWorld\t$';
console.log(text);

const test1 = '1';
const test2 = '1';
console.log(test1 === test2);

const symbol1 = Symbol('symbol');
const symbol2 = Symbol('symbol');
// 유일무이한 값을 가지기 때문에 false가 나옴
console.log(symbol1 === symbol2);

const dictionary = {
  apple: '사과',
  banana: '바나나',
};
console.log(dictionary.apple);
