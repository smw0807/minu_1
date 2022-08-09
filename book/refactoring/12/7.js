//서브클래스 제어하기
class Person {
  constructor(name) {
    this._name = name;
  }
  get name() { return this._name; }
  get genderCode() { return 'X'; }
  get isMale() { return this instanceof Male; }
}

class Male extends Person {
	get GenderCode() { return 'M'; }
}
class Female extends Person {
	get GenderCode() { return 'F'; }
}

const numberOfMales = people.filter( p => p instanceof Male).length;

//생성자를 팩터리 함수로 바꾸기
function createPerson(name) {
  return new Person(name);
}
function createMale(name) {
  return new Male(name);
}
function createFemale(name){
  return new Female(name);
}

// 다른?
function createPerson(aRecord) {
  switch(aRecord.gender) {
    case 'M': return new Male(aRecord.name);
    case 'F': return new Female(aRecord.name);
    default: return new Person(aRecord.name);
  }
}

function loadFromInput(data) {
  return data.map(aRecord => createPerson(aRecord));
}
const numberOfMales2 = people.filter( p => p.isMale).length;