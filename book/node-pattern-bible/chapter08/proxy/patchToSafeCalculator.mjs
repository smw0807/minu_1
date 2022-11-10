import { StackCalculator } from './stackCalculator.mjs';

function patchToSafeCalculator(calculator) {
  const divideOrig = calculator.divide;
  calculator.divide = () => {
    //추가적인 검증 로직
    const divisor = calculator.peekValue();
    if (divisor === 0) throw Error('Division by 0');
    //Subject에 유요한 위임자일 경우
    return divideOrig.apply(calculator);
  };
  return calculator;
}

const calculator = new StackCalculator();
const safeCalculator = patchToSafeCalculator(calculator);

calculator.putValue(3); //[3]
calculator.putValue(2); //[3, 2]
console.log(calculator.multiply()); //3 * 2 = 6

safeCalculator.putValue(2); //[6, 2]
console.log(safeCalculator.multiply()); //6 * 2 = 12

calculator.putValue(0); // [12, 0];
console.log(calculator.divide()); // 12 / 0 = Infinity

safeCalculator.clear(); //[]
safeCalculator.putValue(4); //[4]
safeCalculator.putValue(0); //[4, 0]
console.log(safeCalculator.divide()); //4 / 0 => Error
