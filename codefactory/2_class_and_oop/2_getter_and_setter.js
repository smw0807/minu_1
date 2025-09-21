class IdolModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  /**
   * 1) 데이터를 가공해서 새로운 데이터를 반환
   * 2) private한 값을 반환할 때
   */
  get nameAndYear() {
    return `${this.name}-${this.year}`;
  }

  set setName(name) {
    this.name = name;
  }
  set year(year) {
    this.year = year;
  }
}

const yuJin = new IdolModel('안유진', 2003);
console.log(yuJin);
console.log(yuJin.nameAndYear);

yuJin.setName = '송민우';
console.log(yuJin.nameAndYear);

class IdolModel2 {
  #name;
  year;

  constructor(name, year) {
    this.#name = name;
    this.year = year;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }
}

console.log('----- IdolModel2 -----');
const yuJin2 = new IdolModel2('안유진', 2003);
console.log(yuJin2);
// console.log(yuJin2.)
console.log(yuJin2.name);
yuJin2.name = '송민우';
console.log(yuJin2.name);

console.log('----- IdolModel3 -----');
class IdolModel3 {
  name;
  year;

  constructor({ name, year }) {
    this.name = name;
    this.year = year;
  }
}
const yuJin3 = new IdolModel3({ name: '안유진', year: 2003 });
console.log(yuJin3);
