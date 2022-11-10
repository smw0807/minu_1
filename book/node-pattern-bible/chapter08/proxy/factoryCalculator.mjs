import { StackCalculator } from './stackCalculator.mjs';

function createSafeCalculator(calculator) {
  return {
    //프록시된 함수
    divide() {
      //추가 적인 검증 로직
      const divisor = calculator.peekValue();
      if (divisor === 0) throw Error('Division by 0');
      //Subject에 대한 유효한 위임자(delegate)일 경우
      return calculator.divide();
    },

    //위임된 함수들
    putValue(value) {
      return calculator.putValue(value);
    },

    getValue() {
      return calculator.getValue();
    },

    peekValue() {
      return calculator.peekValue();
    },

    clear() {
      return calculator.clear();
    },

    multiply() {
      return calculator.multiply();
    },
  };
}
const calculator = new StackCalculator();
const safeCalculator = createSafeCalculator(calculator);

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
