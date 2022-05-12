/**
 * 클래스 추출하기
 */
class Person {
  constructor(name, telephoneNumber, officeAreaCode, officeNumber) {
    this._name = name;
    this._telephoneNumber = telephoneNumber;
    this._officeAreaCode = officeAreaCode;
    this._officeNumber = officeNumber;
  }

  get name() { return this._name; }
  set name(arg) { this._name = arg; }
  
}