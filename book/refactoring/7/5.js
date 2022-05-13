/**
 * 클래스 추출하기
 */
class Person {
  constructor(name, telephoneNumber, officeAreaCode, officeNumber) {
    this._name = name;
    this._telephoneNumber = telephoneNumber;
    // this._officeAreaCode = officeAreaCode;
    // this._officeNumber = officeNumber;
    this._telephoneNumber = new TelephoneNumber();
  }

  get name() { return this._name; }
  set name(arg) { this._name = arg; }
  get officeAreaCode() { return this._telephoneNumber.officeAreaCode; }
  set officeAreaCode(arg) { this._telephoneNumber.officeAreaCode = arg; }
  
}
class TelephoneNumber {
  // constructor()
  get officeAreaCode() { return this._officeAreaCode; }
  set officeAreaCode(arg) { this._officeAreaCode = arg; }
}

const a = new Person('minwoo', '01011112222', 2, 5);
console.log(a);
// a.of
a.officeAreaCode = 3;
console.log(a);