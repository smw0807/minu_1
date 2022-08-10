class Person {
  static counter = 0; //정적 프로퍼티
  constructor(name, cnt) {
    this._name = name;
    this._cnt = cnt;
  }
  get name() { return this._name; }
  set name(arg) { this._name = arg; }

  get cnt(){ return this._cnt; }
  set cnt(arg) { this._cnt = arg; }

  printCounter() {
    console.log(Person.counter); //클래스 이름으로 정적 프로퍼티를 참조한다.
  }
}

const a = new Person('a', 0);
const b = new Person('b', 0);

Person.counter++; //클래스 이름을 참조로 정적 프로퍼티에 접근?
a.printCounter();
Person.counter++;
b.printCounter(); //클래스 이름을 참조로 정적 프로퍼티에 접근?
console.log(a.counter); //안나옴, 인스턴스에 없기 때문에 접근 안됨
console.log(b.counter); //안나옴, 인스턴스에 없기 때문에 접근 안됨