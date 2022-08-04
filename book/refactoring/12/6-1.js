//직접 상속일 때
// class Employee {
//   constructor(name, type) {
//     this.validateType(type);
//     this._name = name;
//     this._type = type;
//   }

//   validateType(arg) {
//     if (!["engineer", "manager", "saleperson"].includes(arg))
//       throw new Error(`${arg}라는 직원 유형은 없습니다.`);
//   }
//   toString() { return `${this._name} (${this._type})`; }
// }


//1. 타입 코드를 자가 캡슐화
class Employee {
  constructor(name) {
    // this.validateType(type); //7
    this._name = name;
    // this._type = type; //6. 타입 코드 필드 제거
  }
  // get type() { return this._type; } //6. 슈퍼클래스의 게터 제거
  
  // validateType(arg) { //7 검증로직 제거 - switch 문에서 해주는거나 다름없기 때문에
  //   if (!["engineer", "manager", "salesperson"].includes(arg))
  //     throw new Error(`${arg}라는 직원 유형은 없습니다.`);
  // }
  toString() { return `${this._name} (${this.type})`; } //this._type에서 게터를 가져오도록 this.type으로 바뀜
}

//2 집접 상속 받는 방식으로..(엔지니어)
class Engineer extends Employee {
  get type() { return "engineer"; } //타입코드 게터를 오버라이드하여 적절한 리터럴 값을 반환시키면 된다.
}

//3 생성자를 팩터리 함수로 바꿔서 선택 로직을 담을 별도 장소를 마련
function createEmployee(name, type) {
  switch (type) { //새로 만든 서브클래스를 사용하기 위한 선택 로직을 팩터리에 추가
    case "engineer" : return new Engineer(name);
    case "manager" : return new Manager(name);
    case "salesperson" : return new Salesperson(name);
    default: throw new Error(`${type}라는 직원 유형은 없습니다.`);
  }
  // return new Employee(name, type);
}

//4 테스트 - engineer로 넘기면 서브클래스에 타는거 확인됨
// const a = createEmployee('minwoo', 'engineer');
// console.log(a.toString());

//5 남은 유형들도 적용
class Manager extends Employee {
  get type() { return "manager"; }
}
class Salesperson extends Employee {
  get type() { return "salesperson"; }
}

//test
const a = createEmployee('smw', 'manager');
console.log(a.toString());