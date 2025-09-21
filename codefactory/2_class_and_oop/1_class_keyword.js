/**
 * Class Keyword
 */
class IdolModel {
  name;
  year;
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  sayName() {
    return `안녕하세요, 저는 ${this.name}입니다.`;
  }
}

const gaeul = new IdolModel('가을', 2002);
console.log(gaeul);
const mirae = new IdolModel('미래', 2003);
console.log(mirae);
const dahyeong = new IdolModel('다현', 2003);
console.log(dahyeong);
const hana = new IdolModel('하나', 2004);
console.log(hana);
const haerin = new IdolModel('해린', 2004);
console.log(haerin);
const yujin = new IdolModel('유진', 2003);
console.log(yujin);

console.log(gaeul.sayName());
console.log(mirae.sayName());
console.log(dahyeong.sayName());
console.log(hana.sayName());
console.log(haerin.sayName());
console.log(yujin.sayName());
