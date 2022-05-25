/**
 * 필드 옮기기?
 */
//고객 클래스
class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._discountRate = discountRate;
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() { return this._discountRate; }
  becomPreferred() {
    this._discountRate += 0.03;
  }
  applyDiscount(amount) {
    return amount.subtract(amount.multiply(this._discountRate));
  }
}
//계약 클래스
class CustomerContract {
  constructor(startDate) {
    this._startDate = startDate;
  }
}
// discountRate 필드를 CustomerContract로 옮기기...?

//1. 필드 캡슐화
class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._setDiscountRate(discountRate);
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() { return this._discountRate; }
  _setDiscountRate(aNumber) { this._discountRate = aNumber; }
  becomPreferred() {
    this._setDiscountRate(this.discountRate + 0.03);
  }
  applyDiscount(amount) {
    return amount.subtract(amount.multiply(this.discountRate));
  }
}
//계약 클래스
class CustomerContract {
  constructor(startDate) {
    this._startDate = startDate;
  }
}

//2. CustomerContract 클래스에 필드 하나와 접근자들을 추가
class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._setDiscountRate(discountRate);
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() { return this._discountRate; }
  _setDiscountRate(aNumber) { this._discountRate = aNumber; }
  becomPreferred() {
    this._setDiscountRate(this.discountRate + 0.03);
  }
  applyDiscount(amount) {
    return amount.subtract(amount.multiply(this.discountRate));
  }
}
//계약 클래스
class CustomerContract {
  constructor(startDate, discountRate) {
    this._startDate = startDate;
    this._discountRate = discountRate;
  }
  get discountRate() { return this._discountRate; }
  set discountRate(arg) { this._discountRate = arg; }
}

//3. Customer 접근자들이 새로운 필드를 사용하도록 수정
class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._contract = new CustomerContract(dateToday());
    this._setDiscountRate(discountRate);
  }

  get discountRate() { return this._contract.discountRate; }
  _setDiscountRate(aNumber) { this._contract.discountRate = aNumber; }
  becomPreferred() {
    this._setDiscountRate(this.discountRate + 0.03);
  }
  applyDiscount(amount) {
    return amount.subtract(amount.multiply(this.discountRate));
  }
}
//계약 클래스
class CustomerContract {
  constructor(startDate, discountRate) {
    this._startDate = startDate;
    this._discountRate = discountRate;
  }
  get discountRate() { return this._discountRate; }
  set discountRate(arg) { this._discountRate = arg; }
}