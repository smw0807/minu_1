class IdolModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  sayHello() {
    return `안녕하세요, 저는 ${this.name}입니다.`;
  }
}

class FemaleIdolModel extends IdolModel {
  part;

  // super
  constructor(name, year, part) {
    super(name, year);
    this.part = part;
  }

  // override
  sayHello() {
    // return `안녕하세요, 저는 ${this.name}이고, ${this.part}을 맡고 있습니다.`;
    return `${super.sayHello()} 저는 ${this.part}을 맡고 있습니다.`;
  }
}

const yuJin = new FemaleIdolModel('안유진', 2003, '보컬');
console.log(yuJin);

const wonYoung = new IdolModel('장원영', 2004);
console.log(wonYoung.sayHello());

console.log(yuJin.sayHello());
