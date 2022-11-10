import { StackCalculator } from './stackCalculator.mjs';
class SafeCalculator {
  constructor(calculator) {
    this.calculator = calculator;
  }

  //프록시 함수
  divide() {
    //추가적인 검증 로직
    const divisor = this.calculator.peekValue();
    if (divisor === 0) throw Error('Division by 0');
    //Subject에 대한 유효한 위임자(delegate)일 경우
    return this.calculator.divide();
  }

  //위임된 함수들
  putValue(value) {
    return this.calculator.putValue(value);
  }

  getValue() {
    return this.calculator.getValue();
  }

  peekValue() {
    return this.calculator.peekValue();
  }

  clear() {
    return this.calculator.clear();
  }

  multiply() {
    return this.calculator.multiply();
  }
}

const calculator = new StackCalculator();
const safeCalculator = new SafeCalculator(calculator);

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
