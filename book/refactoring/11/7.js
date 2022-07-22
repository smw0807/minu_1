class Person1 {
  get name() { return this._name; }
  set name(arg) { this._name = arg; }
  get id() { return this._id; }
  set id(arg) { this._id = arg; }
}

const smw = new Person1();
console.log(smw);
smw.name = 'Song Min Woo';
smw.id = 'smw0807';
console.log(smw);
// constructor 없어도 들어감
//==========================================================================
class Person2 {
  constructor(id) {
    this._id = id;
  }
  get name() { return this._name; }
  set name(arg) { this._name = arg; }
  get id() { return this._id; }
}
console.log("--------------");
const smw2 = new Person2();
smw2.name = 'minwoo';
smw2.id = 'smw001'; //undefined 뜸
console.log(smw2);
//==========================================================================
class Person3 {
  constructor(id) {
    this._id = id;
  }
  get name() { return this._name; }
  set name(arg) { this._name = arg; }
  get id() { return this._id; }
}
console.log('------------------');
const smw3 = new Person3('smw002');
smw3.name = 'minu';
console.log(smw3);