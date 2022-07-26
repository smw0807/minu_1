class ChargeCalculator {
  constructor(customer, usage, provider) {
    this._customer = customer;
    this._usage = usage;
    this._provider = provider;
  }
  get baseCharge() {
    return this._customer.baseRate * this._usage;
  }
  get charge() {
    return this.baseCharge + this._provider.connectionCharge;
  }
}

//호출
var monthCharge = new ChargeCalculator(customer, usage, provider).charge();

//1. 함수로 추출
function charge(customer, usage, provider) {
  return new new ChargeCalculator(customer, usage, provider).charge();
}
var monthCharge = charge(customer, usage, provider);

//2
class ChargeCalculator {
  constructor(customer, usage, provider) {
    this._customer = customer;
    this._usage = usage;
    this._provider = provider;
  }
  // get baseCharge() {
  //   return this._customer.baseRate * this._usage;
  // }
  get charge() {
    const baseCharge = this._customer.baseRate * this._usage;
    return baseCharge + this._provider.connectionCharge;
  }
}

//3
class ChargeCalculator {
  constructor(customer, usage, provider) {
    this._customer = customer;
    this._usage = usage;
    this._provider = provider;
  }

  charge(customer, usage, provider) {
    const baseCharge = this._customer.baseRate * this._usage;
    return baseCharge + this._provider.connectionCharge;
  }
}
function charge(customer, usage, provider) {
  return new new ChargeCalculator(customer, usage, provider)
                          .charge(customer, usage, provider);
}

//4
class ChargeCalculator {
  constructor(customer, usage, provider) {
    this._usage = usage;
    this._provider = provider;
  }

  charge(customer, usage, provider) {
    const baseCharge = customer.baseRate * usage;
    return baseCharge + provider.connectionCharge;
  }
}

//5 클래스 안의 명령 charge는 지우고 함수로 대체...
function charge(customer, usage, provider) {
  const baseCharge = customer.baseRate * usage;
  return baseCharge + provider.connectionCharge;
}