class Party {
}
class Employee extends Party{ 
  constructor(name, id, monthlyCost) {
    super();
    this._id = id;
    this._name = name;
    this._monthlyCost = monthlyCost;
  }
}
class Department extends Party {
  constructor(name, staff) {
    super();
    this._name = name;
    this._staff = staff;
  }
}

// name이 공통 코드

// 공통 코드를 슈퍼클래스로 옮긴다.
class Party {
  constructor(name) {
    this._name = name;
  }
}
class Employee extends Party{ 
  constructor(name, id, monthlyCost) {
    super(name);
    this._id = id;
    this._monthlyCost = monthlyCost;
  }
}
class Department extends Party {
  constructor(name, staff) {
    super(name);
    this._staff = staff;
  }
}
