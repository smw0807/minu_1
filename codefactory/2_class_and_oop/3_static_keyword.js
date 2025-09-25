class IdolModel {
  name;
  year;
  /**
   * 1) 클래스 자체에 속하는 값
   * 2) 인스턴스를 생성하지 않고도 접근할 수 있는 값
   */
  static groupName = '아이브';
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  static returnGroupName() {
    return this.groupName;
  }
}

const yuJin = new IdolModel('안유진', 2003);
console.log(yuJin);
console.log(IdolModel.groupName);
console.log(IdolModel.returnGroupName());

console.log('----- IdolModel2 -----');
/**
 * Factory constructor
 */
class IdolModel2 {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  static fromObject(object) {
    return new IdolModel2(object.name, object.year);
  }

  static fromList(list) {
    return new IdolModel2(list[0], list[1]);
  }
}

const yuJin2 = IdolModel2.fromObject({ name: '안유진', year: 2003 });
console.log(yuJin2);

const wonYoung = IdolModel2.fromList(['원영', 2004]);
console.log(wonYoung);
