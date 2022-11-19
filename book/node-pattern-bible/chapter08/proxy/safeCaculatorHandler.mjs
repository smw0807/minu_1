import { StackCalculator } from './stackCalculator.mjs';
const safeCalculatorHandler = {
  get: (target, property) => {
    if (property === 'divide') {
      //프록시된 함수
      return function () {
        //추가적인 검증 로직
        const divisor = target.peekValue();
        if (divisor === 0) throw Error('Division by 0');

        //Subject에 대한 유효한 위임자일 경우
        return target.divide();
      };
    }
    //위임된 함수들과 속성들
    return target[property];
  },
};

const calculator = new StackCalculator();
const safeCalculator = new Proxy(calculator, safeCalculatorHandler);

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
