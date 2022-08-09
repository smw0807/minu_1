//슈퍼클래스 추출하기
//두 클래스가 있는데 공통된 기능으로 연간 비용과 월간 비용이라는 개념, 이름이 있다.
class Employee {
  constructor(name, id, monthlyCost) {
    this._id = id;
    this._name = name;
    this._monthlyCost = monthlyCost;
  }
  get monthlyCost() { return this._monthlyCost; } //월간비용
  get name() { return this._name; }
  get id() { return this._id; }

  get annualCost() { //연간비용
    return this._monthlyCost * 12;
  }
}
class Department {
  constructor(name, staff) {
    this._name = name;
    this._staff = staff;
  }
  get staff() { return this._staff.slice(); }
  get name() { return this._name; }

  get totalMonthlyCost() { //총 월간 비용
    return this.staff
      .map(e => e.monthlyCost)
      .reduce( (sum, cost) => sum + cost);
  }
  get headCount() { return this._staff.length; }
  get totalAnnualCost() { //총 연간 비용
    return this.totalMonthlyCost * 12;
  }
}

// 빈 슈퍼 클래스 생성
class Party {
  constructor(name) {
    this._name = name;
  }
  get name() { return this._name; } //서브클래스들에 있는 메서드들을 메서드 올리기로 슈퍼 클래스에 올림
  get annualCost() { return this._monthlyCost * 12; } 
}
class Employee extends Party{
  constructor(name, id, monthlyCost) {
    super(name);
    this._id = id;
    this._name = name;
    this._monthlyCost = monthlyCost;
  }
  get monthlyCost() { return this._monthlyCost; } //월간비용
  get id() { return this._id; }

}
class Department extends Party{
  constructor(name, staff) {
    super(name);
    this._name = name;
    this._staff = staff;
  }
  get staff() { return this._staff.slice(); }
  
  get totalMonthlyCost() { //총 월간 비용
    return this.staff
      .map(e => e.monthlyCost)
      .reduce( (sum, cost) => sum + cost);
  }
  get headCount() { return this._staff.length; }
}
