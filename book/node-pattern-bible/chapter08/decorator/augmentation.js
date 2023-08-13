class StackCalculator {
  constructor() {
    this.stack = [];
  }

  putValue(value) {
    this.stack.push(value);
  }

  getValue() {
    return this.stack.pop();
  }

  peekValue() {
    return this.stack[this.stack.length - 1];
  }

  clear() {
    this.stack = [];
  }

  divide() {
    const divisor = this.getValue();
    const dividend = this.getValue();
    const result = dividend / divisor;
    this.putValue(result);
    return result;
  }

  multiply() {
    const multiplicand = this.getValue();
    const multiplier = this.getValue();
    const result = multiplier * multiplicand;
    this.putValue(result);
    return result;
  }
}

/**
 * 객체 확장(augmentation)
 * 데코레이트되는 객체에 직접 새 함수를 정의해서(몽키 패치) 데코레이트를 수행할 수도 있다.
 */
function patchCalculator(calculator) {
  //새로운 함수
  calculator.add = function () {
    const addend2 = calculator.getValue();
    const addend1 = calculator.getValue();
    const result = addend1 + addend2;
    calculator.putValue(result);
    return result;
  };

  //수정된 함수
  const dividOrig = calculator.divide;
  calculator.divide = () => {
    //추가 검증 로직
    const divisor = calculator.peekValue();
    if (divisor === 0) {
      throw Error('Division by 0');
    }

    //subject에 대한 유효한 위임자(delegates)일 경우
    return dividOrig.apply(calculator);
  };
  return calculator;
}

/*
여기서 calculator와 enhancedCalculator는 동일한 객체를 참조한다.
이는 patchCalculator()가 원래의 계산기 객체를 변형한 후 반환하기 때문이다 
*/
const calculator = new StackCalculator();
const enhancedCalculator = patchCalculator(calculator);

enhancedCalculator.putValue(4);
enhancedCalculator.putValue(3);
console.log(enhancedCalculator.add()); //4+3=7
enhancedCalculator.putValue(2);
console.log(enhancedCalculator.multiply()); //7*2=14
