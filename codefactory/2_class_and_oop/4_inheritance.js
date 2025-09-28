class IdolModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

class FemaleIdolModel extends IdolModel {
  dance() {
    return `저는 ${this.name}이고, ${this.year}년생입니다. 전 춤을 추어요`;
  }
}

class MaleIdolModel extends IdolModel {
  sing() {
    return `저는 ${this.name}이고, ${this.year}년생입니다. 전 노래를 부르어요`;
  }
}

const yuJin = new FemaleIdolModel('안유진', 2003);
console.log(yuJin);
console.log(yuJin.dance());

const jiMin = new MaleIdolModel('지민', 1995);
console.log(jiMin);
console.log(jiMin.sing());

console.log(' ---------------------- ');

console.log(yuJin instanceof IdolModel);
console.log(yuJin instanceof FemaleIdolModel);
console.log(yuJin instanceof MaleIdolModel);

console.log(' ---------------------- ');
console.log(jiMin instanceof IdolModel);
console.log(jiMin instanceof FemaleIdolModel);
console.log(jiMin instanceof MaleIdolModel);
