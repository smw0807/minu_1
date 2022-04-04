/**
 * 여러 함수를 클래스로 묶기
 */

function acquireReading() {
  return {
    customer: 'ivan',
    quantity: 10,
    month: 5,
    year: 2017
  }
}

// const aReading = acquireReading();
// console.log(aReading);
// const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;
//===================

//레코드 캡슐화?
class Reading {
  constructor(data) {
    this._customer = data.customer;
    this._quantity = data.quantity;
    this._month = data.month;
    this._year = data.year;
  }

  get customer() { return this._customer }
  get quantity() { return this._quantity }
  get month() { return this._month }
  get year() { return this._year }

  // get calculateBaseCharge() {
  //   return baseRate(this.month, this.year) * this.quantity;
  // }
  get baseCharge() {
    return baseRate(this.month, this.year) * this.quantity;
  }
}

const rawReading = acquireReading();
const aReading = new Reading(rawReading);
console.log(aReading);
// const basicChargeAmount = aReading.calculateBaseCharge;
const basicChargeAmount = aReading.baseCharge;
console.log(basicChargeAmount);